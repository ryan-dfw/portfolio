import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { aiLabels, lanes } from "../data/projects";
import type { Project } from "../data/types";
import { Chevron } from "./Lane";
import { Shot } from "./Shot";

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

  // ←/→ step through the lane while open
  useEffect(() => {
    if (!project) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.metaKey || event.ctrlKey) return;
      const target = event.key === "ArrowLeft" ? prev : event.key === "ArrowRight" ? next : null;
      if (!target) return;
      event.preventDefault();
      onGo(target.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, prev, next, onGo]);

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
        if (target) onGo(target.id);
      }}
      onClick={(event) => {
        // clicks on the backdrop land on the <dialog> itself
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {project ? (
        <Body key={project.id} project={project} onClose={onClose}>
          <nav className="detail__nav" aria-label="Projects in this lane">
            <button
              type="button"
              className="detail__step"
              onClick={() => prev && onGo(prev.id)}
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
              onClick={() => next && onGo(next.id)}
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
  );
}

function Body({
  project,
  onClose,
  children,
}: {
  project: Project;
  onClose: () => void;
  children: ReactNode;
}) {
  const { links } = project;
  const ai = aiLabels[project.ai];

  return (
    <div className={`detail__body detail__body--${project.kind}`}>
      <button type="button" className="detail__close" onClick={onClose} aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      <div className="detail__media">
        <Shot project={project} size="detail" />
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
