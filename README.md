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

Put files in `public/shots/` and set `media` on the project:

```ts
media: { landscape: "/shots/raincal-wide.webp", portrait: "/shots/raincal-tall.webp", alt: "Week view" }
```

- `kind: "phone"` uses `portrait` inside a device frame.
- `kind: "web"` uses `landscape` on wide screens and `portrait` (a mobile screenshot) at 640px and below.
- `kind: "desktop"` uses `landscape` only.

Anything missing shows a placeholder of the right shape. `hue` tints the placeholder and stage.
