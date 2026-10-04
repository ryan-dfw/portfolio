import { useCallback, useMemo } from "react";
import { aiLabels, lanes, projects } from "./data/projects";
import { site } from "./data/site";
import { Lane } from "./components/Lane";
import { Detail } from "./components/Detail";
import { useSelection } from "./hooks/useSelection";
import type { AiInvolvement } from "./data/types";
import "./styles/layout.css";
import "./styles/lane.css";
import "./styles/card.css";
import "./styles/detail.css";

export function App() {
  const valid = useCallback((id: string) => projects.some((p) => p.id === id), []);
  const { id, open, go, close } = useSelection(valid);
  const selected = useMemo(() => projects.find((p) => p.id === id) ?? null, [id]);
  const neighbours = useMemo(() => {
    if (!selected) return { prev: null, next: null, index: 0, count: 0 };
    const lane = projects.filter((p) => p.lane === selected.lane);
    const at = lane.indexOf(selected);
    return { prev: lane[at - 1] ?? null, next: lane[at + 1] ?? null, index: at, count: lane.length };
  }, [selected]);

  return (
    <>
      <div className="ambient" aria-hidden="true" />

      <header className="masthead">
        <div className="masthead__id">
          <h1 className="masthead__name">{site.name}</h1>
          <p className="masthead__tagline">{site.tagline}</p>
        </div>
        <nav className="masthead__links" aria-label="Elsewhere">
          {site.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => {
                if (!("stub" in link) || !link.stub) return;
                event.preventDefault();
                window.alert(link.stub);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      {site.intro ? (
        <div className="intro">
          <p>{site.intro}</p>
        </div>
      ) : null}

      <main className="lanes">
        {lanes.map((lane) => {
          const inLane = projects.filter((p) => p.lane === lane.id);
          if (inLane.length === 0) return null;
          return <Lane key={lane.id} lane={lane} projects={inLane} onOpen={open} />;
        })}
      </main>

      <footer className="legend">
        <dl>
          {(Object.keys(aiLabels) as AiInvolvement[]).map((key) => (
            <div key={key}>
              <dt>{aiLabels[key].label}</dt>
              <dd>{aiLabels[key].meaning}</dd>
            </div>
          ))}
        </dl>
      </footer>

      <Detail project={selected} {...neighbours} onGo={go} onClose={close} />
    </>
  );
}
