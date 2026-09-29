# Licença

**Capital Blocks** está sob **CC BY-NC-SA 4.0** (Creative Commons
Attribution-NonCommercial-ShareAlike 4.0) — **código e conteúdo sob a mesma licença**.

O pedido que originou esta licença foi: *uso aberto, para fins educacionais e não
comerciais*. Isso descreve com precisão a licença **CC BY-NC-SA 4.0**
("Atribuição – NãoComercial – CompartilhaMesmaLicença").

## Por que uma única licença

A versão anterior deste repositório tinha um esquema **dual** (MIT para o código,
CC BY-NC-SA para o conteúdo). Isso foi unificado em **uma única licença CC BY-NC-SA
4.0**, por dois motivos:

1. **Coerência com o pedido.** A licença MIT permitia uso comercial do código, o
   que não corresponde ao requisito “não comercial”. Uma única licença não deixa
   nenhuma parte do repositório com uso comercial liberado.

2. **Elimina a ambiguidade de escopo.** Um componente `.tsx` mistura código e
   textos em português. Com licença dupla, era ambíguo dizer o que valia para cada
   parte. Com uma licença única, todo o repositório segue a mesma regra, sem
   precisar decidir caso a caso.

## O que está coberto

**Tudo:**

```
Código:      src/**/*.ts · src/**/*.tsx · scripts/*.mjs
             index.html · vite.config.ts · tsconfig*.json · public/sw.js
Conteúdo:    src/data/**  (countries, flows, wars, sources, companies, tours, theory, …)
             src/lib/marx.ts · src/lib/companyMetrics.ts
             THEORY.md · DATA-GUIDELINES.md · DATA-STANDARD.md
             WIREFRAME.md · TODO.md · README.md · SECURITY.md
             textos de interface exibidos no app
```

## Como citar (atribuição)

> Fonte: **Capital Blocks — A Anatomia do Capitalismo Global**,
> <https://github.com/Leonyantunes/capital-blocks>.
> Licenciado sob CC BY-NC-SA 4.0.

## Aviso sobre os dados

Esta licença cobre o **material** deste repositório. Os **dados econômicos e
estatísticos** citados pela aplicação pertencem às instituições que os produzem
(FMI, ONU, BIS, SIPRI, Banco Central, IBGE…), que têm seus próprios termos de uso —
a lista completa está em `src/data/sources.ts` e no Módulo 10 do app. Este projeto
**não** redistribui a posse desses dados: cita, agrega e computa sobre eles, sempre
com fonte e ano.

O texto legal completo da licença está no arquivo [`LICENSE`](LICENSE), e o código
legal oficial (em inglês) está em <https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode>.
