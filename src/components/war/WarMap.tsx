import { useMemo, useState } from 'react'
import {
  MAP_W, MAP_H, COUNTRY_FEATURES, GRATICULE_D, SPHERE_D, ISO_TO_BLOC, BLOCS, arcPath, project,
} from '../../lib/world'
import { WAR_EPOCHS, WAR_CONFLICTS, SUPPLIERS, warText, type SupplierId } from '../../data/wars'
import { locale, pick } from '../../i18n'
import { useApp } from '../../store/useApp'

/**
 * MAPA "WAR ROOM" — mesma cartografia da Home (Natural Earth 110m),
 * reutilizada p/ demonstrar a luta entre blocos de capital:
 * nós de conflito pulsantes por época + linhas de suprimento
 * das matrizes (defesa/energia/finanças) até as zonas de guerra.
 */

interface ArcSpec {
  id: string
  d: string
  color: string
  dur: number
}

export default function WarMap({
  epochIndex,
  onSelect,
  selectedId,
}: {
  epochIndex: number
  onSelect: (id: string) => void
  selectedId: string | null
}) {
  const lang = useApp((s) => s.lang)
  const epoch = WAR_EPOCHS[epochIndex]
  const [hoverName, setHoverName] = useState<{ name: string; x: number; y: number } | null>(null)
  const regionNames = useMemo(() => {
    const DisplayNames = (Intl as unknown as {
      DisplayNames?: new (locales: string[], options: { type: 'region' }) => { of(code: string): string | undefined }
    }).DisplayNames
    return DisplayNames ? new DisplayNames([locale(lang)], { type: 'region' }) : null
  }, [lang])

  const conflicts = useMemo(
    () => WAR_CONFLICTS.filter((c) => c.epoch === epochIndex),
    [epochIndex],
  )

  const arcs = useMemo<ArcSpec[]>(() => {
    const specs: ArcSpec[] = []
    let parity = 1
    conflicts.forEach((c) => {
      c.empresas.forEach((emp) => {
        if (!emp.ref) return
        const sup = SUPPLIERS[emp.ref as SupplierId]
        if (!sup) return
        const bend = 0.18 * (parity % 2 === 0 ? -1 : 1)
        parity++
        specs.push({
          id: `${c.id}-${emp.ref}`,
          d: arcPath(sup.hq, c.lngLat, bend),
          color: epoch.color,
          dur: 3.6 + (specs.length % 4) * 0.7,
        })
      })
    })
    return specs
  }, [conflicts, epoch])

  /* camada de países estática — memoizada p/ performance */
  const countriesLayer = useMemo(
    () => (
      <g strokeLinejoin="round">
        {COUNTRY_FEATURES.map((f) => {
          const bloc = ISO_TO_BLOC[f.id]
          const color = BLOCS.find((b) => b.id === bloc)?.color
          return (
            <path key={f.id} d={f.d}
              style={{ fill: color ? `${color}1a` : '#141a22', stroke: '#232c38', strokeWidth: 0.5 }}
              onPointerEnter={(e) => {
                const r = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect()
                setHoverName({ name: regionNames?.of(f.id) ?? f.name, x: ((e.clientX - r.left) / r.width) * MAP_W, y: ((e.clientY - r.top) / r.height) * MAP_H })
              }}
              onPointerLeave={() => setHoverName(null)}
            />
          )
        })}
      </g>
    ),
    [regionNames],
  )

  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="h-auto w-full select-none"
        role="img" aria-label={`${pick(lang, 'Mapa de conflitos — época', 'Conflict map — era', 'Mapa de conflictos — época')} ${epoch.faixa}`}>
        <rect width={MAP_W} height={MAP_H} fill="#0d1117" />

        <g>
          <path d={SPHERE_D} fill="#10151d" stroke="#1b2430" strokeWidth="1" />
          <path d={GRATICULE_D} fill="none" stroke="#141b24" strokeWidth="0.5" />

          {/* países (contexto, não interativos — camada memoizada) */}
          {countriesLayer}

          {/* linhas de suprimento matriz→frente */}
          {arcs.map((a) => (
            <g key={a.id}>
              <path d={a.d} fill="none" stroke={a.color} strokeWidth="1.4"
                strokeDasharray="5 4" opacity="0.8" />
              {[0, 1].map((i) => (
                <circle key={i} r="2.2" fill={a.color}>
                  <animateMotion dur={`${a.dur}s`} repeatCount="indefinite" begin={`-${(a.dur * i) / 2}s`} path={a.d} />
                </circle>
              ))}
            </g>
          ))}

          {/* nós de conflito */}
          {conflicts.map((c) => {
            const [x, y] = project(c.lngLat)
            const sel = selectedId === c.id
            return (
              <g key={c.id} className="cursor-pointer" onClick={() => onSelect(c.id)}>
                <circle cx={x} cy={y} r="22" fill={epoch.color} opacity="0.14"
                  className="marker-ring" style={{ transformOrigin: `${x}px ${y}px` }} />
                <circle cx={x} cy={y} r={sel ? 9 : 7}
                  fill={sel ? '#0d1117' : epoch.color} stroke={epoch.color}
                  strokeWidth={sel ? 3 : 1.8} />
                <text x={x + 13} y={y + 4} fontSize="11" fontWeight="700"
                  fill={sel ? '#ffffff' : epoch.color} className="font-mono pointer-events-none">
                  {warText(lang, c.curto)}
                </text>
                <title>{`${warText(lang, c.nome)} · ${warText(lang, c.periodo)} — ${pick(lang, 'clique para “quem lucra”', 'click for “who profits”', 'haz clic para “quién gana”')}`}</title>
              </g>
            )
          })}

          {/* sedes das matrizes (pequenos quadrados) */}
          {Object.values(SUPPLIERS).map((s) => {
            const [x, y] = project(s.hq)
            const active = arcs.some((a) => a.id.endsWith(`-${s.id}`))
            return (
              <g key={s.id} opacity={active ? 1 : 0.28}>
                <rect x={x - 3.5} y={y - 3.5} width="7" height="7" fill="#ffc107" stroke="#0d1117" strokeWidth="0.8" />
                <title>{`${s.nome} (${warText(lang, s.pais)})${active ? pick(lang, ' → fornecendo nesta época', ' → supplying in this era', ' → suministrando en esta época') : ''}`}</title>
              </g>
            )
          })}
        </g>

        {hoverName && (
          <g pointerEvents="none">
            <text x={hoverName.x + 8} y={hoverName.y - 8} fontSize="10.5" className="fill-zinc-300 font-mono">
              {hoverName.name}
            </text>
          </g>
        )}
      </svg>

      {/* legenda */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-zinc-800 px-4 py-2 text-[10px] text-zinc-500">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: epoch.color }} /> {pick(lang, 'zona de conflito', 'conflict zone', 'zona de conflicto')} ({epoch.faixa})</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2 w-2 bg-money" /> {pick(lang, 'matriz do complexo militar-industrial', 'military-industrial complex headquarters', 'sede del complejo militar-industrial')}</span>
        <span>{pick(lang, 'linhas = fluxo de armas/dinheiro/logística', 'lines = flow of weapons/money/logistics', 'líneas = flujo de armas/dinero/logística')}</span>
        <span className="ml-auto hidden md:inline">{pick(lang, 'clique no nó para abrir o painel “quem lucra”', 'click the node to open the “who profits” panel', 'haz clic en el nodo para abrir el panel “quién gana”')}</span>
      </div>
    </div>
  )
}
