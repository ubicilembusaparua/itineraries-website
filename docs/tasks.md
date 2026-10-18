# Groomed itinerary website backlog

## 1. Set up the empty project

### Goal

Show an empty app screen at the site entry point, with a working project setup, passing smoke test, and static production build for the itinerary work that follows.

### Acceptance criteria

- [x] Opening the site entry point displays the app shell without an error screen.
- [x] The app shell contains no itinerary cards or itinerary content.

### Out of scope

- None. No work has been moved from this task.

### Constraints

- Use Vite and React, as specified in [the plan](plan.md).
- Keep the app static; do not add a backend.

## 2. Read the five itineraries from Markdown

### Goal

Make the five itineraries in `itinerary_list/itineraries.MD` available to the app with their source wording and details intact.

### Acceptance criteria

- [x] The app displays five itinerary titles, each matching one heading in the source Markdown.
- [x] Each itinerary's best-for text, start and finish times, ordered stops, activities, notes, and source links match the source Markdown wherever those fields are present.
- [x] The second itinerary displays its library-hours note and link; the third, fourth, and fifth display their source notes and links.
- [x] The fifth itinerary displays “Saturday only” as its availability.
- [x] Time ranges and non-ASCII punctuation render as readable text.

### Out of scope

- None. No work has been moved from this task.

### Constraints

- Treat `itinerary_list/itineraries.MD` as the source of truth; preserve its wording and order.
- Use Marked, as specified in [the plan](plan.md).

## 3. Build the travel cards

### Goal

Show one recognizable card for each itinerary with a short preview of its source content.

### Acceptance criteria

- [x] The card view contains exactly five cards, in the same order as the source Markdown.
- [x] Each card shows the matching title, best-for text, start and finish times, and a photo placeholder.
- [x] Each card's short preview uses wording from that itinerary's Markdown content.
- [x] The five cards are visually distinguishable as travel cards, with the playful card-game styling described in [the plan](plan.md).

### Out of scope

- None. No work has been moved from this task.

### Constraints

- Use the itinerary data from task 2; do not rewrite the source itinerary wording.
- Use CSS for styling. Final photos are not provided, so use placeholders.

## 4. Arrange the five cards in a fan

### Goal

Keep all five cards visible together and make each one selectable on phone and desktop screens.

### Acceptance criteria

- [x] At a 375 CSS-pixel-wide viewport, all five card faces or selectable card tabs are visible, and each can be selected.
- [x] At a 1280 CSS-pixel-wide viewport, all five cards appear in a fan and each can be selected.
- [x] Selecting any card does not make the other four unreachable.
- [x] Card order matches the source itinerary order at both viewport widths.

### Out of scope

- None. No work has been moved from this task.

### Constraints

- Follow the overall fan shape in [the plan](plan.md).
- Keep each card's click or tap target usable at both viewport widths.

## 5. Animate the fan opening

### Goal

Animate the cards from a pile into their final fan arrangement without changing their order or availability.

### Acceptance criteria

- [x] On initial load with motion enabled, the cards visibly move from a pile into the fan and settle in source order.
- [x] After the animation settles, all five cards remain visible and selectable.
- [x] With reduced motion enabled, the cards appear directly in the fan without the entrance movement.
- [x] If the entrance animation is skipped, the final fan still shows all five selectable cards.

### Out of scope

- None. No work has been moved from this task.

### Constraints

- Use Motion for the animation, as specified in [the plan](plan.md).
- Do not make selection depend on the entrance animation completing.

## 6. Select a card and show its preview

### Goal

Let the friend select any itinerary, see its preview, and switch directly to another card while keeping the fan available.

### Acceptance criteria

- [x] Hovering or keyboard-focusing a card raises it above neighboring cards and shows that card's preview.
- [x] Tapping a card selects it and shows its preview without requiring a hover state.
- [x] Selecting a different card moves the raised state and preview to the new card.
- [x] The unselected cards remain visible and selectable while a preview is shown.

### Out of scope

- None. No work has been moved from this task.

### Constraints

- Build previews from the source wording in `itinerary_list/itineraries.MD`.
- Keep touch selection usable on phones.

## 7. Build the full-screen itinerary view

### Goal

Present one itinerary's complete schedule in a readable full-screen view.

### Acceptance criteria

- [x] The view shows the selected itinerary's title, start and finish times, and a large photo placeholder at the top.
- [x] Every stop appears once, in source order, with its source time, name, and activity text.
- [x] Any notes and source links for the selected itinerary are visible in the view; itineraries without notes do not show another itinerary's notes.
- [x] The view's title, schedule, notes, and links match the selected itinerary when checked for each of the five cards.
- [x] The timeline and its text fit the phone and desktop layouts without horizontal scrolling.

### Out of scope

- None. No work has been moved from this task.

### Constraints

- Preserve the source wording from `itinerary_list/itineraries.MD`.
- Use the full-screen treatment and vertical timeline described in [the plan](plan.md).
- Use photo placeholders until final images are provided.

## 8. Connect the card to the full-screen view

### Goal

Open the selected itinerary from the fan and return to the same fan state when it closes.

### Acceptance criteria

- [x] Opening any card displays the full-screen view for that card.
- [x] With motion enabled, the selected card expands into the full-screen view; closing it reverses the transition.
- [x] Closing the view returns to the fan with the same card still identifiable as selected.
- [x] After returning, a different card can be opened and its matching itinerary is shown.
- [x] With reduced motion enabled, opening and closing still work without the expansion movement.

### Out of scope

- None. No work has been moved from this task.

### Constraints

- Use Motion for the transition, as specified in [the plan](plan.md).
- Keep the fan usable after the view closes.

## 9. Add the WhatsApp choice action

### Goal

Let the friend open WhatsApp with a prepared message naming the selected itinerary.

### Acceptance criteria

- [x] The full-screen view has a button labeled **Choose this itinerary**.
- [x] Activating the button opens a WhatsApp conversation composer with the placeholder message and selected itinerary title in the message text.
- [x] For each of the five itineraries, the prepared message contains that itinerary's exact title and no other itinerary title.
- [x] The friend can choose the WhatsApp recipient; the site does not require a recipient phone number.

### Out of scope

- None. No work has been moved from this task.

### Constraints

- Use placeholder message wording until final wording is provided.
- Do not add a backend or save votes.

## 10. Add a copy-message option

### Goal

Let the friend copy the same prepared choice message for use in another chat app.

### Acceptance criteria

- [x] The full-screen view has a **Copy message** action beside **Choose this itinerary**.
- [x] Activating it copies the same placeholder message and selected itinerary title used by the WhatsApp action.
- [x] After a successful copy, a brief visible confirmation appears.
- [x] If copying fails, no success confirmation appears and a visible failure message is shown.
- [x] For each of the five itineraries, the copied message contains that itinerary's exact title and no other itinerary title.

### Out of scope

- None. No work has been moved from this task.

### Constraints

- Do not add a backend or save votes.
- Keep both choice actions available in the full-screen view.

## 11. Finish keyboard and motion accessibility

### Goal

Make the browsing, full-screen, and choice flows usable with a keyboard and with reduced motion enabled.

### Acceptance criteria

- [x] Every card and action can receive keyboard focus, and focused controls have a visible focus indicator.
- [x] The focused card's preview is shown without requiring a pointer.
- [x] Enter or Space opens the focused card; Escape closes the full-screen view.
- [x] After closing with Escape, focus returns to the card that was opened.
- [x] With reduced motion enabled, the fan, preview, full-screen view, close action, and both choice actions remain usable.

### Out of scope

- None. No work has been moved from this task.

### Constraints

- Follow the keyboard and reduced-motion behavior described in [the plan](plan.md).
- Preserve visible focus while cards overlap in the fan.

## 12. Verify the complete static site

### Goal

Confirm the finished site presents all five source itineraries and supports the full browse, choose, and return flow on phone and desktop layouts.

### Acceptance criteria

- [x] On phone and desktop layouts, the friend can select each of the five cards, open its matching full-screen view, and return to the fan.
- [x] For every itinerary, the displayed title, schedule, activities, notes, and links match `itinerary_list/itineraries.MD` wherever present.
- [x] For every itinerary, the WhatsApp message and copied message contain its matching title.
- [x] Keyboard navigation completes the selection, open, close, and choice flows, with focus returning to the selected card after closing.
- [x] With reduced motion enabled, the friend can complete the same browse and choice flow.
- [x] The production static build displays the same five-card experience as the development site.

### Out of scope

- None. No work has been moved from this task.

### Constraints

- Use the sources, design, and stack documented in [the plan](plan.md).
- Do not add a backend or saved votes.

## Implementation update

Implemented the twelve tasks as a static Vite and React site, including Markdown sourced itinerary cards, the fan and full-screen views, responsive and keyboard access, reduced-motion support, and WhatsApp and copy actions. `npm test` passes all 11 tests, and `npm run build` produces the static site. The acceptance checkboxes above remain open.
