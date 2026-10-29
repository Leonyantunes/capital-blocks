import { describe, expect, it } from 'vitest'
import { COUNTRIES } from '../data/countries'
import { COUNTRIES_GEOJSON, ISO_TO_BLOC } from '../lib/world'

describe('contratos de picking do mapa GPU', () => {
  it('todo país renderizado e mapeado resolve para um drawer editorial válido', () => {
    const drawerIds = new Set(COUNTRIES.map((country) => country.id))
    const renderedMappings = (COUNTRIES_GEOJSON.features ?? [])
      .map((feature: { id?: string | number | null }) =>
        feature.id === null || feature.id === undefined ? null : ISO_TO_BLOC[String(feature.id)],
      )
      .filter((id: string | null | undefined): id is string => !!id)

    expect(renderedMappings.length).toBeGreaterThan(30)
    expect(renderedMappings.every((id: string) => drawerIds.has(id))).toBe(true)
  })

  it('todo destino declarado em ISO_TO_BLOC corresponde a um drawer editorial válido', () => {
    const drawerIds = new Set(COUNTRIES.map((country) => country.id))
    const invalid = [...new Set(Object.values(ISO_TO_BLOC))].filter((id) => !drawerIds.has(id))
    expect(invalid).toEqual([])
  })

  it('territórios sem ISO numérico não são tratados como drawer inexistente', () => {
    const unmapped = (COUNTRIES_GEOJSON.features ?? []).filter(
      (feature: { id?: string | number | null }) => feature.id === null || feature.id === undefined,
    )
    expect(unmapped.length).toBeGreaterThan(0)
    expect(unmapped.every((feature: { properties?: { name?: string } }) => !!feature.properties?.name)).toBe(true)
  })
})
