import type { StateCreator } from "zustand";
import type { CanvasStore } from "../types";

export type Theme = "light" | "dark";
export type GridStyle = "none" | "dots" | "lines";

export interface UiSlice {
  theme: Theme;
  gridStyle: GridStyle;
  toggleTheme: () => void;
  setGridStyle: (style: GridStyle) => void;
}

const LIGHT_FG = "#1A1A1A";
const DARK_FG = "#E8E8E8";

export const createUiSlice: StateCreator<
  CanvasStore,
  [["zustand/immer", never]],
  [],
  UiSlice
> = (set, get) => ({
  theme: "light",
  gridStyle: "dots" as GridStyle,

  toggleTheme: () => {
    const nextTheme = get().theme === "light" ? "dark" : "light";
    const currentStroke = get().activeStyle.strokeColor;
    const newStroke =
      currentStroke === LIGHT_FG ? DARK_FG :
      currentStroke === DARK_FG ? LIGHT_FG :
      currentStroke;
    set({
      theme: nextTheme,
      activeStyle: { ...get().activeStyle, strokeColor: newStroke },
    });
  },

  setGridStyle: (style) => set({ gridStyle: style }),
});
