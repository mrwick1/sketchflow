export const TOOLS = {
  pan: "pan",
  selection: "selection",
  rectangle: "rectangle",
  line: "line",
  pencil: "pencil",
  text: "text",
} as const;

export type Tool = (typeof TOOLS)[keyof typeof TOOLS];

export type Action =
  | "none"
  | "drawing"
  | "moving"
  | "resizing"
  | "panning"
  | "writing";

export type HitPosition =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "start"
  | "end"
  | "inside";

export type InteractionState =
  | { kind: "none" }
  | {
      kind: "moving";
      elementId: string;
      pointOffsets?: { dx: number; dy: number }[];
      offsetX: number;
      offsetY: number;
    }
  | { kind: "resizing"; elementId: string; position: HitPosition }
  | { kind: "drawing"; elementId: string }
  | { kind: "writing"; elementId: string };
