import { useCallback, useEffect, useState } from "react";

const fromHash = () => decodeURIComponent(window.location.hash.slice(1)) || null;

/**
 * The open project lives in the URL hash so a card can be linked to (#raincal)
 * and the back button closes it on phones.
 */
export function useSelection(valid: (id: string) => boolean) {
  const [id, setId] = useState<string | null>(() => {
    const initial = fromHash();
    return initial && valid(initial) ? initial : null;
  });

  useEffect(() => {
    const sync = () => {
      const next = fromHash();
      setId(next && valid(next) ? next : null);
    };
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, [valid]);

  const open = useCallback((next: string) => {
    window.history.pushState({ opened: true }, "", `#${next}`);
    setId(next);
  }, []);

  /** Switch to another project while open; back still closes. */
  const go = useCallback((next: string) => {
    window.history.replaceState(window.history.state, "", `#${next}`);
    setId(next);
  }, []);

  const close = useCallback(() => {
    if (window.history.state?.opened) {
      window.history.back();
    } else {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    setId(null);
  }, []);

  return { id, open, go, close };
}
