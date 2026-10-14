import { useEffect, useRef, useState } from "react";
import type { ReactNode, Ref } from "react";
import { aiLabels, lanes } from "../data/projects";
import type { Project } from "../data/types";
import { Chevron } from "./Lane";
import { framesFor, layoutFor, UPRIGHT } from "../data/frames";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { Gallery } from "./Gallery";
import type { GalleryHandle } from "./Gallery";
import { Lightbox } from "./Lightbox";
import type { Zoomed } from "./Lightbox";

type Props = {
  project: Project | null;
  prev: Project | null;
  next: Project | null;
  index: number;
  count: number;
  onGo: (id: string) => void;
  onClose: () => void;
};

const SWIPE = 60;

export function Detail({ project, prev, next, index, count, onGo, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [zoomed, setZoomed] = useState<Zoomed | null>(null);
  const gallery = useRef<GalleryHandle>(null);
  const upright = useMediaQuery(UPRIGHT);
  // set when ← carries over into the previous project, so it opens on its last screenshot
  const [enteredBackward, setEnteredBackward] = useState(false);

  if (!project && enteredBackward) setEnteredBackward(false);

  const goProject = (target: Project, backward: boolean) => {
    setEnteredBackward(backward);
    onGo(target.id);
  };

  // a full-size view never outlives its project
  const [zoomFor, setZoomFor] = useState(project?.id);
  if (zoomFor !== project?.id) {
    setZoomFor(project?.id);
    setZoomed(null);
  }

  // ←/→ go through this project's screenshots first, then on to the neighbouring project.
  // While a screenshot is full size, they step through full-size screenshots instead.
  useEffect(() => {
    if (!project) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.metaKey || event.ctrlKey) return;
      const dir = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
      if (!dir) return;
      event.preventDefault();

      if (zoomed) {
        const frames = framesFor(project, upright);
        const at = frames.findIndex((f) => f.src === zoomed.src);
        const to = frames[at + dir];
        if (!to) return;
        setZoomed({ src: to.src, alt: to.media.alt ?? `${project.name} screenshot` });
        gallery.current?.goTo(at + dir);
        return;
      }

      if (gallery.current?.step(dir)) return;
      const target = dir < 0 ? prev : next;
      if (target) goProject(target, dir < 0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // a new project starts at the top
  useEffect(() => {
    dialog.current?.scrollTo({ top: 0 });
  }, [project?.id]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (project && !el.open) {
      el.showModal();
      el.focus();
    }
    if (!project && el.open) el.close();
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, [project]);

  return (
    <>
      <dialog
        ref={dialog}
        className="detail"
        tabIndex={-1}
        aria-labelledby="detail-title"
        onCancel={(event) => {
          event.preventDefault();
          onClose();
        }}
        onTouchStart={(event) => {
          const t = event.touches[0];
          touch.current = event.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null;
        }}
        onTouchEnd={(event) => {
          const start = touch.current;
          touch.current = null;
          if (!start) return;
          const t = event.changedTouches[0];
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          if (Math.abs(dx) < SWIPE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
          const target = dx < 0 ? next : prev;
          if (target) goProject(target, false);
        }}
        onClick={(event) => {
          // clicks on the backdrop land on the <dialog> itself
          if (event.target === event.currentTarget) onClose();
        }}
      >
        {project ? (
          <Body
            key={project.id}
            project={project}
            onClose={onClose}
            onZoom={(src, alt) => setZoomed({ src, alt })}
          gallery={gallery}
          startAtEnd={enteredBackward}
          >
            <nav className="detail__nav" aria-label="Projects in this lane">
              <button
                type="button"
                className="detail__step"
                onClick={() => prev && goProject(prev, false)}
                disabled={!prev}
                aria-label={prev ? `Previous: ${prev.name}` : "No previous project"}
              >
                <Chevron dir="left" />
                <span className="detail__step-name">{prev?.name}</span>
              </button>
              <span className="detail__pos">
                {lanes.find((l) => l.id === project.lane)?.label} {index + 1}/{count}
              </span>
              <button
                type="button"
                className="detail__step detail__step--next"
                onClick={() => next && goProject(next, false)}
                disabled={!next}
                aria-label={next ? `Next: ${next.name}` : "No next project"}
              >
                <span className="detail__step-name">{next?.name}</span>
                <Chevron dir="right" />
              </button>
            </nav>
          </Body>
        ) : null}
      </dialog>
      <Lightbox image={zoomed} onClose={() => setZoomed(null)} />
    </>
  );
}

function Body({
  project,
  onClose,
  onZoom,
  gallery,
  startAtEnd,
  children,
}: {
  project: Project;
  onClose: () => void;
  onZoom: (src: string, alt: string) => void;
  gallery: Ref<GalleryHandle>;
  startAtEnd: boolean;
  children: ReactNode;
}) {
  const upright = useMediaQuery(UPRIGHT);
  const { links } = project;
  const ai = aiLabels[project.ai];

  return (
    <div className={`detail__body detail__body--${layoutFor(project, framesFor(project, upright)[0])}`}>
      <button type="button" className="detail__close" onClick={onClose} aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      <div className="detail__media">
        <Gallery ref={gallery} project={project} onZoom={onZoom} startAtEnd={startAtEnd} />
      </div>

      <div className="detail__info">
        <h2 id="detail-title" className="detail__title">
          {project.name}
        </h2>
        <p className="detail__purpose">{project.purpose}</p>

        <div className="detail__links">
          {links.live ? <Ext href={links.live} primary>{prettyHost(links.live)}</Ext> : null}
          {links.extra?.map((link) => (
            <Ext key={link.href} href={link.href}>
              {link.label}
            </Ext>
          ))}
          {links.github === "private" ? (
            <span className="detail__link detail__link--muted">GitHub: private repo</span>
          ) : links.github ? (
            <Ext href={links.github}>GitHub</Ext>
          ) : null}
        </div>

        <dl className="detail__facts">
          <Fact term="Artifact">{project.artifact}</Fact>
          {project.year ? <Fact term="Year">{project.year}</Fact> : null}
          <Fact term="AI">
            {ai.label}
          </Fact>
          <Fact term="Skills">
            <Tags items={project.skills} />
          </Fact>
          {project.concepts?.length ? (
            <Fact term="Concepts">
              <Tags items={project.concepts} quiet />
            </Fact>
          ) : null}
          {project.note ? <Fact term="Note">{project.note}</Fact> : null}
        </dl>

      </div>

      {children}
    </div>
  );
}

function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="detail__fact">
      <dt>{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Tags({ items, quiet }: { items: string[]; quiet?: boolean }) {
  return (
    <ul className={`tags${quiet ? " tags--quiet" : ""}`}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Ext({ href, children, primary }: { href: string; children: ReactNode; primary?: boolean }) {
  return (
    <a
      className={`detail__link${primary ? " detail__link--primary" : ""}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M3 1.5h5.5V7M8.5 1.5 1.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

const prettyHost = (url: string) => {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
};
