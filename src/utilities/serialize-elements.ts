import type {
  CanvasElement,
  ElementStyle,
  Point,
} from "../engine/elements/types";
import type { Tool } from "../engine/tools/types";
import { createElement } from "./create-element";

interface SerializedElement {
  id: string;
  type: CanvasElement["type"];
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  style: ElementStyle;
  seed?: number;
  points?: Point[];
  text?: string;
  fontSize?: number;
}

export const serializeElements = (
  elements: Map<string, CanvasElement>
): string => {
  const arr: SerializedElement[] = [];

  for (const el of elements.values()) {
    const base: SerializedElement = {
      id: el.id,
      type: el.type,
      x1: el.x1,
      y1: el.y1,
      x2: el.x2,
      y2: el.y2,
      style: el.style,
    };

    switch (el.type) {
      case "line":
      case "rectangle":
      case "ellipse":
      case "diamond":
      case "arrow":
        base.seed = el.roughElement.options.seed;
        break;
      case "pencil":
        base.points = el.points;
        break;
      case "text":
        base.text = el.text;
        base.fontSize = el.fontSize;
        break;
    }

    arr.push(base);
  }

  return JSON.stringify(arr);
};

export const deserializeElements = (
  json: string
): Map<string, CanvasElement> => {
  const arr: SerializedElement[] = JSON.parse(json);
  const map = new Map<string, CanvasElement>();

  for (const entry of arr) {
    let element: CanvasElement;

    switch (entry.type) {
      case "line":
      case "rectangle":
      case "ellipse":
      case "diamond":
      case "arrow":
        element = createElement(
          entry.x1,
          entry.y1,
          entry.x2,
          entry.y2,
          entry.type as Tool,
          entry.style,
          entry.id,
          entry.seed
        );
        break;
      case "pencil":
        element = {
          id: entry.id,
          type: "pencil",
          x1: entry.x1,
          y1: entry.y1,
          x2: entry.x2,
          y2: entry.y2,
          style: entry.style,
          points: entry.points ?? [],
        };
        break;
      case "text":
        element = {
          id: entry.id,
          type: "text",
          x1: entry.x1,
          y1: entry.y1,
          x2: entry.x2,
          y2: entry.y2,
          style: entry.style,
          text: entry.text ?? "",
          fontSize: entry.fontSize ?? 24,
        };
        break;
      default:
        continue;
    }

    map.set(entry.id, element);
  }

  return map;
};
