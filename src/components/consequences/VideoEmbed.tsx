import { useState } from 'react'
import { m } from 'framer-motion'
import { pick } from '../../i18n'
import { useApp } from '../../store/useApp'
import { textoPorModo } from '../../lib/simples'

/**
 * Vídeo YouTube com facade lazy (thumbnail → iframe no clique):
 * não carrega o player até o usuário pedir (performance + privacidade).
 */
export default function VideoEmbed({ videoId, titulo }: { videoId: string; titulo: string }) {
  const [playing, setPlaying] = useState(false)
  const lang = useApp((s) => s.lang)
  const mode = useApp((s) => s.mode)
  const tx = (pt: string, en: string, es: string) => pick(lang, pt, en, es)

  if (playing) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-800">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="group relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-800"
      aria-label={`${tx('Reproduzir vídeo', 'Play video', 'Reproducir video')}: ${titulo}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` }}
        alt={`${tx('Capa do vídeo', 'Video thumbnail', 'Miniatura del video')}: ${titulo}`}
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
        loading="lazy"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/95 shadow-2xl transition-transform group-hover:scale-110">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
      <span className="absolute bottom-3 left-4 right-4 text-left">
        <span className="block text-[10px] font-bold uppercase tracking-widest text-red-300">
          {tx('Série · Mortes do Capitalismo · Filipe Boni', 'Series · Deaths of Capitalism · Filipe Boni', 'Serie · Muertes del Capitalismo · Filipe Boni')}
        </span>
        <span className="mt-0.5 block text-sm font-bold text-zinc-50">{titulo}</span>
        <span className="mt-0.5 block text-[10.5px] text-zinc-400">
          {textoPorModo(mode,
            tx('clique para assistir (≈15 min) — depois volte para a análise', 'click to watch (≈15 min) — then return to the analysis', 'haz clic para ver (≈15 min) — luego vuelve al análisis'),
            tx('fonte audiovisual · análise documental abaixo', 'audiovisual source · documentary analysis below', 'fuente audiovisual · análisis documental abajo'),
            tx('clique para assistir e depois volte para continuar', 'click to watch, then come back to continue', 'haz clic para ver y luego vuelve para continuar'))}
        </span>
      </span>
    </button>
  )
}
