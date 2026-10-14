import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { episodesForLang, PLAYLIST_URL, type Episode } from '../../data/consequences'
import VideoEmbed from './VideoEmbed'
import AffectedMap, { InterventionRanking, CfaPanel } from './AffectedMap'
import ModeBadge from '../ui/ModeBadge'
import Tip from '../ui/Tip'
import { mt, pick } from '../../i18n'
import { useApp } from '../../store/useApp'
import { textoPorModo } from '../../lib/simples'

type Era = 'historica' | 'atual'

function EpisodeStrip({ episodes, selected, onSelect }: { episodes: Episode[]; selected: Episode; onSelect: (e: Episode) => void }) {
  const sorted = [...episodes].sort((a, b) => {
    const order = ['americas', 'escravidao', 'india', 'congo', 'indonesia', 'bhopal', 'iraque', 'clima']
    return order.indexOf(a.id) - order.indexOf(b.id)
  })
  return (
    <div className="thin-scroll flex gap-2 overflow-x-auto pb-1">
      {sorted.map((ep) => {
        const sel = ep.id === selected.id
        return (
          <button key={ep.id} onClick={() => onSelect(ep)} title={ep.titulo}
            className={`shrink-0 rounded-lg border px-3 py-2 text-left transition-colors ${
              sel ? 'bg-zinc-800' : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600'
            }`}
            style={sel ? { borderColor: ep.color, boxShadow: `inset 3px 0 0 ${ep.color}` } : undefined}>
            <div className="font-mono text-[9.5px] uppercase tracking-wider" style={{ color: ep.color }}>
              EP {String(ep.ep).padStart(2, '0')} · {ep.periodo.split(' – ')[0]}
            </div>
            <div className={`mt-0.5 text-[11px] font-semibold ${sel ? 'text-zinc-50' : 'text-zinc-300'}`}>
              {ep.curto}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function MechanismCard({ mec, color, index }: { mec: Episode['mecanismos'][number]; color: string; index: number }) {
  const [open, setOpen] = useState(index === 0)
  const mode = useApp((s) => s.mode)
  return (
    <article className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60">
      <button onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-900/70">
        <span className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold"
            style={{ background: `${color}22`, color, border: `1px solid ${color}66` }}>
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-zinc-100">{mec.t}</span>
        </span>
        <span className={`shrink-0 text-zinc-600 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <m.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="border-t border-zinc-800/70 px-4 pb-3.5 pt-3 text-xs leading-relaxed text-zinc-200">
              {textoPorModo(mode, mec.did, mec.adv)}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </article>
  )
}

export default function ConsequencesModule() {
  const lang = useApp((s) => s.lang)
  const episodes = episodesForLang(lang)
  const tx = (pt: string, en: string, es: string) => pick(lang, pt, en, es)
  const eraMeta: Record<Era, { label: string; sub: string; color: string }> = {
    historica: {
      label: tx('Consequências históricas', 'Historical consequences', 'Consecuencias históricas'),
      sub: tx('séc. XV – XX · a fundação a sangue', '15th–20th c. · a bloody foundation', 's. XV–XX · una fundación sangrienta'),
      color: '#ff7043',
    },
    atual: {
      label: tx('Consequências atuais', 'Present-day consequences', 'Consecuencias actuales'),
      sub: tx('1965 → hoje · o método continua', '1965 → today · the method continues', '1965 → hoy · el método continúa'),
      color: '#ba68c8',
    },
  }
  const [era, setEra] = useState<Era>('historica')
  const [selId, setSelId] = useState('americas')
  const mode = useApp((s) => s.mode)
  const didatico = mode !== 'avancado'

  const ep = episodes.find((e) => e.id === selId) ?? episodes[0]

  const select = (e: Episode) => {
    setSelId(e.id)
    setEra(e.era)
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="relative">
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-400">{mt(lang, 'consequences').kicker}</div>
          <ModeBadge />
        </div>
        <h2 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-100">{mt(lang, 'consequences').title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {didatico
            ? tx('Cada grande riqueza do mundo tem uma história de dor por trás — e quase sempre é a MESMA história repetida: alguém é despojado, trabalha de graça ou morre; alguém de cima embolsa. Esta série conta 8 dessas histórias, da conquista da América até a crise climática. Assista, depois leia a análise.', 'Behind much of the world’s great wealth lies a history of pain — often the SAME pattern repeated: someone is dispossessed, works for free or dies; someone above captures the gain. This series tells eight of those stories, from the conquest of the Americas to the climate crisis. Watch, then read the analysis.', 'Detrás de gran parte de la riqueza mundial hay una historia de dolor — y a menudo se repite el MISMO patrón: alguien es despojado, trabaja gratis o muere; alguien arriba captura la ganancia. Esta serie cuenta ocho de esas historias, desde la conquista de América hasta la crisis climática. Mira y luego lee el análisis.')
            : tx('Oito casos de acumulação por despossussão, desperdício e superexploração — da acumulação primitiva (1492) à externalização planetária de risco (clima). A tese transversal: violência não é desvio do capitalismo, é seu método constitutivo de acumulação.', 'Eight cases of accumulation by dispossession, waste and super-exploitation — from primitive accumulation (1492) to planetary risk externalization (climate). The cross-cutting thesis: violence is not an anomaly of capitalism; it is a constitutive method of accumulation.', 'Ocho casos de acumulación por desposesión, desperdicio y superexplotación — desde la acumulación primitiva (1492) hasta la externalización planetaria del riesgo (clima). La tesis transversal: la violencia no es una desviación del capitalismo, sino un método constitutivo de acumulación.')}
        </p>
        <a href={PLAYLIST_URL} target="_blank" rel="noreferrer"
          className="mt-1.5 inline-block text-[11px] text-red-300 underline decoration-dotted hover:text-red-200">
          {tx('assistir a série completa no YouTube ↗', 'watch the full series on YouTube ↗', 'ver la serie completa en YouTube ↗')}
        </a>
      </header>

      {/* seletor de era */}
      <div className="grid gap-2 sm:grid-cols-2">
        {(['historica', 'atual'] as Era[]).map((e) => {
          const meta = eraMeta[e]
          const active = era === e
          return (
            <button key={e} onClick={() => setEra(e)}
              className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                active ? 'bg-zinc-800/80' : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600'
              }`}
              style={active ? { borderColor: `${meta.color}88` } : undefined}>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />
                <span className={`text-sm font-bold ${active ? 'text-zinc-50' : 'text-zinc-300'}`}>{meta.label}</span>
              </div>
              <div className="mt-0.5 text-[11px] text-zinc-500">{meta.sub}</div>
              <div className="mt-1 font-mono text-[9.5px] text-zinc-600">
                {e === 'historica'
                  ? tx('EP 01–04 · Américas, África, Índia, Congo', 'EP 01–04 · Americas, Africa, India, Congo', 'EP 01–04 · Américas, África, India, Congo')
                  : tx('EP 05–08 · Indonésia, Bhopal, Iraque, Clima', 'EP 05–08 · Indonesia, Bhopal, Iraq, Climate', 'EP 05–08 · Indonesia, Bhopal, Irak, Clima')}
              </div>
            </button>
          )
        })}
      </div>

      {/* linha do tempo dos episódios */}
      <EpisodeStrip episodes={episodes} selected={ep} onSelect={select} />

      {/* painel do episódio */}
      <AnimatePresence mode="wait">
        <m.article
          key={ep.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
        >
          {/* header do episódio */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: ep.color }}>
                EP {String(ep.ep).padStart(2, '0')} · {ep.periodo} · {ep.local}
              </div>
              <h3 className="mt-0.5 text-lg font-bold leading-tight text-zinc-100">{ep.titulo}</h3>
            </div>
            <span className="rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest"
              style={{ borderColor: `${ep.color}66`, color: ep.color, background: `${ep.color}14` }}>
              {ep.era === 'historica'
                ? tx('Histórica', 'Historical', 'Histórica')
                : tx('Atual', 'Current', 'Actual')}
            </span>
          </div>

          {/* vídeo */}
          <VideoEmbed videoId={ep.videoId} titulo={ep.titulo} />

          {/* vítimas */}
          <section className="rounded-xl border p-4" style={{ borderColor: `${ep.color}44`, background: `${ep.color}0a` }}>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">{tx('A conta da morte', 'The death toll', 'El saldo de muertes')}</div>
            <div className="mt-1 font-mono text-3xl font-extrabold" style={{ color: ep.color }}>{ep.vitimas.numero}</div>
            <div className="mt-1 text-xs text-zinc-300">{ep.vitimas.rotulo}</div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400">
              {textoPorModo(mode, ep.vitimas.did, ep.vitimas.adv)}
            </p>
          </section>

          {/* mecanismos */}
          <section>
            <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              {tx('Como o capital lucrou', 'How capital profited', 'Cómo lucró el capital')} — {ep.mecanismos.length} {tx('mecanismos', 'mechanisms', 'mecanismos')}
            </h4>
            <div className="flex flex-col gap-2">
              {ep.mecanismos.map((m, i) => (
                <MechanismCard key={m.t} mec={m} color={ep.color} index={i} />
              ))}
            </div>
          </section>

          {/* aprofundamento */}
          <section className="rounded-xl border border-dashed border-zinc-700 bg-zinc-950/60 p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">{tx('Aprofundamento teórico', 'Theoretical deep dive', 'Profundización teórica')}</h4>
              <span className="font-mono text-[9.5px] text-zinc-600">{ep.aprof.autores}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
              {textoPorModo(mode, ep.aprof.did, ep.aprof.adv)}
            </p>
          </section>
        </m.article>
      </AnimatePresence>

      {/* ── o outro lado do mapa ── */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              {tx('O outro lado do mapa · quem foi atrasado pela expansão', 'The other side of the map · who was held back by expansion', 'El otro lado del mapa · quién quedó rezagado por la expansión')}
            </h3>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
              {didatico
                ? tx('Os episódios acima são os capítulos mais famosos. Mas o mapa da exploração é muito maior: ex-colônias inteiras ainda usam a moeda da antiga metrópole, ainda exportam matéria-prima barata e ainda sofrem golpes e invasões. Clique nos países coloridos para conhecer a história de cada um.', 'The episodes above are the best-known chapters. But the map of exploitation is much larger: entire former colonies still use monetary arrangements inherited from the old metropole, still export cheap raw materials and still face coups and invasions. Click the colored countries to read each story.', 'Los episodios anteriores son los capítulos más conocidos. Pero el mapa de la explotación es mucho mayor: antiguas colonias enteras todavía usan arreglos monetarios heredados de la antigua metrópoli, siguen exportando materias primas baratas y siguen sufriendo golpes e invasiones. Haz clic en los países coloreados para conocer cada historia.')
                : tx('Cartografia da dependência: países fora dos blocos dominantes, classificados por forma primária de subordinação (tutela monetária CFA, extração colonial, guerra direta, desestabilização, plantation). Dados atuais (FMI) + histórico de intervenções documentadas.', 'Cartography of dependency: countries outside the dominant blocs, classified by primary form of subordination (CFA monetary tutelage, colonial extraction, direct war, destabilization, plantation). Current IMF data + documented intervention history.', 'Cartografía de la dependencia: países fuera de los bloques dominantes, clasificados por forma primaria de subordinación (tutela monetaria CFA, extracción colonial, guerra directa, desestabilización, plantación). Datos actuales del FMI + historial de intervenciones documentadas.')}
            </p>
          </div>
        </div>

        <AffectedMap />

        <div className="grid gap-3 lg:grid-cols-2">
          <CfaPanel />
          <InterventionRanking />
        </div>
      </section>

      {/* tese transversal */}
      <Tip text={didatico
        ? tx('Repare: os 8 casos têm o MESMO desenho — violência para tomar (terra, corpos, minério), trabalho forçado ou barato demais, lucro subindo para o topo e a história sendo contada como “progresso”.', 'Notice: all eight cases share the SAME pattern — violence to seize land, bodies or minerals; forced or extremely cheap labor; gains flowing upward; and the story retold as “progress”.', 'Observa: los ocho casos comparten el MISMO patrón — violencia para tomar tierra, cuerpos o minerales; trabajo forzado o extremadamente barato; ganancias que suben; y la historia contada como “progreso”.')
        : tx('Sequência estrutural recorrente: despossessão → coerção extraeconômica → extração de sobretrabalho → financeirização do resultado → narrativa de progresso. A violência é constitutiva, não residual.', 'Recurring structural sequence: dispossession → extra-economic coercion → extraction of surplus labor → financialization of the result → narrative of progress. Violence is constitutive, not residual.', 'Secuencia estructural recurrente: desposesión → coerción extraeconómica → extracción de sobretrabajo → financiarización del resultado → narrativa de progreso. La violencia es constitutiva, no residual.')}>
        <section className="cursor-help rounded-xl border border-dashed border-red-400/40 bg-red-400/5 p-4">
          <h4 className="text-sm font-bold text-red-300">{tx('A tese transversal das 8 histórias', 'The common thesis across the 8 stories', 'La tesis transversal de las 8 historias')}</h4>
          <p className="mt-1 text-xs leading-relaxed text-zinc-300">
            {didatico
              ? tx('Américas, África, Índia, Congo, Indonésia, Bhopal, Iraque, clima: muda o século, muda o continente — o roteiro é o mesmo. Primeiro toma-se à força o que pertence aos de baixo. Depois obriga-se o sobrevivente a trabalhar por quase nada. Depois o lucro sobe para quem já tem muito. Por fim, escreve-se a história chamando tudo de “progresso” e “desenvolvimento”.', 'Americas, Africa, India, Congo, Indonesia, Bhopal, Iraq, climate: the century changes, the continent changes — the script repeats. First, what belongs to those below is seized by force. Then survivors are pushed to work for almost nothing. Then gains flow to those who already have plenty. Finally, the story is written as “progress” and “development”.', 'Américas, África, India, Congo, Indonesia, Bhopal, Irak, clima: cambia el siglo, cambia el continente — el guion se repite. Primero se toma por la fuerza lo que pertenece a quienes están abajo. Luego se obliga a los sobrevivientes a trabajar por casi nada. Después la ganancia sube hacia quienes ya tienen mucho. Por último, la historia se escribe llamando a todo “progreso” y “desarrollo”.')
              : tx('A série demonstra empiricamente a continuidade estrutural entre acumulação primitiva e acumulação por despossussão/desperdício: a coerção extraeconômica não é resíduo pré-capitalista, mas instrumento permanente de ajuste da oferta de trabalho e de abertura de campos de investimento (1492 → 1885 → 1965 → 1984 → 2003 → antropoceno).', 'The series argues empirically for structural continuity between primitive accumulation and accumulation by dispossession/waste: extra-economic coercion is not a pre-capitalist residue but a recurring instrument for adjusting labor supply and opening fields of investment (1492 → 1885 → 1965 → 1984 → 2003 → Anthropocene).', 'La serie sostiene empíricamente una continuidad estructural entre acumulación primitiva y acumulación por desposesión/desperdicio: la coerción extraeconómica no es un residuo precapitalista, sino un instrumento recurrente para ajustar la oferta de trabajo y abrir campos de inversión (1492 → 1885 → 1965 → 1984 → 2003 → Antropoceno).')}
          </p>
        </section>
      </Tip>

      <p className="text-[10px] leading-relaxed text-zinc-600">
        {tx('Base: série “Mortes do Capitalismo” (Filipe Boni) — 8 episódios · conteúdo analítico complementado com Davis, Williams, Rodney, Nixon, Patnaik, Hickel, Sen, Harvey, Hochschild, Bevins, Klein, Kadri, Malm, Oreskes e Heede. Estimativas de vítimas variam por fonte e metodologia — os intervalos são os historiográficos citados em cada episódio.', 'Basis: “Deaths of Capitalism” series (Filipe Boni) — 8 episodes · analytical content supplemented with Davis, Williams, Rodney, Nixon, Patnaik, Hickel, Sen, Harvey, Hochschild, Bevins, Klein, Kadri, Malm, Oreskes and Heede. Victim estimates vary by source and methodology — ranges follow the historiography cited in each episode.', 'Base: serie “Muertes del Capitalismo” (Filipe Boni) — 8 episodios · contenido analítico complementado con Davis, Williams, Rodney, Nixon, Patnaik, Hickel, Sen, Harvey, Hochschild, Bevins, Klein, Kadri, Malm, Oreskes y Heede. Las estimaciones de víctimas varían según fuente y metodología — los intervalos siguen la historiografía citada en cada episodio.')}
      </p>
    </div>
  )
}
