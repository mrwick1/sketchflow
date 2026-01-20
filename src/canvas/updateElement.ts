import type { Tool } from "../engine/tools/types";
import type { CanvasElement } from "../engine/elements/types";
import { createElement } from "../utilities";
import { useCanvasStore } from "../store/useCanvasStore";

export function updateElement(
  ctx: CanvasRenderingContext2D,
  id: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: Tool,
  options?: { text: string }
): void {
  const { getElement, replaceAndOverwrite } = useCanvasStore.getState();
  const existing = getElement(id);
  if (!existing) return;

  let updated: CanvasElement;
  switch (type) {
    case "line":
    case "rectangle":
    case "ellipse":
    case "diamond":
    case "arrow": {
      const seed = "roughElement" in existing ? existing.roughElement.options.seed : undefined;
      updated = createElement(x1, y1, x2, y2, type, existing.style, id, seed);
      break;
    }
    case "pencil": {
      if (existing.type !== "pencil") return;
      const newPoints = [...existing.points, { x: x2, y: y2 }];
      updated = { ...existing, points: newPoints };
      break;
    }
    case "text": {
      if (!options) {
        throw new Error("No text options provided for text tool");
      }
      const textWidth = ctx.measureText(options.text).width;
      const textHeight = 24;
      updated = {
        ...createElement(x1, y1, x1 + textWidth, y1 + textHeight, type, existing.style, id),
        text: options.text,
      } as CanvasElement;
      break;
    }
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
  replaceAndOverwrite(id, updated);
}
