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
 * To add a screenshot, drop files in /public/shots and set `media`.
 */
export const projects: Project[] = [
  // ─── PAID ────────────────────────────────────────────────────────────
  {
    id: "nearvye",
    name: "Nearvye",
    lane: "paid",
    purpose: "Matches people who are physically at the same event.",
    artifact: "iOS app",
    ai: "hand",
    year: "’25",
    skills: ["Swift", "BLE", "Firebase Realtime Database", "Firebase Storage", "Firebase Auth"],
    concepts: ["Proximity validation", "Mutual matching", "Data minimization"],
    note:
      "Working MVP tested on two physical iPhones; built in about a month. BLE confirms the other person is in the room. If both swipe right, both are told. That's where the app's job ends: there's no chat, by design.",
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
      "About 7,500 leads consolidated from buyer spreadsheets and enriched with addresses and contacts by a Python + LLM pipeline. A buyer checks whether a region and quantity exists, purchases, and gets a key to view their leads. Live.",
    links: {},
    kind: "web",
    hue: 205,
  },
  {
    id: "paola-book-sales",
    name: "Paola Book Sales",
    lane: "paid",
    purpose: "Sells Paola's book.",
    artifact: "Website",
    ai: "vibes",
    year: "’26",
    skills: ["TypeScript/TSX", "Vite", "Stripe Checkout", "Netlify", "Serverless functions"],
    concepts: ["Bilingual support"],
    note:
      "About $600 in sales on launch day, built in roughly two weeks for an in-person launch. Claude made the visuals, including the 3D book. I set up her Stripe account, checkout and deployment. Stripe holds the products and prices; picking the Spanish edition switches the page and checkout to Spanish.",
    links: {
      github: "https://github.com/ryan-dfw/paola-book-sales",
      live: "https://paolabooksales.netlify.app",
    },
    kind: "web",
    hue: 345,
  },

  // ─── SOFTWARE ────────────────────────────────────────────────────────
  {
    id: "airis",
    name: "AIris",
    lane: "software",
    purpose: "Reconstructs blindly-shot photos through a caption and image generation.",
    artifact: "Android app",
    ai: "assisted",
    year: "’24–’26",
    skills: [
      "Kotlin",
      "Jetpack Compose",
      "Sony Camera Remote API",
      "Wi-Fi Direct",
      "Android networking",
      "OpenAI API",
    ],
    concepts: ["Network routing", "Image → text → image", "Prompt engineering"],
    note:
      "Drives a Sony QX10 directly over its Wi-Fi while keeping cellular up for API calls. Follows a Python prototype and a hand-written Java app; this Kotlin version keeps that logic, and Claude rebuilt the UI.",
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
    skills: ["Rust"],
    concepts: ["A/V synchronization", "Metadata-driven behavior"],
    note:
      "Early MVP. Each song's MPD stickers name its video and a start offset, which are currently set by hand.",
    links: { github: "https://github.com/ryan-dfw/pvplayer" },
    kind: "desktop",
    hue: 25,
  },

  // ─── WEB ─────────────────────────────────────────────────────────────
  {
    id: "save-state-lyrics",
    name: "Save State Lyrics",
    lane: "web",
    purpose: "Album lyrics with more control than standard lyrics platforms.",
    artifact: "Website",
    ai: "hand",
    year: "’26",
    skills: ["TypeScript/TSX", "Vite"],
    concepts: ["Hierarchical data modeling", "Translation state", "Speaker-aware lyrics"],
    links: {
      github: "https://github.com/savestaterecords/save-state-lyrics",
      live: "https://lyr.savestate.fm",
    },
    kind: "web",
    hue: 190,
  },
  {
    id: "raincal",
    name: "raincal",
    lane: "web",
    purpose: "Shares Google Calendar availability in compact day, week, month and year views.",
    artifact: "Website",
    ai: "vibes",
    year: "’26",
    skills: ["TypeScript/TSX", "Vite", "Google Calendar API", "Netlify"],
    concepts: ["Responsive visualization", "Availability abstraction"],
    note:
      "Every view fits one screen, so one screenshot or link shares it. Shows free/busy only, never event details. My personal version is live; it may become a reusable template.",
    links: {
      github: "https://github.com/ryan-dfw/calendar-webview",
      live: "https://rdfwcal.netlify.app",
    },
    kind: "web",
    hue: 215,
  },
  {
    id: "elm-aperture",
    name: "Elm Aperture",
    lane: "web",
    purpose: "Photography portfolio.",
    artifact: "Website",
    ai: "assisted",
    year: "’24–’26",
    skills: ["TypeScript/TSX", "Vite"],
    note:
      "The beta is replacing elmapt.com. Some of its new sections are still placeholder text.",
    links: {
      github: "https://github.com/elm-aperture/elmapt",
      live: "https://beta.elmapt.com",
      extra: [{ label: "elmapt.com (current)", href: "https://elmapt.com" }],
    },
    kind: "web",
    hue: 40,
  },
  {
    id: "portfolio",
    name: "This portfolio",
    lane: "web",
    purpose: "Recursion is fun.",
    artifact: "Website",
    ai: "vibes",
    year: "’26",
    skills: ["TypeScript/TSX", "Vite"],
    links: {},
    kind: "web",
    hue: 230,
  },
];
