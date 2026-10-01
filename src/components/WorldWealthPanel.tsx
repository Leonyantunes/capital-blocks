import DonutChart from './DonutChart'
import Tip from './ui/Tip'
import { useApp } from '../store/useApp'
import {
  WORLD_GDP_TRI, CLAIMS, REAL_ASSETS, DERIV_NOTIONAL_TRI, PRIVATE_NET_WEALTH_TRI, claimsTotal,
} from '../data/worldWealth'
import { worldSummary, WORLD_AGGREGATES, WORLD_COMPANIES } from '../data/companies'
import { modRef } from '../data/modules'

/**
 * RIQUEZA MUNDIAL SOB RAIO-X — quanto do patrimônio do planeta é
 * base real × esfera de títulos (capital fictício), com fontes.
 */
export default function WorldWealthPanel() {
  const mode = useApp((s) => s.mode)
  const didatico = mode !== 'avancado'
  const claims = claimsTotal()
  const claimsYears = claims / WORLD_GDP_TRI
  const wealthYears = PRIVATE_NET_WEALTH_TRI / WORLD_GDP_TRI
  const derivMultiple = DERIV_NOTIONAL_TRI / WORLD_GDP_TRI
  const donutSegments = [
    ...CLAIMS.map((c) => ({ key: c.key, label: c.label, value: c.tri, color: c.color })),
  ]
  const ws = worldSummary()

  return (
    <section aria-label="Riqueza mundial" className="flex flex-col gap-3">
      <header>
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-fuchsia-300">
          A riqueza do planeta: base real × esfera de títulos
        </h3>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {didatico
            ? 'Quanto vale TUDO o que existe de papel (ações, dívidas, derivativos) comparado com o que o mundo realmente PRODUZ num ano? Quando o papel cresce muito mais rápido que a produção, a riqueza vira promessa — e promessa pode virar bolha.'
            : 'A esfera de titularidade (fictício) cresce sobre a base produtivo-rentista; quando o múltiplo título/PIB se estica, a sobreacumulação de pretensões antecede as crises de realização (2000, 2008).'}
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        {/* Donut da esfera de títulos + razões-chave */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-zinc-100">Composição da esfera de títulos</h4>
            <span className="font-mono text-xs text-zinc-500">
              total ≈ US$ {claims.toLocaleString('pt-BR')} tri = {claimsYears.toFixed(1)}× PIB anual
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <DonutChart segments={donutSegments} centerLabel="títulos" centerValue={`US$${claims} tri`} />
            <ul className="min-w-[220px] flex-1 space-y-2">
              {CLAIMS.map((c) => (
                <li key={c.key}>
                  <Tip text={didatico ? c.didatico : c.avancado}>
                    <div className="flex cursor-help items-center justify-between gap-2 rounded-md border border-zinc-800 px-2 py-1.5 hover:border-zinc-600">
                      <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-zinc-300">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: c.color }} />
                        {c.label}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] font-bold" style={{ color: c.color }}>
                        US$ {c.tri.toLocaleString('pt-BR')} tri · {((c.tri / claims) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </Tip>
                  <p className="mt-0.5 pl-4 font-mono text-[9.5px] text-zinc-600">{c.source} · {c.year}</p>
                </li>
              ))}
              <li className="pl-1 pt-1 text-[10px] leading-snug text-zinc-500">
                100% desta esfera é <strong className="text-fuchsia-300">capital fictício</strong>: direitos sobre
                mais-valia futura — nada aqui é máquina, grão ou fábrica.
              </li>
            </ul>
          </div>
        </div>

        {/* Razões estruturais */}
        <div className="grid grid-cols-2 content-start gap-2">
          <RatioCard label="Riqueza líquida privada" value={`US$ ${PRIVATE_NET_WEALTH_TRI} tri`} sub={`≈ ${wealthYears.toFixed(1)}× o PIB anual do planeta`} source="UBS GWR · fim-2023"
            tip={didatico
              ? 'Somando casas, ações e contas das famílias (menos dívidas), os privados do mundo guardam o equivalente a ~4 anos de TODA produção mundial.'
              : 'Ativos financeiros + reais − dívidas dos households: a riqueza privada vale múltiplos do fluxo anual que a gera — assinatura da dominância rentista.'} />
          <RatioCard label="Imobiliário mundial" value="US$ 380 tri" sub="maior ativo real do globo" source="Savills · 2023"
            tip={didatico
              ? 'Tijolo é a maior "poupança" da humanidade — e o colateral por trás de grande parte dos empréstimos bancários.'
              : 'Ativo real não-produtivo (renda fundiária); funciona como colateral-chave do crédito, acoplando ciclos imobiliário e financeiro.'} />
          <RatioCard label="Derivativos (nocional)" value={`US$ ${DERIV_NOTIONAL_TRI.toLocaleString('pt-BR')} tri`} sub={`${derivMultiple.toFixed(0)}× o PIB · apostas s/ apostas`} source="BIS · jun/2024"
            tip={didatico
              ? 'Contratos de derivativos somam quase US$700 tri em "valor de face". Não é dinheiro no bolso — é o tamanho das APOSTAS feitas sobre juros, câmbio e preços.'
              : 'Nocional ≠ valor de mercado (MV ≈ US$ 15–20 tri): mede exposição. Rede de interdependência cuja falha sincronizada materializa crises (AIG 2008).'} />
          <RatioCard label="Mega-caps no Raio-X" value={`US$ ${ws.capTri.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} tri`} sub={`${ws.pctMarketCapMundial.toFixed(0)}% de todo o mercado acionário`} source="10-K/FY24 · dez/2025"
            tip={didatico
              ? `As ${WORLD_COMPANIES.length} maiores empresas rastreadas juntas valem cerca de US$ ${ws.capTri.toFixed(0)} trilhões — ${ws.pctMarketCapMundial.toFixed(0)}% do valor de TODAS as empresas listadas do mundo.`
              : `Σ cap das rastreadas = ${ws.pctMarketCapMundial.toFixed(0)}% do market cap global; Σ receitas = ${ws.pctPibMundial.toFixed(1)}% do PIB mundial.`} />
        </div>
      </div>

      {/* barra base produtiva vs esfera titular */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <h4 className="text-sm font-semibold text-zinc-100">Base real × promessas</h4>
        <div className="mt-2 space-y-2">
          <StackedRatio label="PIB mundial — produção REAL de um ano" value={WORLD_GDP_TRI} max={Math.max(claims, PRIVATE_NET_WEALTH_TRI)} color="#4caf50" />
          <StackedRatio label="Esfera de títulos (ações + dívidas)" value={claims} max={Math.max(claims, PRIVATE_NET_WEALTH_TRI)} color="#9c27b0" />
          <StackedRatio label="Riqueza líquida privada" value={PRIVATE_NET_WEALTH_TRI} max={Math.max(claims, PRIVATE_NET_WEALTH_TRI)} color="#ffc107" />
        </div>
        <p className="mt-2 text-[10.5px] leading-relaxed text-zinc-600">
          {didatico
            ? 'Leitura: para cada US$100 que o mundo produz em um ano, existem ~US$280 em papéis prometendo pedaços desse bolo nos próximos anos. O sistema não quebra enquanto as promessas forem acreditadas — Marx chamava isso de capital fictício.'
            : `Claims/PIB ≈ ${(claims / WORLD_GDP_TRI).toFixed(1)}×: a titularização corre à frente da valorização real. Historicamente o múltiplo se comprime via crise (destruição de capital fictício) — ver Timeline 1929/2008.`}
        </p>
        <button
          onClick={() => useApp.getState().setTab('wealth')}
          className="mt-3 w-full rounded-lg border border-money/50 bg-money/10 px-3 py-2 text-xs font-semibold text-money transition-colors hover:bg-money/20"
        >
          E quem produz tudo isso? → {modRef('wealth')} · Quem Sustenta Quê?
        </button>
      </div>
    </section>
  )
}

function StackedRatio({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="mb-0.5 flex justify-between text-[10.5px]">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono font-bold text-zinc-200">US$ {value.toLocaleString('pt-BR')} tri</span>
      </div>
      <div className="h-3.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
    </div>
  )
}

function RatioCard({ label, value, sub, source, tip }: {
  label: string; value: string; sub: string; source: string; tip?: string
}) {
  const body = (
    <div className="h-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 transition-colors hover:border-zinc-600">
      <div className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</div>
      <div className="mt-1 font-mono text-lg font-extrabold text-zinc-100">{value}</div>
      <div className="mt-0.5 text-[10.5px] leading-snug text-zinc-400">{sub}</div>
      <div className="mt-1.5 inline-block rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500">{source}</div>
    </div>
  )
  return tip ? <Tip text={tip}><span className="block h-full cursor-help">{body}</span></Tip> : body
}
