import type { CSSProperties } from "react";
import type { Frame, Orientation } from "../data/frames";
import { thumbOf } from "../data/thumb";
import type { Project } from "../data/types";
import { NARROW, useMediaQuery } from "../hooks/useMediaQuery";

/**
 * Frames one screenshot on the project's tinted stage:
 * a portrait shot of a phone app sits in a device frame; other shots sit inset,
 * with a landscape shot letterboxed when the stage itself is portrait (narrow screens).
 * Without a frame, a placeholder of the expected shape stands in.
 */
export function Shot({
  project,
  frame,
  size = "card",
  lazy = true,
  onZoom,
}: {
  project: Project;
  frame?: Frame;
  size?: "card" | "detail";
  lazy?: boolean;
  /** When set, clicking the screenshot asks to show it full size. */
  onZoom?: (src: string, alt: string) => void;
}) {
  const narrow = useMediaQuery(NARROW);
  const { kind, hue, name } = project;

  const orientation: Orientation =
    frame?.orientation ?? (kind === "phone" || (kind === "web" && narrow) ? "portrait" : "landscape");

  let mode: "device" | "fill" | "contain" | "inset";
  if (kind === "phone" && orientation === "portrait") mode = "device";
  else if (orientation === "landscape" && narrow) mode = "contain";
  else mode = frame ? "inset" : "fill";

  const alt = frame?.media.alt ?? `${name} screenshot`;

  return (
    <div
      className={`shot shot--${mode} shot--${size} shot--${orientation}`}
      style={{ "--hue": hue } as CSSProperties}
    >
      <div className={`shot__frame shot__frame--${orientation}`}>
        {frame ? (
          <>
            <img
              src={thumbOf(frame.src)}
              alt={alt}
              loading={lazy ? "lazy" : "eager"}
              decoding="async"
              draggable={false}
            />
            {onZoom ? (
              <button
                type="button"
                className="shot__zoom"
                onClick={() => onZoom(frame.src, alt)}
                aria-label={`View full size: ${alt}`}
              />
            ) : null}
          </>
        ) : (
          <div className="shot__placeholder" role="img" aria-label={`${name}: screenshot coming`}>
            <span className="shot__initial">{name.charAt(0)}</span>
            <span className="shot__label">{orientation}</span>
          </div>
        )}
      </div>
    </div>
  );
}
