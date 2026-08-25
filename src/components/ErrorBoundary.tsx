import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

/** ERROR BOUNDARY — um bug num módulo nunca derruba o site inteiro. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error('[Capital Blocks] erro capturado:', error)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto my-10 max-w-xl rounded-xl border border-red-500/50 bg-red-500/5 p-6 text-center">
          <h2 className="text-sm font-bold text-red-300">Algo quebrou neste módulo</h2>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            O erro foi registrado no console. Os demais módulos continuam funcionando — recarregue a página ou
            navegue pelo menu para continuar.
          </p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.hash = '' }}
            className="mt-4 rounded-lg bg-money px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-300"
          >
            tentar novamente
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
