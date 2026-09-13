/**
 * WORKER do globo — constrói a matriz de pontos terrestres fora da thread
 * principal. O geoContains contra ~170 países travava frames no celular
 * mesmo fatiado por setTimeout; aqui roda sem concorrer com o render.
 */
import { sampleLand } from './landSample'

const ctx = self as unknown as {
  onmessage: ((e: MessageEvent) => void) | null
  postMessage: (msg: unknown, transfer?: Transferable[]) => void
}

ctx.onmessage = (e: MessageEvent) => {
  const step = (e.data as { step?: number } | null)?.step ?? 0.85
  const res = sampleLand(step, (done, total) => {
    ctx.postMessage({ type: 'progress', done, total })
  })
  ctx.postMessage(
    { type: 'done', positions: res.positions, isos: res.isos, count: res.count },
    [res.positions.buffer],
  )
}
