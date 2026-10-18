import React from 'react'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'
import { choiceMessage, itineraries } from './data/itineraries.js'

vi.mock('motion/react', async () => {
  const ReactModule = await import('react')
  const motionTag = (tag) => ReactModule.forwardRef(({ children, layoutId, initial, animate, exit, transition, whileHover, whileFocus, onHoverStart, ...props }, ref) => (
    ReactModule.createElement(tag, { ...props, ref }, children)
  ))
  return {
    AnimatePresence: ({ children }) => children,
    motion: { button: motionTag('button'), div: motionTag('div'), section: motionTag('section') },
    useReducedMotion: () => true,
  }
})

describe('itinerary browsing and choice flow', () => {
  afterEach(cleanup)

  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('renders exactly five selectable cards and updates the preview on focus and tap', () => {
    render(<App />)
    const buttons = screen.getAllByRole('button', { name: /^Select / })
    expect(buttons).toHaveLength(5)

    fireEvent.focusIn(buttons[2])
    expect(screen.getByRole('heading', { name: itineraries[2].title })).toBeInTheDocument()
    expect(screen.getAllByText(itineraries[2].stops[0].activity).length).toBeGreaterThan(0)

    fireEvent.click(buttons[4])
    expect(screen.getAllByText('Saturday only').length).toBeGreaterThan(0)
    expect(buttons[4]).toHaveAttribute('aria-pressed', 'true')
    expect(buttons[0]).toBeInTheDocument()
  })

  it.each(itineraries.map((itinerary) => [itinerary.title, itinerary]))(
    'opens the complete view and prepares the matching choice for %s',
    async (_, itinerary) => {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: `Select ${itinerary.title}` }))
      fireEvent.click(screen.getByRole('button', { name: /Open full itinerary/ }))

      const dialog = screen.getByRole('dialog')
      expect(within(dialog).getByRole('heading', { name: itinerary.title })).toBeInTheDocument()
      for (const stop of itinerary.stops) {
        expect(within(dialog).getByText(stop.time)).toBeInTheDocument()
        expect(within(dialog).getByRole('heading', { name: stop.name })).toBeInTheDocument()
        expect(within(dialog).getByText(stop.activity)).toBeInTheDocument()
      }
      const displayedNotes = [...dialog.querySelectorAll('.source-note')]
      expect(displayedNotes).toHaveLength(itinerary.notes.length)
      itinerary.notes.forEach((note, index) => {
        const expectedText = note.text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        expect(displayedNotes[index].textContent).toBe(expectedText)
        for (const link of note.links) {
          expect(within(displayedNotes[index]).getByRole('link', { name: link.label })).toHaveAttribute('href', link.href)
        }
      })

      const choose = within(dialog).getByRole('link', { name: /Choose this itinerary/ })
      expect(new URL(choose.href).searchParams.get('text')).toBe(choiceMessage(itinerary.title))
      for (const other of itineraries.filter(({ id }) => id !== itinerary.id)) {
        expect(choiceMessage(itinerary.title)).not.toContain(other.title)
      }

      fireEvent.click(within(dialog).getByRole('button', { name: 'Copy message' }))
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(choiceMessage(itinerary.title))
      expect(await within(dialog).findByRole('status')).toHaveTextContent('Message copied.')
    },
  )

  it('shows a visible failure when copying is unavailable', async () => {
    navigator.clipboard.writeText.mockRejectedValueOnce(new Error('blocked'))
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Open full itinerary/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Copy message' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Could not copy the message.')
  })

  it('opens the focused card with Enter and restores focus after Escape', () => {
    render(<App />)
    const card = screen.getByRole('button', { name: `Select ${itineraries[3].title}` })
    card.focus()
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close itinerary' })).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(card).toHaveFocus()
  })
})
