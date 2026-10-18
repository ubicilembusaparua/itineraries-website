import { describe, expect, it } from 'vitest'
import { marked } from 'marked'
import source from '../../itinerary_list/itineraries.MD?raw'
import { itineraries, parseItineraries } from './itineraries.js'

describe('itinerary Markdown data', () => {
  it('reads five itineraries, preserving the source headings and schedule rows', () => {
    const headingsAndTables = marked.lexer(source)
      .filter((token) => token.type === 'heading' && token.depth === 2 && /^\d+\.\s/.test(token.text))
    const tables = marked.lexer(source).filter((token) => token.type === 'table')

    expect(itineraries).toHaveLength(5)
    expect(itineraries.map(({ title }) => title)).toEqual(headingsAndTables.map(({ text }) => text.replace(/^\d+\.\s*/, '')))
    expect(itineraries.map(({ stops }) => stops.map(({ time, name, activity }) => [time, name, activity])))
      .toEqual(tables.map(({ rows }) => rows.map((row) => row.map(({ text }) => text))))
  })

  it('keeps the source metadata, non-ASCII time ranges, and Saturday-only availability', () => {
    expect(itineraries[0]).toMatchObject({
      bestFor: 'street food, history, and photography',
      start: '08:00, Saturday or Sunday',
      startTime: '08:00',
      finish: 'around 13:00',
    })
    expect(itineraries[0].stops[0].time).toBe('08:00–09:15')
    expect(itineraries[4]).toMatchObject({ startTime: '07:00', availability: 'Saturday only', finish: 'around 12:30' })
  })

  it('keeps each itinerary note and the source links attached to the correct itinerary', () => {
    const sections = marked.lexer(source)
      .map((token, index, tokens) => ({ token, index, tokens }))
      .filter(({ token }) => token.type === 'heading' && token.depth === 2 && /^\d+\.\s/.test(token.text))
      .map(({ index, tokens }, sectionIndex, headings) => {
        const end = headings[sectionIndex + 1]?.index ?? tokens.length
        const section = tokens.slice(index + 1, end)
        const tableIndex = section.findIndex((token) => token.type === 'table')
        return section.slice(tableIndex + 1).filter((token) => token.type === 'paragraph').map(({ text }) => text)
      })

    expect(itineraries.map(({ notes }) => notes.map(({ text }) => text))).toEqual(sections)
    expect(itineraries[0].notes).toHaveLength(0)
    expect(itineraries[1].notes[0].text).toContain('weekend hours of 09:00–22:00')
    expect(itineraries[1].notes[0].links).toEqual([
      { label: 'Perpustakaan Jakarta listing', href: 'https://perpustakaan.jakarta.go.id/supports/about-us' },
    ])
    expect(itineraries[2].notes[0].links[0].href).toBe('https://tebetecopark.jakarta.go.id/v144/t101/informasi')
    expect(itineraries[3].notes[0].links[0].href).toBe('https://www.museumnasional.or.id/layanan-blu/')
    expect(itineraries[4].notes[0].links.map(({ href }) => href)).toEqual([
      'https://pusat.jakarta.go.id/kelurahan/kelurahan-gelora/fasilitas/fasilitas-taman-hutan-kota/taman-hutan-kota',
      'https://www.netherlandsandyou.nl/web/indonesia/visit',
    ])
    expect(parseItineraries(source)).toHaveLength(5)
  })
})
