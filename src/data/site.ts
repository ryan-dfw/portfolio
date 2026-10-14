export type SiteLink = {
  label: string;
  href: string;
  /** Placeholder: clicking shows this message instead of following the link. */
  stub?: string;
};

export const site = {
  name: "Ryan McKevitt",
  tagline: "Software developer · Photographer · Business owner",
  intro: [
    "I build software, websites, and digital tools for clients and independent projects.\n\nMy background spans photography, audiovisual production, and small business operations, with experience taking projects from initial concept through development and delivery.",
  ].join("\n"),
  links: [
    { label: "GitHub", href: "https://github.com/ryan-dfw" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ryanmckevitt" },
    { label: "Resume", href: "/Ryan_McKevitt_Resume.pdf"},
    { label: "Email", href: "mailto:mckevitt.r@gmail.com" },
  ] satisfies SiteLink[],
};
