import { useEffect, useMemo, useState } from 'react'
import { SOURCES, SOURCE_CATEGORIES, SOURCE_KINDS, sourcesSummary } from '../../data/sources'
import { TOUR_SOURCE_USAGE } from '../../data/sourceUsage'
import { mt, type Lang } from '../../i18n'
import { useApp } from '../../store/useApp'
import { textoPorModo } from '../../lib/simples'
import ModeBadge from '../ui/ModeBadge'
import Tip from '../ui/Tip'

/**
 * Estados de verificação, em PT/EN/ES.
 * São o coração da honestidade do app: o rótulo diz o quanto se pode confiar
 * naquele número. Traduzir aqui é o mínimo — o conteúdo de cada fonte segue
 * em PT-BR até a fase de tradução integral do conteúdo.
 */
const VERIFICATION_LABEL: Record<
  string,
  { rotulo: [string, string, string]; classe: string; dica: [string, string, string] }
> = {
  'url-incluida': {
    rotulo: ['link verificado', 'verified link', 'enlace verificado'],
    classe: 'border-sky-400/50 text-sky-300',
    dica: [
      'Há link direto copiado do app ou conferido como acessível. O link não garante atualização automática.',
      'A direct link was copied from the app or checked as reachable. The link does not guarantee automatic updates.',
      'Hay un enlace directo copiado de la app o verificado como accesible. El enlace no garantiza actualización automática.',
    ],
  },
  'fonte-declarada': {
    rotulo: ['fonte declarada', 'declared source', 'fuente declarada'],
    classe: 'border-zinc-700 text-zinc-300',
    dica: [
      'Instituição e safra estão nomeadas no app. A página/tabela exata pode ainda estar pendente.',
      'Institution and vintage are named in the app. The exact page/table may still be pending.',
      'Institución y campaña están nombradas en la app. La página/tabla exacta puede seguir pendiente.',
    ],
  },
  'revisao-pendente': {
    rotulo: ['revisão pendente', 'review pending', 'revisión pendiente'],
    classe: 'border-amber-400/60 text-amber-300',
    dica: [
      'Falta página exata, há inconsistência possível ou safra desatualizada. Não citar como fato fechado sem checar.',
      'Exact page missing, possible inconsistency or outdated vintage. Do not cite as settled fact without checking.',
      'Falta la página exacta, hay inconsistencia posible o campaña desactualizada. No citar como hecho cerrado sin verificar.',
    ],
  },
}

const idx = (l: Lang) => (l === 'pt' ? 0 : l === 'en' ? 1 : 2)

/** MÓDULO 10 — FONTES & REFERÊNCIAS: a base documental do app. */
export default function SourcesModule() {
  const lang = useApp((s) => s.lang)
  const mode = useApp((s) => s.mode)
  const [query, setQuery] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [tipo, setTipo] = useState('todos')
  const [somenteLinks, setSomenteLinks] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.hash.startsWith('#fonte-')) return
    const id = decodeURIComponent(window.location.hash.slice(1))
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
    return () => window.clearTimeout(timer)
  }, [])

  const resumo = useMemo(() => sourcesSummary(), [])
  const categorias = useMemo(
    () => SOURCE_CATEGORIES.filter((c) => SOURCES.some((s) => s.categoria === c.id)),
    [],
  )
  const tipos = useMemo(
    () => SOURCE_KINDS.filter((k) => SOURCES.some((s) => s.tipo === k.id)),
    [],
  )

  const lista = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SOURCES.filter((s) => categoria === 'todas' || s.categoria === categoria)
      .filter((s) => tipo === 'todos' || s.tipo === tipo)
      .filter((s) => !somenteLinks || s.urls.length > 0)
      .filter((s) =>
        !q ||
        `${s.nome} ${s.instituicao ?? ''} ${s.cobre.join(' ')} ${s.usadoEm.join(' ')}`
          .toLowerCase()
          .includes(q),
      )
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  }, [query, categoria, tipo, somenteLinks])

  const rotuloCategoria = (id: string) =>
    SOURCE_CATEGORIES.find((c) => c.id === id)?.rotulo ?? id
  const rotuloTipo = (id: string) =>
    SOURCE_KINDS.find((k) => k.id === id)?.rotulo ?? id

  return (
    <div className="flex flex-col gap-4">
      <header className="relative">
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-money">
            {mt(lang, 'sources').kicker}
          </div>
          <ModeBadge />
        </div>
        <h2 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-100">
          {mt(lang, 'sources').title}
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {textoPorModo(
            mode,
            resumo.revisaoPendente > 0
              ? 'De onde sai cada número importante do app? Aqui está a lista das fontes. O selo “revisão pendente” marca o que ainda precisa de checagem antes de virar citação escolar.'
              : 'De onde sai cada número importante do app? Aqui está a lista das fontes. Nesta auditoria, nenhuma entrada ficou com revisão pendente; estimativas e ressalvas continuam marcadas separadamente.',
            'Base documental auditável: instituições, safras, cobertura por dataset, estado de verificação e links diretos. Estimativas permanecem explicitamente sinalizadas mesmo quando a metodologia e as fontes de calibração já foram auditadas.',
            resumo.revisaoPendente > 0
              ? 'Aqui você vê de onde vêm os números. Se aparecer “revisão pendente”, aquele dado ainda precisa ser conferido antes de usar num trabalho.'
              : 'Aqui você vê de onde vêm os números. As fontes foram conferidas; quando um número é só uma estimativa, o app avisa.',
          )}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
          <div className="text-[9.5px] uppercase tracking-widest text-zinc-500">Referências</div>
          <div className="mt-1 font-mono text-lg font-extrabold text-zinc-100">{resumo.total}</div>
          <div className="mt-0.5 text-[10px] text-zinc-500">entradas canônicas</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
          <div className="text-[9.5px] uppercase tracking-widest text-zinc-500">Com link direto</div>
          <div className="mt-1 font-mono text-lg font-extrabold text-sky-300">{resumo.comUrl}</div>
          <div className="mt-0.5 text-[10px] text-zinc-500">página/base acessível</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
          <div className="text-[9.5px] uppercase tracking-widest text-zinc-500">Revisão pendente</div>
          <div className="mt-1 font-mono text-lg font-extrabold text-amber-300">{resumo.revisaoPendente}</div>
          <div className="mt-0.5 text-[10px] text-zinc-500">checar antes de citar</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
          <div className="text-[9.5px] uppercase tracking-widest text-zinc-500">Estimativas</div>
          <div className="mt-1 font-mono text-lg font-extrabold text-zinc-100">{resumo.estimativas}</div>
          <div className="mt-0.5 text-[10px] text-zinc-500">método interno sinalizado</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar fonte, instituição, dataset ou módulo…"
          className="w-64 max-w-full flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-money/60"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          aria-label="Filtrar por categoria"
          className="h-[34px] cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-2 text-xs text-zinc-300 outline-none focus:border-money/60"
        >
          <option value="todas">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.rotulo}</option>
          ))}
        </select>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          aria-label="Filtrar por tipo de fonte"
          className="h-[34px] cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-2 text-xs text-zinc-300 outline-none focus:border-money/60"
        >
          <option value="todos">Todos os tipos</option>
          {tipos.map((k) => (
            <option key={k.id} value={k.id}>{k.rotulo}</option>
          ))}
        </select>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-300">
          <input
            type="checkbox"
            checked={somenteLinks}
            onChange={(e) => setSomenteLinks(e.target.checked)}
            className="h-3.5 w-3.5 accent-amber-400"
          />
          Somente com link
        </label>
        <span className="ml-auto font-mono text-[10px] text-zinc-500">
          {lista.length} de {SOURCES.length}
        </span>
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        {lista.map((s) => {
          const v = VERIFICATION_LABEL[s.verificacao]
          return (
            <article
              key={s.id}
              id={`fonte-${s.id}`}
              className="scroll-mt-20 flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-300">
                  {rotuloCategoria(s.categoria)}
                </span>
                <span className="rounded border border-zinc-700 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                  {rotuloTipo(s.tipo)}
                </span>
                <Tip text={v.dica[idx(lang)]}>
                  <span className={`cursor-help rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${v.classe}`}>
                    {v.rotulo[idx(lang)]}
                  </span>
                </Tip>
                {s.estimate && (
                  <span className="rounded border border-amber-400/60 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-amber-300">
                    est.
                  </span>
                )}
                <span className="ml-auto font-mono text-[10px] text-zinc-500">{s.ano}</span>
              </div>

              <h3 className="mt-2 text-sm font-bold text-zinc-100">{s.nome}</h3>
              {s.instituicao && (
                <div className="mt-0.5 text-[11px] font-medium text-zinc-400">{s.instituicao}</div>
              )}
              <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                {textoPorModo(mode, s.resumoDidatico, s.resumoAvancado)}
              </p>

              <div className="mt-2.5 rounded-lg bg-zinc-950/60 p-2.5">
                <div className="text-[9.5px] uppercase tracking-widest text-zinc-500">Cobre no app</div>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] leading-snug text-zinc-300">
                  {s.cobre.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </div>

              {s.urls.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.urls.map((u) => (
                    <a
                      key={u.url}
                      href={u.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-sky-400/40 bg-sky-400/10 px-2.5 py-1.5 font-mono text-[10px] font-bold text-sky-300 underline decoration-dotted hover:bg-sky-400/20"
                    >
                      {u.rotulo} ↗
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-2 font-mono text-[10px] text-zinc-600">
                  URL direta pendente — ver observação abaixo.
                </p>
              )}

              {s.observacao && (
                <p className="mt-2 border-t border-zinc-800/70 pt-2 text-[10.5px] leading-snug text-amber-200/90">
                  {s.verificacao === 'revisao-pendente' ? 'Pendência' : 'Nota de auditoria'}: {s.observacao}
                </p>
              )}

              <div className="mt-auto pt-2 font-mono text-[9px] uppercase tracking-wider text-zinc-600">
                usado em: {s.usadoEm.join(' · ')}
                {(TOUR_SOURCE_USAGE[s.id] ?? 0) > 0 && (
                  <span className="ml-1 text-sky-400/80">
                    · {TOUR_SOURCE_USAGE[s.id]} vínculo(s) em estatísticas dos tours
                  </span>
                )}
              </div>
            </article>
          )
        })}
      </section>

      {lista.length === 0 && (
        <p className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
          Nenhuma referência encontrada com esses filtros. Limpe a busca ou escolha outra categoria.
        </p>
      )}

      <p className="text-[10px] leading-relaxed text-zinc-600">
        Como citar: prefira instituição + safra + página/tabela. Exemplo: “FMI, COFER, Q4 2025”.
        Estimativas internas usam badge “est.” e nunca devem ser apresentadas como estatística oficial.
        Entradas com “revisão pendente” indicam exatamente o que falta checar.
      </p>
    </div>
  )
}
