import type { Lang } from './i18n'
import type { UIMode } from './store/useApp'

type Tri = [pt: string, en: string, es: string]

export function cText(lang: Lang, pt: string, en: string, es: string): string {
  return lang === 'pt' ? pt : lang === 'en' ? en : es
}

export function cMode(
  lang: Lang,
  mode: UIMode,
  simples: Tri,
  didatico: Tri,
  avancado: Tri,
): string {
  const row = mode === 'simples' ? simples : mode === 'avancado' ? avancado : didatico
  return cText(lang, row[0], row[1], row[2])
}

export function localeForLang(lang: Lang): string {
  return lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES'
}

const COUNTRIES: Record<string, [string, string]> = {
  Brasil: ['Brazil', 'Brasil'],
  EUA: ['USA', 'EE. UU.'],
  China: ['China', 'China'],
  Taiwan: ['Taiwan', 'Taiwán'],
  'Arábia Saudita': ['Saudi Arabia', 'Arabia Saudita'],
  'Coreia do Sul': ['South Korea', 'Corea del Sur'],
  Japão: ['Japan', 'Japón'],
  França: ['France', 'Francia'],
  'Países Baixos (UE)': ['Netherlands (EU)', 'Países Bajos (UE)'],
  Dinamarca: ['Denmark', 'Dinamarca'],
  Suíça: ['Switzerland', 'Suiza'],
  Alemanha: ['Germany', 'Alemania'],
  'Reino Unido': ['United Kingdom', 'Reino Unido'],
  'Austrália': ['Australia', 'Australia'],
  'Austrália/UK': ['Australia/UK', 'Australia/Reino Unido'],
  Luxemburgo: ['Luxembourg', 'Luxemburgo'],
  Irlanda: ['Ireland', 'Irlanda'],
  Suécia: ['Sweden', 'Suecia'],
  'Argentina/Uruguai': ['Argentina/Uruguay', 'Argentina/Uruguay'],
  Itália: ['Italy', 'Italia'],
  Bélgica: ['Belgium', 'Bélgica'],
  Índia: ['India', 'India'],
  México: ['Mexico', 'México'],
  Noruega: ['Norway', 'Noruega'],
  Espanha: ['Spain', 'España'],
  Canadá: ['Canada', 'Canadá'],
  'Países Baixos/UE': ['Netherlands/EU', 'Países Bajos/UE'],
  'França/UE': ['France/EU', 'Francia/UE'],
}

export function companyCountry(lang: Lang, value: string): string {
  if (lang === 'pt') return value
  return COUNTRIES[value]?.[lang === 'en' ? 0 : 1] ?? value
}

const SECTORS: Record<string, [string, string]> = {
  Energia: ['Energy', 'Energía'],
  'Energia / Distribuição': ['Energy / Distribution', 'Energía / Distribución'],
  'Petróleo / Energia': ['Oil / Energy', 'Petróleo / Energía'],
  'Petróleo / Energia estatal': ['State-owned oil / Energy', 'Petróleo estatal / Energía'],
  'Petróleo upstream': ['Upstream oil', 'Petróleo upstream'],
  'Extrativa Mineral': ['Mining', 'Minería'],
  Mineração: ['Mining', 'Minería'],
  'Mineração estatal': ['State-owned mining', 'Minería estatal'],
  Siderurgia: ['Steel', 'Siderurgia'],
  'Siderurgia global': ['Global steel', 'Siderurgia global'],
  Petroquímica: ['Petrochemicals', 'Petroquímica'],
  'Produtos químicos': ['Chemicals', 'Productos químicos'],
  'Celulose e Papel': ['Pulp & Paper', 'Celulosa y Papel'],
  'Alimentos e Bebidas': ['Food & Beverages', 'Alimentos y Bebidas'],
  'Alimentos globalizados': ['Global food', 'Alimentos globalizados'],
  Agronegócio: ['Agribusiness', 'Agronegocio'],
  'Bens de Capital': ['Capital Goods', 'Bienes de Capital'],
  'Bens de Capital / Ônibus': ['Capital Goods / Buses', 'Bienes de Capital / Autobuses'],
  Aeroindústria: ['Aerospace', 'Aeroindustria'],
  Aeroespacial: ['Aerospace', 'Aeroespacial'],
  'Aeroespacial / Defesa': ['Aerospace / Defense', 'Aeroespacial / Defensa'],
  Autoindústria: ['Automotive', 'Automoción'],
  'Autoindústria premium': ['Premium automotive', 'Automoción premium'],
  Autopeças: ['Auto parts', 'Autopartes'],
  Varejo: ['Retail', 'Comercio minorista'],
  'Varejo global': ['Global retail', 'Comercio minorista global'],
  'Varejo atacarejo': ['Wholesale retail', 'Mayorista-minorista'],
  'Varejo / Joalheria': ['Retail / Jewelry', 'Comercio minorista / Joyería'],
  'Varejo / Bebidas / Logística': ['Retail / Beverages / Logistics', 'Comercio / Bebidas / Logística'],
  'Varejo (construção)': ['Home improvement retail', 'Comercio de mejoras del hogar'],
  Telecom: ['Telecom', 'Telecomunicaciones'],
  Telecomunicações: ['Telecommunications', 'Telecomunicaciones'],
  'Bancário / Portador de Juros': ['Banking / Interest-bearing capital', 'Bancario / Capital portador de interés'],
  'Bancário portador de juros': ['Interest-bearing banking', 'Banca portadora de interés'],
  'Bancário global': ['Global banking', 'Banca global'],
  'Bancário estatal': ['State-owned banking', 'Banca estatal'],
  Bancário: ['Banking', 'Bancario'],
  'Bancário / Gestão de patrimônio': ['Banking / Wealth management', 'Banca / Gestión patrimonial'],
  'Banco de investimento': ['Investment banking', 'Banca de inversión'],
  'Seguros / Serviços financeiros': ['Insurance / Financial services', 'Seguros / Servicios financieros'],
  'Seguros / Gestão de ativos': ['Insurance / Asset management', 'Seguros / Gestión de activos'],
  'Conglomerado / Seguros': ['Conglomerate / Insurance', 'Conglomerado / Seguros'],
  'Conglomerado / Energia': ['Conglomerate / Energy', 'Conglomerado / Energía'],
  'Pagamentos': ['Payments', 'Pagos'],
  'Pagamentos (rede de cartões)': ['Payments (card network)', 'Pagos (red de tarjetas)'],
  'Cartões / Bancário': ['Cards / Banking', 'Tarjetas / Banca'],
  'Gestora de ativos': ['Asset manager', 'Gestora de activos'],
  'Infraestrutura de mercado': ['Market infrastructure', 'Infraestructura de mercado'],
  Plataformas: ['Platforms', 'Plataformas'],
  'Plataformas / Ads': ['Platforms / Ads', 'Plataformas / Publicidad'],
  'Plataformas / Social': ['Platforms / Social', 'Plataformas / Social'],
  'Plataformas / Games': ['Platforms / Games', 'Plataformas / Videojuegos'],
  'Plataforma de viagens': ['Travel platform', 'Plataforma de viajes'],
  'Plataforma de mobilidade': ['Mobility platform', 'Plataforma de movilidad'],
  'Delivery / Plataforma': ['Delivery / Platform', 'Delivery / Plataforma'],
  'E-commerce / Cloud': ['E-commerce / Cloud', 'Comercio electrónico / Nube'],
  'E-commerce (plataforma)': ['E-commerce platform', 'Plataforma de comercio electrónico'],
  'E-commerce (Temu)': ['E-commerce (Temu)', 'Comercio electrónico (Temu)'],
  'E-commerce LatAm': ['LatAm e-commerce', 'Comercio electrónico LatAm'],
  'Cloud / Software': ['Cloud / Software', 'Nube / Software'],
  'Cloud / Banco de dados': ['Cloud / Database', 'Nube / Base de datos'],
  Software: ['Software', 'Software'],
  'Software criativo': ['Creative software', 'Software creativo'],
  'Software financeiro': ['Financial software', 'Software financiero'],
  'Software empresarial': ['Enterprise software', 'Software empresarial'],
  'Software / Análise de dados': ['Software / Data analytics', 'Software / Analítica de datos'],
  'SaaS / CRM': ['SaaS / CRM', 'SaaS / CRM'],
  'SaaS empresarial': ['Enterprise SaaS', 'SaaS empresarial'],
  'TI / Consultoria': ['IT / Consulting', 'TI / Consultoría'],
  'TI / Terceirização global': ['IT / Global outsourcing', 'TI / Tercerización global'],
  'Semicondutores': ['Semiconductors', 'Semiconductores'],
  'Semicondutores / IA': ['Semiconductors / AI', 'Semiconductores / IA'],
  'Semicondutores / IP': ['Semiconductors / IP', 'Semiconductores / PI'],
  'Semicondutores (foundry)': ['Semiconductors (foundry)', 'Semiconductores (foundry)'],
  'Semicondutores (analógico)': ['Semiconductors (analog)', 'Semiconductores (analógico)'],
  'Semicondutores (móvel)': ['Semiconductors (mobile)', 'Semiconductores (móvil)'],
  'Semicondutores (memória)': ['Semiconductors (memory)', 'Semiconductores (memoria)'],
  'Semicondutores (equipamentos)': ['Semiconductor equipment', 'Equipos para semiconductores'],
  'Litografia EUV (monopólio)': ['EUV lithography (monopoly)', 'Litografía EUV (monopolio)'],
  'Tech / Ecossistema': ['Tech / Ecosystem', 'Tecnología / Ecosistema'],
  'Eletrônicos / EV': ['Electronics / EV', 'Electrónica / VE'],
  'Eletrônicos / Entretenimento': ['Electronics / Entertainment', 'Electrónica / Entretenimiento'],
  'Semicondutores / Eletrônicos': ['Semiconductors / Electronics', 'Semiconductores / Electrónica'],
  'Montagem eletrônica': ['Electronics assembly', 'Ensamblaje electrónico'],
  'Streaming / Cultura': ['Streaming / Culture', 'Streaming / Cultura'],
  'Mídia / Streaming': ['Media / Streaming', 'Medios / Streaming'],
  'Mídia / Cultura': ['Media / Culture', 'Medios / Cultura'],
  'Farmacêutica': ['Pharmaceuticals', 'Farmacéutica'],
  'Farmacêutica / Saúde': ['Pharmaceuticals / Health', 'Farmacéutica / Salud'],
  'Farmacêutica / Agroquímica': ['Pharmaceuticals / Agrochemicals', 'Farmacéutica / Agroquímica'],
  'Farmacêutica (Ozempic)': ['Pharmaceuticals (Ozempic)', 'Farmacéutica (Ozempic)'],
  Biotecnologia: ['Biotechnology', 'Biotecnología'],
  'Biotecnologia (vacinas)': ['Biotechnology (vaccines)', 'Biotecnología (vacunas)'],
  'Ciências da vida': ['Life sciences', 'Ciencias de la vida'],
  'Saúde': ['Health', 'Salud'],
  'Saúde / Diagnóstico': ['Health / Diagnostics', 'Salud / Diagnóstico'],
  'Saúde / Farmácias': ['Health / Pharmacies', 'Salud / Farmacias'],
  'Planos de saúde': ['Health insurance', 'Seguros de salud'],
  Cosméticos: ['Cosmetics', 'Cosméticos'],
  Luxo: ['Luxury', 'Lujo'],
  Bebidas: ['Beverages', 'Bebidas'],
  'Bebidas / Snacks': ['Beverages / Snacks', 'Bebidas / Snacks'],
  Cervejaria: ['Brewing', 'Cervecería'],
  Tabaco: ['Tobacco', 'Tabaco'],
  'Consumo básico': ['Consumer staples', 'Consumo básico'],
  'Franquias alimentares': ['Food franchises', 'Franquicias de alimentos'],
  'Café / Varejo': ['Coffee / Retail', 'Café / Comercio minorista'],
  'Calçados / Vestuário': ['Footwear / Apparel', 'Calzado / Ropa'],
  Calçados: ['Footwear', 'Calzado'],
  'Fast fashion': ['Fast fashion', 'Moda rápida'],
  Logística: ['Logistics', 'Logística'],
  'Logística / Shipping': ['Logistics / Shipping', 'Logística / Transporte marítimo'],
  'Serviços petrolíferos': ['Oilfield services', 'Servicios petroleros'],
  'Serviços de guerra / energia': ['War / Energy services', 'Servicios de guerra / energía'],
  'Máquinas pesadas': ['Heavy machinery', 'Maquinaria pesada'],
  'Maquinário agrícola': ['Agricultural machinery', 'Maquinaria agrícola'],
  'Indústria / Infraestrutura': ['Industry / Infrastructure', 'Industria / Infraestructura'],
  'Energia / Automação industrial': ['Energy / Industrial automation', 'Energía / Automatización industrial'],
  'Defesa · militar-industrial': ['Defense · military-industrial', 'Defensa · militar-industrial'],
  'Serviços / Academias': ['Services / Gyms', 'Servicios / Gimnasios'],
  'Locação de veículos': ['Vehicle rental', 'Alquiler de vehículos'],
  'Construção Civil': ['Construction', 'Construcción'],
  Saneamento: ['Water & sanitation', 'Agua y saneamiento'],
  'Shoppings / Renda imobiliária': ['Shopping malls / Property income', 'Centros comerciales / Renta inmobiliaria'],
}

export function companySector(lang: Lang, value: string): string {
  if (lang === 'pt') return value
  return SECTORS[value]?.[lang === 'en' ? 0 : 1] ?? value
}

export function companySource(lang: Lang, value?: string): string | undefined {
  if (!value || lang === 'pt') return value
  if (/DFs FY2024/.test(value)) return lang === 'en' ? 'FY2024 financial statements (approx.)' : 'Estados financieros FY2024 (aprox.)'
  if (/Relatório anual FY2024/.test(value)) return lang === 'en' ? 'FY2024 annual report (approx.)' : 'Informe anual FY2024 (aprox.)'
  if (/10-K\/20-F FY2024\/25/.test(value)) return lang === 'en'
    ? '10-K/20-F FY2024/25 · market cap Dec/2025'
    : '10-K/20-F FY2024/25 · capitalización dic/2025'
  if (/estimativa \(companhia fechada\)/.test(value)) return lang === 'en' ? 'estimate (private company)' : 'estimación (empresa privada)'
  return value
}

const NOTES: Record<string, [string, string]> = {
  'br-petrobras': ['Dividends + share buybacks announced in 2024 (~US$18bn)', 'Dividendos + recompras de acciones anunciados en 2024 (~US$18 mil millones)'],
  'br-itau': ['Record profit in the history of the Brazilian banking system', 'Lucro récord en la historia del sistema bancario brasileño'],
  'br-bb': ['State-controlled bank — record historical profit', 'Banco controlado por el Estado — lucro récord histórico'],
  'br-jbs': ['Global operation: world’s largest animal-protein processor', 'Operación global: mayor procesadora de proteína animal del mundo'],
  'br-suzano': ['World’s largest eucalyptus pulp producer', 'Mayor productora mundial de celulosa de eucalipto'],
  'br-btg': ['Highest estimated average payroll in the banking sample', 'Mayor nómina media estimada de la muestra bancaria'],
  'br-ultrapar': ['Thin margin on a huge fuel-distribution volume', 'Margen estrecho sobre un enorme volumen de combustibles'],
  'br-natura': ['GAAP loss tied to Avon problems — even a giant can destroy capital', 'Pérdida GAAP ligada a problemas de Avon — incluso un gigante puede destruir capital'],
  'br-b3': ['High margin on market-trading infrastructure', 'Margen alto sobre la infraestructura de negociación'],
  'br-eletrobras': ['Hydropower rent: inherited assets generate profit with a small payroll', 'Renta hidroeléctrica: activos heredados generan lucro con una nómina pequeña'],
  'br-ifood': ['Millions of partner couriers remain outside the formal payroll', 'Millones de repartidores socios quedan fuera de la nómina formal'],
  'br-vibra': ['Brazil’s largest fuel distributor; formerly BR Distribuidora', 'Mayor distribuidora de combustibles de Brasil; antigua BR Distribuidora'],
  'br-braskem': ['Petrochemical cycle and Alagoas liabilities pressured the result', 'El ciclo petroquímico y los pasivos de Alagoas presionaron el resultado'],
  'br-multiplan': ['Rental income and stakes in shopping centers', 'Ingresos de alquiler y participaciones en centros comerciales'],
  'gl-broadcom': ['FY24 GAAP depressed by VMware amortization', 'GAAP FY24 reducido por la amortización de VMware'],
  'gl-netflix': ['Record revenue per employee in the sample', 'Ingresos por empleado récord en la muestra'],
  'gl-visa': ['Rent-like income over payment infrastructure', 'Ingreso tipo renta sobre infraestructura de pagos'],
  'gl-asml': ['World EUV monopoly — key node in the chip conflict', 'Monopolio mundial de EUV — nodo clave en el conflicto de chips'],
  'gl-intel': ['2024 GAAP loss from restructuring — even a giant can destroy capital', 'Pérdida GAAP 2024 por reestructuración — incluso un gigante puede destruir capital'],
  'gl-uber': ['2024 profit includes a one-off tax credit', 'El lucro de 2024 incluye un crédito fiscal extraordinario'],
  'gl-foxconn-hon-hai': ['One of the world’s largest electronics employers; assembles the iPhone', 'Uno de los mayores empleadores electrónicos del mundo; ensambla el iPhone'],
  'gl-byd': ['About 900k employees: one of the world’s largest auto workforces', 'Cerca de 900 mil empleados: una de las mayores plantillas automotrices del mundo'],
  'gl-lockheed-martin': ['F-35/HIMARS · backlog around US$176bn (2024)', 'F-35/HIMARS · cartera cercana a US$176 mil millones (2024)'],
  'gl-rtx-raytheon': ['Patriot/Tomahawk; FY24 GAAP affected by Powder Metal charges', 'Patriot/Tomahawk; GAAP FY24 afectado por cargos de Powder Metal'],
  'gl-blackrock': ['About US$11.5tn under management: the world’s largest asset manager', 'Aproximadamente US$11,5 billones bajo gestión: la mayor gestora de activos del mundo'],
}

export function companyNote(lang: Lang, id: string, value?: string): string | undefined {
  if (!value || lang === 'pt') return value
  return NOTES[id]?.[lang === 'en' ? 0 : 1] ?? value
}
