import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createElementsSlice } from "./slices/elementsSlice";
import { createViewportSlice } from "./slices/viewportSlice";
import { createToolSlice } from "./slices/toolSlice";
import type { CanvasStore } from "./types";

export type { CanvasStore };

export const useCanvasStore = create<CanvasStore>()(
  immer((...args) => ({
    ...createElementsSlice(...args),
    ...createViewportSlice(...args),
    ...createToolSlice(...args),
  }))
);
