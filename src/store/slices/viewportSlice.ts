import type { StateCreator } from "zustand";
import type { CanvasStore } from "../types";

export interface ViewportSlice {
  panOffset: { x: number; y: number };
  startPanMousePosition: { x: number; y: number };
  scale: number;
  canvasSize: { width: number; height: number };

  setPanOffset: (offset: { x: number; y: number }) => void;
  setStartPanMousePosition: (pos: { x: number; y: number }) => void;
  setScale: (scale: number) => void;
  onZoom: (delta: number) => void;
  setCanvasSize: (size: { width: number; height: number }) => void;
}

export const createViewportSlice: StateCreator<
  CanvasStore,
  [["zustand/immer", never]],
  [],
  ViewportSlice
> = (set) => ({
  panOffset: { x: 0, y: 0 },
  startPanMousePosition: { x: 0, y: 0 },
  scale: 1,
  canvasSize: { width: window.innerWidth, height: window.innerHeight },

  setPanOffset: (offset) =>
    set((state) => {
      state.panOffset = offset;
    }),

  setStartPanMousePosition: (pos) =>
    set((state) => {
      state.startPanMousePosition = pos;
    }),

  setScale: (scale) =>
    set((state) => {
      state.scale = scale;
    }),

  onZoom: (delta) =>
    set((state) => {
      state.scale = Math.min(Math.max(state.scale + delta, 0.1), 20);
    }),

  setCanvasSize: (size) =>
    set((state) => {
      state.canvasSize = size;
    }),
});
