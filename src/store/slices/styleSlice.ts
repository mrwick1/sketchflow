import type { StateCreator } from "zustand";
import { DEFAULT_STYLE, type ElementStyle } from "../../engine/elements/types";
import type { CanvasStore } from "../types";

export interface StyleSlice {
  activeStyle: ElementStyle;
  setActiveStyle: (style: Partial<ElementStyle>) => void;
}

export const createStyleSlice: StateCreator<
  CanvasStore,
  [["zustand/immer", never]],
  [],
  StyleSlice
> = (set, get) => ({
  activeStyle: { ...DEFAULT_STYLE },

  setActiveStyle: (style) => {
    set({ activeStyle: { ...get().activeStyle, ...style } });
  },
});
