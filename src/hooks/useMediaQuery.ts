import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (changed) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", changed);
      return () => list.removeEventListener("change", changed);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const NARROW = "(max-width: 640px)";
