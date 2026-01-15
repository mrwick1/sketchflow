import type { StateCreator } from "zustand";
import type { CanvasElement, ElementStyle } from "../../engine/elements/types";
import { createElement } from "../../utilities/create-element";
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
  deleteElement: (id: string) => void;
  updateElementStyle: (id: string, styleUpdate: Partial<ElementStyle>) => void;
  hydrateElements: (elements: Map<string, CanvasElement>) => void;
  clearCanvas: () => void;
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

  deleteElement: (id) => {
    const next = new Map(get().elements);
    next.delete(id);
    set({ elements: next });
  },

  hydrateElements: (elements) => {
    set({
      elements: new Map(elements),
      history: [new Map(elements)],
      historyIndex: 0,
    });
  },

  clearCanvas: () => {
    // Push current state to history first so Ctrl+Z restores it
    const { elements, history, historyIndex } = get();
    const truncated = history.slice(0, historyIndex + 1);
    truncated.push(new Map(elements));

    set({
      elements: new Map(),
      history: [...truncated, new Map()],
      historyIndex: truncated.length,
    });
  },

  updateElementStyle: (id, styleUpdate) => {
    const element = get().elements.get(id);
    if (!element) return;

    const newStyle = { ...element.style, ...styleUpdate };
    let updated: CanvasElement;

    switch (element.type) {
      case "line":
      case "rectangle":
      case "ellipse":
      case "diamond":
      case "arrow":
        updated = createElement(
          element.x1, element.y1, element.x2, element.y2,
          element.type, newStyle, element.id, element.roughElement.options.seed
        );
        break;
      case "pencil":
        updated = { ...element, style: newStyle };
        break;
      case "text":
        updated = { ...element, style: newStyle };
        break;
      default:
        return;
    }

    const next = new Map(get().elements);
    next.set(id, updated);
    set({ elements: next });
  },
});
