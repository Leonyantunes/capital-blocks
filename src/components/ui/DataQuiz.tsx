import { useState } from 'react'
import { m } from 'framer-motion'
import { useApp } from '../../store/useApp'
import { textoPorModo } from '../../lib/simples'
import { locale, pick, type Lang } from '../../i18n'

type LText = { pt: string; en: string; es: string }
const l = (lang: Lang, x: LText) => pick(lang, x.pt, x.en, x.es)

interface Q {
  pergunta: LText
  perguntaSimples?: LText
  unidade: LText
  min: number
  max: number
  step: number
  real: number
  formato?: (n: number) => string
  fonte: string
  did: LText
  simples?: LText
}

const QS: Q[] = [
  {
    pergunta: { pt: 'Quantos % da riqueza mundial pertence ao Top 1%?', en: 'What percentage of global wealth belongs to the top 1%?', es: '¿Qué porcentaje de la riqueza mundial pertenece al 1% más rico?' },
    perguntaSimples: { pt: 'Quanto da riqueza mundial pertence ao 1% mais rico?', en: 'How much of global wealth belongs to the richest 1%?', es: '¿Cuánta riqueza mundial pertenece al 1% más rico?' },
    unidade: { pt: '% da riqueza', en: '% of wealth', es: '% de la riqueza' }, min: 0, max: 100, step: 1, real: 47.5,
    fonte: 'UBS Global Wealth Report 2024',
    did: { pt: 'Quase metade de tudo — e a fatia cresce a cada ano desde 1980.', en: 'Almost half of all wealth — and the share has risen strongly since 1980.', es: 'Casi la mitad de toda la riqueza — y la proporción ha aumentado con fuerza desde 1980.' },
    simples: { pt: 'Quase metade da riqueza está com o 1% mais rico. O gráfico seguinte mostra como essa divisão mudou ao longo do tempo.', en: 'Almost half of wealth belongs to the richest 1%. The next chart shows how that distribution changed over time.', es: 'Casi la mitad de la riqueza pertenece al 1% más rico. El gráfico siguiente muestra cómo cambió esa distribución.' },
  },
  {
    pergunta: { pt: 'Quantos US$ bilhões/ano de lucro de multinacionais são deslocados para paraísos fiscais?', en: 'How many US$ billions of multinational profits are shifted to tax havens each year?', es: '¿Cuántos miles de millones de US$ de beneficios multinacionales se trasladan a paraísos fiscales cada año?' },
    perguntaSimples: { pt: 'Quanto lucro de multinacionais é registrado por ano em paraísos fiscais?', en: 'How much multinational profit is booked in tax havens each year?', es: '¿Cuánto beneficio de multinacionales se registra cada año en paraísos fiscales?' },
    unidade: { pt: 'US$ bi/ano', en: 'US$ bn/year', es: 'US$ mil M/año' }, min: 0, max: 2000, step: 10, real: 1000,
    fonte: 'Tørsløv–Wier–Zucman (Missing Profits)',
    did: { pt: '≈ 1 trilhão por ano — 36 a 40% de TODOS os lucros multinacionais do planeta.', en: '≈ US$1 trillion per year — roughly 36–40% of global multinational profits.', es: '≈ US$1 billón al año — alrededor del 36–40% de los beneficios multinacionales mundiales.' },
    simples: { pt: 'A estimativa é de cerca de US$ 1 trilhão por ano. A fonte calcula quanto lucro é registrado em países com tributação muito baixa.', en: 'The estimate is about US$1 trillion per year. The source measures profits booked in very low-tax jurisdictions.', es: 'La estimación ronda US$1 billón al año. La fuente calcula los beneficios registrados en jurisdicciones de tributación muy baja.' },
  },
  {
    pergunta: { pt: 'Quantas pessoas morrem por ano de causas ligadas ao TRABALHO (acidentes + doenças)?', en: 'How many people die each year from WORK-related causes (accidents + diseases)?', es: '¿Cuántas personas mueren al año por causas relacionadas con el TRABAJO (accidentes + enfermedades)?' },
    perguntaSimples: { pt: 'Quantas pessoas morrem por ano por acidentes e doenças ligados ao trabalho?', en: 'How many people die each year from work-related accidents and diseases?', es: '¿Cuántas personas mueren cada año por accidentes y enfermedades laborales?' },
    unidade: { pt: 'milhões/ano', en: 'million/year', es: 'millones/año' }, min: 0, max: 5, step: 0.05, real: 2.9,
    formato: (n) => `${n.toFixed(2)} mi`,
    fonte: 'ILO, 2023',
    did: { pt: 'Quase 3 milhões por ano — mais que guerras. E é tratado como custo operacional.', en: 'Almost 3 million per year — an enormous recurring human cost of work.', es: 'Casi 3 millones al año — un enorme costo humano recurrente del trabajo.' },
    simples: { pt: 'A OIT estima quase 3 milhões de mortes por ano por acidentes e doenças ligados ao trabalho.', en: 'The ILO estimates almost 3 million deaths per year from work-related accidents and diseases.', es: 'La OIT estima casi 3 millones de muertes al año por accidentes y enfermedades relacionados con el trabajo.' },
  },
  {
    pergunta: { pt: 'Quantos bilhões de horas de trabalho de cuidado NÃO PAGO são realizadas por dia no mundo?', en: 'How many billions of hours of UNPAID care work are performed every day worldwide?', es: '¿Cuántos miles de millones de horas de trabajo de cuidados NO REMUNERADO se realizan cada día en el mundo?' },
    perguntaSimples: { pt: 'Quantas horas de cuidado não pago são feitas por dia no mundo?', en: 'How many hours of unpaid care work are done each day worldwide?', es: '¿Cuántas horas de cuidados no remunerados se realizan al día en el mundo?' },
    unidade: { pt: 'bilhões de horas/dia', en: 'billion hours/day', es: 'mil M de horas/día' }, min: 0, max: 30, step: 0.5, real: 16.4,
    fonte: 'ILO, 2018 (~9% do PIB mundial, 80% por mulheres)',
    did: { pt: 'A economia invisível que sustenta a visível — e não aparece em nenhum PIB.', en: 'The invisible economy that sustains the visible one — much of it never appears in GDP.', es: 'La economía invisible que sostiene a la visible — gran parte de ella no aparece en el PIB.' },
    simples: { pt: 'São bilhões de horas por dia cuidando de crianças, idosos, casas e famílias sem pagamento direto.', en: 'Billions of hours are spent every day caring for children, older people, homes and families without direct pay.', es: 'Cada día se dedican miles de millones de horas a cuidar niños, personas mayores, hogares y familias sin pago directo.' },
  },
  {
    pergunta: { pt: 'Quantos milhões de pessoas vivem hoje em ESCRAVIDÃO CONTEMPORÂNEA?', en: 'How many millions of people live in MODERN SLAVERY today?', es: '¿Cuántos millones de personas viven hoy en ESCLAVITUD MODERNA?' },
    perguntaSimples: { pt: 'Quantas pessoas vivem em situações classificadas como escravidão moderna?', en: 'How many people live in situations classified as modern slavery?', es: '¿Cuántas personas viven en situaciones clasificadas como esclavitud moderna?' },
    unidade: { pt: 'milhões', en: 'million', es: 'millones' }, min: 0, max: 100, step: 1, real: 50,
    fonte: 'ILO / Walk Free, 2021',
    did: { pt: '50 milhões — pessoas em trabalho forçado ou casamento forçado segundo a estimativa conjunta.', en: '50 million — people in forced labor or forced marriage in the joint estimate.', es: '50 millones — personas en trabajo forzoso o matrimonio forzoso según la estimación conjunta.' },
    simples: { pt: 'A estimativa é de 50 milhões de pessoas em trabalho forçado ou casamento forçado.', en: 'The estimate is 50 million people in forced labor or forced marriage.', es: 'La estimación es de 50 millones de personas en trabajo forzoso o matrimonio forzoso.' },
  },
]

/** QUIZ ANTES DA REVELAÇÃO — chute primeiro, dado depois (data-journalism). */
export default function DataQuiz() {
  const [idx, setIdx] = useState(0)
  const [guess, setGuess] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const mode = useApp((s) => s.mode)
  const lang = useApp((s) => s.lang)
  const q = QS[idx]

  const fmt = (n: number) => q.formato ? q.formato(n) : `${n.toLocaleString(locale(lang))} ${l(lang, q.unidade)}`
  const distancia = guess === null ? 0 : Math.abs(guess - q.real) / q.real

  const revelar = () => setRevealed(true)
  const proxima = () => {
    setIdx((i) => (i + 1) % QS.length)
    setGuess(null); setRevealed(false)
  }

  return (
    <section className="rounded-xl border border-money/40 bg-money/5 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-zinc-100">{pick(lang, 'Antes de ver o dado: CHUTE 🎯', 'Before seeing the data: GUESS 🎯', 'Antes de ver el dato: ADIVINA 🎯')}</h3>
        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500">
          <span>{pick(lang, 'pergunta', 'question', 'pregunta')} {idx + 1}/{QS.length}</span>
          <button onClick={proxima} className="rounded border border-zinc-700 px-1.5 py-0.5 text-[9.5px] text-zinc-400 hover:text-zinc-200">
            {pick(lang, 'pular →', 'skip →', 'saltar →')}
          </button>
        </div>
      </div>
      <p className="mt-1 text-[11px] text-zinc-500">
        {textoPorModo(
          mode,
          pick(lang, 'Estudos mostram que a gente lembra melhor quando erra o chute primeiro. Arraste, arrisque e descubra a realidade:', 'Studies show that making a guess first can improve recall. Drag, take a chance and reveal the data:', 'Los estudios muestran que hacer una estimación primero puede mejorar el recuerdo. Arrastra, arriesga y descubre el dato:'),
          pick(lang, 'Elicitação de estimativa prévia → ancoragem corrigida: técnica padrão de retenção em data-journalism.', 'Prior-estimate elicitation → corrected anchoring: a common retention technique in data journalism.', 'Estimación previa → anclaje corregido: técnica habitual de retención en periodismo de datos.'),
          pick(lang, 'Primeiro dê um palpite. Depois compare com o dado e veja quão perto você chegou.', 'Guess first. Then compare it with the data and see how close you were.', 'Primero haz una estimación. Después compárala con el dato y mira qué tan cerca quedaste.'),
        )}
      </p>

      <p className="mt-3 text-sm font-semibold text-zinc-100">
        {l(lang, mode === 'simples' ? (q.perguntaSimples ?? q.pergunta) : q.pergunta)}
      </p>

      {!revealed ? (
        <div className="mt-2">
          <input type="range" min={q.min} max={q.max} step={q.step} value={guess ?? q.min}
            onChange={(e) => setGuess(parseFloat(e.target.value))} className="w-full" />
          <div className="mt-1 flex items-center justify-between">
            <span className="font-mono text-sm font-bold text-zinc-100">
              {pick(lang, 'seu chute', 'your guess', 'tu estimación')}: {guess === null ? '—' : fmt(guess)}
            </span>
            <button onClick={revelar} disabled={guess === null}
              className="rounded-lg bg-money px-3 py-1.5 text-xs font-bold text-onaccent disabled:opacity-40">
              {pick(lang, 'revelar o real', 'reveal the actual value', 'revelar el valor real')}
            </button>
          </div>
        </div>
      ) : (
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
          <div className="rounded-lg border border-emerald-400/50 bg-emerald-400/10 p-3">
            <div className="text-[9.5px] uppercase tracking-widest text-zinc-500">{pick(lang, 'o dado real', 'actual data', 'dato real')}</div>
            <div className="font-mono text-2xl font-extrabold text-emerald-300">{fmt(q.real)}</div>
            <div className="mt-1 text-[11px] text-zinc-400">
              {guess !== null && (
                <>
                  {pick(lang, 'seu chute', 'your guess', 'tu estimación')}: <span className="font-mono font-bold text-zinc-200">{fmt(guess)}</span> ·
                  {pick(lang, 'distância', 'distance', 'distancia')}: <span className="font-mono font-bold text-zinc-200">{(distancia * 100).toFixed(0)}%</span>{' '}
                  {textoPorModo(
                    mode,
                    distancia < 0.15 ? pick(lang, '— perto demais, você já conhecia?', '— very close; did you already know it?', '— muy cerca; ¿ya lo conocías?') : distancia < 0.6 ? pick(lang, '— dentro do comum: há uma diferença relevante entre percepção e dado.', '— a common gap between perception and data.', '— una diferencia habitual entre percepción y dato.') : pick(lang, '— longe: o dado ficou bem distante da sua estimativa.', '— far off: the data is well away from your estimate.', '— lejos: el dato quedó muy distante de tu estimación.'),
                    distancia < 0.15 ? pick(lang, '— estimativa muito próxima.', '— a very close estimate.', '— estimación muy cercana.') : distancia < 0.6 ? pick(lang, '— diferença moderada.', '— moderate difference.', '— diferencia moderada.') : pick(lang, '— diferença grande entre palpite e dado.', '— large gap between guess and data.', '— gran diferencia entre estimación y dato.'),
                    distancia < 0.15 ? pick(lang, '— seu palpite ficou bem perto.', '— your guess was very close.', '— tu estimación quedó muy cerca.') : distancia < 0.6 ? pick(lang, '— seu palpite ficou a alguma distância.', '— your guess was somewhat off.', '— tu estimación quedó a cierta distancia.') : pick(lang, '— seu palpite ficou longe do dado.', '— your guess was far from the data.', '— tu estimación quedó lejos del dato.'),
                  )}
                </>
              )}
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-300">
              {textoPorModo(mode, l(lang, q.did), l(lang, q.did), q.simples ? l(lang, q.simples) : undefined)}
            </p>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-wider text-zinc-600">{pick(lang, 'fonte', 'source', 'fuente')}: {q.fonte}</div>
          </div>
          <button onClick={proxima}
            className="mt-2 rounded-lg border border-zinc-700 px-3 py-1.5 text-[11px] font-semibold text-zinc-300 hover:border-money hover:text-money">
            {pick(lang, 'próxima pergunta →', 'next question →', 'siguiente pregunta →')}
          </button>
        </m.div>
      )}
    </section>
  )
}
