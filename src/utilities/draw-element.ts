import getStroke from "perfect-freehand";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { CanvasElement } from "../engine/elements/types";
import { getSvgPathFromStroke } from "./svg-path";

export const drawElement = (
  roughCanvas: RoughCanvas,
  context: CanvasRenderingContext2D,
  element: CanvasElement
) => {
  context.save();
  context.globalAlpha = element.style.opacity;

  switch (element.type) {
    case "line":
    case "rectangle":
    case "ellipse":
    case "diamond":
      roughCanvas.draw(element.roughElement);
      break;
    case "arrow": {
      roughCanvas.draw(element.roughElement);
      const { x1, y1, x2, y2 } = element;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLength = 15;
      const headAngle = Math.PI / 6;
      context.strokeStyle = element.style.strokeColor;
      context.lineWidth = element.style.strokeWidth;
      context.beginPath();
      context.moveTo(x2, y2);
      context.lineTo(
        x2 - headLength * Math.cos(angle - headAngle),
        y2 - headLength * Math.sin(angle - headAngle)
      );
      context.moveTo(x2, y2);
      context.lineTo(
        x2 - headLength * Math.cos(angle + headAngle),
        y2 - headLength * Math.sin(angle + headAngle)
      );
      context.stroke();
      break;
    }
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
      context.fillStyle = element.style.strokeColor;
      context.fill(new Path2D(stroke));
      break;
    }
    case "text": {
      context.textBaseline = "top";
      context.font = `${element.fontSize}px sans-serif`;
      context.fillStyle = element.style.strokeColor;
      context.fillText(element.text, element.x1, element.y1);
      break;
    }
    default:
      throw new Error(`Type not recognised: ${(element as CanvasElement).type}`);
  }

  context.restore();
};
