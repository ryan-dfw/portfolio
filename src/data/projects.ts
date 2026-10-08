import type { AiInvolvement, Lane, Project } from "./types";

export const lanes: Lane[] = [
  { id: "paid", label: "Paid" },
  { id: "software", label: "Software" },
  { id: "web", label: "Web" },
];

export const aiLabels: Record<AiInvolvement, { label: string; meaning: string }> = {
  hand: {
    label: "Hand-coded",
    meaning:
      "For some reason or another, i’ve written every line. If quizzed about an implementation detail, i’ll have a reasonable answer. These take me a long time….",
  },
  assisted: {
    label: "AI-assisted",
    meaning:
      "Claude handled a substantial share - most likely design implementation. I may be a bit clueless about how the CSS/XML happened, but the architecture, behavior, and hookups were my work.",
  },
  vibes: {
    label: "All vibes",
    meaning:
      "Rapid implementation was favored over codebase familiarity. Claude was handed my directives and produced implementation. What goes on in there? I’m not fully sure. It meets the requirements, but it’s due for manual review.",
  },
};

/**
 * Order within a lane = order in this array.
 * To move a project between lanes, change `lane`.
 * To add screenshots, drop files in /public/shots and list them in `media` (first = card image).
 */
export const projects: Project[] = [
  // ─── PAID ────────────────────────────────────────────────────────────
  {
    id: "nearvye",
    name: "Nearvye",
    lane: "paid",
    purpose: "Dating-type app for guests at the same event.",
    artifact: "iOS app",
    ai: "hand",
    year: "’25",
    skills: ["Swift", "BLE", "Firebase Realtime Database", "Firebase Storage", "Firebase Auth"],
    concepts: ["Proximity validation", "Mutual matching", "Data minimization"],
    note:
      "Users see nearby accounts by BLE broadcast, swiping right on accounts of interest. If interest is mutual, both users are notified. The app is purposefully lightweight and single-purpose: it stores nothing beyond what’s needed for authentication and a profile picture, and provides no messaging or other communication features. MVP built in about a month, tested with two iPhones.",
    links: { github: "private" },
    kind: "phone",
    hue: 280,
  },
  {
    id: "steelwise",
    name: "Steelwise Consulting",
    lane: "paid",
    purpose: "Buy and sell steel-industry leads.",
    artifact: "Data pipeline + website",
    ai: "assisted",
    year: "’26",
    skills: [
      "Python",
      "SQL",
      "PostgreSQL",
      "DataGrip",
      "Firebase Realtime Database",
      "TypeScript/TSX",
      "Vite",
      "LLM API",
    ],
    concepts: ["Data enrichment", "Denormalization"],
    note:
      "Consolidated 7,500+ leads from buyer spreadsheets and enriched them with addresses and product information through a Python + LLM pipeline. Sellers confirm the desired quantity is available in a region, then generate a key that unlocks those exact records for delivery to the client.",
    links: {
      github: "private",
      live: "https://steelwiseconsulting.com",
    },
    media: [
      { landscape: "/shots/steelwise01.webp", portrait: "/shots/steelwise01-tall.webp", alt: "Access-code login for purchased leads" },
      { landscape: "/shots/steelwise02.webp", portrait: "/shots/steelwise02-tall.webp", alt: "Buyer leads table with sample data" },
      { landscape: "/shots/steelwise03.webp", portrait: "/shots/steelwise03-tall.webp", alt: "Landing page" },
    ],
    kind: "web",
    hue: 205,
  },
  {
    id: "paola-book-sales",
    name: "Paola Book Sales",
    lane: "paid",
    purpose: "Sells Paola's books and manages their fulfillment.",
    artifact: "Storefront + operations dashboard",
    ai: "vibes",
    year: "’26",
    skills: [
      "TypeScript/TSX",
      "Vite",
      "Stripe Checkout",
      "Stripe API",
      "Firebase Auth",
      "Netlify",
      "Serverless functions",
    ],
    concepts: [
      "Order-state modeling",
      "Fulfillment workflows",
      "Stripe metadata",
      "Localization",
    ],
    note:
        "Built for an in-person book launch and handled about $600 in sales on launch day. The bilingual storefront takes orders through Stripe; an authenticated dashboard turns those orders into a fulfillment workflow for shipping, pickup, customer follow-up and delivery. Fulfillment state is written back to Stripe metadata, keeping Stripe as the system of record without a separate database. My admin view mocks up fake data, which is what's shown here to prevent showing anyone's personal information.",
    links: {
      github: "https://github.com/ryan-dfw/paola-book-sales",
      live: "https://paolabooksales.netlify.app",
    },
    media: [
      { landscape: "/shots/paolabook01.webp", portrait: "/shots/paolabook01-tall.webp", alt: "Storefront with the edition picker" },
      { landscape: "/shots/paolabook02.webp", portrait: "/shots/paolabook02-tall.webp", alt: "Orders dashboard showing mock data" },
      { portrait: "/shots/paolabook03-tall.webp", alt: "Order detail with fulfillment actions (mock data)" },
    ],
    kind: "web",
    hue: 345,
  },

  // ─── SOFTWARE ────────────────────────────────────────────────────────
  {
    id: "airis",
    name: "AIris",
    lane: "software",
    purpose:
        "Hijacks a screenless camera's image output, replacing its photographs with AI-generated recreations.",
    artifact: "Android app",
    ai: "assisted",
    year: "’24–’26",
    skills: [
      "Kotlin",
      "Jetpack Compose",
      "Sony Camera Remote API",
      "Android ConnectivityManager",
      "OpenAI API",
    ],
    concepts: [
      "Concurrent network interfaces",
      "Network routing",
      "Semantic reconstruction",
    ],
    note:
        "Built around a Sony QX10, which captures photographs using its physical shutter. AIris retrieves each image, generates a text description, and uses that description to create a replacement image. The Android app maintains its camera connection over Wi-Fi while routing AI requests through cellular. Originally implemented in Python and then Java, with the current end-to-end Kotlin version using a Claude-assisted UI.",
    links: {
      github: "https://github.com/ryan-dfw/airis",
      extra: [
        {
          label: "Original repo",
          href: "https://github.com/ryan-dfw/Image-Reconstruction-via-Captioning",
        },
        {
          label: "Write-up",
          href: "https://app.readytensor.ai/publications/image_reconstruction_via_captioning_HX49phI51zVP",
        },
      ],
    },
    kind: "phone",
    hue: 300,
  },
  {
    id: "pvplayer",
    name: "pvplayer",
    lane: "software",
    purpose: "Plays an album through MPD and shows each song's music video, muted and in sync.",
    artifact: "Desktop utility",
    ai: "hand",
    year: "’26",
    skills: ["Rust", "MPD", "mpv"],
    concepts: [
      "Event-driven programming",
      "State machines",
      "Playback synchronization",
    ],
    note:
        "WIP - A Rust companion to MPD that plays associated music videos through mpv while MPD handles audio. It reads video paths and timing offsets from MPD stickers, preloads upcoming videos, and schedules their playback around track transitions. It also follows MPD's pause and resume state. Video timing offsets are currently configured manually.",
    links: {
      github: "https://github.com/ryan-dfw/pvplayer",
    },
    kind: "desktop",
    hue: 25,
  },

  // ─── WEB ─────────────────────────────────────────────────────────────
  {
    id: "elm-aperture",
    name: "Elm Aperture",
    lane: "web",
    purpose: "Photography portfolio and client-facing website.",
    artifact: "Website",
    ai: "assisted",
    year: "’24–’26",
    skills: [
      "TypeScript/TSX",
      "React",
      "Vite",
      "CSS",
    ],
    concepts: [
      "Content-driven galleries",
      "Client-side routing",
      "Responsive image delivery",
    ],
    note:
        "A rebuild of my photography website, with a content architecture that derives galleries and image selections from structured data. Includes custom client-side routing, responsive image sources, and URL-addressable lightboxes with browser history support. I designed the content architecture while Claude handled the visual design. The beta is replacing the current site and still contains unfinished content.",
    links: {
      github: "https://github.com/elm-aperture/elmapt",
      live: "https://beta.elmapt.com",
      extra: [
        {
          label: "elmapt.com (current)",
          href: "https://elmapt.com",
        },
      ],
    },
    media: [
      { landscape: "/shots/elmapt01.webp", portrait: "/shots/elmapt01-tall.webp", alt: "Home page with full-bleed portrait" },
      { landscape: "/shots/elmapt02.webp", portrait: "/shots/elmapt02-tall.webp", alt: "Hotel & Hospitality gallery" },
      { landscape: "/shots/elmapt03.webp", portrait: "/shots/elmapt03-tall.webp", alt: "Lifestyle Portraits gallery" },
    ],
    kind: "web",
    hue: 40,
  },
  {
    id: "save-state-lyrics",
    name: "Save State Lyrics",
    lane: "web",
    purpose:
        "Publishes official lyrics with artist-specific formatting, translations, and presentation.",
    artifact: "Website",
    ai: "assisted",
    year: "’26",
    skills: [
      "TypeScript/TSX",
      "React",
      "React Router",
      "Vite",
    ],
    concepts: [
      "Hierarchical data modeling",
    ],
    note:
        "A lyrics catalog for Save State Records, organized as artists, releases, and songs. Lyrics are stored as typed TypeScript data, preserving line-level formatting, speaker colors, and translations alongside the text. The site builds its catalog from these source files without a database or CMS. I implemented the application logic while Claude handled the CSS.",
    links: {
      github: "https://github.com/savestaterecords/save-state-lyrics",
      live: "https://lyr.savestate.fm",
    },
    media: [
      { landscape: "/shots/ssrlyrics01.webp", portrait: "/shots/ssrlyrics01-tall.webp", alt: "Home page with latest release and featured videos" },
      { landscape: "/shots/ssrlyrics02.webp", portrait: "/shots/ssrlyrics02-tall.webp", alt: "Album view with lyrics" },
      { landscape: "/shots/ssrlyrics03.webp", portrait: "/shots/ssrlyrics03-tall.webp", alt: "Album view showing credits" },
    ],
    kind: "web",
    hue: 190,
  },
  {
    id: "raincal",
    name: "raincal",
    lane: "web",
    purpose:
        "Visualizes Google Calendar availability across four timescales, from a single day to an entire year.",
    artifact: "Website",
    ai: "vibes",
    year: "’26",
    skills: [
      "TypeScript/TSX",
      "React",
      "Vite",
      "Google Calendar API"
    ],
    concepts: [
      "Data visualization",
    ],
    note:
        "Transforms Google Calendar events into hourly availability data, visualized in day, week, month and year layouts. Each visualization fits within a single screen, including the entire year, making availability easy to inspect and share as a screenshot or link. Larger date ranges load progressively, and event details are omitted from the display.",
    links: {
      github: "https://github.com/ryan-dfw/calendar-webview",
      live: "https://rdfwcal.netlify.app",
    },
    media: [
      { landscape: "/shots/raincal01.webp", portrait: "/shots/raincal01-tall.webp", alt: "Week view" },
      { landscape: "/shots/raincal02.webp", portrait: "/shots/raincal02-tall.webp", alt: "Month view" },
      { landscape: "/shots/raincal03.webp", portrait: "/shots/raincal03-tall.webp", alt: "Year view" },
    ],
    kind: "web",
    hue: 215,
  },
  {
    id: "portfolio",
    name: "This portfolio",
    lane: "web",
    purpose: "Recursion is fun.",
    artifact: "Website",
    ai: "vibes",
    year: "’26",
    skills: ["TypeScript/TSX", "React", "Vite"],
    links: {
      github: "https://github.com/ryan-dfw/portfolio",
      live: "https://rdfw.netlify.app/",
    },
    kind: "web",
    hue: 230,
  },
];
