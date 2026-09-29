import { useState } from 'react'
import { m } from 'framer-motion'
import Tip from './ui/Tip'
import { useApp } from '../store/useApp'
import { modRef } from '../data/modules'

type Lens = 'marx' | 'mmt' | 'both'

const LENS_META: Record<Lens, { label: string; color: string }> = {
  marx: { label: 'Leitura Marxista', color: '#f44336' },
  mmt: { label: 'Leitura MMT', color: '#42a5f5' },
  both: { label: 'Comparativo', color: '#ba68c8' },
}

function SectoralBalances() {
  const [gt, setGt] = useState(6) // G − T (% PIB)
  const [xm, setXm] = useState(2.5) // X − M (% PIB)
  const si = gt + xm // (S − I) ≡ (G − T) + (X − M)
  const overheating = gt > 7

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-100">Identidade setorial interativa</h3>
        <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
          (S − I) ≡ (G − T) + (X − M)
        </span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-zinc-400">
        O déficit público de um lado é, obrigatoriamente, excedente do outro. Mexa nos controles e veja quem fica
        com o saldo espelhado:
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex justify-between text-[11px]">
            <span className="text-fuchsia-300">Déficit público (G − T)</span>
            <span className="font-mono font-bold text-zinc-200">{gt.toLocaleString('pt-BR')}%</span>
          </div>
          <input type="range" min={0} max={14} step={0.5} value={gt} onChange={(e) => setGt(parseFloat(e.target.value))} />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[11px]">
            <span className="text-emerald-300">Superávit externo (X − M)</span>
            <span className="font-mono font-bold text-zinc-200">{xm.toLocaleString('pt-BR')}%</span>
          </div>
          <input type="range" min={-5} max={8} step={0.5} value={xm} onChange={(e) => setXm(parseFloat(e.target.value))} />
        </div>
      </div>

      {/* barras espelhadas */}
      <div className="mt-3 space-y-1.5">
        {[
          { label: 'Setor governo (G − T)', v: gt, color: '#9c27b0' },
          { label: 'Setor privado (S − I)', v: si, color: '#4caf50' },
          { label: 'Setor externo (X − M)', v: xm, color: '#ffc107' },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-2">
            <span className="w-36 shrink-0 text-right text-[10.5px] text-zinc-400">{row.label}</span>
            <div className="relative h-4 flex-1 rounded bg-zinc-800/70">
              <m.div
                animate={{ width: `${Math.max(row.v, 0) * 4}%` }}
                transition={{ type: 'spring', stiffness: 130, damping: 22 }}
                className={`h-full rounded ${row.v < 0 ? 'hidden' : ''}`}
                style={{ background: row.color }}
              />
              {row.v < 0 && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-red-300">
                  déficit {row.v.toLocaleString('pt-BR')}%
                </span>
              )}
            </div>
            <span className="w-12 shrink-0 font-mono text-[11px] font-bold text-zinc-200">
              {row.v >= 0 ? `+${row.v.toLocaleString('pt-BR')}` : row.v.toLocaleString('pt-BR')}%
            </span>
          </div>
        ))}
      </div>

      <div className={`mt-3 rounded-lg border p-2.5 text-[11px] leading-relaxed ${
        overheating ? 'border-money/50 bg-money/10 text-amber-200' : 'border-zinc-700 bg-zinc-950/60 text-zinc-400'
      }`}>
        {overheating
          ? '⚠ Estímulo fiscal acima da capacidade oculta típica: na ótica MMT o limite não é a dívida, é a INFLAÇÃO — gastar além dos recursos reais disponíveis empurra preços.'
          : '✓ Dentro de uma faixa compatível com capacidade oculta estimada: para a MMT, o constrangimento relevante é inflação/recursos reais — nunca a "falta de dinheiro" do Tesouro.'}
      </div>
      <p className="mt-1.5 text-[10px] leading-relaxed text-zinc-600">
        Exemplos aproximados: Brasil 2023–24 → G−T ≈ 6%, X−M ≈ +2,5% (superávit comercial recorde); EUA 2020
        (pandemia) → G−T ≈ 15%, X−M ≈ −3%. Valores ilustrativos em % do PIB.
      </p>
    </div>
  )
}

export default function MmtPanel() {
  const [lens, setLens] = useState<Lens>('mmt')
  const mode = useApp((s) => s.mode)
  const didatico = mode === 'didatico'

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-machine/30 bg-machine/5 p-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-zinc-100">
            A dívida sob outra lente: Teoria Monetária Moderna (MMT)
          </h3>
          <p className="mt-0.5 max-w-3xl text-xs leading-relaxed text-zinc-400">
            O fluxo acima mostra a leitura marxista (quem captura os juros). A MMT discorda do diagnóstico de
            “sustentabilidade” — e a tensão entre as duas lentes é esclarecedora:
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
          {(Object.keys(LENS_META) as Lens[]).map((l) => (
            <button key={l} onClick={() => setLens(l)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                lens === l ? 'text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              style={lens === l ? { background: LENS_META[l].color } : undefined}>
              {LENS_META[l].label}
            </button>
          ))}
        </div>
      </header>

      {lens === 'marx' && (
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-2 sm:grid-cols-3">
          {[
            { t: 'Dívida = captura de renda', d: 'O título público transfere mais-valia presente e futura ao capital portador de juros — impostos sobre trabalho pagam a conta.' },
            { t: 'Capital fictício', d: 'Preço do título = valor capitalizado dos juros prometidos: riqueza de papel sem contrapartida produtiva (Marx, Livro III).' },
            { t: 'Estado como campo de batalha', d: 'A política fiscal reflete a correlação de forças entre frações do capital e classe trabalhadora — nunca um "orçamento neutro".' },
          ].map((c) => (
            <article key={c.t} className="rounded-lg border border-labor/40 bg-labor/5 p-3">
              <h4 className="text-xs font-bold text-red-300">{c.t}</h4>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">{c.d}</p>
            </article>
          ))}
        </m.div>
      )}

      {lens === 'mmt' && (
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-2 sm:grid-cols-2">
          {[
            {
              t: didatico ? 'Quem imprime a moeda não quebra nela' : 'Sovereign issuer ≠ household',
              d: didatico
                ? 'O Brasil só deve em real, e o BCB é quem cria reais. Por isso o Japão convive com dívida de 230–250% do PIB há décadas sem calote — diferente da Grécia, que devia em euro (moeda que não controla).'
                : 'Emissor de moeda fiduciária soberana paga sempre seus títulos resgatáveis na própria unidade; default involuntário é categoria inaplicável (ver Japão 2024: ~230-250% PIB, yields ancorados por BoJ).',
            },
            {
              t: didatico ? 'Impostos não pagam as contas do Estado' : 'Taxes don’t fund spending',
              d: didatico
                ? 'Na ordem operacional, o Estado gasta primeiro (cria moeda) e cobra depois. Os impostos servem para dar valor à moeda, redistribuir e conter excessos — não para "juntar dinheiro".'
                : 'Sequência operacional: gasto credora reservas; tributação debita reservas criando demanda pela moeda e liberando espaço de capacidade produtiva — não financia no sentido técnico.',
            },
            {
              t: didatico ? 'Déficit público = poupança privada' : 'Sectoral balances identity',
              d: didatico
                ? 'Toda vez que o governo gasta mais do que arrecada, ALGUÉM do outro lado recebe esse excedente: empresas, famílias ou o resto do mundo. É matemática das contas nacionais — veja no simulador abaixo.'
                : '(S−I) ≡ (G−T)+(X−M): déficit fiscal é contraface do superávit privado/externo. Austeridade busca reduzir G−T sem perguntar qual setor absorverá o ajuste.',
            },
            {
              t: didatico ? 'O limite verdadeiro é a inflação' : 'Real resource constraint',
              d: didatico
                ? 'A pergunta certa não é "temos dinheiro?" mas "temos fábricas, trabalhadores e materiais?". Gastar além disso empurra os preços para cima — esse é o freio real, não a dívida.'
                : 'Constraint = capacidade produtiva oculta e trajetória de preços; instrumentos: tributação seletiva, crédito dirigido, controles de mark-up. Debate aberto: coordenação fiscal-monetária vs independência formal do BCB.',
            },
          ].map((c) => (
            <article key={c.t} className="rounded-lg border border-sky-400/40 bg-sky-400/5 p-3">
              <h4 className="text-xs font-bold text-sky-300">{c.t}</h4>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">{c.d}</p>
            </article>
          ))}
        </m.div>
      )}

      {lens === 'both' && (
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-2 md:grid-cols-2">
          <article className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
            <h4 className="text-xs font-bold text-emerald-300">Pontos de encontro</h4>
            <ul className="mt-1.5 space-y-1.5 text-[11px] leading-relaxed text-zinc-300">
              <li>· <strong>Dinheiro endógeno:</strong> bancos criam crédito ao emprestar — ambos rejeitam a "poupança prévia" ortodoxa.</li>
              <li>· <strong>Juros são distribuição:</strong> taxa alta transfere renda a rentistas (MMT: sem função alocativa maior; Marx: captura pelo capital portador de juros).</li>
              <li>· <strong>Contra a austeridade naturalizada:</strong> o "teto de gastos" é escolha política, não lei física.</li>
              <li>· <strong>Contrafactual grego:</strong> crise de solvência é produto da hierarquia monetária (euro), não do tamanho numérico da dívida.</li>
            </ul>
          </article>
          <article className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
            <h4 className="text-xs font-bold text-red-300">Divergências decisivas</h4>
            <ul className="mt-1.5 space-y-1.5 text-[11px] leading-relaxed text-zinc-300">
              <li>· <strong>Classe social:</strong> MMT trata o Estado como gestor neutro da moeda; para Marx, ele organiza condições de acumulação — quem manda no orçamento é a fração dominante do capital.</li>
              <li>· <strong>Inflação:</strong> MMT foca demanda × capacidade; Marx acrescenta conflito distributivo, mark-ups monopolistas e choques de câmbio/commodities.</li>
              <li>· <strong>Hierarquia monetária global:</strong> a lente MMT nasce em emissores centrais (EUA/Japão/Reino Unido); para a periferia, o dólar-hegemonia impõe restrição externa real (ver {modRef('home')}).</li>
            </ul>
          </article>
        </m.div>
      )}

      <SectoralBalances />

      <div className="flex flex-wrap gap-2">
        <Tip text={didatico
          ? 'O Japão deve mais que o dobro do que produz e paga juros baixíssimos há décadas — porque deve em iene, na própria moeda.'
          : 'IMF WEO/MoF: bruto geral ~230-250% do PIB (2024-25); BoJ ancora curva (YCC); titularidade doméstica elevada elimina risco de fuga.'}>
          <span className="cursor-help rounded-lg border border-zinc-700 bg-zinc-950/60 px-2.5 py-1.5 text-[10.5px] text-zinc-300">
            [JPN] Japão: dívida ~230–250% PIB · sem default · <em>IMF/MoF</em>
          </span>
        </Tip>
        <Tip text={didatico
          ? 'A Grécia entrou em crise devendo proporcionalmente MENOS que o Japão — porque devia em euro, moeda que não controla.'
          : 'Contrafactual da zona do euro: crise a ~130% PIB (2010-12) por ausência de emitente soberano — troika impôs austeridade pró-cíclica.'}>
          <span className="cursor-help rounded-lg border border-zinc-700 bg-zinc-950/60 px-2.5 py-1.5 text-[10.5px] text-zinc-300">
            [GRC] Grécia: crise a ~130% PIB · sem moeda própria · <em>eurozona</em>
          </span>
        </Tip>
        <Tip text={didatico
          ? 'Os EUA já gastam mais em juros da dívida do que com o exército — a maior transferência anual para rentistas do planeta.'
          : 'Net interest ≈ US$ 880 bi–1 tri (2024-25) > Defense DOD (~$850 bi): rentistas como destinatário estrutural nº1 do orçamento federal.'}>
          <span className="cursor-help rounded-lg border border-zinc-700 bg-zinc-950/60 px-2.5 py-1.5 text-[10.5px] text-zinc-300">
            [USA] EUA: juros {'>'} US$ 1 tri/ano {'>'} defesa · <em>Treasury/CBO</em>
          </span>
        </Tip>
      </div>
    </section>
  )
}
