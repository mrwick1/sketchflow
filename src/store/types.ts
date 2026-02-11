import type { ElementsSlice } from "./slices/elementsSlice";
import type { ViewportSlice } from "./slices/viewportSlice";
import type { ToolSlice } from "./slices/toolSlice";
import type { UiSlice } from "./slices/uiSlice";
import type { StyleSlice } from "./slices/styleSlice";

export type CanvasStore = ElementsSlice & ViewportSlice & ToolSlice & UiSlice & StyleSlice;
