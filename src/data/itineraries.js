import { marked } from 'marked'
import itineraryMarkdown from '../../itinerary_list/itineraries.MD?raw'

function findLinks(tokens, links = []) {
  for (const token of tokens ?? []) {
    if (token.type === 'link') links.push({ label: token.text, href: token.href })
    findLinks(token.tokens, links)
  }
  return links
}

export function parseItineraries(markdown) {
  const tokens = marked.lexer(markdown)
  const headings = tokens
    .map((token, index) => ({ token, index }))
    .filter(({ token }) => token.type === 'heading' && token.depth === 2 && /^\d+\.\s/.test(token.text))

  return headings.map(({ token: heading, index }, itineraryIndex) => {
    const end = headings[itineraryIndex + 1]?.index ?? tokens.length
    const section = tokens.slice(index + 1, end)
    const metadata = section.find((token) => token.type === 'paragraph' && token.text.startsWith('**Best for:**'))
    const table = section.find((token) => token.type === 'table')
    const fields = metadata?.text.match(/^\*\*Best for:\*\* (.*?) · \*\*Start:\*\* (.*?) · \*\*Finish:\*\* (.*)$/)
    const start = fields?.[2].replaceAll('**', '') ?? ''
    const [startTime, ...availabilityParts] = start.split(', ')
    const tableIndex = section.indexOf(table)
    const noteTokens = tableIndex < 0 ? [] : section.slice(tableIndex + 1).filter((token) => token.type === 'paragraph')

    return {
      id: String(itineraryIndex + 1),
      title: heading.text.replace(/^\d+\.\s*/, ''),
      bestFor: fields?.[1] ?? '',
      start,
      startTime,
      availability: availabilityParts.join(', '),
      finish: fields?.[3] ?? '',
      stops: (table?.rows ?? []).map(([time, name, activity]) => ({
        time: time.text,
        name: name.text,
        activity: activity.text,
      })),
      notes: noteTokens.map((note) => ({
        text: note.text,
        html: marked.parseInline(note.text),
        links: findLinks(note.tokens),
      })),
    }
  })
}

export const itineraries = parseItineraries(itineraryMarkdown)

export function choiceMessage(title) {
  return `I'd love to choose: ${title}. Can we make this happen?`
}
