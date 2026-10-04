import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Lane as LaneType, Project } from "../data/types";
import { Card } from "./Card";

type Edges = { start: boolean; end: boolean };

export function Lane({
  lane,
  projects,
  onOpen,
}: {
  lane: LaneType;
  projects: Project[];
  onOpen: (id: string) => void;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState<Edges>({ start: true, end: true });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        measure();
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [measure]);

  /** Scrolls so the next card that isn't fully visible lands at the start. */
  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const pad = parseFloat(getComputedStyle(el).scrollPaddingInlineStart) || 0;
    const view = el.getBoundingClientRect();
    const left = view.left + pad;

    let target: HTMLElement | undefined;
    if (dir === 1) {
      target = cards.find((c) => c.getBoundingClientRect().right > view.right + 1);
    } else {
      target = [...cards].reverse().find((c) => c.getBoundingClientRect().left < left - 1);
    }
    if (!target) return;

    const delta =
      dir === 1
        ? target.getBoundingClientRect().left - left
        : target.getBoundingClientRect().right - view.right;
    el.scrollBy({ left: delta, behavior: reducedMotion() ? "auto" : "smooth" });
  };

  /** ←/→ move focus between cards in this lane. */
  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const buttons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(".card__button"),
    );
    const at = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (at === -1) return;
    const next = buttons[at + (event.key === "ArrowRight" ? 1 : -1)];
    if (!next) return;
    event.preventDefault();
    next.focus({ preventScroll: true });
    next.scrollIntoView({
      behavior: reducedMotion() ? "auto" : "smooth",
      block: "nearest",
      inline: "nearest",
    });
  };

  const scrollable = !(edges.start && edges.end);
  const headingId = `lane-${lane.id}`;

  return (
    <section className="lane" aria-labelledby={headingId}>
      <header className="lane__head">
        <h2 id={headingId} className="lane__label">
          {lane.label}
        </h2>
        <span className="lane__count" aria-label={`${projects.length} projects`}>
          {projects.length}
        </span>
        <span className="lane__rule" aria-hidden="true" />
        {scrollable ? (
          <span className="lane__nav">
            <button
              type="button"
              className="lane__arrow"
              onClick={() => step(-1)}
              disabled={edges.start}
              aria-label={`Previous ${lane.label} projects`}
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              className="lane__arrow"
              onClick={() => step(1)}
              disabled={edges.end}
              aria-label={`More ${lane.label} projects`}
            >
              <Chevron dir="right" />
            </button>
          </span>
        ) : null}
      </header>

      <div
        className="lane__viewport"
        data-fade-start={!edges.start || undefined}
        data-fade-end={!edges.end || undefined}
      >
        <ul ref={track} className="lane__track" onKeyDown={onKeyDown}>
          {projects.map((project) => (
            <Card key={project.id} project={project} onOpen={onOpen} />
          ))}
        </ul>
      </div>
    </section>
  );
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d={dir === "right" ? "M5 2.5 9.5 7 5 11.5" : "M9 2.5 4.5 7 9 11.5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
