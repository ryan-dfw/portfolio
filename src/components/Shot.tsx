import type { CSSProperties } from "react";
import type { Project } from "../data/types";
import { NARROW, useMediaQuery } from "../hooks/useMediaQuery";

type Orientation = "portrait" | "landscape";

/**
 * Frames a project's screenshot according to its kind:
 * phone apps sit in a portrait device frame, web projects fill the stage
 * (landscape on wide screens, portrait on narrow), desktop tools stay landscape.
 * With no image, a placeholder of the right shape stands in.
 */
export function Shot({ project, size = "card" }: { project: Project; size?: "card" | "detail" }) {
  const narrow = useMediaQuery(NARROW);
  const { kind, media, hue, name } = project;

  let orientation: Orientation;
  let src: string | undefined;
  let mode: "device" | "fill" | "contain";

  if (kind === "phone") {
    orientation = "portrait";
    src = media?.portrait;
    mode = "device";
  } else if (kind === "web" && narrow) {
    orientation = media?.portrait || !media?.landscape ? "portrait" : "landscape";
    src = media?.portrait ?? media?.landscape;
    mode = media?.portrait || !media?.landscape ? "fill" : "contain";
  } else {
    orientation = "landscape";
    src = media?.landscape;
    // a landscape-only shot on a narrow (portrait) stage gets letterboxed
    mode = narrow ? "contain" : "fill";
  }

  return (
    <div
      className={`shot shot--${mode} shot--${size}`}
      style={{ "--hue": hue } as CSSProperties}
    >
      <div className={`shot__frame shot__frame--${orientation}`}>
        {src ? (
          <img src={src} alt={media?.alt ?? `${name} screenshot`} loading="lazy" decoding="async" />
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
