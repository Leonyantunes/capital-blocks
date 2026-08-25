import { useMemo, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { COUNTRY_FEATURES, MAP_W, MAP_H, GRATICULE_D, SPHERE_D, ISO_TO_BLOC, BLOCS } from '../../lib/world'
import { AFFECTED, CAT_META, type AffectedCat, type AffectedCountry } from '../../data/affected'
import { useApp } from '../../store/useApp'

const IMPERIAL_BLOCS = new Set(['usa', 'eu', 'gbr', 'jpn'])

/** MAPA "O OUTRO LADO" — países atrasados/explorados pelo imperialismo. */
export default function AffectedMap() {
  const [selectedIso, setSelectedIso] = useState<string | null>('180')
  const [catFilter, setCatFilter] = useState<AffectedCat | 'todas'>('todas')
  const didatico = useApp((s) => s.mode) === 'didatico'

  const byIso = useMemo(() => Object.fromEntries(AFFECTED.map((a) => [a.iso, a])), [])
  const selected = selectedIso ? byIso[selectedIso] ?? null : null

  const visible = useMemo(
    () => (catFilter === 'todas' ? AFFECTED : AFFECTED.filter((a) => a.cat === catFilter)),
    [catFilter],
  )
  const visibleIso = useMemo(() => new Set(visible.map((a) => a.iso)), [visible])

  const countriesLayer = useMemo(
    () => (
      <g strokeLinejoin="round">
        {COUNTRY_FEATURES.map((f) => {
          const aff = byIso[f.id]
          const bloc = ISO_TO_BLOC[f.id]
          const blocColor = BLOCS.find((b) => b.id === bloc)?.color
          const imperial = bloc ? IMPERIAL_BLOCS.has(bloc) : false
          const dimmed = catFilter !== 'todas' && (!aff || !visibleIso.has(f.id))
          const sel = f.id === selectedIso

          if (aff) {
            const meta = CAT_META[aff.cat]
            return (
              <path key={f.id} d={f.d}
                style={{
                  fill: `${meta.color}${dimmed ? '18' : '4d'}`,
                  stroke: sel ? '#ffffff' : meta.color,
                  strokeWidth: sel ? 1.6 : dimmed ? 0.5 : 0.9,
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedIso(f.id)}
              >
                <title>{`${aff.nome} — ${meta.label} · clique para a história`}</title>
              </path>
            )
          }
          return (
            <path key={f.id} d={f.d}
              style={{
                fill: imperial ? `${blocColor ?? '#ffc107'}14` : bloc ? `${blocColor}10` : '#131a22',
                stroke: '#232c38', strokeWidth: 0.5,
              }}
            >
              <title>{f.name}{imperial ? ' · centro imperial' : ''}</title>
            </path>
          )
        })}
      </g>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [byIso, catFilter, selectedIso],
  )

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
      {/* mapa + legenda */}
      <div className="flex flex-col gap-2">
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
          <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="h-auto w-full select-none" role="img"
            aria-label="Mapa dos países afetados pelo imperialismo">
            <rect width={MAP_W} height={MAP_H} fill="#0d1117" />
            <g>
              <path d={SPHERE_D} fill="#10151d" stroke="#1b2430" strokeWidth="1" />
              <path d={GRATICULE_D} fill="none" stroke="#141b24" strokeWidth="0.5" />
              {countriesLayer}
            </g>
          </svg>
        </div>

        {/* legenda / filtros */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2">
          <button onClick={() => setCatFilter('todas')}
            className={`rounded-md border px-2 py-1 text-[10.5px] transition-colors ${
              catFilter === 'todas' ? 'border-money/70 bg-money/10 text-money' : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}>
            todas as marcas
          </button>
          {(Object.keys(CAT_META) as AffectedCat[]).map((c) => {
            const meta = CAT_META[c]
            const active = catFilter === c
            return (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10.5px] transition-colors ${
                  active ? 'bg-zinc-800 text-zinc-100' : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
                style={active ? { borderColor: meta.color } : undefined}
                title={meta.exemplo}>
                <span className="h-2 w-2 rounded-sm" style={{ background: meta.color }} />
                {meta.label}
              </button>
            )
          })}
          <span className="ml-auto hidden font-mono text-[9.5px] text-zinc-600 md:inline">
            tons apagados = centro imperial · clique num país colorido
          </span>
        </div>
      </div>

      {/* painel do país selecionado */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <AnimatePresence mode="wait">
          <m.article
            key={selected?.iso ?? 'none'}
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
          >
            {!selected ? (
              <p className="py-8 text-center text-xs text-zinc-600">clique em um país colorido no mapa</p>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-[9.5px] uppercase tracking-widest" style={{ color: CAT_META[selected.cat].color }}>
                      {CAT_META[selected.cat].label}
                    </div>
                    <h4 className="text-lg font-bold text-zinc-100">{selected.nome}</h4>
                    <div className="text-[10.5px] text-zinc-500">
                      {selected.regiao} · {selected.colonizador} · {selected.periodo}
                    </div>
                  </div>
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[9px] text-zinc-400">{selected.code}</span>
                </div>

                <p className="mt-2.5 text-xs leading-relaxed text-zinc-200">
                  {didatico ? selected.did : selected.adv}
                </p>

                {/* dados atuais */}
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  <MiniStat label="PIB (FMI)" value={`US$ ${selected.pibTri.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} tri`} />
                  <MiniStat label="Renda per capita" value={`US$ ${selected.perCapitaUsd.toLocaleString('pt-BR')}`} />
                  <MiniStat label="Intervenções" value={selected.intervencoes !== undefined ? `${selected.intervencoes}+` : '—'} />
                </div>
                <p className="mt-2 rounded-lg bg-zinc-950/70 p-2 text-[10.5px] leading-snug text-zinc-400">
                  <span className="text-zinc-300">Hoje:</span> {selected.chave}
                </p>
                {selected.interNotas && (
                  <p className="mt-1.5 text-[10px] leading-snug text-zinc-500">
                    <span className="font-mono uppercase tracking-wider text-zinc-600">intervenções:</span> {selected.interNotas}
                  </p>
                )}
                {selected.ep && (
                  <p className="mt-1.5 text-[10px] text-zinc-500">
                    relacionado ao episódio acima ·{' '}
                    <span className="font-mono" style={{ color: CAT_META[selected.cat].color }}>EP {selected.ep === 'congo' ? '04' : selected.ep === 'iraque' ? '07' : '—'}</span>
                  </p>
                )}
              </>
            )}
          </m.article>
        </AnimatePresence>
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-950/70 p-2 text-center">
      <div className="text-[8.5px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-0.5 font-mono text-[11.5px] font-bold text-zinc-100">{value}</div>
    </div>
  )
}

/** Ranking — países com mais intervenções documentadas. */
export function InterventionRanking() {
  const didatico = useApp((s) => s.mode) === 'didatico'
  const list = AFFECTED.filter((a) => a.intervencoes && a.intervencoes > 0)
    .sort((a, b) => (b.intervencoes ?? 0) - (a.intervencoes ?? 0))
    .slice(0, 12)
  const max = list[0]?.intervencoes ?? 1

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-zinc-100">Os países mais intervencionados do planeta</h3>
        <span className="font-mono text-[9.5px] text-zinc-600">1890–hoje · Blum/Kinzer/Tufts MIP (aprox.)</span>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
        {didatico
          ? 'Cada barra é uma soma de invasões, ocupações, golpes e sabotagens documentadas. Cuba e o Haiti aparecem no topo — não por acaso: são os vizinhos mais rebeldes do império.'
          : 'Contagem documentada de intervenções militares/operações encobertas (1890–hoje). A recorrência correlaciona-se com: proximidade ao centro (Caribe), recursos estratégicos e experimentação de doutrina (contra-insurgência, choque).'}
      </p>
      <div className="mt-3 space-y-1.5">
        {list.map((a) => (
          <div key={a.iso} className="flex items-center gap-2">
            <span className="w-10 shrink-0 font-mono text-[10px] text-zinc-500">{a.code}</span>
            <span className="w-36 shrink-0 truncate text-[11px] text-zinc-200">{a.nome}</span>
            <div className="h-4 flex-1 overflow-hidden rounded bg-zinc-800/70">
              <div className="h-full rounded"
                style={{ width: `${((a.intervencoes ?? 0) / max) * 100}%`, background: CAT_META[a.cat].color }} />
            </div>
            <span className="w-8 shrink-0 text-right font-mono text-[11px] font-bold text-zinc-100">{a.intervencoes}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Painel Françafrique / franco CFA. */
export function CfaPanel() {
  const didatico = useApp((s) => s.mode) === 'didatico'
  const cfaList = AFFECTED.filter((a) => a.cat === 'cfa')
  const totalPib = cfaList.reduce((s, a) => s + a.pibTri, 0)
  return (
    <div className="rounded-xl border border-fuchsia-400/40 bg-fuchsia-400/5 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-fuchsia-300">Françafrique: o franco CFA — a moeda da independência incompleta</h3>
        <span className="font-mono text-[9.5px] text-zinc-600">14 países · ≈US$ {totalPib.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} tri somados</span>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
        {didatico
          ? 'Quatorze países africanos usam uma moeda (o franco CFA) que nasceu como moeda COLONIAL francesa. Até 2020, metade das reservas desses países ficava DEPOSITADA no Tesouro francês. A paridade é fixada em relação ao euro. Ou seja: a política monetária de 200 milhões de pessoas é decidida, na prática, longe delas. Quando um país tenta sair (Guiné, 1958), a França pune e vai embora levando até os fios da luz.'
          : 'Arquitetura pós-colonial de captura monetária: emissão contratualizada (impressão via Banque de France), centralização de ~50% das reservas no Trésor français (até a reforma UEMOA 2020), paridade fixa ao franco/euro e convertibilidade garantida — em troca de disciplina orçamentária supervisada. Resultado: política monetária e cambial exógena, crédito restrito, desindustrialização e competividade artificial das exportações primárias (TMD aplicada à esfera monetária).'}
      </p>
      <ul className="mt-2 flex flex-wrap gap-1">
        {cfaList.map((a) => (
          <li key={a.iso} className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">
            {a.nome}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] leading-relaxed text-zinc-600">
        Marcos: criado em 1945 (franco CFA = "franco da Comunidade Francesa de África"); desvalorização de 50% em
        uma noite (1994); reforma de 2020 renomeia o CFA ocidental para "eco" — mas mantém a paridade ao euro.
        Guiné (1958) e Togo (tentativa de saída de Olympio, 1963) como casos de ruptura/punição.
      </p>
    </div>
  )
}
