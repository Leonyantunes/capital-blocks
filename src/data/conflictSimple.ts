export type ConflictSimpleId = 'semis' | 'energia' | 'reprimaria'
export type ConflictSimpleLang = 'pt' | 'en' | 'es'

const COPY: Record<ConflictSimpleId, Record<ConflictSimpleLang, string>> = {
  semis: {
    pt: 'Os chips mais avançados estão concentrados em poucas empresas e países. EUA e China disputam acesso a essas fábricas, máquinas e tecnologias; a TSMC responde por mais de 90% da lógica de ponta na referência usada.',
    en: 'The most advanced chips are concentrated in a few firms and countries. The U.S. and China compete over access to these factories, machines, and technologies; TSMC accounts for more than 90% of leading-edge logic in the cited source.',
    es: 'Los chips más avanzados están concentrados en pocas empresas y países. EE. UU. y China disputan el acceso a estas fábricas, máquinas y tecnologías; TSMC representa más del 90% de la lógica de vanguardia en la fuente citada.',
  },
  energia: {
    pt: 'Sanções e guerra mudaram as rotas de petróleo e gás russos. A Rússia vendeu mais para a Ásia e a Europa buscou outros fornecedores, alterando custos de energia.',
    en: 'Sanctions and war changed Russian oil and gas routes. Russia sold more to Asia while Europe sought other suppliers, changing energy costs.',
    es: 'Las sanciones y la guerra cambiaron las rutas del petróleo y gas rusos. Rusia vendió más a Asia y Europa buscó otros proveedores, cambiando los costos de energía.',
  },
  reprimaria: {
    pt: 'O Brasil passou a depender mais de grãos e minérios e tem uma grande população fora do emprego formal ou subocupada. Isso ajuda a explicar por que salários e poder de negociação podem ficar pressionados.',
    en: 'Brazil became more dependent on grain and mineral exports and has a large population outside formal employment or underemployed. This helps explain pressure on wages and bargaining power.',
    es: 'Brasil pasó a depender más de granos y minerales y tiene una gran población fuera del empleo formal o subempleada. Esto ayuda a explicar la presión sobre salarios y poder de negociación.',
  },
}

export function conflictSimpleForLang(id: ConflictSimpleId, lang: ConflictSimpleLang): string {
  return COPY[id][lang]
}
