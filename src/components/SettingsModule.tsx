import { useApp, type Lang, type Theme, type UIMode } from '../store/useApp'
import { mt, pick, t } from '../i18n'
import { NIVEIS, textoPorModo } from '../lib/simples'
import ModeBadge from './ui/ModeBadge'

/**
 * PÁGINA DE CONFIGURAÇÕES — todas as preferências num lugar só (antes
 * espalhadas na Navbar). Aberta pelo botão ⚙ da Navbar ou por ?t=settings.
 *
 * O que vive aqui:
 * • Nível de leitura (simples/didático/avançado) — cards com descrição
 * • Tema (obsidian/claro) — paleta por tokens (index.css [data-theme])
 * • Idioma do app (PT/EN/ES) — chrome, módulos e dados editoriais traduzidos
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
  const mapRenderer = useApp((s) => s.mapRenderer)
  const setMapRenderer = useApp((s) => s.setMapRenderer)
  const levelDescription = (id: UIMode) => {
    if (id === 'simples') return pick(lang,
      'Para quem está começando: palavras do dia a dia, sem fórmula.',
      'For beginners: everyday language, no formulas.',
      'Para quien está empezando: lenguaje cotidiano, sin fórmulas.')
    if (id === 'didatico') return pick(lang,
      'Explicações com alguma conta e metáfora. Padrão do app.',
      'Explanations with some calculations and metaphors. App default.',
      'Explicaciones con algunos cálculos y metáforas. Predeterminado de la app.')
    return pick(lang,
      'Categorias, fórmulas e detalhes para leitura aprofundada.',
      'Categories, formulas and details for deeper reading.',
      'Categorías, fórmulas y detalles para una lectura más profunda.')
  }

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
          {textoPorModo(
            mode,
            pick(lang,
              'Ajuste o app do seu jeito: nível de leitura, tema, idioma e o que aparece na tela. Tudo fica salvo no seu navegador — na próxima visita, o app abre do mesmo jeito.',
              'Adjust the app your way: reading level, theme, language and what appears on screen. Everything is saved in your browser, so the app opens the same way next time.',
              'Ajusta la app a tu manera: nivel de lectura, tema, idioma y lo que aparece en pantalla. Todo queda guardado en tu navegador para la próxima visita.'),
            pick(lang,
              'Centralização das preferências: nível de leitura, tema por tokens, idioma da interface, modo de referências e modo apresentação. Estado persistido (localStorage) com validação de rehydrate.',
              'Centralized preferences: reading level, token-based theme, interface language, references mode and presentation mode. State persists in localStorage with rehydrate validation.',
              'Preferencias centralizadas: nivel de lectura, tema por tokens, idioma de la interfaz, modo de referencias y modo presentación. El estado persiste en localStorage con validación de rehidratación.'),
            pick(lang,
              'Escolha textos mais simples, mude o tema e o idioma e decida se quer ver as fontes junto dos números. Suas escolhas ficam salvas neste navegador.',
              'Choose simpler text, change the theme and language, and decide whether sources should appear next to figures. Your choices stay saved in this browser.',
              'Elige textos más simples, cambia el tema y el idioma y decide si quieres ver las fuentes junto a las cifras. Tus elecciones quedan guardadas en este navegador.'),
          )}
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
                  {t(lang, n.id)}
                </span>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-zinc-400">
                {levelDescription(n.id as UIMode)}
              </p>
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
            {pick(lang,
              'Os mapas 2D e 3D mantêm o canvas escuro (instrumento com paleta própria) nos dois temas.',
              'The 2D and 3D maps keep a dark canvas (an instrument with its own palette) in both themes.',
              'Los mapas 2D y 3D mantienen el lienzo oscuro (un instrumento con paleta propia) en ambos temas.')}
          </p>
        </section>

        {/* ── motor do mapa 2D ── */}
        <section className="flex flex-col gap-2">
          <SectionTitle>{pick(lang, 'Motor do Mapa 2D', '2D Map Engine', 'Motor del Mapa 2D')}</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                id: 'svg' as const,
                nome: pick(lang, '🍃 Mapa Vetorial SVG (Leve / Padrão)', '🍃 Lightweight SVG Map (Default)', '🍃 Mapa SVG Ligero (Predeterminado)'),
                desc: pick(lang, 'Renderização SVG nativa direta pelo navegador. Máxima compatibilidade e zero consumo de GPU.', 'Native browser SVG rendering. Maximum compatibility and zero GPU load.', 'Renderización SVG nativa. Máxima compatibilidad y sin carga de GPU.')
              },
              {
                id: 'gpu' as const,
                nome: pick(lang, '⚡ GPU Deck.gl (60 FPS)', '⚡ GPU Deck.gl (60 FPS)', '⚡ GPU Deck.gl (60 FPS)'),
                desc: pick(lang, 'Aceleração de hardware WebGL2 com arcos parabólicos 3D de alta densidade.', 'WebGL2 hardware acceleration with 3D parabolic arcs.', 'Aceleración por hardware WebGL2 con arcos parabólicos 3D.')
              }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMapRenderer(m.id)}
                aria-pressed={mapRenderer === m.id}
                className={`rounded-xl border p-3.5 text-left transition-colors ${
                  mapRenderer === m.id
                    ? 'border-money/70 bg-money/10'
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                }`}
              >
                <span className={`block text-xs font-bold ${mapRenderer === m.id ? 'text-money' : 'text-zinc-100'}`}>
                  {m.nome}
                </span>
                <span className="mt-1 block text-[10px] leading-relaxed text-zinc-400">{m.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── idioma ── */}
        <section className="flex flex-col gap-2">
          <SectionTitle>{t(lang, 'idioma')}</SectionTitle>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'pt', nome: pick(lang, 'Português', 'Portuguese', 'Portugués'), curto: 'PT' },
              { id: 'en', nome: pick(lang, 'Inglês', 'English', 'Inglés'), curto: 'EN' },
              { id: 'es', nome: pick(lang, 'Espanhol', 'Spanish', 'Español'), curto: 'ES' },
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
            {pick(lang,
              'O app oferece PT-BR, inglês e espanhol em toda a interface e no conteúdo editorial; a preferência fica salva no navegador.',
              'The app supports Brazilian Portuguese, English and Spanish across the interface and editorial content; the preference is saved in the browser.',
              'La app ofrece portugués de Brasil, inglés y español en toda la interfaz y el contenido editorial; la preferencia queda guardada en el navegador.')}
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
            desc={pick(lang,
              'Os números exibidos ganham um marcador discreto com a fonte (instituição, safra ou método) quando existe. Desligado por padrão para a aula ficar limpa.',
              'Displayed figures get a discreet source marker (institution, vintage or method) when available. Off by default to keep the lesson uncluttered.',
              'Las cifras mostradas reciben un marcador discreto de fuente (institución, período o método) cuando existe. Está desactivado por defecto para mantener limpia la clase.')}
          />
          <Toggle
            on={presentation}
            onChange={setPresentation}
            label={t(lang, 'apresentacao')}
            desc={pick(lang,
              'Aumenta a fonte raiz do app para projeção em sala ou leitura à distância.',
              'Increases the app’s root font size for classroom projection or reading from a distance.',
              'Aumenta el tamaño de fuente base de la app para proyección en clase o lectura a distancia.')}
          />
        </div>
      </section>

      {/* ── cruzamento com a base documental ── */}
      <button
        onClick={() => setTab('sources')}
        className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-money/40 bg-money/5 p-4 text-left transition-colors hover:border-money/70"
      >
        <span>
          <span className="block text-sm font-bold text-money">{mt(lang, 'sources').title}</span>
          <span className="mt-0.5 block text-[11.5px] leading-relaxed text-zinc-400">
            {pick(lang,
              'A base documental completa do app — instituições, safras, estado de verificação e links diretos — está no módulo de fontes.',
              'The app’s complete documentation base — institutions, vintages, verification status and direct links — is in the sources module.',
              'La base documental completa de la app — instituciones, períodos, estado de verificación y enlaces directos — está en el módulo de fuentes.')}
          </span>
        </span>
        <span className="shrink-0 text-lg text-money" aria-hidden="true">→</span>
      </button>

      <p className="text-[11px] leading-relaxed text-zinc-600">
        {pick(lang,
          'Suas preferências ficam salvas no navegador e sobrevivem ao recarregar; JSON corrompido cai no padrão sem quebrar o app. Nada sai do seu navegador: sem backend, sem telemetria, sem rastreamento.',
          'Your preferences are saved in the browser and survive reloads; corrupted JSON falls back to defaults without breaking the app. Nothing leaves your browser: no backend, telemetry or tracking.',
          'Tus preferencias quedan guardadas en el navegador y sobreviven a las recargas; un JSON corrupto vuelve a los valores predeterminados sin romper la app. Nada sale de tu navegador: sin backend, telemetría ni rastreo.')}
      </p>
    </div>
  )
}
