import { useEffect, useRef } from "react";
import { useCanvasStore } from "../store/useCanvasStore";
import { serializeElements, deserializeElements } from "../utilities";
import type { ElementStyle } from "../engine/elements/types";
import type { GridStyle } from "../store/slices/uiSlice";

const KEYS = {
  elements: "sketchflow-elements",
  style: "sketchflow-style",
  theme: "sketchflow-theme",
  grid: "sketchflow-grid",
} as const;

export function useLocalPersistence(): void {
  const hydrated = useRef(false);

  // Load on mount
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const { hydrateElements, setActiveStyle, toggleTheme, theme, setGridStyle } =
      useCanvasStore.getState();

    // Restore elements
    const savedElements = localStorage.getItem(KEYS.elements);
    if (savedElements) {
      try {
        const elements = deserializeElements(savedElements);
        if (elements.size > 0) {
          hydrateElements(elements);
        }
      } catch {
        // Corrupted data — ignore
      }
    }

    // Restore style
    const savedStyle = localStorage.getItem(KEYS.style);
    if (savedStyle) {
      try {
        const style: ElementStyle = JSON.parse(savedStyle);
        setActiveStyle(style);
      } catch {
        // Corrupted data — ignore
      }
    }

    // Restore theme
    const savedTheme = localStorage.getItem(KEYS.theme);
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      if (savedTheme !== theme) {
        toggleTheme();
      }
    }

    // Restore grid style
    const savedGrid = localStorage.getItem(KEYS.grid) as GridStyle | null;
    if (savedGrid && (savedGrid === "none" || savedGrid === "dots" || savedGrid === "lines")) {
      setGridStyle(savedGrid);
    }
  }, []);

  // Save on change (debounced)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const unsub = useCanvasStore.subscribe((state, prev) => {
      // Only save when elements, activeStyle, theme, or gridStyle change
      if (
        state.elements === prev.elements &&
        state.activeStyle === prev.activeStyle &&
        state.theme === prev.theme &&
        state.gridStyle === prev.gridStyle
      ) {
        return;
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        try {
          localStorage.setItem(
            KEYS.elements,
            serializeElements(state.elements)
          );
          localStorage.setItem(
            KEYS.style,
            JSON.stringify(state.activeStyle)
          );
          localStorage.setItem(KEYS.theme, state.theme);
          localStorage.setItem(KEYS.grid, state.gridStyle);
        } catch {
          // localStorage full or unavailable — ignore
        }
      }, 500);
    });

    return () => {
      clearTimeout(timeout);
      unsub();
    };
  }, []);
}
