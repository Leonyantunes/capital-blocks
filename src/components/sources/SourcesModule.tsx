import { useEffect, useMemo, useState } from 'react'
import { SOURCES, SOURCE_CATEGORIES, SOURCE_KINDS, sourcesSummary } from '../../data/sources'
import { generatedText } from '../../data/generatedTranslations'
import { TOUR_SOURCE_USAGE } from '../../data/sourceUsage'
import { mt, pick, pickTri, type Lang, type TriText } from '../../i18n'
import { useApp } from '../../store/useApp'
import { textoPorModo } from '../../lib/simples'
import ModeBadge from '../ui/ModeBadge'
import Tip from '../ui/Tip'
import AnalyticsLab from './AnalyticsLab'

/**
 * Estados de verificação, em PT/EN/ES.
 * São o coração da honestidade do app: o rótulo diz o quanto se pode confiar
 * naquele número. Metadados longos das fontes passam pela camada estática
 * generatedTranslations, mantendo o runtime offline e trilíngue.
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

const CATEGORY_LABELS: Record<string, TriText> = {
  macro: ['Macroeconomia', 'Macroeconomics', 'Macroeconomía'],
  moeda: ['Moeda e crédito', 'Money and credit', 'Moneda y crédito'],
  riqueza: ['Riqueza e concentração', 'Wealth and concentration', 'Riqueza y concentración'],
  trabalho: ['Trabalho e salários', 'Labor and wages', 'Trabajo y salarios'],
  comercio: ['Comércio e fluxos', 'Trade and flows', 'Comercio y flujos'],
  guerra: ['Guerra e defesa', 'War and defense', 'Guerra y defensa'],
  'fiscal-br': ['Fiscalidade no Brasil', 'Fiscal policy in Brazil', 'Fiscalidad en Brasil'],
  empresas: ['Empresas e mercado', 'Companies and markets', 'Empresas y mercado'],
  brasil: ['Brasil', 'Brazil', 'Brasil'],
  teoria: ['Teoria e conceitos', 'Theory and concepts', 'Teoría y conceptos'],
  alternativas: ['Alternativas', 'Alternatives', 'Alternativas'],
  impactos: ['Vítimas e impactos', 'Victims and impacts', 'Víctimas e impactos'],
  geo: ['Geografia e técnica', 'Geography and technical methods', 'Geografía y técnica'],
  metodo: ['Métodos e estimativas', 'Methods and estimates', 'Métodos y estimaciones'],
}

const KIND_LABELS: Record<string, TriText> = {
  'fonte-primaria': ['Fonte primária', 'Primary source', 'Fuente primaria'],
  'base-oficial': ['Base oficial', 'Official database', 'Base oficial'],
  anuario: ['Anuário', 'Yearbook', 'Anuario'],
  'relatorio-anual': ['Relatório anual', 'Annual report', 'Informe anual'],
  academica: ['Acadêmica', 'Academic', 'Académica'],
  'ong-especializada': ['ONG especializada', 'Specialized NGO', 'ONG especializada'],
  'midia-especializada': ['Mídia especializada', 'Specialized media', 'Medio especializado'],
  enciclopedia: ['Enciclopédia', 'Encyclopedia', 'Enciclopedia'],
  audiovisual: ['Audiovisual', 'Audiovisual', 'Audiovisual'],
  'metodologia-interna': ['Metodologia interna', 'Internal methodology', 'Metodología interna'],
  'portal-oficial': ['Portal oficial', 'Official portal', 'Portal oficial'],
}

/** MÓDULO 10 — FONTES & REFERÊNCIAS: a base documental do app. */
export default function SourcesModule() {
  const lang = useApp((s) => s.lang)
  const mode = useApp((s) => s.mode)
  const [subTab, setSubTab] = useState<'fontes' | 'analytics'>('fontes')
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
        `${s.nome} ${generatedText(lang, s.nome)} ${s.instituicao ?? ''} ${generatedText(lang, s.instituicao)} ${s.cobre.join(' ')} ${s.cobre.map((c) => generatedText(lang, c)).join(' ')} ${s.usadoEm.join(' ')}`
          .toLowerCase()
          .includes(q),
      )
      .sort((a, b) => generatedText(lang, a.nome).localeCompare(generatedText(lang, b.nome), lang))
  }, [query, categoria, tipo, somenteLinks, lang])

  const rotuloCategoria = (id: string) =>
    CATEGORY_LABELS[id] ? pickTri(lang, CATEGORY_LABELS[id]) : SOURCE_CATEGORIES.find((c) => c.id === id)?.rotulo ?? id
  const rotuloTipo = (id: string) =>
    KIND_LABELS[id] ? pickTri(lang, KIND_LABELS[id]) : SOURCE_KINDS.find((k) => k.id === id)?.rotulo ?? id

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
              ? pick(lang,
                  'De onde sai cada número importante do app? Aqui está a lista das fontes. O selo “revisão pendente” marca o que ainda precisa de checagem antes de virar citação escolar.',
                  'Where does each important figure in the app come from? Here is the source list. The “review pending” badge marks items that still need checking before they become a classroom citation.',
                  '¿De dónde sale cada cifra importante de la app? Aquí está la lista de fuentes. El sello “revisión pendiente” marca lo que aún debe verificarse antes de convertirse en una cita escolar.')
              : pick(lang,
                  'De onde sai cada número importante do app? Aqui está a lista das fontes. Nesta auditoria, nenhuma entrada ficou com revisão pendente; estimativas e ressalvas continuam marcadas separadamente.',
                  'Where does each important figure in the app come from? Here is the source list. In this audit, no entry remained pending review; estimates and caveats are still marked separately.',
                  '¿De dónde sale cada cifra importante de la app? Aquí está la lista de fuentes. En esta auditoría, ninguna entrada quedó con revisión pendiente; las estimaciones y salvedades siguen marcadas por separado.'),
            pick(lang,
              'Base documental auditável: instituições, safras, cobertura por dataset, estado de verificação e links diretos. Estimativas permanecem explicitamente sinalizadas mesmo quando a metodologia e as fontes de calibração já foram auditadas.',
              'Auditable documentation base: institutions, vintages, dataset coverage, verification status and direct links. Estimates remain explicitly marked even when methodology and calibration sources have already been audited.',
              'Base documental auditable: instituciones, períodos, cobertura por dataset, estado de verificación y enlaces directos. Las estimaciones siguen señaladas explícitamente incluso cuando la metodología y las fuentes de calibración ya fueron auditadas.'),
            resumo.revisaoPendente > 0
              ? pick(lang,
                  'Aqui você vê de onde vêm os números. Se aparecer “revisão pendente”, aquele dado ainda precisa ser conferido antes de usar num trabalho.',
                  'Here you can see where the figures come from. If “review pending” appears, that figure still needs checking before it is used in an assignment.',
                  'Aquí puedes ver de dónde vienen las cifras. Si aparece “revisión pendiente”, ese dato aún debe verificarse antes de usarlo en un trabajo.')
              : pick(lang,
                  'Aqui você vê de onde vêm os números. As fontes foram conferidas; quando um número é só uma estimativa, o app avisa.',
                  'Here you can see where the figures come from. The sources have been checked; when a figure is only an estimate, the app tells you.',
                  'Aquí puedes ver de dónde vienen las cifras. Las fuentes fueron verificadas; cuando una cifra es solo una estimación, la app lo indica.'),
          )}
        </p>
      </header>

      {/* Seletor de Sub-Abas: Fontes Documentais vs Laboratório Analítico SQL */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          type="button"
          onClick={() => setSubTab('fontes')}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            subTab === 'fontes'
              ? 'bg-zinc-800 text-zinc-100 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>📚 {pick(lang, 'Base Documental & Fontes', 'Audited Sources & References', 'Base Documental y Fuentes')}</span>
          <span className="rounded-full bg-zinc-700/60 px-1.5 py-0.2 font-mono text-[10px] text-zinc-300">{resumo.total}</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('analytics')}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            subTab === 'analytics'
              ? 'bg-emerald-600/90 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>🔬 {pick(lang, 'Laboratório Analítico SQL (DuckDB-Wasm)', 'SQL Analytics Lab (DuckDB-Wasm)', 'Laboratorio Analítico SQL (DuckDB-Wasm)')}</span>
          <span className="rounded-full bg-emerald-950 px-1.5 py-0.2 font-mono text-[10px] text-emerald-300">WASM</span>
        </button>
      </div>

      {subTab === 'analytics' ? (
        <AnalyticsLab />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
          <div className="text-[9.5px] uppercase tracking-widest text-zinc-500">
            {pick(lang, 'Referências', 'References', 'Referencias')}
          </div>
          <div className="mt-1 font-mono text-lg font-extrabold text-zinc-100">{resumo.total}</div>
          <div className="mt-0.5 text-[10px] text-zinc-500">
            {pick(lang, 'entradas canônicas', 'canonical entries', 'entradas canónicas')}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
          <div className="text-[9.5px] uppercase tracking-widest text-zinc-500">
            {pick(lang, 'Com link direto', 'With direct link', 'Con enlace directo')}
          </div>
          <div className="mt-1 font-mono text-lg font-extrabold text-sky-300">{resumo.comUrl}</div>
          <div className="mt-0.5 text-[10px] text-zinc-500">
            {pick(lang, 'página/base acessível', 'accessible page/database', 'página/base accesible')}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
          <div className="text-[9.5px] uppercase tracking-widest text-zinc-500">
            {pick(lang, 'Revisão pendente', 'Review pending', 'Revisión pendiente')}
          </div>
          <div className="mt-1 font-mono text-lg font-extrabold text-amber-300">{resumo.revisaoPendente}</div>
          <div className="mt-0.5 text-[10px] text-zinc-500">
            {pick(lang, 'checar antes de citar', 'check before citing', 'verificar antes de citar')}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
          <div className="text-[9.5px] uppercase tracking-widest text-zinc-500">
            {pick(lang, 'Estimativas', 'Estimates', 'Estimaciones')}
          </div>
          <div className="mt-1 font-mono text-lg font-extrabold text-zinc-100">{resumo.estimativas}</div>
          <div className="mt-0.5 text-[10px] text-zinc-500">
            {pick(lang, 'método interno sinalizado', 'internal method flagged', 'método interno señalado')}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={pick(lang,
            'Buscar fonte, instituição, dataset ou módulo…',
            'Search source, institution, dataset or module…',
            'Buscar fuente, institución, dataset o módulo…')}
          className="w-64 max-w-full flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-money/60"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          aria-label={pick(lang, 'Filtrar por categoria', 'Filter by category', 'Filtrar por categoría')}
          className="h-[34px] cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-2 text-xs text-zinc-300 outline-none focus:border-money/60"
        >
          <option value="todas">{pick(lang, 'Todas as categorias', 'All categories', 'Todas las categorías')}</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{rotuloCategoria(c.id)}</option>
          ))}
        </select>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          aria-label={pick(lang, 'Filtrar por tipo de fonte', 'Filter by source type', 'Filtrar por tipo de fuente')}
          className="h-[34px] cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-2 text-xs text-zinc-300 outline-none focus:border-money/60"
        >
          <option value="todos">{pick(lang, 'Todos os tipos', 'All types', 'Todos los tipos')}</option>
          {tipos.map((k) => (
            <option key={k.id} value={k.id}>{rotuloTipo(k.id)}</option>
          ))}
        </select>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-300">
          <input
            type="checkbox"
            checked={somenteLinks}
            onChange={(e) => setSomenteLinks(e.target.checked)}
            className="h-3.5 w-3.5 accent-amber-400"
          />
          {pick(lang, 'Somente com link', 'Only with link', 'Solo con enlace')}
        </label>
        <span className="ml-auto font-mono text-[10px] text-zinc-500">
          {lista.length} {pick(lang, 'de', 'of', 'de')} {SOURCES.length}
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

              <h3 className="mt-2 text-sm font-bold text-zinc-100">{generatedText(lang, s.nome)}</h3>
              {s.instituicao && (
                <div className="mt-0.5 text-[11px] font-medium text-zinc-400">{generatedText(lang, s.instituicao)}</div>
              )}
              <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                {textoPorModo(mode, generatedText(lang, s.resumoDidatico), generatedText(lang, s.resumoAvancado))}
              </p>

              <div className="mt-2.5 rounded-lg bg-zinc-950/60 p-2.5">
                <div className="text-[9.5px] uppercase tracking-widest text-zinc-500">
                  {pick(lang, 'Cobre no app', 'Covers in the app', 'Cubre en la app')}
                </div>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] leading-snug text-zinc-300">
                  {s.cobre.map((c) => <li key={c}>{generatedText(lang, c)}</li>)}
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
                      {generatedText(lang, u.rotulo)} ↗
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-2 font-mono text-[10px] text-zinc-600">
                  {pick(lang,
                    'URL direta pendente — ver observação abaixo.',
                    'Direct URL pending — see the note below.',
                    'URL directa pendiente — consulta la observación abajo.')}
                </p>
              )}

              {s.observacao && (
                <p className="mt-2 border-t border-zinc-800/70 pt-2 text-[10.5px] leading-snug text-amber-200/90">
                  {s.verificacao === 'revisao-pendente'
                    ? pick(lang, 'Pendência', 'Pending item', 'Pendiente')
                    : pick(lang, 'Nota de auditoria', 'Audit note', 'Nota de auditoría')}: {generatedText(lang, s.observacao)}
                </p>
              )}

              <div className="mt-auto pt-2 font-mono text-[9px] uppercase tracking-wider text-zinc-600">
                {pick(lang, 'usado em', 'used in', 'usado en')}: {s.usadoEm.join(' · ')}
                {(TOUR_SOURCE_USAGE[s.id] ?? 0) > 0 && (
                  <span className="ml-1 text-sky-400/80">
                    · {TOUR_SOURCE_USAGE[s.id]} {pick(lang,
                      'vínculo(s) em estatísticas dos tours',
                      'link(s) in tour statistics',
                      'vínculo(s) en estadísticas de los tours')}
                  </span>
                )}
              </div>
            </article>
          )
        })}
      </section>

      {lista.length === 0 && (
        <p className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
          {pick(lang,
            'Nenhuma referência encontrada com esses filtros. Limpe a busca ou escolha outra categoria.',
            'No references found with these filters. Clear the search or choose another category.',
            'No se encontraron referencias con estos filtros. Limpia la búsqueda o elige otra categoría.')}
        </p>
      )}

      <p className="text-[10px] leading-relaxed text-zinc-600">
        {pick(lang,
          'Como citar: prefira instituição + safra + página/tabela. Exemplo: “FMI, COFER, Q4 2025”. Estimativas internas usam badge “est.” e nunca devem ser apresentadas como estatística oficial. Entradas com “revisão pendente” indicam exatamente o que falta checar.',
          'How to cite: prefer institution + vintage + page/table. Example: “IMF, COFER, Q4 2025”. Internal estimates use the “est.” badge and must never be presented as official statistics. “Review pending” entries state exactly what still needs checking.',
          'Cómo citar: prefiere institución + período + página/tabla. Ejemplo: “FMI, COFER, Q4 2025”. Las estimaciones internas usan la etiqueta “est.” y nunca deben presentarse como estadística oficial. Las entradas con “revisión pendiente” indican exactamente qué falta verificar.')}
      </p>
        </>
      )}
    </div>
  )
}
