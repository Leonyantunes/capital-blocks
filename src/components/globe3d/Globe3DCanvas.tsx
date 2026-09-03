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
import { BLOCS, ISO_TO_BLOC } from '../../lib/world'
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
}

export interface GlobeFocus {
  lng: number
  lat: number
  nonce: number
  /** distância-alvo da câmera (zoom do voo); omitido = mantém */
  dist?: number
  /** eleva o ponto focal acima do centro (0..1; card não tapa o país) */
  lift?: number
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
    selGlowA.scale.setScalar(0.14)
    selGlowB.scale.setScalar(0.14)
    selGlowA.visible = false
    selGlowB.visible = false
    globe.add(selGlowA)
    globe.add(selGlowB)

    interface ArcRec {
      id: string
      type: FlowType
      detail: boolean
      curve: THREE.QuadraticBezierCurve3
      line: THREE.Line
      core: THREE.Line
      len: number
    }
    let arcs: ArcRec[] = []

    interface Mover { arc: number; t: number }
    let movers: Mover[] = []
    let moverPoints: THREE.Points | null = null
    let moverColors: Float32Array | null = null
    let moverBase: THREE.Color[] = []

    const markerMeshes: THREE.Mesh[] = []
    const markerGroup = new THREE.Group()
    globe.add(markerGroup)

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
      /* arcos */
      for (const f of FLOWS) {
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
          .multiplyScalar(1 + dist * 0.3 + f.peso * 0.012)
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
        const st = TYPE_STYLE[f.type]
        const dashed = st.dash !== ''
        const mat = dashed
          ? new THREE.LineDashedMaterial({ color: new THREE.Color(st.color), dashSize: 0.035, gapSize: 0.024, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })
          : new THREE.LineBasicMaterial({ color: new THREE.Color(st.color), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })
        const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(ARC_SEG))
        const line = new THREE.Line(geo, mat)
        line.renderOrder = 3
        if (dashed) line.computeLineDistances()
        line.userData.flowId = f.id
        /* núcleo de energia: filete claro sobre a mesma geometria */
        const core = new THREE.Line(
          geo,
          new THREE.LineBasicMaterial({ color: new THREE.Color('#ffffff'), transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }),
        )
        core.renderOrder = 4
        core.raycast = () => {}
        arcGroup.add(line)
        arcGroup.add(core)
        arcs.push({ id: f.id, type: f.type, detail: f.tier === 'detail', curve, line, core, len: curve.getLength() })
      }

      /* partículas (movers) */
      {
        const tmp: Mover[] = []
        arcs.forEach((a, i) => {
          const f = FLOWS.find((x) => x.id === a.id)!
          const k = f.peso >= 2.5 ? 4 : f.peso >= 1.5 ? 3 : 2
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

      /* marcadores */
      const markerScale = isMobile ? 1.4 : 1
      for (const b of BLOCS) {
        const p = latLngToVec3(b.anchor[0], b.anchor[1], 1.012)
        const baseR = b.tier === 'secondary' ? 0.008 : 0.013
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(baseR * markerScale, 16, 16),
          new THREE.MeshBasicMaterial({ color: new THREE.Color(b.color) }),
        )
        mesh.position.set(p[0], p[1], p[2])
        mesh.userData.blocId = b.id
        const ringIn = (b.tier === 'secondary' ? 0.014 : 0.02) * markerScale
        const ringOut = (b.tier === 'secondary' ? 0.017 : 0.024) * markerScale
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(ringIn, ringOut, 32),
          new THREE.MeshBasicMaterial({ color: new THREE.Color(b.color), transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false }),
        )
        ring.position.copy(mesh.position)
        ring.lookAt(0, 0, 0)
        markerGroup.add(mesh)
        markerGroup.add(ring)
        markerMeshes.push(mesh)
      }

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
      const attr = dotPoints.geometry.getAttribute('color') as THREE.BufferAttribute
      const arr = attr.array as Float32Array
      for (let i = 0; i < dotIsos.length; i++) {
        if (useHl && hs.has(dotIsos[i])) {
          arr[i * 3] = fill.r
          arr[i * 3 + 1] = fill.g
          arr[i * 3 + 2] = fill.b
        } else if (spotSet && spotCol && spotSet.has(dotIsos[i])) {
          arr[i * 3] = Math.min(1, spotCol.r * 1.15 + 0.12)
          arr[i * 3 + 1] = Math.min(1, spotCol.g * 1.15 + 0.12)
          arr[i * 3 + 2] = Math.min(1, spotCol.b * 1.15 + 0.12)
        } else if (hoverIso !== null && dotIsos[i] === hoverIso) {
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
    }

    function applySelection() {
      const { visibleLayers, selectedFlowId, highlightFlowIds } = live.current
      const anySel = !!selectedFlowId
      const anyHl = highlightFlowIds.length > 0
      const camDist = camera.position.length()
      const detailOn = camDist < 2.75
      for (const a of arcs) {
        const vis = visibleLayers[a.type] !== false
        const isSel = selectedFlowId === a.id
        const isHl = highlightFlowIds.includes(a.id)
        let op = 0.8
        if (!vis) op = 0
        else if (a.detail && !detailOn) op = 0
        else if (anySel) op = isSel ? 1 : 0.05
        else if (anyHl) op = isHl ? 1 : 0.07
        a.line.visible = op > 0
        ;(a.line.material as THREE.LineBasicMaterial).opacity = Math.min(1, op)
        /* núcleo acompanha: forte no selecionado, sutil no normal */
        a.core.visible = a.line.visible
        ;(a.core.material as THREE.LineBasicMaterial).opacity =
          !a.line.visible ? 0 : selectedFlowId === a.id ? 0.85 : anySel || anyHl ? 0 : 0.16
      }
      /* brilho pulsante nas pontas do fluxo selecionado */
      const sel = arcs.find((a) => a.id === selectedFlowId && a.line.visible)
      if (sel) {
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
          const vis = visibleLayers[a.type] !== false && (!a.detail || detailOn)
          const emph = selectedFlowId === a.id || highlightFlowIds.includes(a.id) || (!anySel && !anyHl)
          const base = moverBase[i]
          const f = !vis ? 0 : emph ? 1 : 0.08
          moverColors![i * 3] = base.r * f
          moverColors![i * 3 + 1] = base.g * f
          moverColors![i * 3 + 2] = base.b * f
        })
        attr.needsUpdate = true
      }
    }

    /* ── voo de câmera (tour / clique com zoom) ───────────── */
    let flight: {
      t: number
      dur: number
      from: THREE.Quaternion
      to: THREE.Quaternion
      camFrom: THREE.Vector3 | null
      camTo: THREE.Vector3 | null
    } | null = null
    let lastFocusNonce = -1
    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

    /* ── interação ────────────────────────────────────────── */
    const ray = new THREE.Raycaster()
    ray.params.Line = { threshold: isMobile ? 0.045 : 0.025 } as never
    const ndc = new THREE.Vector2()
    const castAt = (cx: number, cy: number) => {
      const r = renderer.domElement.getBoundingClientRect()
      ndc.x = ((cx - r.left) / r.width) * 2 - 1
      ndc.y = -((cy - r.top) / r.height) * 2 + 1
      ray.setFromCamera(ndc, camera)
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
      const hitM = ray.intersectObjects(markerMeshes, false)[0]
      if (hitM) {
        live.current.onSelectBloc(hitM.object.userData.blocId as string)
        return
      }
      const hitL = ray.intersectObjects(arcGroup.children, false)[0]
      if (hitL) {
        const id = hitL.object.userData.flowId as string
        live.current.onSelectFlow(live.current.selectedFlowId === id ? null : id)
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
      const hitM = ray.intersectObjects(markerMeshes, false)[0]
      const hitL = hitM ? undefined : ray.intersectObjects(arcGroup.children, false)[0]
      const hit = hitM ?? hitL
      renderer.domElement.style.cursor = hit ? 'pointer' : 'grab'
      /* tooltip do arco: título + escala anual (só desktop com mouse fino) */
      if (finePointer && hitL) {
        const f = FLOWS.find((x) => x.id === (hitL.object.userData.flowId as string))
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
        if (!hitL) tipEl.style.display = 'none'
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
        const p = latLngToVec3(f.lng, f.lat, 1)
        _v1.set(p[0], p[1], p[2]).applyQuaternion(globe.quaternion).normalize()
        _v2.copy(camera.position).normalize()
        /* lift: inclina o alvo p/ cima p/ o país aparecer acima do card */
        const lift = THREE.MathUtils.clamp(f.lift ?? 0, 0, 1)
        if (lift > 0) {
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
        const camTo = f.dist ? camera.position.clone().setLength(f.dist) : null
        flight = {
          t: 0,
          dur: f.dist ? 1.4 : 1.5,
          from: globe.quaternion.clone(),
          to,
          camFrom: camTo ? camera.position.clone() : null,
          camTo,
        }
        controls.enabled = false
      }
      if (flight) {
        flight.t += dt
        const t = easeInOut(Math.min(1, flight.t / flight.dur))
        globe.quaternion.slerpQuaternions(flight.from, flight.to, t)
        if (flight.camFrom && flight.camTo) camera.position.lerpVectors(flight.camFrom, flight.camTo, t)
        if (flight.t >= flight.dur) {
          flight = null
          controls.enabled = true
        }
      } else if (o.autoRotate && !reducedMotion) {
        globe.rotation.y += dt * 0.12 * o.rotateSpeed
      }

      /* partículas ao longo das curvas */
      if (moverPoints && movers.length) {
        const pos = moverPoints.geometry.getAttribute('position') as THREE.BufferAttribute
        const arr = pos.array as Float32Array
        const sp = (reducedMotion ? 0.15 : 1) * o.arcSpeed
        for (let i = 0; i < movers.length; i++) {
          const m = movers[i]
          const a = arcs[m.arc]
          /* arco em destaque corre até 2.4× mais rápido */
          const boost = live.current.selectedFlowId === a.id ? 2.4 : 1
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
      const key = `${live.current.selectedFlowId}|${live.current.highlightFlowIds.join(',')}|${JSON.stringify(live.current.visibleLayers)}|${camDist.toFixed(2)}|${o.showArcs}|${spotSig}`
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
        const s = 0.13 + 0.035 * Math.sin(performance.now() * 0.005)
        selGlowA.scale.setScalar(s)
        selGlowB.scale.setScalar(s)
      }

      controls.update()
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
      const key = JSON.stringify({ ...o, showLs: o.showLabels })
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
