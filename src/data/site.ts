export type SiteLink = {
  label: string;
  href: string;
  /** Placeholder: clicking shows this message instead of following the link. */
  stub?: string;
};

export const site = {
  name: "Ryan McKevitt",
  tagline: "lorem ipsum",
  intro: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
  ].join("\n"),
  links: [
    { label: "GitHub", href: "https://github.com/ryan-dfw" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ryanmckevitt" },
    { label: "Resume", href: "/resume.pdf", stub: "don't do that" },
    { label: "Email", href: "mailto:mckevitt.r@gmail.com" },
  ] satisfies SiteLink[],
};
