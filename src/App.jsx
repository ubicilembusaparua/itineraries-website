import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import './App.css'
import { choiceMessage, itineraries } from './data/itineraries.js'

const fanOffsets = [-410, -205, 0, 205, 410]
const fanAngles = [-13, -7, 0, 7, 13]

function PhotoPlaceholder({ index, large = false }) {
  return (
    <div className={`photo-placeholder photo-${index + 1}${large ? ' photo-large' : ''}`} aria-label="Photo placeholder">
      <span className="photo-sun" aria-hidden="true" />
      <span className="photo-hill photo-hill-back" aria-hidden="true" />
      <span className="photo-hill photo-hill-front" aria-hidden="true" />
      <span className="photo-label">Jakarta, out and about</span>
    </div>
  )
}

function ItineraryCard({ itinerary, index, active, selected, reducedMotion, compact, stackPosition, onSelect, onNavigate, onOpen, onPointerInteraction, cardRef }) {
  return (
    <motion.button
      ref={cardRef}
      type="button"
      className={`travel-card${active ? ' is-active' : ''}${selected ? ' is-selected' : ''}`}
      style={{ zIndex: active ? 10 : index + 1, '--fan-angle': `${fanAngles[index]}deg` }}
      layoutId={reducedMotion ? undefined : `itinerary-card-${itinerary.id}`}
      initial={reducedMotion ? false : { opacity: 0, y: 50, scale: 0.92 }}
      animate={{
        opacity: 1,
        x: compact ? stackPosition * 4 : fanOffsets[index],
        y: compact ? (active ? -8 : 8 + Math.min(Math.abs(stackPosition), 3) * 4) : (active ? -28 : 0),
        scale: compact ? (active ? 1.02 : 1 - Math.min(Math.abs(stackPosition), 3) * 0.01) : (active ? 1.07 : 1),
        rotate: compact ? Math.max(-2, Math.min(2, stackPosition * 0.5)) : fanAngles[index],
      }}
      transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 21, delay: active ? 0 : index * 0.04 }}
      onHoverStart={() => onSelect(index, false)}
      onFocus={() => onSelect(index, false)}
      onClick={() => onOpen(index)}
      onPointerDown={(event) => {
        if (compact) event.currentTarget.setPointerCapture(event.pointerId)
        onPointerInteraction('pointerdown', event)
      }}
      onPointerUp={(event) => onPointerInteraction('pointerup', event)}
      onPointerCancel={() => onPointerInteraction('pointercancel')}
      onClickCapture={(event) => onPointerInteraction('clickcapture', event)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(index)
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          onNavigate(index + 1)
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()
          onNavigate(index - 1)
        }
      }}
      aria-label={`Open ${itinerary.title}`}
      aria-pressed={selected}
    >
      <PhotoPlaceholder index={index} />
      <span className="card-body">
        <span className="card-index">Plan {String(index + 1).padStart(2, '0')}</span>
        <span className="card-title">{itinerary.title}</span>
        <span className="card-best-for">{itinerary.bestFor}</span>
        <span className="card-times">
          <span><small>START</small>{itinerary.startTime}</span>
          <span><small>FINISH</small>{itinerary.finish}</span>
        </span>
        {itinerary.availability && <span className="card-availability">{itinerary.availability}</span>}
        <span className="card-preview">{itinerary.stops[0]?.activity}</span>
        <span className="card-open-hint">Open this plan <span aria-hidden="true">↗</span></span>
      </span>
    </motion.button>
  )
}

function ItineraryView({ itinerary, index, reducedMotion, onClose, closeRef }) {
  const [copyStatus, setCopyStatus] = useState('')
  const copyTimer = useRef(null)
  const message = choiceMessage(itinerary.title)

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  async function copyMessage() {
    window.clearTimeout(copyTimer.current)
    try {
      await navigator.clipboard.writeText(message)
      setCopyStatus('Message copied.')
    } catch {
      setCopyStatus('Could not copy the message. Please try again.')
      return
    }
    copyTimer.current = window.setTimeout(() => setCopyStatus(''), 2500)
  }

  return (
    <motion.div
      className="dialog-backdrop"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? undefined : { opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="itinerary-title"
        className="itinerary-dialog"
        layoutId={reducedMotion ? undefined : `itinerary-card-${itinerary.id}`}
        initial={reducedMotion ? false : { opacity: 0, y: 36, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reducedMotion ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 180, damping: 24, duration: reducedMotion ? 0 : undefined }}
      >
        <button ref={closeRef} className="close-button" type="button" aria-label="Close itinerary" onClick={onClose}>×</button>
        <header className="dialog-header">
          <p className="eyebrow">Jakarta · Plan {String(index + 1).padStart(2, '0')}</p>
          <h1 id="itinerary-title">{itinerary.title}</h1>
          <p className="dialog-meta">Starts {itinerary.start} <span aria-hidden="true">·</span> finishes {itinerary.finish}</p>
          <PhotoPlaceholder index={index} large />
        </header>

        <div className="dialog-content">
          <section className="schedule-section" aria-labelledby="schedule-heading">
            <div className="section-heading">
              <p className="eyebrow">Your morning, step by step</p>
              <h2 id="schedule-heading">The plan</h2>
            </div>
            <ol className="timeline">
              {itinerary.stops.map((stop) => (
                <li className="timeline-stop" key={`${stop.time}-${stop.name}`}>
                  <time>{stop.time}</time>
                  <div>
                    <h3>{stop.name}</h3>
                    <p>{stop.activity}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {itinerary.notes.length > 0 && (
            <section className="notes-section" aria-labelledby="notes-heading">
              <p className="eyebrow">Good to know</p>
              <h2 id="notes-heading">Notes & links</h2>
              {itinerary.notes.map((note) => (
                <p className="source-note" key={note.text} dangerouslySetInnerHTML={{ __html: note.html }} />
              ))}
            </section>
          )}

          <section className="choose-section" aria-label="Choose this itinerary">
            <div>
              <p className="eyebrow">Sounds like your kind of morning?</p>
              <p className="choice-caption">Send this plan or copy the message for another chat.</p>
            </div>
            <div className="choice-actions">
              <a className="button button-primary" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">Choose this itinerary <span aria-hidden="true">↗</span></a>
              <button className="button button-secondary" type="button" onClick={copyMessage}>Copy message</button>
              <span className="copy-status" aria-live="polite" role={copyStatus ? 'status' : undefined}>{copyStatus}</span>
            </div>
          </section>
        </div>
      </motion.section>
    </motion.div>
  )
}

export default function App() {
  const reducedMotion = useReducedMotion() === true
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(max-width: 900px)').matches)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const cardRefs = useRef([])
  const swipeStart = useRef(null)
  const suppressClick = useRef(false)
  const closeRef = useRef(null)
  const wasOpen = useRef(false)
  const selectedItinerary = itineraries[selectedIndex]
  function chooseCard(index) { setActiveIndex(index) }

  function handleCardPointer(type, event) {
    if (!compact) return
    if (type === 'pointerdown') {
      swipeStart.current = event.clientX
    }
    if (type === 'pointercancel') swipeStart.current = null
    if (type === 'pointerup' && swipeStart.current !== null) {
      const distance = event.clientX - swipeStart.current
      swipeStart.current = null
      if (Math.abs(distance) > 45) {
        suppressClick.current = true
        setActiveIndex((current) => Math.max(0, Math.min(itineraries.length - 1, current + (distance < 0 ? 1 : -1))))
      }
    }
    if (type === 'clickcapture' && suppressClick.current) {
      event.preventDefault()
      event.stopPropagation()
      suppressClick.current = false
    }
  }

  function navigateCard(index) {
    const nextIndex = Math.max(0, Math.min(itineraries.length - 1, index))
    setActiveIndex(nextIndex)
    cardRefs.current[nextIndex]?.focus()
  }

  function openItinerary(index = selectedIndex) {
    setSelectedIndex(index)
    setActiveIndex(index)
    setIsOpen(true)
  }

  function closeItinerary() {
    setIsOpen(false)
  }

  useEffect(() => {
    const media = window.matchMedia?.('(max-width: 900px)')
    if (!media) return undefined
    const updateCompact = () => setCompact(media.matches)
    media.addEventListener('change', updateCompact)
    return () => media.removeEventListener('change', updateCompact)
  }, [])

  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus()
    } else if (wasOpen.current) {
      cardRefs.current[selectedIndex]?.focus()
    }
    wasOpen.current = isOpen
  }, [isOpen, selectedIndex])

  useEffect(() => {
    if (!isOpen) return undefined
    function handleKeyDown(event) {
      if (event.key === 'Escape') closeItinerary()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <main className="app-shell">
      <section className="intro" id="top">
        <div>
          <p className="eyebrow">Five ways to wander Jakarta</p>
          <h1>Pick a morning<br /><span>that feels like you.</span></h1>
        </div>
        <p className="intro-note">A little fresh air, something good to eat, and time to catch up. Choose a card to peek inside.</p>
      </section>

      <section className="browse-section" aria-label="Browse itineraries">
        <div
          className={`fan${compact ? ' is-compact' : ''}`}
          aria-label="Five itinerary cards"
        >
          {itineraries.map((itinerary, index) => (
            <ItineraryCard
              key={itinerary.id}
              itinerary={itinerary}
              index={index}
              active={activeIndex === index}
              selected={selectedIndex === index}
              stackPosition={index - activeIndex}
              reducedMotion={reducedMotion}
              compact={compact}
              onSelect={chooseCard}
              onNavigate={navigateCard}
              onOpen={openItinerary}
              onPointerInteraction={handleCardPointer}
              cardRef={(element) => { cardRefs.current[index] = element }}
            />
          ))}
        </div>

      </section>

      <AnimatePresence>
        {isOpen && selectedItinerary && (
          <ItineraryView
            itinerary={selectedItinerary}
            index={selectedIndex}
            reducedMotion={reducedMotion}
            closeRef={closeRef}
            onClose={closeItinerary}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
