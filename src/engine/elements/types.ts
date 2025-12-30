import type { Drawable } from "roughjs/bin/core";

export type Point = { readonly x: number; readonly y: number };

export type Bounds = {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
};

export type ElementStyle = {
  readonly strokeColor: string;
  readonly strokeWidth: number;
  readonly opacity: number;
  readonly roughness: number;
};

export const DEFAULT_STYLE: ElementStyle = {
  strokeColor: "#000000",
  strokeWidth: 1,
  opacity: 1,
  roughness: 1,
};

interface BaseElement extends Bounds {
  readonly id: string;
  readonly style: ElementStyle;
}

export interface RectangleElement extends BaseElement {
  readonly type: "rectangle";
  readonly roughElement: Drawable;
}

export interface LineElement extends BaseElement {
  readonly type: "line";
  readonly roughElement: Drawable;
}

export interface PencilElement extends BaseElement {
  readonly type: "pencil";
  readonly points: Point[];
}

export interface TextElement extends BaseElement {
  readonly type: "text";
  readonly text: string;
  readonly fontSize: number;
}

export type CanvasElement =
  | RectangleElement
  | LineElement
  | PencilElement
  | TextElement;

export type ElementKind = CanvasElement["type"];
