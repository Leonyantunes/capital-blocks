# WIREFRAME — CAPITAL BLOCKS · A Anatomia do Capitalismo Global

Hierarquia visual da tela inicial (Dark Mode padrão) e dos fluxos de interação.
Stack de UI: React + Tailwind v4, tipografia Inter (UI) / JetBrains Mono (dados numéricos).

---

## 0. Sistema Visual

| Elemento | Decisão |
| :--- | :--- |
| Fundo | `zinc-950` (quase-preto), superfícies em `zinc-900/60` |
| Acento primário | `amber-400` — capital-dinheiro, ações do usuário, estado ativo |
| Frações de capital | Produtivo `emerald`, Financeiro `amber`, Comercial `sky`, Fictício `fuchsia`, Estatal `red` |
| Mais-valia | Sempre `emerald` (+m) ou `red` (extração/pulso em P) |
| Tipografia | Inter para leitura; JetBrains Mono para **toda** grandeza econômica (números = mono) |
| Movimento | Setas com dash animado (fluxo contínuo); engrenagem P gira lentamente; M′ pulsa |

---

## 1. Tela Inicial — Módulo 01 "O Circuito do Capital"

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (sticky, blur)                                                       │
│ [◼ logo 4 blocos] CAPITAL BLOCKS        [01 Circuito]* [02 Blocos] (03)(04) │
│                   A ANATOMIA DO…         ativo=chip âmbar   riscados=breve   │
├─────────────────────────────────────────────────────────────────────────────┤
│ HEADER DO MÓDULO                                                            │
│ MÓDULO 01 · H1 "O Circuito do Capital"                                      │
│ parágrafo didático + chip-mono: M — C(L/MP) … P … C′ — M′                    │
├──────────────────┬──────────────────────────────────────────────────────────┤
│ PAINEL ESQUERDO  │ DIAGRAMA SVG (ocupa a maior área, responsivo)            │
│ (340px fixo)     │                                                          │
│                  │  (M)──D—M──▶[C ┬ L força de trabalho v]···▶((P))·′▶[C′]──▶(M′)
│ Slider k = c/v   │   ▲            └ MP meios prod.   c │pulso vermelho  valor │
│ 0.5 ─●────── 9   │  âmbar                            +m pill verde     pulsante
│                  │                                                          │
│ Slider e = m/v   │  barra inferior no SVG: M = c% ████░░ v% (composição)    │
│ 50% ────●── 300% │                                                          │
│                  ├──────────────────────────────────────────────────────────┤
│ Presets          │ GRID DE 4 MÉTRICAS (cards):                              │
│ [Manufatura XIX] │  M=c+v | g=m/(c+v)* | k=c/v | e=m/v                      │
│ [Fordismo]       │  (*fica vermelha quando g < 20%)                         │
│ [Automação/IA]   ├──────────────────────────────────────────────────────────┤
│                  │ CURVA DA TENDÊNCIA DE LUCRO (SVG, largura total)          │
│ Leituras c/v/m/C'│  família de curvas p/ e fixo + curva atual + marcador ●   │
│ (mini-cards mono)│  nota dinâmica: "subir k derruba g em X p.p."             │
├──────────────────┴──────────────────────────────────────────────────────────┤
│ FOOTER: disclaimer teórico + fontes aproximadas (FMI)                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Fluxo de interação:** mover slider → Zustand atualiza `k`/`e` → todos os nós do circuito,
métricas e a curva re-renderizam no mesmo tick (uma única fonte de verdade).

## 2. Tela — Módulo 02 "Blocos & Fluxos"

```
HEADER DO MÓDULO                          [PIB Nominal | PPP] ← segmented control
STRIP COMPARATIVA (scroll horizontal)
  [USA $32.38tri ▓▓▓▓▒▒▒] [CHN …] [BRA …] [EU] [IND] [RUS]  → clique abre painel
GRID DE CARDS (2–3 colunas)
  ┌ CARD PAÍS ────────────────────────────┐
  │ USA  · AMÉRICA DO NORTE               │
  │ Estados Unidos                        │
  │ perfil em 1 linha                     │
  │ $32,38 tri   PPP: $32,38 tri          │
  │ ▓▓▓▓▓▓▓ barra empilhada das frações   │
  │ Anatomia do bloco →                   │
  └───────────────────────────────────────┘
CARDS PLACEHOLDER (borda tracejada): Módulo 03 Guerra de Blocos / 04 Timeline
```

## 3. Drawer Lateral (painel do país)

Overlay escurece o fundo → painel desliza da direita (440px, scroll próprio):

1. **Header sticky**: região, nome, perfil, botão ✕.
2. **Toggle Nominal/PPP** + PIB gigante em mono + base alternativa esmaecida.
3. **Gráfico de rosca** (frações do PIB) + legenda interativa:
   cada linha mostra `%` e `$ tri` da fração; clique oculta/mostra a fração na rosca.
4. **Guerra interna de blocos**: cards por facção (tese política + firms-chips).
5. Rodapé: aviso de decomposição didática.

## 4. Próximos módulos (spec resumida)

* **03 Guerra de Blocos**: matriz de pares (EUA×CHN semicondutores etc.) com Sankey de
  redirecionamento de rotas, medidores de tarifa e reservas.
* **04 Timeline**: trilha horizontal 1870→2026 com zoom por década e cartões-evento.
