import type { Bounds, CanvasElement } from "../engine/elements/types";

export const getCanvasBounds = (
  elements: CanvasElement[],
  padding = 20
): Bounds | null => {
  if (elements.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const el of elements) {
    if (el.type === "pencil") {
      for (const p of el.points) {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      }
    } else if (el.type === "text") {
      const x1 = el.x1;
      const y1 = el.y1;
      // Approximate text width: fontSize * 0.6 per character
      const textWidth = el.text.length * el.fontSize * 0.6;
      const textHeight = el.fontSize;
      if (x1 < minX) minX = x1;
      if (y1 < minY) minY = y1;
      if (x1 + textWidth > maxX) maxX = x1 + textWidth;
      if (y1 + textHeight > maxY) maxY = y1 + textHeight;
    } else {
      const x1 = Math.min(el.x1, el.x2);
      const y1 = Math.min(el.y1, el.y2);
      const x2 = Math.max(el.x1, el.x2);
      const y2 = Math.max(el.y1, el.y2);
      if (x1 < minX) minX = x1;
      if (y1 < minY) minY = y1;
      if (x2 > maxX) maxX = x2;
      if (y2 > maxY) maxY = y2;
    }
  }

  return {
    x1: minX - padding,
    y1: minY - padding,
    x2: maxX + padding,
    y2: maxY + padding,
  };
};
