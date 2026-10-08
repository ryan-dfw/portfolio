# portfolio

One page of horizontal project lanes. React + TypeScript + Vite.

```
npm install
npm run dev
```

## Editing projects

Everything lives in `src/data/`:

- `projects.ts`: `lanes` (lane order), `projects` (order within a lane = array order), `aiLabels`
- `site.ts`: name, tagline, header links
- `types.ts`: the `Project` shape, with comments

To move a project to another lane, change `lane`. A lane with no projects is hidden.
Each project's `id` is its URL hash, so `/#raincal` opens that card.

## Screenshots

Name PNGs what they should be called (e.g. `steelwise01.png`), drop them into `public/png_in/`, then:

```
npm run shots
```

Each `name.png` becomes `public/shots/name.webp` (full size, opened when a screenshot is clicked) and `name_thumb.webp` (cards and gallery), and the PNG moves to `deleteme/shots/` (gitignored, safe to empty). Settings live at the top of `scripts/shots.mjs`; with `sharp` pinned to an exact version, the same PNG always gives the same files.

List the full-size `.webp` in `media` on the project; the `_thumb` path is derived. The first one is the card image; with two or more, the open card gets a swipeable gallery.

```ts
media: [
  { landscape: "/shots/raincal01.webp", portrait: "/shots/raincal01-tall.webp", alt: "Week view" },
  { landscape: "/shots/raincal02.webp", alt: "Year view" },
],
```

- `kind: "phone"` uses `portrait` inside a device frame.
- `kind: "web"` uses `landscape` on wide screens and `portrait` (a mobile screenshot) at 640px and below; without a `portrait`, the landscape shot is letterboxed.
- `kind: "desktop"` uses `landscape` only.

Screenshots sit inset on a stage tinted by the project's `hue`. Anything missing shows a placeholder of the right shape.
