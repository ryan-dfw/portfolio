import { aiLabels } from "../data/projects";
import type { Project } from "../data/types";
import { framesFor, UPRIGHT } from "../data/frames";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { Shot } from "./Shot";

export function Card({ project, onOpen }: { project: Project; onOpen: (id: string) => void }) {
  const upright = useMediaQuery(UPRIGHT);
  const cover = framesFor(project, upright)[0];
  return (
    <li className={`card card--${project.kind}`}>
      <button
        type="button"
        className="card__button"
        onClick={() => onOpen(project.id)}
        aria-haspopup="dialog"
      >
        <Shot project={project} frame={cover} />
        <span className="card__text">
          <span className="card__name">{project.name}</span>
          <span className="card__purpose">{project.purpose}</span>
          <span className="card__meta">
            {project.artifact}
            <span aria-hidden="true"> · </span>
            {aiLabels[project.ai].label}
            {project.year ? (
              <span className="card__year">
                <span aria-hidden="true"> · </span>
                {project.year}
              </span>
            ) : null}
          </span>
        </span>
      </button>
    </li>
  );
}
