import rough from "roughjs";
import type { CanvasElement } from "../engine/elements/types";
import { drawElement } from "./draw-element";
import { getCanvasBounds } from "./get-bounds";

export const exportToPng = (elements: CanvasElement[]): void => {
  const bounds = getCanvasBounds(elements);
  if (!bounds) return;

  const width = bounds.x2 - bounds.x1;
  const height = bounds.y2 - bounds.y1;

  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;

  const context = offscreen.getContext("2d");
  if (!context) return;

  // White background
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, width, height);

  // Translate so elements render at origin
  context.translate(-bounds.x1, -bounds.y1);

  const roughCanvas = rough.canvas(offscreen);

  for (const element of elements) {
    drawElement(roughCanvas, context, element);
  }

  offscreen.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sketchflow.png";
    a.click();
    URL.revokeObjectURL(url);
  });
};
