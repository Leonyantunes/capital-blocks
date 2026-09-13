/**
 * Canvas 3D do globo — Three.js otimizado para 60fps.
 * • matriz de pontos terrestres (uma geometria, um draw call)
 * • arcos de fluxo como linhas + partículas em um único Points
 * • marcadores de blocos com raycast, rótulos HTML projetados
 * • atmosfera fresnel + halo (bloom falso, sem pós-processamento pesado)
 * • pausa fora de tela / aba oculta, DPR limitado, sem alocação por frame
 */
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FLOWS, TYPE_STYLE, type FlowType } from '../../data/flows'
import { BLOCS, ISO_TO_BLOC, routeMidpoint } from '../../lib/world'
import { WAGES, wageColor } from '../../data/wages'
import { DISASTERS } from '../../data/disasters'
import { buildLandMatrixAsync, findCountry, getBorderPositions, latLngToVec3, type LandMatrix } from './landPoints'

export interface GlobeVisualOpts {
  themeDot: string
  themeGlow: string
  dotSize: number
  atmosphere: boolean
  atmosphereIntensity: number
  glowColor: string
  bloom: boolean
  bloomIntensity: number
  autoRotate: boolean
  rotateSpeed: number
  arcSpeed: number
  showArcs: boolean
  showMarkers: boolean
  showLabels: boolean
  showGraticule: boolean
  showBorders: boolean
  showCountryTip: boolean
  showStars: boolean
  highlightIsos: string[]
  highlightFill: string
  /** camada temática sobre os pontos: nenhuma · salários · mortes */
  layer: 'none' | 'wages' | 'deaths'
  /** ponta com seta de direção em cada arco de fluxo */
  showArrows: boolean
}

export interface GlobeFocus {
  lng: number
  lat: number
  nonce: number
  /** distância-alvo da câmera (zoom do voo); omitido = calculado do span */
  dist?: number
  /** eleva o ponto focal acima do centro (0..1; card não tapa o país) */
  lift?: number
  /** rota a enquadrar de ponta a ponta (tem prioridade sobre lng/lat) */
  flowId?: string
}

interface Props {
  opts: GlobeVisualOpts
  visibleLayers: Record<FlowType, boolean>
  selectedFlowId: string | null
  highlightFlowIds: string[]
  /** países em destaque (tour ou seleção) + cor que faz sentido */
  spot: { isos: string[]; color: string } | null
  onSelectFlow: (id: string | null) => void
  onSelectBloc: (blocId: string) => void
  onStats: (s: { fps: number; lat: number; lng: number; alt: number }) => void
  onReady: (dotCount: number) => void
  focus: GlobeFocus | null
}

function resolveAnchor(a: string | [number, number]): [number, number] {
  if (typeof a === 'string') {
    const b = BLOCS.find((x) => x.id === a)
    return b ? b.anchor : [0, 0]
  }
  return a
}

const _v1 = new THREE.Vector3()
const _v2 = new THREE.Vector3()
const _v3 = new THREE.Vector3()
const _v4 = new THREE.Vector3()

/**
 * Rotação que leva o ponto local `pLocal` até `target` MANTENDO o norte em cima.
 * Evita o roll arbitrário do setFromUnitVectors (globo de ponta-cabeça no tour).
 */
function uprightQuat(pLocal: THREE.Vector3, target: THREE.Vector3, fallback: THREE.Quaternion): THREE.Quaternion {
  const up = new THREE.Vector3(0, 1, 0)
  const zL = pLocal.clone().normalize()
  const xL = new THREE.Vector3().crossVectors(up, zL)
  if (xL.lengthSq() < 1e-6) return fallback.clone() // ponto no polo: mantém comportamento padrão
  xL.normalize()
  const yL = new THREE.Vector3().crossVectors(zL, xL)
  const zW = target.clone().normalize()
  const xW = new THREE.Vector3().crossVectors(up, zW)
  if (xW.lengthSq() < 1e-6) xW.set(1, 0, 0)
  else xW.normalize()
  const yW = new THREE.Vector3().crossVectors(zW, xW)
  const mL = new THREE.Matrix4().makeBasis(xL, yL, zL)
  const mW = new THREE.Matrix4().makeBasis(xW, yW, zW)
  return new THREE.Quaternion()
    .setFromRotationMatrix(mW)
    .multiply(new THREE.Quaternion().setFromRotationMatrix(mL).invert())
}

const flowById: Record<string, (typeof FLOWS)[number]> = Object.fromEntries(
  FLOWS.map((f) => [f.id, f]),
)

export default function Globe3DCanvas(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const labelsRef = useRef<HTMLDivElement>(null)
  const live = useRef(props)
  live.current = props

  useEffect(() => {
    const container = containerRef.current
    if (!container || !labelsRef.current) return
    const labelsBox: HTMLDivElement = labelsRef.current

    const reducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    /* mobile: menos pontos/estrelas/segmentos + DPR menor */
    const isMobile =
      window.matchMedia('(pointer: coarse)').matches ||
      Math.min(window.innerWidth, window.innerHeight) < 700
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const DOT_STEP = isMobile ? 1.15 : 0.85
    const ARC_SEG = isMobile ? 48 : 72
    const STAR_N = isMobile ? 600 : 1300
    const OCEAN_SEG = isMobile ? 48 : 64
    const ATMO_SEG = isMobile ? 32 : 48

    /* ── renderer / cena / câmera (com fallback sem WebGL) ── */
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' })
    } catch {
      const fb = document.createElement('div')
      fb.className = 'globe3d-loading'
      fb.textContent = 'WebGL indisponível neste dispositivo — use o Mapa 2D.'
      container.appendChild(fb)
      return
    }
    let dprCap = isMobile ? 1.5 : 1.75
    const applyPixelRatio = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap))
      const w = container.clientWidth || 1
      const h = container.clientHeight || 1
      renderer.setSize(w, h, false)
    }
    applyPixelRatio()
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0.4, 0.55, 2.55)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = false
    controls.minDistance = 1.55
    controls.maxDistance = 5
    /* eixo travado: norte sempre em cima (sem virar de ponta-cabeça) */
    controls.minPolarAngle = 0.2
    controls.maxPolarAngle = Math.PI - 0.2
    controls.rotateSpeed = 0.55
    controls.zoomSpeed = 0.7

    const globe = new THREE.Group()
    scene.add(globe)

    /* ── oceano (oclusão) ───────────────────────────────────
       OPACO de propósito: transparente aqui entrava na fila de blend junto
       com pontos/fronteiras (mesma origem = ordem instável) e cobria os
       pontos com 97% de fill escuro conforme o giro — os "apagões". */
    const ocean = new THREE.Mesh(
      new THREE.SphereGeometry(0.99, OCEAN_SEG, OCEAN_SEG),
      new THREE.MeshBasicMaterial({ color: new THREE.Color('#070c16') }),
    )
    ocean.renderOrder = 0
    globe.add(ocean)

    /* ── estrelas ─────────────────────────────────────────── */
    const starGeo = new THREE.BufferGeometry()
    {
      const N = STAR_N
      const arr = new Float32Array(N * 3)
      for (let i = 0; i < N; i++) {
        const r = 9 + Math.random() * 22
        const th = Math.random() * Math.PI * 2
        const ph = Math.acos(2 * Math.random() - 1)
        arr[i * 3] = r * Math.sin(ph) * Math.cos(th)
        arr[i * 3 + 1] = r * Math.cos(ph)
        arr[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th)
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    }
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.045, sizeAttenuation: true, transparent: true, opacity: 0.7, depthWrite: false,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    /* ── grade ────────────────────────────────────────────── */
    const gratGroup = new THREE.Group()
    {
      const pts: number[] = []
      const seg = 72
      for (let m = 0; m < 24; m++) {
        const lng = (m / 24) * 360 - 180
        for (let i = 0; i < seg; i++) {
          const a1 = (i / seg) * 180 - 90
          const a2 = ((i + 1) / seg) * 180 - 90
          const p1 = latLngToVec3(lng, a1, 1.001)
          const p2 = latLngToVec3(lng, a2, 1.001)
          pts.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2])
        }
      }
      for (let p = -60; p <= 75; p += 15) {
        for (let i = 0; i < seg; i++) {
          const l1 = (i / seg) * 360 - 180
          const l2 = ((i + 1) / seg) * 360 - 180
          const p1 = latLngToVec3(l1, p, 1.001)
          const p2 = latLngToVec3(l2, p, 1.001)
          pts.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2])
        }
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3))
      const mat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.1, depthWrite: false })
      gratGroup.add(new THREE.LineSegments(g, mat))
    }
    globe.add(gratGroup)
    const gratMat = (gratGroup.children[0] as THREE.LineSegments).material as THREE.LineBasicMaterial

    /* ── atmosfera fresnel + halo ─────────────────────────── */
    const atmoUniforms = {
      uColor: { value: new THREE.Color('#3b82f6') },
      uIntensity: { value: 1.1 },
    }
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.18, ATMO_SEG, ATMO_SEG),
      new THREE.ShaderMaterial({
        uniforms: atmoUniforms,
        vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader:
          'uniform vec3 uColor; uniform float uIntensity; varying vec3 vN;' +
          'void main(){ float i = pow(max(0.0, 0.68 - dot(vN, vec3(0.0, 0.0, 1.0))), 2.4);' +
          ' gl_FragColor = vec4(uColor, 1.0) * i * uIntensity; }',
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    )
    scene.add(atmo)

    const haloTex = (() => {
      const c = document.createElement('canvas')
      c.width = 256
      c.height = 256
      const ctx = c.getContext('2d')!
      const g = ctx.createRadialGradient(128, 128, 60, 128, 128, 128)
      g.addColorStop(0, 'rgba(255,255,255,0.9)')
      g.addColorStop(0.35, 'rgba(255,255,255,0.28)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 256, 256)
      const t = new THREE.CanvasTexture(c)
      t.colorSpace = THREE.SRGBColorSpace
      return t
    })()
    const haloMat = new THREE.SpriteMaterial({
      map: haloTex, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const halo = new THREE.Sprite(haloMat)
    halo.scale.setScalar(3.6)
    scene.add(halo)

    /* ── estado mutável ───────────────────────────────────── */
    let dotPoints: THREE.Points | null = null
    let dotIsos: string[] = []
    const arcGroup = new THREE.Group()
    globe.add(arcGroup)

    /* brilho pulsante nas pontas do fluxo selecionado */
    const selGlowMat = new THREE.SpriteMaterial({
      map: haloTex, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const selGlowA = new THREE.Sprite(selGlowMat)
    const selGlowB = new THREE.Sprite(selGlowMat.clone())
    selGlowA.scale.setScalar(0.18)
    selGlowB.scale.setScalar(0.18)
    selGlowA.visible = false
    selGlowB.visible = false
    globe.add(selGlowA)
    globe.add(selGlowB)

    interface ArcRec {
      id: string
      type: FlowType
      detail: boolean
      curve: THREE.QuadraticBezierCurve3
      /** amostras locais da curva ((ARC_SEG+1)×3) p/ picking raio→curva */
      samples: Float32Array
      len: number
      from: [number, number]
      to: [number, number]
      /** fatia de vértices deste arco nos buffers mesclados do tipo */
      vStart: number
      vCount: number
      /** opacidade corrente — 0 = invisível (render, picking e partículas) */
      op: number
      /** pose da seta na ponta de chegada (instância = pose × escala) */
      arrowPos: THREE.Vector3
      arrowQuat: THREE.Quaternion
    }
    let arcs: ArcRec[] = []
    /* índice id→arco: evita FLOWS.find() O(n) dentro dos loops por frame */
    let arcById: Record<string, ArcRec> = {}

    interface Mover { arc: number; t: number }
    let movers: Mover[] = []
    let moverPoints: THREE.Points | null = null
    let moverColors: Float32Array | null = null
    let moverBase: THREE.Color[] = []
    const markerGroup = new THREE.Group()
    globe.add(markerGroup)

    /* ── ARCO EM LOTE — 1 LineSegments por tipo de fluxo (cor por vértice
       simula opacidade no blending aditivo) + 1 LineSegments de núcleo
       branco para todos os arcos + setas/marcadores instanciados.
       Reduz ~200 draw calls por frame para ~20 (gargalo dominante de GPU
       mobile), com aparência idêntica. */
    const dummy = new THREE.Object3D()
    const _c = new THREE.Color()
    const _m4 = new THREE.Matrix4()
    const _s3 = new THREE.Vector3()
    const TYPE_RGB: Record<FlowType, THREE.Color> = Object.fromEntries(
      (Object.keys(TYPE_STYLE) as FlowType[]).map((t) => [t, new THREE.Color(TYPE_STYLE[t].color)]),
    ) as Record<FlowType, THREE.Color>
    const WHITE = new THREE.Color('#ffffff')
    /** Escreve rgb×f nos vértices [vStart, vStart+vCount) do buffer. */
    const writeColor = (arr: Float32Array, rgb: THREE.Color, f: number, vStart: number, vCount: number) => {
      const r = rgb.r * f
      const g = rgb.g * f
      const b = rgb.b * f
      for (let v = vStart; v < vStart + vCount; v++) {
        const o = v * 3
        arr[o] = r
        arr[o + 1] = g
        arr[o + 2] = b
      }
    }
    interface TypeBatch {
      mesh: THREE.LineSegments
      colors: THREE.BufferAttribute
    }
    const typeBatches = {} as Record<FlowType, TypeBatch>
    let coreMesh: THREE.LineSegments | null = null
    let coreColors: THREE.BufferAttribute | null = null
    let arrowsMesh: THREE.InstancedMesh | null = null
    let markersMesh: THREE.InstancedMesh | null = null

    /* marcadores de mortes corporativas (camada "deaths", paridade com o 2D) */
    const disasterGroup = new THREE.Group()
    disasterGroup.visible = false
    globe.add(disasterGroup)
    {
      const dSphGeo = new THREE.SphereGeometry(1, 12, 12)
      const dRingGeo = new THREE.RingGeometry(0.74, 1, 24)
      const dMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#f44336') })
      const dRingMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#f44336'), transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false })
      const dSph = new THREE.InstancedMesh(dSphGeo, dMat, DISASTERS.length)
      const dRing = new THREE.InstancedMesh(dRingGeo, dRingMat, DISASTERS.length)
      DISASTERS.forEach((d, i) => {
        const p = latLngToVec3(d.lngLat[0], d.lngLat[1], 1.014)
        const r = 0.008 + Math.sqrt(d.mortosNum / 500000) * 0.012
        dummy.position.set(p[0], p[1], p[2])
        dummy.quaternion.identity()
        dummy.scale.setScalar(r)
        dummy.updateMatrix()
        dSph.setMatrixAt(i, dummy.matrix)
        dummy.scale.setScalar(r * 1.9)
        dummy.lookAt(0, 0, 0)
        dummy.updateMatrix()
        dRing.setMatrixAt(i, dummy.matrix)
      })
      disasterGroup.add(dSph)
      disasterGroup.add(dRing)
    }

    /* fronteiras dos países (uma geometria, um draw call) */
    let borderLines: THREE.LineSegments | null = null
    let borderMat: THREE.LineBasicMaterial | null = null

    /* hover de país (desktop): iso sob o cursor + dica */
    let hoverIso: string | null = null
    const tipEl = document.createElement('div')
    tipEl.className = 'globe3d-tip'
    tipEl.style.display = 'none'
    container.appendChild(tipEl)

    /* rótulos HTML dos blocos principais */
    const labelDefs = BLOCS.filter((b) => b.tier !== 'secondary')
    const labelEls: { id: string; el: HTMLDivElement; vec: THREE.Vector3; color: string; code: string }[] = []
    for (const b of labelDefs) {
      const el = document.createElement('div')
      el.className = 'globe3d-label'
      el.textContent = `${b.code}`
      el.style.borderColor = `${b.color}88`
      el.addEventListener('pointerdown', (e) => e.stopPropagation())
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        live.current.onSelectBloc(b.id)
      })
      labelsBox.appendChild(el)
      const p = latLngToVec3(b.anchor[0], b.anchor[1], 1.02)
      labelEls.push({ id: b.id, el, vec: new THREE.Vector3(p[0], p[1], p[2]), color: b.color, code: b.code })
    }

    /* ── construção: arcos/marcadores primeiro, pontos de forma assíncrona ─── */
    let disposed = false
    const loadingEl = document.createElement('div')
    loadingEl.className = 'globe3d-loading'
    loadingEl.innerHTML = '<span class="globe3d-spin"></span><span>construindo matriz de pontos…</span>'
    container.appendChild(loadingEl)

    const addDots = (matrix: LandMatrix) => {
      if (disposed || dotPoints) return
      dotIsos = matrix.isos
      const dg = new THREE.BufferGeometry()
      dg.setAttribute('position', new THREE.BufferAttribute(matrix.positions.slice(), 3))
      const n = matrix.count
      const cols = new Float32Array(n * 3)
      const c = new THREE.Color(live.current.opts.themeDot)
      for (let i = 0; i < n; i++) {
        cols[i * 3] = c.r
        cols[i * 3 + 1] = c.g
        cols[i * 3 + 2] = c.b
      }
      dg.setAttribute('color', new THREE.BufferAttribute(cols, 3))
      const dm = new THREE.PointsMaterial({
        size: live.current.opts.dotSize,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      dotPoints = new THREE.Points(dg, dm)
      dotPoints.renderOrder = 1
      globe.add(dotPoints)
      applyVisual()
      live.current.onReady(matrix.count)
      loadingEl.remove()
    }

    /* pose da seta na ponta de chegada, orientada pela tangente do arco
       (aplicada como matriz de instância no applySelection) */
    const UP_Y = new THREE.Vector3(0, 1, 0)
    const arrowPose = (rec: ArcRec) => {
      const pTip = rec.curve.getPoint(0.965, _v1)
      const pBack = rec.curve.getPoint(1, _v2)
      rec.arrowPos.copy(pBack)
      const dir = _v3.copy(pBack).sub(pTip)
      if (dir.lengthSq() > 1e-9) rec.arrowQuat.setFromUnitVectors(UP_Y, dir.normalize())
      else rec.arrowQuat.identity()
    }

    const build = () => {
      if (disposed) return
      /* fronteiras: países delimitados mesmo sem zoom */
      try {
        const bp = getBorderPositions(1.0028)
        if (bp.length >= 6) {
          const bg = new THREE.BufferGeometry()
          bg.setAttribute('position', new THREE.BufferAttribute(bp.slice(), 3))
          borderMat = new THREE.LineBasicMaterial({
            color: new THREE.Color('#9ecbff'), transparent: true, opacity: 0.4,
            blending: THREE.AdditiveBlending, depthWrite: false,
          })
          borderLines = new THREE.LineSegments(bg, borderMat)
          borderLines.renderOrder = 2
          globe.add(borderLines)
        }
      } catch {
        /* globo segue funcional sem fronteiras */
      }
      /* ── arcos mesclados por tipo — `bend` do dado (mesmo do 2D) desloca o
         ápice perpendicularmente, mantendo a leitura de curvatura idêntica
         nos dois mapas. 1 LineSegments por tipo (cor por vértice ≈ opacidade
         no blending aditivo; traço via atributo lineDistance). ── */
      const byType: Partial<Record<FlowType, (typeof FLOWS)[number][]>> = {}
      for (const f of FLOWS) (byType[f.type] ??= []).push(f)
      /* setas: 1 geometria compartilhada, 1 draw call para todas */
      const arrowsGeo = new THREE.ConeGeometry(0.011, 0.03, 10)
      const arrows = new THREE.InstancedMesh(
        arrowsGeo,
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false }),
        FLOWS.length,
      )
      arrows.renderOrder = 5
      arrows.raycast = () => {}
      arrows.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      arrowsMesh = arrows
      /* núcleo de energia: um único buffer para todos os arcos */
      const perArc = ARC_SEG * 2
      const corePos = new Float32Array(FLOWS.length * perArc * 3)
      coreColors = new THREE.BufferAttribute(new Float32Array(FLOWS.length * perArc * 3), 3)
      let arcIndex = 0
      for (const t of Object.keys(TYPE_STYLE) as FlowType[]) {
        const list = byType[t] ?? []
        const dashed = TYPE_STYLE[t].dash !== ''
        const pos = new Float32Array(list.length * perArc * 3)
        const cols = new Float32Array(list.length * perArc * 3)
        const ld = dashed ? new Float32Array(list.length * perArc) : null
        list.forEach((f, ai) => {
          const a = resolveAnchor(f.from)
          const b = resolveAnchor(f.to)
          const s = latLngToVec3(a[0], a[1], 1.005)
          const e = latLngToVec3(b[0], b[1], 1.005)
          const start = new THREE.Vector3(s[0], s[1], s[2])
          const end = new THREE.Vector3(e[0], e[1], e[2])
          const dist = start.distanceTo(end)
          const mid = start
            .clone()
            .add(end)
            .multiplyScalar(0.5)
            .normalize()
          /* elevação pela distância + peso, e deslocamento lateral pelo bend */
          const radial = 1 + dist * 0.3 + f.peso * 0.012
          const perp = new THREE.Vector3().crossVectors(mid, new THREE.Vector3(0, 1, 0))
          if (perp.lengthSq() < 1e-6) perp.set(1, 0, 0)
          perp.normalize()
          mid.multiplyScalar(radial).addScaledVector(perp, f.bend * dist * 0.12)
          const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
          const pts = curve.getPoints(ARC_SEG)
          const samples = new Float32Array(pts.length * 3)
          pts.forEach((p, i) => {
            samples[i * 3] = p.x
            samples[i * 3 + 1] = p.y
            samples[i * 3 + 2] = p.z
          })
          const vStart = ai * perArc
          /* pares (p_i, p_i+1) → LineSegments; traço contínuo via lineDistance */
          let cum = 0
          for (let i = 0; i < ARC_SEG; i++) {
            const p0 = pts[i]
            const p1 = pts[i + 1]
            const o = (vStart + i * 2) * 3
            pos[o] = p0.x; pos[o + 1] = p0.y; pos[o + 2] = p0.z
            pos[o + 3] = p1.x; pos[o + 4] = p1.y; pos[o + 5] = p1.z
            const segLen = p0.distanceTo(p1)
            if (ld) {
              ld[vStart + i * 2] = cum
              ld[vStart + i * 2 + 1] = cum + segLen
            }
            cum += segLen
          }
          /* o núcleo recebe os mesmos vértices (índice global do arco) */
          corePos.set(pos.subarray(vStart * 3, (vStart + perArc) * 3), arcIndex * perArc * 3)
          const rec: ArcRec = {
            id: f.id, type: t, detail: f.tier === 'detail', curve, samples,
            len: curve.getLength(), from: a, to: b,
            vStart, vCount: perArc, op: 0.8,
            arrowPos: new THREE.Vector3(), arrowQuat: new THREE.Quaternion(),
          }
          arrowPose(rec)
          dummy.position.copy(rec.arrowPos)
          dummy.quaternion.copy(rec.arrowQuat)
          dummy.scale.setScalar(1)
          dummy.updateMatrix()
          arrows.setMatrixAt(arcIndex, dummy.matrix)
          arrows.setColorAt(arcIndex, TYPE_RGB[t])
          arcs.push(rec)
          arcById[f.id] = rec
          arcIndex++
        })
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        const colAttr = new THREE.BufferAttribute(cols, 3)
        g.setAttribute('color', colAttr)
        if (ld) g.setAttribute('lineDistance', new THREE.BufferAttribute(ld, 1))
        const mat = dashed
          ? new THREE.LineDashedMaterial({ color: 0xffffff, vertexColors: true, dashSize: 0.035, gapSize: 0.024, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false })
          : new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false })
        const mesh = new THREE.LineSegments(g, mat)
        mesh.renderOrder = 3
        mesh.raycast = () => {}
        arcGroup.add(mesh)
        typeBatches[t] = { mesh, colors: colAttr }
      }
      const coreGeo = new THREE.BufferGeometry()
      coreGeo.setAttribute('position', new THREE.BufferAttribute(corePos, 3))
      coreGeo.setAttribute('color', coreColors)
      coreMesh = new THREE.LineSegments(
        coreGeo,
        new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false }),
      )
      coreMesh.renderOrder = 4
      coreMesh.raycast = () => {}
      arcGroup.add(coreMesh)
      arcGroup.add(arrows)

      /* partículas (movers) */
      {
        const tmp: Mover[] = []
        arcs.forEach((a, i) => {
          const f = flowById[a.id]
          const k = f && f.peso >= 2.5 ? 4 : f && f.peso >= 1.5 ? 3 : 2
          for (let j = 0; j < k; j++) tmp.push({ arc: i, t: j / k })
        })
        movers = tmp
        const pos = new Float32Array(movers.length * 3)
        moverColors = new Float32Array(movers.length * 3)
        moverBase = movers.map((m) => new THREE.Color(TYPE_STYLE[arcs[m.arc].type].color))
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage))
        g.setAttribute('color', new THREE.BufferAttribute(moverColors, 3).setUsage(THREE.DynamicDrawUsage))
        moverPoints = new THREE.Points(
          g,
          new THREE.PointsMaterial({ size: 0.024, vertexColors: true, transparent: true, opacity: 0.95, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending }),
        )
        moverPoints.renderOrder = 5
        globe.add(moverPoints)
      }

      /* marcadores de blocos: esfera + anel instanciados (2 draw calls);
         o raycast por instância resolve o bloco clicado */
      const markerScale = isMobile ? 1.4 : 1
      const sphereGeo = new THREE.SphereGeometry(1, 16, 16)
      const ringGeo = new THREE.RingGeometry(0.83, 1, 32)
      const spheres = new THREE.InstancedMesh(sphereGeo, new THREE.MeshBasicMaterial(), BLOCS.length)
      spheres.userData.blocIds = BLOCS.map((b) => b.id)
      const ringsMesh = new THREE.InstancedMesh(
        ringGeo,
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false }),
        BLOCS.length,
      )
      BLOCS.forEach((b, i) => {
        const p = latLngToVec3(b.anchor[0], b.anchor[1], 1.012)
        const baseR = (b.tier === 'secondary' ? 0.008 : 0.013) * markerScale
        const ringOut = (b.tier === 'secondary' ? 0.017 : 0.024) * markerScale
        dummy.position.set(p[0], p[1], p[2])
        dummy.quaternion.identity()
        dummy.scale.setScalar(baseR)
        dummy.updateMatrix()
        spheres.setMatrixAt(i, dummy.matrix)
        spheres.setColorAt(i, new THREE.Color(b.color))
        dummy.scale.setScalar(ringOut)
        dummy.lookAt(0, 0, 0)
        dummy.updateMatrix()
        ringsMesh.setMatrixAt(i, dummy.matrix)
        ringsMesh.setColorAt(i, new THREE.Color(b.color))
      })
      markerGroup.add(spheres)
      markerGroup.add(ringsMesh)
      markersMesh = spheres

      applyVisual()
      applySelection()
      /* pontos terrestres (assíncrono, sem travar a aba) */
      void buildLandMatrixAsync(DOT_STEP, (done, total) => {
        if (disposed || !loadingEl.isConnected) return
        const pct = Math.round((done / total) * 100)
        const label = loadingEl.lastElementChild
        if (label) label.textContent = `construindo matriz de pontos… ${pct}%`
      }).then((matrix) => {
        if (disposed) return
        addDots(matrix)
        applySelection()
      })
    }
    const buildTimer = window.setTimeout(build, 60)

    /* ── aplicação de estado visual (sem rebuild) ─────────── */
    const hlSet = () => new Set(live.current.opts.highlightIsos)
    /** Recolore os pontos: tema + destaque regional + spot (tour/seleção) + hover. */
    function recolorDots() {
      if (!dotPoints) return
      const o = live.current.opts
      const dot = new THREE.Color(o.themeDot)
      const fill = new THREE.Color(o.highlightFill)
      const hs = hlSet()
      const useHl = hs.size > 0
      /* países da rota/parada em destaque: cor que faz sentido (fluxo ou acento do tour) */
      const spot = live.current.spot
      const spotSet = spot ? new Set(spot.isos) : null
      const spotCol = spot ? new THREE.Color(spot.color) : null
      /* heatmap salarial: só vale no 2D e no 3D quando a camada está ativa */
      const layer = o.layer
      const wageMode = layer === 'wages'
      const wageCache = new Map<string, THREE.Color>()
      const wageColOf = (iso: string): THREE.Color | null => {
        if (!wageMode) return null
        const cached = wageCache.get(iso)
        if (cached) return cached
        const usd = WAGES[iso]
        if (usd === undefined) return null
        const c = new THREE.Color(wageColor(usd))
        wageCache.set(iso, c)
        return c
      }
      const attr = dotPoints.geometry.getAttribute('color') as THREE.BufferAttribute
      const arr = attr.array as Float32Array
      for (let i = 0; i < dotIsos.length; i++) {
        const iso = dotIsos[i]
        const wc = wageColOf(iso)
        if (spotSet && spotCol && spotSet.has(iso)) {
          arr[i * 3] = Math.min(1, spotCol.r * 1.15 + 0.12)
          arr[i * 3 + 1] = Math.min(1, spotCol.g * 1.15 + 0.12)
          arr[i * 3 + 2] = Math.min(1, spotCol.b * 1.15 + 0.12)
        } else if (wc) {
          arr[i * 3] = wc.r
          arr[i * 3 + 1] = wc.g
          arr[i * 3 + 2] = wc.b
        } else if (useHl && hs.has(iso)) {
          arr[i * 3] = fill.r
          arr[i * 3 + 1] = fill.g
          arr[i * 3 + 2] = fill.b
        } else if (hoverIso !== null && iso === hoverIso) {
          /* país sob o cursor: clareia ~60% rumo ao branco */
          arr[i * 3] = dot.r + (1 - dot.r) * 0.6
          arr[i * 3 + 1] = dot.g + (1 - dot.g) * 0.6
          arr[i * 3 + 2] = dot.b + (1 - dot.b) * 0.6
        } else {
          arr[i * 3] = dot.r
          arr[i * 3 + 1] = dot.g
          arr[i * 3 + 2] = dot.b
        }
      }
      attr.needsUpdate = true
    }
    function applyVisual() {
      const o = live.current.opts
      const glow = new THREE.Color(o.glowColor || o.themeGlow)
      if (dotPoints) {
        recolorDots()
        ;(dotPoints.material as THREE.PointsMaterial).size = o.dotSize
        ;(dotPoints.material as THREE.PointsMaterial).opacity = o.bloom ? Math.min(1, 0.9 + o.bloomIntensity * 0.06) : 0.92
      }
      gratMat.color.copy(glow)
      gratGroup.visible = o.showGraticule
      if (borderLines && borderMat) {
        /* fronteiras acompanham o tema (brilho + branco) */
        borderMat.color.copy(glow).lerp(new THREE.Color('#ffffff'), 0.45)
        borderLines.visible = o.showBorders
      }
      atmo.visible = o.atmosphere
      atmoUniforms.uColor.value.copy(glow)
      atmoUniforms.uIntensity.value = o.atmosphereIntensity
      haloMat.color.copy(glow)
      haloMat.opacity = o.bloom ? 0.22 + o.bloomIntensity * 0.14 : 0.14 + o.atmosphereIntensity * 0.05
      renderer.toneMappingExposure = o.bloom ? 1.05 + o.bloomIntensity * 0.22 : 1.0
      if (moverPoints) {
        ;(moverPoints.material as THREE.PointsMaterial).size = 0.02 + (o.bloom ? o.bloomIntensity * 0.004 : 0)
      }
      stars.visible = o.showStars
      markerGroup.visible = o.showMarkers
      labelsBox.style.display = o.showLabels ? 'block' : 'none'
      arcGroup.visible = o.showArcs
      /* camada temática: mortes usam marcadores próprios */
      disasterGroup.visible = o.layer === 'deaths'
    }

    function applySelection() {
      /* antes do build (60ms) não há buffers mesclados — o loop de frames
         chama esta função desde o primeiro frame */
      if (!coreColors || !arcs.length) return
      const { visibleLayers, selectedFlowId, highlightFlowIds } = live.current
      const anySel = !!selectedFlowId
      const anyHl = highlightFlowIds.length > 0
      const camDist = camera.position.length()
      const detailOn = camDist < 2.75
      const showArrows = live.current.opts.showArrows

      for (const a of arcs) {
        const vis = visibleLayers[a.type] !== false
        const isSel = selectedFlowId === a.id
        const isHl = highlightFlowIds.includes(a.id)
        let op = 0.8
        if (!vis) op = 0
        else if (isSel || isHl) op = 1
        else if (a.detail && !detailOn) op = 0
        else if (anySel) op = 0.05
        else if (anyHl) op = 0.07
        a.op = op
        /* cor × fator ≡ opacidade no blending aditivo */
        writeColor(typeBatches[a.type].colors.array as Float32Array, TYPE_RGB[a.type], op, a.vStart, a.vCount)
        /* núcleo acompanha: forte no selecionado, sutil no normal */
        const coreOp = op === 0 ? 0 : selectedFlowId === a.id ? 0.95 : anySel || anyHl ? 0 : 0.16
        writeColor(coreColors!.array as Float32Array, WHITE, coreOp, a.vStart, a.vCount)
      }
      for (const t of Object.keys(typeBatches) as FlowType[]) {
        typeBatches[t].colors.needsUpdate = true
        typeBatches[t].mesh.visible = visibleLayers[t] !== false
      }
      coreColors!.needsUpdate = true

      /* setas: cor = opacidade (aditivo); escala 0 esconde a instância */
      const am = arrowsMesh
      if (am) {
        arcs.forEach((a, i) => {
          const on = a.op > 0 && showArrows
          _c.copy(TYPE_RGB[a.type]).multiplyScalar(on ? Math.min(1, a.op) : 0)
          am.setColorAt(i, _c)
          _m4.compose(a.arrowPos, a.arrowQuat, _s3.set(on ? 1 : 0, on ? 1 : 0, on ? 1 : 0))
          am.setMatrixAt(i, _m4)
        })
        if (am.instanceColor) am.instanceColor.needsUpdate = true
        am.instanceMatrix.needsUpdate = true
      }

      /* brilho pulsante nas pontas do fluxo selecionado */
      const sel = selectedFlowId ? arcById[selectedFlowId] : undefined
      if (sel && sel.op > 0) {
        const st = TYPE_STYLE[sel.type]
        selGlowA.visible = true
        selGlowB.visible = true
        ;(selGlowA.material as THREE.SpriteMaterial).color.set(st.color)
        ;(selGlowB.material as THREE.SpriteMaterial).color.set(st.color)
        sel.curve.getPoint(0, selGlowA.position)
        sel.curve.getPoint(1, selGlowB.position)
      } else {
        selGlowA.visible = false
        selGlowB.visible = false
      }
      /* partículas: esmaece as não-enfatizadas via cor escura */
      if (moverPoints && moverColors) {
        const attr = moverPoints.geometry.getAttribute('color') as THREE.BufferAttribute
        movers.forEach((m, i) => {
          const a = arcs[m.arc]
          const emph = selectedFlowId === a.id || highlightFlowIds.includes(a.id) || (!anySel && !anyHl)
          const f = a.op === 0 ? 0 : emph ? 1 : 0.08
          moverColors![i * 3] = moverBase[i].r * f
          moverColors![i * 3 + 1] = moverBase[i].g * f
          moverColors![i * 3 + 2] = moverBase[i].b * f
        })
        attr.needsUpdate = true
      }
    }

    /* ── voo de câmera (tour / clique com zoom) ─────────────
       Viagem em 3 fases: SOBE (afasta a câmera) → CRUZA (gira no alto) → DESCE. */
    let flight: {
      t: number
      dur: number
      from: THREE.Quaternion
      to: THREE.Quaternion
      camFrom: THREE.Vector3
      camPeak: THREE.Vector3
      camTo: THREE.Vector3
    } | null = null
    let lastFocusNonce = -1
    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

    /* ── interação ────────────────────────────────────────── */
    const ray = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const castAt = (cx: number, cy: number) => {
      const r = renderer.domElement.getBoundingClientRect()
      ndc.x = ((cx - r.left) / r.width) * 2 - 1
      ndc.y = -((cy - r.top) / r.height) * 2 + 1
      ray.setFromCamera(ndc, camera)
    }
    const _wp = new THREE.Vector3()
    /** Arco visível mais próximo do raio (distância raio→amostra, em mundo).
     *  Substitui o raycast por linha: com as geometrias mescladas por tipo,
     *  o raio não identifica mais o arco sozinho. 52×~72 amostras = trivial. */
    const pickArc = (): string | null => {
      const thresh = isMobile ? 0.045 : 0.025
      let best: string | null = null
      let bestD = thresh * thresh
      const m3 = arcGroup.matrixWorld
      for (const a of arcs) {
        if (a.op === 0) continue
        const s = a.samples
        for (let i = 0; i < s.length; i += 3) {
          _wp.set(s[i], s[i + 1], s[i + 2]).applyMatrix4(m3)
          const d = ray.ray.distanceSqToPoint(_wp)
          if (d < bestD) {
            bestD = d
            best = a.id
          }
        }
      }
      return best
    }
    /** País sob um pixel (raio → oceano → local → lat/lng → lookup). */
    const countryAt = (cx: number, cy: number): { iso: string; name: string } | null => {
      castAt(cx, cy)
      const hit = ray.intersectObject(ocean, false)[0]
      if (!hit) return null
      _v4.copy(hit.point)
      globe.worldToLocal(_v4)
      const r = _v4.length() || 1
      const lat = 90 - (Math.acos(THREE.MathUtils.clamp(_v4.y / r, -1, 1)) * 180) / Math.PI
      const theta = Math.atan2(_v4.z, -_v4.x)
      let lng = (theta * 180) / Math.PI - 180
      if (lng < -180) lng += 360
      if (lng > 180) lng -= 360
      try {
        return findCountry(lng, lat)
      } catch {
        return null
      }
    }
    let downX = 0
    let downY = 0
    /* multi-toque (pinch) nunca deve virar "clique" ao soltar os dedos */
    const activePtrs = new Set<number>()
    let multiTouch = false
    const onDown = (e: PointerEvent) => {
      activePtrs.add(e.pointerId)
      if (activePtrs.size > 1) multiTouch = true
      downX = e.clientX
      downY = e.clientY
      flight = null /* gesto do usuário cancela o voo do tour */
      controls.enabled = true
      tipEl.style.display = 'none'
      renderer.domElement.style.cursor = 'grabbing'
    }
    const onUp = (e: PointerEvent) => {
      activePtrs.delete(e.pointerId)
      if (multiTouch) {
        if (activePtrs.size === 0) multiTouch = false
        return
      }
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 7) return
      castAt(e.clientX, e.clientY)
      const mk = markersMesh
      const hitM = mk ? ray.intersectObject(mk, false)[0] : null
      if (mk && hitM && hitM.instanceId !== undefined) {
        live.current.onSelectBloc((mk.userData.blocIds as string[])[hitM.instanceId])
        return
      }
      const hitArc = pickArc()
      if (hitArc) {
        live.current.onSelectFlow(live.current.selectedFlowId === hitArc ? null : hitArc)
        return
      }
      /* clique no país abre a anatomia do bloco (atalho mobile); senão, desseleciona */
      const c = countryAt(e.clientX, e.clientY)
      const bloc = c ? ISO_TO_BLOC[c.iso] : undefined
      if (bloc) live.current.onSelectBloc(bloc)
      else live.current.onSelectFlow(null)
    }
    const onCancel = (e: PointerEvent) => {
      activePtrs.delete(e.pointerId)
      if (activePtrs.size === 0) multiTouch = false
    }
    let hoverTick = 0
    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      if (now - hoverTick < 90) return
      hoverTick = now
      castAt(e.clientX, e.clientY)
      const hitM = markersMesh ? ray.intersectObject(markersMesh, false)[0] : null
      const hitArc = hitM ? null : pickArc()
      const hit = !!hitM || hitArc !== null
      renderer.domElement.style.cursor = hit ? 'pointer' : 'grab'
      /* tooltip do arco: título + escala anual (só desktop com mouse fino) */
      if (finePointer && hitArc) {
        const f = flowById[hitArc]
        if (f) {
          if (hoverIso !== null) {
            hoverIso = null
            recolorDots()
          }
          const rect = container.getBoundingClientRect()
          tipEl.style.display = 'block'
          tipEl.style.left = `${e.clientX - rect.left + 14}px`
          tipEl.style.top = `${e.clientY - rect.top - 10}px`
          tipEl.textContent = `${f.titulo} · ${f.totalAnual}`
          return
        }
      }
      /* dica do país (só desktop com mouse fino) */
      if (!finePointer || !live.current.opts.showCountryTip || hit) {
        if (hoverIso !== null) {
          hoverIso = null
          recolorDots()
        }
        if (!hitArc) tipEl.style.display = 'none'
        return
      }
      const c = countryAt(e.clientX, e.clientY)
      const iso = c?.iso ?? null
      if (iso !== hoverIso) {
        hoverIso = iso
        recolorDots()
      }
      if (c) {
        const rect = container.getBoundingClientRect()
        tipEl.style.display = 'block'
        tipEl.style.left = `${e.clientX - rect.left + 14}px`
        tipEl.style.top = `${e.clientY - rect.top - 10}px`
        const bloc = ISO_TO_BLOC[c.iso]
        tipEl.textContent = bloc ? `${c.name} · clique → bloco` : c.name
      } else {
        tipEl.style.display = 'none'
      }
    }
    renderer.domElement.addEventListener('pointerdown', onDown)
    renderer.domElement.addEventListener('pointerup', onUp)
    renderer.domElement.addEventListener('pointercancel', onCancel)
    renderer.domElement.addEventListener('pointermove', onMove)
    const onLeave = () => {
      if (hoverIso !== null) {
        hoverIso = null
        recolorDots()
      }
      tipEl.style.display = 'none'
      renderer.domElement.style.cursor = 'grab'
    }
    renderer.domElement.addEventListener('pointerleave', onLeave)
    renderer.domElement.style.cursor = 'grab'
    renderer.domElement.setAttribute('role', 'img')
    renderer.domElement.setAttribute('aria-label', 'Globo 3D interativo com fluxos de capital')

    /* ── resize ───────────────────────────────────────────── */
    const resize = () => {
      const w = container.clientWidth || 1
      const h = container.clientHeight || 1
      renderer.setSize(w, h, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    /* ── loop ─────────────────────────────────────────────── */
    let raf = 0
    let running = true
    let visible = true
    const clock = new THREE.Clock()
    let frames = 0
    let statT = 0
    let fps = 60
    let selCache = ''
    let emaFps = 60
    let qTimer = 0
    let lastBorderOp = -1
    const io = new IntersectionObserver((en) => {
      visible = en[0]?.isIntersecting ?? true
    })
    io.observe(container)
    const onVis = () => {
      running = !document.hidden
      if (running) clock.getDelta()
    }
    document.addEventListener('visibilitychange', onVis)

    const camDir = new THREE.Vector3()
    const WORLD_UP = new THREE.Vector3(0, 1, 0)
    const _qSpin = new THREE.Quaternion()
    const layerSignature = (vl: Record<FlowType, boolean>) =>
      (vl.commodities ? 1 : 0) | (vl.manufatura ? 2 : 0) | (vl.drain ? 4 : 0) |
      (vl.dollar ? 8 : 0) | (vl.brics ? 16 : 0) | (vl.fantasma ? 32 : 0)
    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (!running || !visible) return
      const dt = Math.min(clock.getDelta(), 0.1)
      const o = live.current.opts
      frames++
      statT += dt
      if (statT >= 0.5) {
        fps = Math.round(frames / statT)
        frames = 0
        statT = 0
        emaFps = emaFps * 0.6 + fps * 0.4
        const r = camera.position.length()
        const phi = Math.acos(THREE.MathUtils.clamp(camera.position.y / r, -1, 1))
        const lat = 90 - (phi * 180) / Math.PI
        const theta = Math.atan2(camera.position.z, -camera.position.x)
        let lng = (theta * 180) / Math.PI - 180
        if (lng < -180) lng += 360
        if (lng > 180) lng -= 360
        live.current.onStats({ fps, lat, lng, alt: Math.max(400, Math.round((r - 1) * 38000 + 400)) })
      }

      /* DPR adaptativo: segura 60fps em GPU fraca sem tocar nos toggles */
      qTimer += dt
      if (qTimer > 2.5) {
        qTimer = 0
        if (emaFps < 27 && dprCap > 1) {
          dprCap = Math.max(1, dprCap - 0.25)
          applyPixelRatio()
        }
      }

      /* tour / clique com zoom: dispara voo (globo + dolly da câmera) */
      const f = live.current.focus
      if (f && f.nonce !== lastFocusNonce) {
        lastFocusNonce = f.nonce

        /* ── alvo do foco ─────────────────────────────────────
           rota (flowId): enquadra as DUAS pontas dentro do FOV e aponta o
           ápice ao centro. ponto único: usa lng/lat e distância pedida. */
        let focusLng = f.lng
        let focusLat = f.lat
        let autoDist: number | null = null
        const rec = f.flowId ? arcById[f.flowId] : undefined
        if (rec) {
          const a = latLngToVec3(rec.from[0], rec.from[1], 1)
          const b = latLngToVec3(rec.to[0], rec.to[1], 1)
          const va = _v3.set(a[0], a[1], a[2]).normalize()
          const vb = _v4.set(b[0], b[1], b[2]).normalize()
          /* ponto médio 3D compartilhado (testado em scripts/framing-test.mjs) */
          const mid = routeMidpoint(rec.from, rec.to)
          focusLng = mid[0]
          focusLat = mid[1]
          /* distância p/ caber o span angular — com 25% de folga no frame
             (a rota ocupa ~80% da tela) e mínimo de 2.0: fluxos curtos não
             colam a câmera no país; o gate de rotas regionais não se aplica
             à seleção (ver applySelection) */
          const span = Math.acos(THREE.MathUtils.clamp(va.dot(vb), -1, 1)) // rad
          const halfV = (camera.fov * Math.PI) / 360
          const halfH = Math.atan(Math.tan(halfV) * Math.max(1, camera.aspect))
          const half = Math.min(halfV, halfH)
          const fit = span / 2 / Math.max(0.08, half)
          autoDist = THREE.MathUtils.clamp(1.42 / Math.cos(Math.min(1.35, fit)) / 0.8, 2.0, 5)
        }
        const p = latLngToVec3(focusLng, focusLat, 1)
        /* LOCAL (sem o quaternion atual): uprightQuat mapeia local→alvo;
           aplicar a rotação atual aqui misturava referenciais e errava o alvo */
        _v1.set(p[0], p[1], p[2])
        _v2.copy(camera.position).normalize()
        /* lift: país aparece acima do card; cresce em telas baixas/landscape */
        let lift = THREE.MathUtils.clamp(f.lift ?? 0, 0, 1)
        if (lift > 0) {
          const h = container.clientHeight || 1
          const ratio = Math.min(1.4, Math.max(0.7, 620 / h))
          lift = THREE.MathUtils.clamp(lift * ratio, 0, 0.92)
          const up = _v4.set(0, 1, 0)
          const perp = up.addScaledVector(_v2, -up.dot(_v2))
          if (perp.lengthSq() > 1e-6) {
            perp.normalize()
            const th = lift * 0.45
            _v2.multiplyScalar(Math.cos(th)).addScaledVector(perp, Math.sin(th)).normalize()
          }
        }
        /* voo VERTICALIZADO: norte sempre em cima (sem roll de ponta-cabeça) */
        const to = uprightQuat(_v1, _v2, globe.quaternion)
        const camFrom = camera.position.clone()
        const targetDist = f.dist ?? autoDist
        const camTo = targetDist ? camera.position.clone().setLength(targetDist) : camFrom.clone()
        /* pico da viagem: sobe acima da origem E do destino p/ cruzar no alto */
        const peakR = reducedMotion
          ? Math.max(camFrom.length(), camTo.length())
          : Math.max(camFrom.length(), camTo.length(), 3.4)
        const midDir = camFrom.clone().normalize().lerp(camTo.clone().normalize(), 0.5)
        if (midDir.lengthSq() < 1e-4) {
          /* direções opostas: escolhe um eixo perpendicular qualquer */
          midDir.crossVectors(camFrom.clone().normalize(), new THREE.Vector3(0, 1, 0))
          if (midDir.lengthSq() < 1e-4) midDir.set(1, 0, 0)
        }
        const camPeak = midDir.normalize().multiplyScalar(peakR)
        flight = {
          t: 0,
          dur: reducedMotion ? 1.0 : 2.5,
          from: globe.quaternion.clone(),
          to,
          camFrom,
          camPeak,
          camTo,
        }
        controls.enabled = false
      }
      if (flight) {
        flight.t += dt
        const t = Math.min(1, flight.t / flight.dur)
        /* fase A (sobe): 0→0.3 · fase B (cruza): 0.3→0.7 · fase C (desce): 0.7→1 */
        let g: number
        if (t < 0.3) {
          const u = easeInOut(t / 0.3)
          g = 0.15 * u
          camera.position.lerpVectors(flight.camFrom, flight.camPeak, u)
        } else if (t < 0.7) {
          const u = easeInOut((t - 0.3) / 0.4)
          g = 0.15 + 0.65 * u
          camera.position.copy(flight.camPeak)
        } else {
          const u = easeInOut((t - 0.7) / 0.3)
          g = 0.8 + 0.2 * u
          camera.position.lerpVectors(flight.camPeak, flight.camTo, u)
        }
        globe.quaternion.slerpQuaternions(flight.from, flight.to, g)
        if (flight.t >= flight.dur) {
          /* garante o alvo exato (sem deriva de float) */
          globe.quaternion.copy(flight.to)
          camera.position.copy(flight.camTo)
          flight = null
          controls.enabled = true
        }
      } else if (o.autoRotate && !reducedMotion) {
        /* giro em torno do eixo Y do MUNDO via quaternion: não tomba o globo
           depois que um voo redefine a orientação (o Euler XYZ inclinava) */
        _qSpin.setFromAxisAngle(WORLD_UP, dt * 0.12 * o.rotateSpeed)
        globe.quaternion.premultiply(_qSpin)
      }

      /* partículas ao longo das curvas */
      if (moverPoints && movers.length) {
        const pos = moverPoints.geometry.getAttribute('position') as THREE.BufferAttribute
        const arr = pos.array as Float32Array
        const sp = (reducedMotion ? 0.15 : 1) * o.arcSpeed
        for (let i = 0; i < movers.length; i++) {
          const m = movers[i]
          const a = arcs[m.arc]
          /* arco em destaque corre até 3× mais rápido */
          const boost = live.current.selectedFlowId === a.id ? 3 : 1
          m.t += (dt * sp * 0.22 * boost) / Math.max(0.4, a.len)
          if (m.t > 1) m.t -= 1
          const p = a.curve.getPoint(m.t, _v3)
          arr[i * 3] = p.x
          arr[i * 3 + 1] = p.y
          arr[i * 3 + 2] = p.z
        }
        pos.needsUpdate = true
      }

      /* satélites removidos por decisão de produto (ruído visual) */

      /* reavalia seleção quando muda (inclui modo detalhado por zoom + spot do tour) */
      const camDist = camera.position.length()
      const spotSig = live.current.spot ? `${live.current.spot.color}|${live.current.spot.isos.join(',')}` : ''
      const key = `${live.current.selectedFlowId}|${live.current.highlightFlowIds.join(',')}|${layerSignature(live.current.visibleLayers)}|${camDist.toFixed(2)}|${o.showArcs}|${o.showArrows}|${o.layer}|${spotSig}`
      if (key !== selCache) {
        selCache = key
        applySelection()
        recolorDots()
      }

      /* fronteiras ganham definição com o zoom (0.32 → 0.85); grade recua */
      if (borderMat && borderLines?.visible) {
        const targetOp = camDist < 1.9 ? 0.85 : camDist < 2.3 ? 0.6 : camDist < 2.9 ? 0.42 : 0.32
        if (Math.abs(targetOp - lastBorderOp) > 0.01) {
          lastBorderOp = targetOp
          borderMat.opacity = targetOp
          gratMat.opacity = camDist < 2.0 ? 0.05 : 0.1
        }
      }

      /* pulso dos brilhos do fluxo selecionado */
      if (selGlowA.visible || selGlowB.visible) {
        const s = 0.17 + 0.05 * Math.sin(performance.now() * 0.006)
        selGlowA.scale.setScalar(s)
        selGlowB.scale.setScalar(s)
      }

      if (!flight) controls.update() /* no voo, a câmera é 100% roteirizada */
      renderer.render(scene, camera)

      /* rótulos */
      if (o.showLabels) {
        const w = container.clientWidth
        const h = container.clientHeight
        camDir.copy(camera.position).normalize()
        for (const l of labelEls) {
          _v1.copy(l.vec).applyMatrix4(globe.matrixWorld)
          const facing = _v4.copy(_v1).normalize().dot(camDir)
          _v2.copy(_v1).project(camera)
          const behind = _v2.z > 1 || facing < 0.18
          const x = (_v2.x * 0.5 + 0.5) * w
          const y = (-_v2.y * 0.5 + 0.5) * h
          l.el.style.transform = `translate(-50%,-140%) translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`
          l.el.style.opacity = behind ? '0' : facing > 0.55 ? '1' : '0.35'
          l.el.style.pointerEvents = behind ? 'none' : 'auto'
        }
      }
    }
    animate()

    /* aplica mudanças vindas do React */
    let lastVisual = ''
    const syncTimer = window.setInterval(() => {
      const o = live.current.opts
      /* assinatura barata: sem JSON.stringify a cada tick (evita alocação) */
      const key =
        `${o.themeDot}|${o.themeGlow}|${o.dotSize}|${o.atmosphere}|${o.atmosphereIntensity}|${o.glowColor}|` +
        `${o.bloom}|${o.bloomIntensity}|${o.rotateSpeed}|${o.arcSpeed}|${o.showArcs}|${o.showArrows}|${o.layer}|` +
        `${o.showMarkers}|${o.showLabels}|${o.showGraticule}|${o.showBorders}|${o.showStars}|${o.showCountryTip}|` +
        `${o.autoRotate}|${o.highlightFill}|${o.highlightIsos.length}`
      if (key !== lastVisual) {
        lastVisual = key
        applyVisual()
        applySelection()
      }
    }, 180)

    return () => {
      disposed = true
      loadingEl.remove()
      window.clearTimeout(buildTimer)
      window.clearInterval(syncTimer)
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      renderer.domElement.removeEventListener('pointerdown', onDown)
      renderer.domElement.removeEventListener('pointerup', onUp)
      renderer.domElement.removeEventListener('pointercancel', onCancel)
      renderer.domElement.removeEventListener('pointermove', onMove)
      renderer.domElement.removeEventListener('pointerleave', onLeave)
      controls.dispose()
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        const mat = (mesh as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
        else if (mat) mat.dispose()
      })
      starGeo.dispose()
      haloTex.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
      tipEl.remove()
      labelsBox.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={containerRef} className="globe3d-host relative h-full w-full overflow-hidden">
      <div ref={labelsRef} className="pointer-events-none absolute inset-0 z-10" />
      <style>{`.globe3d-label{position:absolute;left:0;top:0;pointer-events:auto;cursor:pointer;font-family:JetBrains Mono,monospace;font-size:10px;font-weight:700;letter-spacing:.04em;color:#e8f4ff;background:rgba(5,10,20,.82);border:1px solid;padding:2px 7px;border-radius:6px;white-space:nowrap;box-shadow:0 0 12px rgba(80,180,255,.25);transition:opacity .25s} .globe3d-label:hover{background:rgba(20,40,70,.95)} .globe3d-tip{position:absolute;z-index:15;pointer-events:none;font-family:JetBrains Mono,monospace;font-size:10.5px;font-weight:700;color:#eaf4ff;background:rgba(5,10,22,.9);border:1px solid rgba(120,180,255,.45);border-radius:7px;padding:3px 8px;white-space:nowrap;box-shadow:0 0 14px rgba(80,160,255,.3)} .globe3d-loading{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:20;display:flex;align-items:center;gap:10px;font-family:JetBrains Mono,monospace;font-size:11px;color:#9ecbff;background:rgba(5,10,22,.85);border:1px solid rgba(90,162,255,.35);border-radius:10px;padding:10px 14px;pointer-events:none} .globe3d-spin{width:14px;height:14px;border-radius:50%;border:2px solid rgba(120,180,255,.3);border-top-color:#7cc4ff;animation:globe3dspin 0.9s linear infinite} @keyframes globe3dspin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
