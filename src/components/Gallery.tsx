import { useEffect, useImperativeHandle, useRef, useState } from "react";
import type { Ref, TouchEvent } from "react";
import { framesFor, UPRIGHT } from "../data/frames";
import type { Project } from "../data/types";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { Chevron } from "./Lane";
import { Shot } from "./Shot";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Zoom = (src: string, alt: string) => void;

export type GalleryHandle = {
  /** Moves one screenshot; false when already at that end (or there's nothing to move through). */
  step: (dir: 1 | -1) => boolean;
  goTo: (index: number) => void;
};

/** The open card's screenshots: swipe, arrows, dots, or ←/→ via `ref.step`. */
export function Gallery({
  project,
  onZoom,
  startAtEnd = false,
  ref,
}: {
  project: Project;
  onZoom: Zoom;
  /** Arriving from the next project with ←: begin on the last screenshot. */
  startAtEnd?: boolean;
  ref?: Ref<GalleryHandle>;
}) {
  const shots = framesFor(project, useMediaQuery(UPRIGHT));
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(startAtEnd ? Math.max(0, shots.length - 1) : 0);
  // where a requested scroll is headed, so quick repeated steps don't read a stale position
  const heading = useRef<number | null>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (startAtEnd) el.scrollLeft = (shots.length - 1) * el.clientWidth;
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const now = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
        setAt(now);
        if (heading.current === now) heading.current = null;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
    // only on mount: Body is keyed per project
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (index: number) => {
    const el = track.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(shots.length - 1, index));
    heading.current = clamped;
    el.scrollTo({ left: clamped * el.clientWidth, behavior: reducedMotion() ? "auto" : "smooth" });
  };

  useImperativeHandle(ref, () => ({
    step(dir) {
      if (shots.length < 2) return false;
      const from = heading.current ?? at;
      const to = from + dir;
      if (to < 0 || to >= shots.length) return false;
      goTo(to);
      return true;
    },
    goTo,
  }));

  if (shots.length < 2)
    return <Shot project={project} frame={shots[0]} size="detail" lazy={false} onZoom={onZoom} />;

  // keep swipes here from also switching projects
  const own = (event: TouchEvent) => event.stopPropagation();

  return (
    <div className="gallery" role="group" aria-roledescription="carousel" aria-label="Screenshots">
      <div ref={track} className="gallery__track" onTouchStart={own} onTouchEnd={own}>
        {shots.map((frame, i) => (
          <div
            key={frame.src}
            className="gallery__slide"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${shots.length}`}
          >
            <Shot
              project={project}
              frame={frame}
              size="detail"
              lazy={startAtEnd ? i < shots.length - 1 : i > 0}
              onZoom={onZoom}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="gallery__arrow gallery__arrow--prev"
        onClick={() => goTo(at - 1)}
        disabled={at === 0}
        aria-label="Previous screenshot"
      >
        <Chevron dir="left" />
      </button>
      <button
        type="button"
        className="gallery__arrow gallery__arrow--next"
        onClick={() => goTo(at + 1)}
        disabled={at === shots.length - 1}
        aria-label="Next screenshot"
      >
        <Chevron dir="right" />
      </button>

      <div className="gallery__dots">
        {shots.map((_, i) => (
          <button
            key={i}
            type="button"
            className="gallery__dot"
            aria-label={`Screenshot ${i + 1}`}
            aria-current={i === at || undefined}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
