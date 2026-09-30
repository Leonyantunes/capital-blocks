import { useApp, type Lang, type Theme, type UIMode } from '../store/useApp'
import { mt, t } from '../i18n'
import { NIVEIS } from '../lib/simples'
import ModeBadge from './ui/ModeBadge'

/**
 * PÁGINA DE CONFIGURAÇÕES — todas as preferências num lugar só (antes
 * espalhadas na Navbar). Aberta pelo botão ⚙ da Navbar ou por ?t=settings.
 *
 * O que vive aqui:
 * • Nível de leitura (simples/didático/avançado) — cards com descrição
 * • Tema (obsidian/claro) — paleta por tokens (index.css [data-theme])
 * • Idioma do chrome (PT/EN/ES) — o conteúdo dos módulos segue PT-BR
 * • Modo apresentação (fonte ampliada para projeção)
 * • Modo referências (fonte junto dos números exibidos)
 *
 * A Navbar mantém atalho rápido para o controle mais usado (nível de leitura)
 * e o botão ⚙ abre esta página. Tudo persiste no localStorage do usuário.
 */

const NIVEL_DOT: Record<UIMode, string> = {
  simples: 'bg-amber-300',
  didatico: 'bg-emerald-300',
  avancado: 'bg-sky-400',
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
      {children}
    </div>
  )
}

/** Switch acessível (role="switch") com rótulo, descrição e estado anunciado. */
function Toggle({
  on, onChange, label, desc,
}: { on: boolean; onChange: (v: boolean) => void; label: string; desc: string }) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-left transition-colors hover:border-zinc-700"
    >
      <span className="min-w-0">
        <span className="block text-sm font-bold text-zinc-100">{label}</span>
        <span className="mt-0.5 block text-[11.5px] leading-relaxed text-zinc-400">{desc}</span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors ${
          on ? 'border-money bg-money/25' : 'border-zinc-700 bg-zinc-950'
        }`}
      >
        <span
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full shadow transition-all ${
            on ? 'left-6 bg-money' : 'left-1 bg-zinc-500'
          }`}
        />
      </span>
    </button>
  )
}

export default function SettingsModule() {
  const lang = useApp((s) => s.lang)
  const didatico = useApp((s) => s.mode) === 'didatico'
  const mode = useApp((s) => s.mode)
  const setMode = useApp((s) => s.setMode)
  const theme = useApp((s) => s.theme)
  const setTheme = useApp((s) => s.setTheme)
  const showRefs = useApp((s) => s.showRefs)
  const setShowRefs = useApp((s) => s.setShowRefs)
  const presentation = useApp((s) => s.presentation)
  const setPresentation = useApp((s) => s.setPresentation)
  const setLang = useApp((s) => s.setLang)
  const setTab = useApp((s) => s.setTab)

  return (
    <div className="flex flex-col gap-5">
      <header className="relative">
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-money">
            {mt(lang, 'settings').kicker}
          </div>
          <ModeBadge />
        </div>
        <h2 className="mt-0.5 text-xl font-bold tracking-tight text-zinc-100">
          {mt(lang, 'settings').title}
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {didatico
            ? 'Ajuste o app do seu jeito: nível de leitura, tema, idioma e o que aparece na tela. Tudo fica salvo no seu navegador — na próxima visita, o app abre do mesmo jeito.'
            : 'Centralização das preferências: nível de leitura, tema por tokens, idioma do chrome, modo de referências e modo apresentação. Estado persistido (localStorage) com validação de rehydrate.'}
        </p>
      </header>

      {/* ── nível de leitura ── */}
      <section className="flex flex-col gap-2">
        <SectionTitle>{t(lang, 'nivelLeitura')}</SectionTitle>
        <div className="grid gap-2 sm:grid-cols-3">
          {NIVEIS.map((n) => (
            <button
              key={n.id}
              onClick={() => setMode(n.id as UIMode)}
              aria-pressed={mode === n.id}
              className={`rounded-xl border p-4 text-left transition-colors ${
                mode === n.id
                  ? 'border-money/70 bg-money/10'
                  : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${NIVEL_DOT[n.id as UIMode]}`} />
                <span className={`text-sm font-bold ${mode === n.id ? 'text-money' : 'text-zinc-100'}`}>
                  {n.rotulo}
                </span>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-zinc-400">{n.descricao}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* ── tema ── */}
        <section className="flex flex-col gap-2">
          <SectionTitle>{t(lang, 'tema')}</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            {(['dark', 'light'] as Theme[]).map((th) => (
              <button
                key={th}
                onClick={() => setTheme(th)}
                aria-pressed={theme === th}
                className={`rounded-xl border p-3.5 text-left transition-colors ${
                  theme === th
                    ? 'border-money/70 bg-money/10'
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-3.5 w-3.5 rounded-md border ${th === 'dark' ? 'border-zinc-700 bg-zinc-950' : 'border-zinc-400 bg-white'}`} />
                  <span className={`text-sm font-bold ${theme === th ? 'text-money' : 'text-zinc-100'}`}>
                    {th === 'dark' ? t(lang, 'escuro') : t(lang, 'claro')}
                  </span>
                </div>
                <span className="mt-2 flex gap-1" aria-hidden="true">
                  {/* paleta PRÉ-VISUALIZADA do tema alvo (cores fixas — o token
                      inverteria com o tema corrente e os dois cards mostrariam igual) */}
                  {(th === 'dark'
                    ? ['#ffc107', '#2196f3', '#f44336', '#4caf50']
                    : ['#d97706', '#0284c7', '#dc2626', '#16a34a']
                  ).map((c) => (
                    <span key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />
                  ))}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[10.5px] leading-relaxed text-zinc-600">
            Os mapas 2D e 3D mantêm o canvas escuro (instrumento com paleta própria) nos dois temas.
          </p>
        </section>

        {/* ── idioma ── */}
        <section className="flex flex-col gap-2">
          <SectionTitle>{t(lang, 'idioma')}</SectionTitle>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'pt', nome: 'Português', curto: 'PT' },
              { id: 'en', nome: 'English', curto: 'EN' },
              { id: 'es', nome: 'Español', curto: 'ES' },
            ] as { id: Lang; nome: string; curto: string }[]).map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                aria-pressed={lang === l.id}
                className={`rounded-xl border p-3.5 text-left transition-colors ${
                  lang === l.id
                    ? 'border-money/70 bg-money/10'
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                }`}
              >
                <span className={`block text-sm font-bold ${lang === l.id ? 'text-money' : 'text-zinc-100'}`}>
                  {l.nome}
                </span>
                <span className="mt-0.5 block font-mono text-[10px] text-zinc-500">{l.curto}</span>
              </button>
            ))}
          </div>
          <p className="text-[10.5px] leading-relaxed text-zinc-600">
            O chrome da interface é trilíngue; o conteúdo dos módulos segue em PT-BR até a fase de tradução integral.
          </p>
        </section>
      </div>

      {/* ── preferências de exibição ── */}
      <section className="flex flex-col gap-2">
        <SectionTitle>{t(lang, 'preferencias')}</SectionTitle>
        <div className="grid gap-2 lg:grid-cols-2">
          <Toggle
            on={showRefs}
            onChange={setShowRefs}
            label={t(lang, 'mostrarFonte')}
            desc="Os números exibidos ganham um marcador discreto com a fonte (instituição, safra ou método) quando existe. Desligado por padrão para a aula ficar limpa."
          />
          <Toggle
            on={presentation}
            onChange={setPresentation}
            label={t(lang, 'apresentacao')}
            desc="Aumenta a fonte raiz do app para projeção em sala ou leitura à distância."
          />
        </div>
      </section>

      {/* ── cruzamento com a base documental ── */}
      <button
        onClick={() => setTab('sources')}
        className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-money/40 bg-money/5 p-4 text-left transition-colors hover:border-money/70"
      >
        <span>
          <span className="block text-sm font-bold text-money">Fontes & Referências</span>
          <span className="mt-0.5 block text-[11.5px] leading-relaxed text-zinc-400">
            A base documental completa do app — instituições, safras, estado de verificação e links diretos — está no módulo de fontes.
          </span>
        </span>
        <span className="shrink-0 text-lg text-money" aria-hidden="true">→</span>
      </button>

      <p className="text-[11px] leading-relaxed text-zinc-600">
        Suas preferências ficam salvas no navegador e sobrevivem ao recarregar; JSON corrompido cai no padrão sem quebrar o app. Nada sai do seu navegador: sem backend, sem telemetria, sem rastreamento.
      </p>
    </div>
  )
}
