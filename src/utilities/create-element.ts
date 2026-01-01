import rough from "roughjs";
import { nanoid } from "nanoid";
import type { Tool } from "../engine/tools/types";
import {
  DEFAULT_STYLE,
  type CanvasElement,
  type ElementStyle,
} from "../engine/elements/types";

export const createElement = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: Tool,
  style: ElementStyle = DEFAULT_STYLE,
  id: string = nanoid()
): CanvasElement => {
  const generator = rough.generator();

  switch (type) {
    case "line": {
      const roughElement = generator.line(x1, y1, x2, y2);
      return { id, x1, y1, x2, y2, type, roughElement, style };
    }
    case "rectangle": {
      const roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
      return { id, x1, y1, x2, y2, type, roughElement, style };
    }
    case "pencil":
      return {
        id,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        type,
        points: [{ x: x1, y: y1 }],
        style,
      };
    case "text":
      return { id, type, x1, y1, x2, y2, text: "", fontSize: 24, style };
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};
