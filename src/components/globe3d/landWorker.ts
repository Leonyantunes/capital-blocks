/**
 * WORKER do globo — constrói a matriz de pontos terrestres fora da thread
 * principal. O geoContains contra ~170 países travava frames no celular
 * mesmo fatiado por setTimeout; aqui roda sem concorrer com o render.
 *
 * A TOPOLOGIA CHEGA POR postMessage, não por import. O world-atlas
 * (countries-110m.json) tem ~105 kB e já vive no chunk vendor-geo; importar
 * aqui faria o bundler embutir uma segunda cópia dentro deste chunk, e quem
 * abre o globo 3D baixaria o mesmo dado duas vezes.
 */
import { sampleLand, type Topology } from './landSample'

const ctx = self as unknown as {
  onmessage: ((e: MessageEvent) => void) | null
  postMessage: (msg: unknown, transfer?: Transferable[]) => void
}

ctx.onmessage = (e: MessageEvent) => {
  const data = e.data as { step?: number; topology?: Topology } | null
  const step = data?.step ?? 0.85
  if (!data?.topology) {
    ctx.postMessage({ type: 'error', message: 'topology ausente' })
    return
  }
  const res = sampleLand(data.topology, step, (done, total) => {
    ctx.postMessage({ type: 'progress', done, total })
  })
  ctx.postMessage(
    { type: 'done', positions: res.positions, isos: res.isos, count: res.count },
    [res.positions.buffer],
  )
}
