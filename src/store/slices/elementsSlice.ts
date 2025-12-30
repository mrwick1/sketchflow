import type { StateCreator } from "zustand";
import type { CanvasElement } from "../../engine/elements/types";
import type { CanvasStore } from "../types";

export interface ElementsSlice {
  elements: Map<string, CanvasElement>;
  history: Map<string, CanvasElement>[];
  historyIndex: number;

  addElement: (element: CanvasElement) => void;
  replaceElement: (id: string, element: CanvasElement) => void;
  replaceAndOverwrite: (id: string, element: CanvasElement) => void;
  pushHistory: () => void;
  overwriteHistory: () => void;
  undo: () => void;
  redo: () => void;
  getElement: (id: string) => CanvasElement | undefined;
  getElementsArray: () => CanvasElement[];
}

// Use set(partial) instead of set(fn) to bypass immer's Draft
// transformation for Map operations — avoids Draft<Drawable> type issues.
export const createElementsSlice: StateCreator<
  CanvasStore,
  [["zustand/immer", never]],
  [],
  ElementsSlice
> = (set, get) => ({
  elements: new Map(),
  history: [new Map()],
  historyIndex: 0,

  addElement: (element) => {
    const next = new Map(get().elements);
    next.set(element.id, element);
    set({ elements: next });
  },

  replaceElement: (id, element) => {
    const next = new Map(get().elements);
    next.set(id, element);
    set({ elements: next });
  },

  // Batched replace + history overwrite in a single set() call.
  // Used on every mouseMove during drawing/moving/resizing — avoids
  // 2x Map clones and 2x re-renders that separate calls would cause.
  replaceAndOverwrite: (id, element) => {
    const { history, historyIndex } = get();
    const nextElements = new Map(get().elements);
    nextElements.set(id, element);
    const updatedHistory = [...history];
    updatedHistory[historyIndex] = nextElements;
    set({ elements: nextElements, history: updatedHistory });
  },

  pushHistory: () => {
    const { elements, history, historyIndex } = get();
    const truncated = history.slice(0, historyIndex + 1);
    truncated.push(new Map(elements));
    set({ history: truncated, historyIndex: truncated.length - 1 });
  },

  overwriteHistory: () => {
    const { elements, history, historyIndex } = get();
    const updated = [...history];
    updated[historyIndex] = new Map(elements);
    set({ history: updated });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        historyIndex: newIndex,
        elements: new Map(history[newIndex]),
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        historyIndex: newIndex,
        elements: new Map(history[newIndex]),
      });
    }
  },

  getElement: (id) => get().elements.get(id),

  getElementsArray: () => Array.from(get().elements.values()),
});
