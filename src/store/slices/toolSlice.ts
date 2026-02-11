import type { StateCreator } from "zustand";
import type { Tool, Action, InteractionState } from "../../engine/tools/types";
import type { CanvasStore } from "../types";

export interface ToolSlice {
  activeTool: Tool;
  action: Action;
  interaction: InteractionState;
  selectedElementId: string | null;

  setActiveTool: (tool: Tool) => void;
  setAction: (action: Action) => void;
  setInteraction: (interaction: InteractionState) => void;
  setSelectedElementId: (id: string | null) => void;
}

export const createToolSlice: StateCreator<
  CanvasStore,
  [["zustand/immer", never]],
  [],
  ToolSlice
> = (set) => ({
  activeTool: "selection",
  action: "none",
  interaction: { kind: "none" },
  selectedElementId: null,

  setActiveTool: (tool) => set({ activeTool: tool, selectedElementId: null }),

  setAction: (action) => set({ action }),

  setInteraction: (interaction) => set({ interaction }),

  setSelectedElementId: (id) => set({ selectedElementId: id }),
});
