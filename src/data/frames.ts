import type { Media, Project } from "./types";

export type Orientation = "portrait" | "landscape";

/** One screenshot in one orientation. */
export type Frame = { media: Media; orientation: Orientation; src: string };

export const UPRIGHT = "(orientation: portrait)";

/**
 * Every screenshot of a project in viewing order: the viewport's own orientation first
 * (all landscape shots, then all portrait ones on a wide screen; the reverse on an upright one).
 * frames[0] is the card image.
 */
/** Card/panel shape: a phone app leading with a landscape shot is laid out like a website. */
export const layoutFor = (project: Project, first: Frame | undefined) =>
  project.kind === "phone" && first?.orientation === "landscape" ? "web" : project.kind;

export function framesFor(project: Project, upright: boolean): Frame[] {
  const shots = project.media ?? [];
  const wide: Frame[] = shots.flatMap((media) =>
    media.landscape ? [{ media, orientation: "landscape" as const, src: media.landscape }] : [],
  );
  const tall: Frame[] = shots.flatMap((media) =>
    media.portrait ? [{ media, orientation: "portrait" as const, src: media.portrait }] : [],
  );
  return upright ? [...tall, ...wide] : [...wide, ...tall];
}
