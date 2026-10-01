import FollowSalary from './FollowSalary'
import BillionaireTimeline from './BillionaireTimeline'
import { TopOneChart, MirrorBars, ConcentrationStats } from './ConcentrationCharts'
import DataQuiz from '../ui/DataQuiz'
import EscalaCompare from '../ui/EscalaCompare'
import Tip from '../ui/Tip'
import ModeBadge from '../ui/ModeBadge'
import { mt } from '../../i18n'
import { useApp } from '../../store/useApp'

/**
 * MÓDULO 07 — QUEM SUSTENTA QUÊ?
 * Duas demonstrações centrais das diretrizes:
 *   A) o trabalhador sustenta todo o circuito — e o dinheiro não fica com ele;
 *   B) a concentração patrimonial é tendência de regime (Piketty: r > g),
 *      revertida apenas por compressão política (1936–1979).
 */
export default function WealthModule() {
  const lang = useApp((s) => s.lang)
  const didatico = useApp((s) => s.mode) !== 'avancado'

  return (
    <div className="flex flex-col gap-4">
      <header className="relative">
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-money">{mt(lang, 'wealth').kicker}</div>
          <ModeBadge />
        </div>
        <h2 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-100">{mt(lang, 'wealth').title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {didatico
            ? 'Duas perguntas simples, duas respostas desconfortáveis: (1) quem produz TODA a riqueza? O trabalho. (2) Onde ela fica? Em cima, nas mãos de cada vez menos gente. Aqui você segue o dinheiro passo a passo — do salário até o bilionário.'
            : 'Circulação do valor entre classes (Kalecki/Marx) + dinâmica seular da concentração patrimonial (WID/Piketty): compressão distributiva 1936–79 como exceção política, não regra econômica; r > g como força restauradora.'}
        </p>
      </header>

      <DataQuiz />

      <FollowSalary />

      <section className="flex flex-col gap-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          A riqueza foi se aglomerando — século a século
        </h3>
        <TopOneChart />
        <MirrorBars />
        <ConcentrationStats />
      </section>

      <BillionaireTimeline />

      <EscalaCompare usdBi={454} titulo="Tradutor: a riqueza privada mundial (US$ 454 tri) em unidades humanas" />

      <div className="grid gap-3 md:grid-cols-2">
        <article className="rounded-xl border border-dashed border-sky-400/40 bg-sky-400/5 p-4">
          <h4 className="text-sm font-bold text-sky-300">
            {didatico ? 'E então… dá para reverter?' : 'Compressão: a exceção que prova a regra'}
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-zinc-300">
            {didatico
              ? 'Sim — já aconteceu. Entre 1936 e 1979, imposto altíssimo sobre heranças e lucros, sindicatos fortes e salário mínimo valorizado espremeram a fatia dos 1% pela metade. Não foi bondade: foi pressão organizada. Quando a pressão parou, a curva voltou a subir. Concentração não é destino — é escolha política mantida.'
              : 'A janela 1936–1979 (top marginal rates >70%, capital controls, densidade sindical >30%) demonstra elasticidade política da distribuição: sem instituições comprimidoras, r>g restaura o padrão patrimonial em ~uma geração.'}
          </p>
        </article>
        <Tip text={didatico
          ? 'O sistema inteiro — bancos, Estado, acionistas, aluguéis — é sustentado pelo trabalho vivo de todos os dias. Se ele para uma semana, tudo trava. Se os mercados financeiros param uma semana… ninguém passa fome.'
          : 'Assimetria estrutural: reprodução social depende integralmente do trabalho vivo; a realização financeira depende dele apenas indiretamente — daí o poder de veto do capital e a fragilidade negociadora do trabalho.'}>
          <article className="h-full cursor-help rounded-xl border border-dashed border-red-400/40 bg-red-400/5 p-4">
            <h4 className="text-sm font-bold text-red-300">
              {didatico ? 'O teste definitivo' : 'Teste material da dependência'}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-zinc-300">
              Pare o trabalho uma semana: transporte, comida, energia, hospitais — TUDO trava em dias. Pare a
              bolsa uma semana: a vida continua normal. Quem sustenta quem fica óbvio quando invertemos o experimento.
            </p>
          </article>
        </Tip>
      </div>

      <p className="text-[10px] leading-relaxed text-zinc-600">
        Fontes: UBS Global Wealth Report 2024 (faixas, fim-2023); World Inequality Database (Top 1% EUA, série
        aproximada); Oxfam “Inequality Inc.” (2024); Forbes Billionaires 2024/25. Orçamentos domésticos do fluxo
        “Siga o Salário” são ilustrativos (pesquisas de orçamento familiar brasileiro, arredondados p/ didática).
      </p>
    </div>
  )
}
