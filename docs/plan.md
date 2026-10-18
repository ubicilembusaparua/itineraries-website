# Itinerary showcase plan

## Goal

Create a playful website where a friend can browse five Jakarta morning itineraries and pick the one that suits her best.

## Content

- Use [`itinerary_list/itineraries.md`](../itinerary_list/itineraries.md) as the source for all five itineraries.
- Keep the itinerary wording from the Markdown, including times, stops, activities, and relevant notes.
- Use a photo for each itinerary card. Show photo placeholders until the final images are provided.

## Experience

1. Show all five travel cards together in a fan, like cards held in one hand. Use the [card fan demo](https://codefronts.com/components/css-stacked-cards/css-stacked-cards-hover-reveal/) as the interaction reference.
2. Hovering or tapping a card lifts it forward and shows a short preview using the Markdown's wording. The other cards remain visible and selectable.
3. Opening the selected card expands it into a full-screen itinerary view. Present its stops as a vertical timeline, with a large photo at the top.
4. Closing the full-screen view returns to the card fan so she can continue browsing.
5. Place a **Choose this itinerary** button in the full-screen view. It prepares a WhatsApp message naming the chosen itinerary; a **Copy message** option supports other chat apps. Use placeholder message wording for now.

## Visual direction

- Playful card game movement with the look of travel cards, rather than traditional playing cards.
- Make the card fan and full-screen view work on both phones and computers.

## Constraints

- No backend service or saved votes. The friend sends her choice through WhatsApp or another chat app.

## Tech stack

- Vite and React for the static, interactive website.
- Motion for the card fan, selection, and full-screen transitions.
- CSS for the visual styling and responsive layouts.
- Marked to parse the five itineraries from the existing Markdown file.

## Completion checks

- All five itineraries are available from the fan, and each preview and full-screen view matches the Markdown.
- A card can be selected, opened, closed, and replaced by another card on both phone and desktop layouts.
- Choosing any itinerary prepares a message with the correct title, and copying that message works.
