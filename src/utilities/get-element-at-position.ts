import { nearPoint } from ".";
import type { CanvasElement } from "../engine/elements/types";
import type { HitPosition } from "../engine/tools/types";

export type HitTestResult = {
  element: CanvasElement;
  position: HitPosition;
};

export const getElementAtPosition = (
  x: number,
  y: number,
  elements: CanvasElement[]
): HitTestResult | null => {
  for (let i = elements.length - 1; i >= 0; i--) {
    const position = positionWithinElement(x, y, elements[i]);
    if (position !== null) {
      return { element: elements[i], position };
    }
  }
  return null;
};

type PointLike = { x: number; y: number };

const positionWithinElement = (
  x: number,
  y: number,
  element: CanvasElement
): HitPosition | null => {
  const { x1, x2, y1, y2 } = element;
  switch (element.type) {
    case "line": {
      const on = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, "start");
      const end = nearPoint(x, y, x2, y2, "end");
      return (start || end || on) as HitPosition | null;
    }
    case "rectangle": {
      const topLeft = nearPoint(x, y, x1, y1, "topLeft");
      const topRight = nearPoint(x, y, x2, y1, "topRight");
      const bottomLeft = nearPoint(x, y, x1, y2, "bottomLeft");
      const bottomRight = nearPoint(x, y, x2, y2, "bottomRight");
      const inside =
        x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
      return (topLeft || topRight || bottomLeft || bottomRight || inside) as HitPosition | null;
    }
    case "pencil": {
      const betweenAnyPoint = element.points.some((point, index) => {
        const nextPoint = element.points[index + 1];
        if (!nextPoint) return false;
        return (
          onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null
        );
      });
      return betweenAnyPoint ? "inside" : null;
    }
    case "text":
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
    default:
      throw new Error(`Type not recognised: ${(element as CanvasElement).type}`);
  }
};

const onLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number,
  maxDistance: number = 1
): string | null => {
  const a: PointLike = { x: x1, y: y1 };
  const b: PointLike = { x: x2, y: y2 };
  const c: PointLike = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? "inside" : null;
};

const distance = (a: PointLike, b: PointLike) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
