import getStroke from "perfect-freehand";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { CanvasElement } from "../engine/elements/types";

export const drawElement = (
  roughCanvas: RoughCanvas,
  context: CanvasRenderingContext2D,
  element: CanvasElement
) => {
  switch (element.type) {
    case "line":
    case "rectangle":
      roughCanvas.draw(element.roughElement);
      break;
    case "pencil": {
      const strokePoints = getStroke(element.points as { x: number; y: number }[]);
      const formattedPoints: [number, number][] = strokePoints.map((point) => {
        if (point.length !== 2) {
          throw new Error(
            `Expected point to have exactly 2 elements, got ${point.length}`
          );
        }
        return [point[0], point[1]];
      });
      const stroke = getSvgPathFromStroke(formattedPoints);
      context.fill(new Path2D(stroke));
      break;
    }
    case "text": {
      context.textBaseline = "top";
      context.font = `${element.fontSize}px sans-serif`;
      context.fillText(element.text, element.x1, element.y1);
      break;
    }
    default:
      throw new Error(`Type not recognised: ${(element as CanvasElement).type}`);
  }
};

const getSvgPathFromStroke = (stroke: [number, number][]) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (
      acc: string[],
      [x0, y0]: [number, number],
      i: number,
      arr: [number, number][]
    ) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(
        x0.toString(),
        y0.toString(),
        ((x0 + x1) / 2).toString(),
        ((y0 + y1) / 2).toString()
      );
      return acc;
    },
    ["M", ...stroke[0].map((num) => num.toString()), "Q"]
  );

  d.push("Z");
  return d.join(" ");
};
