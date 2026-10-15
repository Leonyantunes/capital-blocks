import { useEffect, useRef, useState, useMemo } from 'react'
import {
  OWNERSHIP_NODES,
  OWNERSHIP_EDGES,
  getBigThreeConcentration,
  type OwnershipNode,
  type CapitalFraction,
} from '../../data/ownership'
import { useApp } from '../../store/useApp'
import { pick } from '../../i18n'

export default function CorporateNetworkGraph() {
  const lang = useApp((s) => s.lang)
  const li = lang === 'pt' ? 0 : lang === 'en' ? 1 : 2

  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d')
  const [selectedFraction, setSelectedFraction] = useState<CapitalFraction | 'todas'>('todas')
  const [selectedInvestor, setSelectedInvestor] = useState<string>('todos')
  const [selectedNode, setSelectedNode] = useState<OwnershipNode | null>(OWNERSHIP_NODES[0])

  const container2DRef = useRef<HTMLDivElement>(null)
  const container3DRef = useRef<HTMLDivElement>(null)
  const cyInstanceRef = useRef<any>(null)
  const forceGraphInstanceRef = useRef<any>(null)

  // Filtra nós e arestas conforme filtros ativos
  const filteredData = useMemo(() => {
    let nodes = OWNERSHIP_NODES
    let edges = OWNERSHIP_EDGES

    if (selectedFraction !== 'todas') {
      nodes = nodes.filter((n) => n.fraction === selectedFraction || n.kind === 'fund')
    }

    if (selectedInvestor !== 'todos') {
      const allowedCompanyIds = new Set(
        edges.filter((e) => e.source === selectedInvestor).map((e) => e.target)
      )
      allowedCompanyIds.add(selectedInvestor)
      nodes = nodes.filter((n) => allowedCompanyIds.has(n.id))
      edges = edges.filter((e) => e.source === selectedInvestor)
    } else {
      const nodeIds = new Set(nodes.map((n) => n.id))
      edges = edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))
    }

    return { nodes, edges }
  }, [selectedFraction, selectedInvestor])

  // --- 2D CYTOSCAPE RENDERING ---
  useEffect(() => {
    if (viewMode !== '2d' || !container2DRef.current) return

    let isMounted = true

    import('cytoscape').then(({ default: cytoscape }) => {
      if (!isMounted || !container2DRef.current) return

      if (cyInstanceRef.current) {
        cyInstanceRef.current.destroy()
      }

      const elements = [
        ...filteredData.nodes.map((n) => ({
          data: {
            id: n.id,
            label: n.name,
            color: n.color,
            size: Math.max(22, Math.min(65, Math.log10(Math.max(n.sizeBi, 1)) * 16)),
            nodeData: n,
          },
        })),
        ...filteredData.edges.map((e) => ({
          data: {
            id: e.id,
            source: e.source,
            target: e.target,
            label: `${e.sharePct}%`,
            weight: e.sharePct,
          },
        })),
      ]

      const cy = cytoscape({
        container: container2DRef.current,
        elements,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': 'data(color)',
              label: 'data(label)',
              color: '#f4f4f5',
              'font-size': '11px',
              'font-weight': 600,
              'text-valign': 'bottom',
              'text-margin-y': 6,
              width: 'data(size)',
              height: 'data(size)',
              'border-width': 2,
              'border-color': '#ffffff33',
            },
          },
          {
            selector: 'edge',
            style: {
              width: 1.5,
              'line-color': '#52525b',
              'target-arrow-color': '#52525b',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              label: 'data(label)',
              'font-size': '9px',
              'font-family': 'monospace',
              color: '#a1a1aa',
              'text-rotation': 'autorotate',
              'text-background-opacity': 0.8,
              'text-background-color': '#09090b',
              'text-background-padding': '2px',
            },
          },
          {
            selector: 'node:selected',
            style: {
              'border-color': '#10b981',
              'border-width': 4,
            },
          },
        ],
        layout: {
          name: 'concentric',
          concentric: (node: any) => {
            const nd = node.data('nodeData')
            return nd?.kind === 'fund' ? 10 : 2
          },
          levelWidth: () => 1,
          padding: 24,
          animate: true,
          animationDuration: 400,
        },
      })

      cy.on('tap', 'node', (evt) => {
        const nd = evt.target.data('nodeData') as OwnershipNode
        setSelectedNode(nd)
      })

      cyInstanceRef.current = cy
    })

    return () => {
      isMounted = false
      if (cyInstanceRef.current) {
        cyInstanceRef.current.destroy()
        cyInstanceRef.current = null
      }
    }
  }, [viewMode, filteredData])

  // --- 3D FORCE GRAPH RENDERING ---
  useEffect(() => {
    if (viewMode !== '3d' || !container3DRef.current) return

    let isMounted = true

    import('3d-force-graph').then(({ default: ForceGraph3D }) => {
      if (!isMounted || !container3DRef.current) return

      if (forceGraphInstanceRef.current) {
        forceGraphInstanceRef.current._destructor?.()
      }

      const gData = {
        nodes: filteredData.nodes.map((n) => ({
          ...n,
          val: Math.max(5, Math.log10(Math.max(n.sizeBi, 1)) * 4),
        })),
        links: filteredData.edges.map((e) => ({
          ...e,
        })),
      }

      const fg = (ForceGraph3D as any)()(container3DRef.current)
        .graphData(gData)
        .backgroundColor('#09090b')
        .nodeLabel((node: any) => `${node.name} (${node.country}) · US$ ${node.sizeBi}B`)
        .nodeColor((node: any) => node.color)
        .nodeVal((node: any) => node.val)
        .linkLabel((link: any) => `Fatia: ${link.sharePct}% (US$ ${link.valueBi}B)`)
        .linkColor(() => '#71717a')
        .linkWidth(1.2)
        .linkDirectionalArrowLength(3.5)
        .linkDirectionalArrowRelPos(1)
        .onNodeClick((node: any) => {
          setSelectedNode(node)
        })

      forceGraphInstanceRef.current = fg
    })

    return () => {
      isMounted = false
      if (forceGraphInstanceRef.current) {
        forceGraphInstanceRef.current._destructor?.()
        forceGraphInstanceRef.current = null
      }
    }
  }, [viewMode, filteredData])

  const concentration = selectedNode ? getBigThreeConcentration(selectedNode.id) : null

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-lg">
      {/* Cabeçalho & Controles */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-fuchsia-500/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-fuchsia-300">
              {pick(lang, 'Teia de Controle Acionário', 'Corporate Ownership Web', 'Red de Control Accionario')}
            </span>
            <span className="rounded border border-zinc-700 bg-zinc-950 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
              SEC 13F / CVM 2025
            </span>
          </div>
          <h3 className="mt-1 text-base font-bold text-zinc-100">
            {pick(
              lang,
              'Propriedade Comum Horizontal e Domínio dos Big Three',
              'Horizontal Common Ownership and Big Three Dominance',
              'Propiedad Común Horizontal y Dominio de los Big Three'
            )}
          </h3>
          <p className="mt-0.5 max-w-2xl text-xs text-zinc-400">
            {pick(
              lang,
              'Veja como BlackRock, Vanguard e State Street possuem participações de 5% a 10% simultâneas em corporações que supostamente concorrem entre si.',
              'See how BlackRock, Vanguard and State Street simultaneously hold 5% to 10% equity in supposed competitors.',
              'Observe cómo BlackRock, Vanguard y State Street poseen simultáneamente entre el 5% y el 10% del capital de empresas que compiten entre sí.'
            )}
          </p>
        </div>

        {/* Comutador 2D / 3D */}
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 p-1">
          <button
            onClick={() => setViewMode('2d')}
            className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
              viewMode === '2d'
                ? 'bg-money text-onaccent shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {pick(lang, 'Grafo 2D (Cytoscape)', '2D Graph (Cytoscape)', 'Grafo 2D (Cytoscape)')}
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
              viewMode === '3d'
                ? 'bg-sky-500 text-onaccent shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {pick(lang, 'Nuvem 3D (WebGL)', '3D Force Cloud (WebGL)', 'Nube 3D (WebGL)')}
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] text-zinc-500 uppercase">{pick(lang, 'Fração:', 'Fraction:', 'Fracción:')}</span>
          {(['todas', 'produtivo', 'financeiro', 'ficticio', 'estatal'] as const).map((fr) => (
            <button
              key={fr}
              onClick={() => setSelectedFraction(fr)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                selectedFraction === fr
                  ? 'border border-zinc-600 bg-zinc-800 text-zinc-100 font-bold'
                  : 'border border-zinc-800/80 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {fr.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] text-zinc-500 uppercase">{pick(lang, 'Foco no Fundo:', 'Focus on Fund:', 'Foco en Fondo:')}</span>
          <select
            value={selectedInvestor}
            onChange={(e) => setSelectedInvestor(e.target.value)}
            className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 font-mono text-[11px] text-zinc-300 outline-none focus:border-money/60"
          >
            <option value="todos">{pick(lang, 'Todos os Investidores', 'All Investors', 'Todos los Inversores')}</option>
            <option value="vanguard">Vanguard Group</option>
            <option value="blackrock">BlackRock Inc.</option>
            <option value="state-street">State Street</option>
            <option value="norges-bank">Norges Bank (Noruega)</option>
          </select>
        </div>
      </div>

      {/* Grid: Canvas do Grafo + Inspetor de Nós */}
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_320px]">
        {/* Canvas da Rede */}
        <div className="relative min-h-[460px] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
          {viewMode === '2d' ? (
            <div ref={container2DRef} className="h-full min-h-[460px] w-full" />
          ) : (
            <div ref={container3DRef} className="h-full min-h-[460px] w-full" />
          )}

          <div className="pointer-events-none absolute bottom-2 left-3 rounded bg-zinc-900/80 px-2 py-1 font-mono text-[10px] text-zinc-500 backdrop-blur">
            {pick(
              lang,
              'Dica: clique em qualquer nó para inspecionar participações acionárias e fatias',
              'Tip: click any node to inspect shareholdings and equity stakes',
              'Consejo: haz clic en cualquier nodo para inspeccionar participaciones'
            )}
          </div>
        </div>

        {/* Painel Inspetor do Nó Selecionado */}
        {selectedNode && (
          <aside className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5">
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: selectedNode.color }}
                    />
                    <h4 className="text-sm font-bold text-zinc-100">{selectedNode.name}</h4>
                  </div>
                  <span className="font-mono text-[10.5px] text-zinc-500">
                    {selectedNode.country} {selectedNode.ticker ? `· ${selectedNode.ticker}` : ''}
                  </span>
                </div>
                <span className="rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 font-mono text-[9px] uppercase font-bold text-zinc-300">
                  {selectedNode.fraction}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <div className="rounded-lg bg-zinc-900/60 p-2.5">
                  <div className="text-[10px] uppercase font-semibold text-zinc-500">
                    {selectedNode.kind === 'fund' || selectedNode.kind === 'sovereign'
                      ? pick(lang, 'Ativos Sob Gestão (AUM)', 'Assets Under Management (AUM)', 'Activos Bajo Gestión (AUM)')
                      : pick(lang, 'Valor de Mercado', 'Market Cap', 'Capitalización Bursátil')}
                  </div>
                  <div className="mt-0.5 font-mono text-lg font-bold text-emerald-300">
                    ${selectedNode.sizeBi.toLocaleString()} {pick(lang, 'Bilhões', 'Billion', 'Miles de Millones')}
                  </div>
                </div>

                <p className="text-[11.5px] leading-relaxed text-zinc-300">
                  {selectedNode.description[li]}
                </p>

                {/* Se for uma empresa investida, mostra quem manda nela */}
                {concentration && concentration.investors.length > 0 && (
                  <div className="mt-3 border-t border-zinc-800 pt-2.5">
                    <div className="flex items-center justify-between text-[10.5px] font-bold text-zinc-400">
                      <span>{pick(lang, 'Grandes Custodiantes:', 'Major Custodians:', 'Grandes Custodios:')}</span>
                      <span className="font-mono text-amber-300">
                        {concentration.totalPct.toFixed(1)}% {pick(lang, 'somados', 'combined', 'sumados')}
                      </span>
                    </div>

                    <ul className="mt-1.5 space-y-1">
                      {concentration.investors.map((inv) => (
                        <li
                          key={inv.name}
                          className="flex items-center justify-between rounded bg-zinc-900/80 px-2 py-1 text-[11px]"
                        >
                          <span className="text-zinc-300 truncate max-w-[180px]">{inv.name}</span>
                          <span className="font-mono font-bold text-sky-400">
                            {inv.pct}% (${inv.valueBi}B)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/40 p-2.5 text-[10px] leading-relaxed text-zinc-500">
              <strong className="text-zinc-400 block mb-0.5">
                {pick(lang, 'Ponto Teórico (Marx & Kalecki):', 'Theoretical Point (Marx & Kalecki):', 'Punto Teórico:')}
              </strong>
              {pick(
                lang,
                'A propriedade acionária dissolve a figura do capitalista individual e a transfere para fundos institucionais de custódia (Marx, Livro III, Cap. 27). A concorrência deixa de ser entre empresas e vira cartelização sistêmica horizontal.',
                'Common stock ownership socializes private ownership into passive institutional holding trusts (Marx, Vol. III, Ch. 27). Competition mutates into systemic horizontal common control.',
                'La propiedad accionaria disuelve al capitalista individual en fondos institucionales de custodia (Marx, Libro III). La competencia transmuta en cartelización horizontal sistémica.'
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
