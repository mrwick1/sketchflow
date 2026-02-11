import type { CanvasElement } from "../engine/elements/types";

const ACCENT = "#0055FF";

function getElementBounds(element: CanvasElement): {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
} {
  if (element.type === "pencil") {
    // x1/y1/x2/y2 are all 0 for pencil — compute from points
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const p of element.points) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  }

  if (element.type === "text") {
    const width = element.text.length * element.fontSize * 0.6;
    const height = element.fontSize;
    return {
      x1: element.x1,
      y1: element.y1,
      x2: element.x1 + width,
      y2: element.y1 + height,
    };
  }

  return {
    x1: Math.min(element.x1, element.x2),
    y1: Math.min(element.y1, element.y2),
    x2: Math.max(element.x1, element.x2),
    y2: Math.max(element.y1, element.y2),
  };
}

/**
 * Draws a dashed bounding box and corner handles around a selected element.
 * Called in world-space (inside the translate+scale transform).
 */
export function drawSelectionHandles(
  ctx: CanvasRenderingContext2D,
  element: CanvasElement,
  scale: number,
): void {
  const bounds = getElementBounds(element);
  const lineWidth = 1 / scale;
  const dashLen = 5 / scale;
  const handleSize = 8 / scale;
  const halfHandle = handleSize / 2;

  // Dashed bounding box
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash([dashLen, dashLen]);
  ctx.strokeRect(
    bounds.x1,
    bounds.y1,
    bounds.x2 - bounds.x1,
    bounds.y2 - bounds.y1,
  );
  ctx.setLineDash([]);

  // Corner handles
  ctx.fillStyle = ACCENT;

  if (element.type === "line" || element.type === "arrow") {
    // 2 handles at endpoints
    ctx.fillRect(
      element.x1 - halfHandle,
      element.y1 - halfHandle,
      handleSize,
      handleSize,
    );
    ctx.fillRect(
      element.x2 - halfHandle,
      element.y2 - halfHandle,
      handleSize,
      handleSize,
    );
  } else {
    // 4 corner handles
    const corners = [
      [bounds.x1, bounds.y1],
      [bounds.x2, bounds.y1],
      [bounds.x1, bounds.y2],
      [bounds.x2, bounds.y2],
    ];
    for (const [cx, cy] of corners) {
      ctx.fillRect(cx - halfHandle, cy - halfHandle, handleSize, handleSize);
    }
  }
}
