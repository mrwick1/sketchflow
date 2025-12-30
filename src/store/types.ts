import type { ElementsSlice } from "./slices/elementsSlice";
import type { ViewportSlice } from "./slices/viewportSlice";
import type { ToolSlice } from "./slices/toolSlice";

export type CanvasStore = ElementsSlice & ViewportSlice & ToolSlice;
