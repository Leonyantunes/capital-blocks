# Guia Didático do Professor — Capital Blocks

> **Um Recurso Educacional Aberto (REA) para o Ensino Crítico de Geografia Econômica, História das Relações Internacionais e Economia Política.**

---

## 1. Visão Geral e Filosofia Pedagógica

O **Capital Blocks** é uma plataforma interativa de visualização científica e geoespacial projetada para transformar conceitos abstratos de economia política e relações internacionais em experiências táteis e auditáveis.

A plataforma resolve o dilema entre simplificação excessiva e jargão impenetrável através de uma arquitetura pedagógica tridimensional:
1. **Vertical (Nível de Complexidade):** `Modo Simples` $\leftrightarrow$ `Modo Didático` $\leftrightarrow$ `Modo Avançado (Pesquisa)`.
2. **Horizontal (Lentes Disciplinares):** `Geografia` $\leftrightarrow$ `História` $\leftrightarrow$ `Economia Política`.
3. **Cartográfica:** `Mapa 2D Vetorial SVG (Leve/Offline)` $\leftrightarrow$ `Globo 3D Físico` $\leftrightarrow$ `GPU Deck.gl (Arcos 3D de Comércio)`.

---

## 2. Os Três Níveis de Leitura em Sala de Aula

| Nível | Público-Alvo | Linguagem & Sintaxe | Foco Conceitual |
| :--- | :--- | :--- | :--- |
| **Simples** | Ensino Fundamental II (8º e 9º anos) | Frases curtas, metáforas cotidianas, eliminação de jargões técnicos sem falsificação dos dados. | Onde estão as máquinas, para onde vai a comida e o minério, quem manda no dinheiro. |
| **Didático** | Ensino Médio e Pré-Vestibular | Conceituação rigorosa acessível, contextualização histórica e geopolítica. | Divisão Internacional do Trabalho (DIT), imperialismo contemporâneo, petrodólar, cadeias globais de valor. |
| **Avançado** | Graduação e Pós-Graduação | Identidades contábeis explícitas ($c, v, m$, Godley, Shaikh & Tonak), notas de mensuração SNA/IBGE/BEA/PWT. | Queda tendencial da taxa de lucro ($r$), Teoria Marxista da Dependência (TMD), Troca Desigual de Emmanuel/Amin, Hegemonia do Dólar. |

---

## 3. Matriz de Alinhamento com a BNCC

### Geografia (Ensino Fundamental II e Médio)
- **EF08GE01:** Descrever as rotas de dispersão populacional e a circulação de mercadorias e capitais na ordem global.
- **EF08GE05:** Analisar a Divisão Internacional do Trabalho (DIT) e as assimetrias entre países do Centro e da Periferia.
- **EF08GE11:** Identificar os principais blocos econômicos (G7, BRICS) e suas disputas comerciais e financeiras.
- **EM13CHS103:** Analisar a circulação de riquezas, o poder hegemônico do dólar e as rotas críticas de transporte marítimo (Chokepoints: Malaca, Ormuz, Suez, Panamá).

### História (Ensino Fundamental II e Médio)
- **EF09HI02:** Compreender o imperialismo moderno, o neocolonialismo e a partilha da África e Ásia.
- **EF09HI10:** Identificar a transição da hegemonia britânica para a norte-americana (Padrão-Ouro $\rightarrow$ Bretton Woods $\rightarrow$ Choque Nixon 1971).
- **EM13CHS201:** Investigar as crises econômicas contemporâneas, o fim da conversibilidade do ouro e a ascensão do capital fictício financeirizado.

### Economia, Filosofia e Sociologia (Ensino Médio e Superior)
- **EM13CHS401:** Examinar a relação entre trabalho assalariado, tecnologia e expropriação de valor no capitalismo contemporâneo.
- **EM13CHS404:** Avaliar criticamente o papel dos grandes fundos de investimento e conglomerados transnacionais na governança global.

---

## 4. Planos de Aula Prontos para Aplicação

### Roteiro 1 (50 minutos): "Para Onde Vai a Riqueza do Brasil?"
- **Público:** Ensino Fundamental II (8º e 9º anos) ou 1º ano do Ensino Médio.
- **Módulos Utilizados:** Módulo 01 (`home` - Mapa de Fluxos) e Módulo 04 (`circuit` - Circuito de Valor).
- **Passo a Passo:**
  1. *Introdução (10 min):* Abra o Mapa no projetor no **Modo Simples**. Destaque o Brasil no mapa.
  2. *Exploração Guiada (15 min):* Inicie o tour temático **"Trilha de Geografia Econômica"**. Mostre aos alunos as partículas azuis saindo dos portos de Santos e Paranaguá em direção à China (soja e minério).
  3. *Provocação Didática (15 min):* Alterne para as partículas roxas pontilhadas (Drenagem de mais-valia). Pergunte: *"Se vendemos tanto alimento, por que o país tem dívidas e remete tantos lucros para bancos no exterior?"*.
  4. *Fechamento (10 min):* Abra o quiz interativo da parada **"Fábrica do Mundo"** e debata as respostas com a turma.

### Roteiro 2 (50 minutos): "A Guerra dos Chips e a Geopolítica da Tecnologia"
- **Público:** Ensino Médio (2º e 3º anos).
- **Módulos Utilizados:** Módulo 03 (`war` - Guerras de Capital) e Módulo 01 (`home` - Rota Semicondutores).
- **Passo a Passo:**
  1. *Contexto (10 min):* Ative o conflito **"Guerra dos Semicondutores"** na barra inferior do mapa.
  2. *Mapeamento Espacial (20 min):* Aponte o Estreito de Taiwan e mostre a concentração da TSMC (Taiwan) e da ASML (Holanda). Discuta por que um único estreito marítimo de 160 km concentra mais de 60% da capacidade global de chips avançados.
  3. *Análise de Vulnerabilidade (10 min):* Alterne para a camada de chokepoints marítimos no mapa e no Globo 3D.
  4. *Síntese (10 min):* Conecte com notícias atuais de sanções comerciais dos EUA sobre exportação de máquinas litográficas para a China.

### Roteiro 3 (90 minutos): "Quem é Dono do Mundo? A Teia Acionária dos Big Three"
- **Público:** Ensino Médio (3º ano) ou Graduação.
- **Módulos Utilizados:** Módulo 02 (`companies` - Teia Acionária com Cytoscape/Force Graph).
- **Passo a Passo:**
  1. *Abertura (15 min):* Pergunte aos estudantes quem é o dono da Apple, da Petrobras, da Vale e da Microsoft.
  2. *Exploração Interativa (30 min):* No Módulo de Empresas, clique na aba **"🕸 Teia Acionária"**. Filtre pelo fundo **Vanguard** e depois por **BlackRock**.
  3. *Laboratório (25 min):* Mostre o conceito de *Common Ownership* (Propriedade Comum): o mesmo pequeno grupo de gestoras institucionais é acionista majoritário tanto da Boeing quanto da Airbus, tanto da Apple quanto da Microsoft, e das maiores mineradoras da B3.
  4. *Debate (20 min):* Como a concorrência capitalista clássica se transforma quando os concorrentes pertencem aos mesmos fundos de custódia?

### Roteiro 4 (90 minutos - Universitário): "A Queda Tendencial da Taxa de Lucro e o Laboratório SQL"
- **Público:** Graduação em Economia, Ciências Sociais, Relações Internacionais ou Geografia.
- **Módulos Utilizados:** Módulo 04 (`circuit` - Circuito e Curva de Lucro) e Módulo 10 (`sources` - Laboratório SQL DuckDB-Wasm).
- **Passo a Passo:**
  1. *Fundamentação Teórica (20 min):* Revisão da identidade marxista $r = \frac{m}{c+v} = \frac{e}{k+1}$ e a controvérsia Okishio vs Shaikh/Kliman.
  2. *Laboratório SQL no Browser (35 min):* Acesse o **Laboratório Analítico SQL** no Módulo 10. Execute a consulta pré-pronta:
     ```sql
     SELECT pais, ano, composicao_k, taxa_lucro_r 
     FROM penn_world_table 
     WHERE pais IN ('Brasil', 'Estados Unidos', 'China');
     ```
  3. *Interpretação Empírica (20 min):* Observe a elevação da composição orgânica $k$ nos EUA e na China nas últimas quatro décadas e o comportamento compensatório da taxa de exploração $e$.
  4. *Exportação de Dados (15 min):* Exporte os resultados em CSV diretamente para análise no R/Python ou planilhas.

---

## 5. Recursos de Acessibilidade e Inclusão

- **Navegação por Teclado:** Use as setas `Esquerda` e `Direita` para avançar paradas de tour; use `Escape` para fechar gavetas.
- **Leitores de Tela:** Todas as rotas, nós de acionistas e botões de conflito possuem atributos `aria-label`, `role` e estados de anúncio.
- **Contraste WCAG 2.1 AA:** Esquema escuro profissional com texto `#f4f4f5` (zinc-100) sobre `#09090b` (zinc-950), garantindo contraste $\ge 7:1$.
- **Baixo Consumo / Dispositivos Antigos:** O seletor de motor permite alternar imediatamente para `Mapa SVG (Leve)` em computadores escolares com GPUs integradas simples.
