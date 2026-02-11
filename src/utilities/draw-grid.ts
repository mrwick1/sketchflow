import type { GridStyle } from "../store/slices/uiSlice";

const GRID_SPACING = 20;

const COLORS = {
  dots: { light: "#D4D4D4", dark: "#2A2A2A" },
  lines: { light: "#E8E8E8", dark: "#1F1F1F" },
};

/**
 * Draws a dot or line grid in world space.
 * Called inside the renderer's translate+scale transform block,
 * so all coordinates are world-space.
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  gridStyle: GridStyle,
  canvasWidth: number,
  canvasHeight: number,
  panOffset: { x: number; y: number },
  scale: number,
  scaleOffset: { x: number; y: number },
  isDark: boolean,
): void {
  if (gridStyle === "none") return;

  // Compute visible world-space bounds from current transform
  const worldLeft = (-panOffset.x * scale + scaleOffset.x) / scale;
  const worldTop = (-panOffset.y * scale + scaleOffset.y) / scale;
  const worldRight = worldLeft + canvasWidth / scale;
  const worldBottom = worldTop + canvasHeight / scale;

  // Snap to grid boundaries
  const startX = Math.floor(worldLeft / GRID_SPACING) * GRID_SPACING;
  const startY = Math.floor(worldTop / GRID_SPACING) * GRID_SPACING;
  const endX = Math.ceil(worldRight / GRID_SPACING) * GRID_SPACING;
  const endY = Math.ceil(worldBottom / GRID_SPACING) * GRID_SPACING;

  const mode = isDark ? "dark" : "light";

  if (gridStyle === "dots") {
    const color = COLORS.dots[mode];
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let x = startX; x <= endX; x += GRID_SPACING) {
      for (let y = startY; y <= endY; y += GRID_SPACING) {
        ctx.moveTo(x + 1, y);
        ctx.arc(x, y, 1, 0, Math.PI * 2);
      }
    }
    ctx.fill();
  } else {
    // lines
    const color = COLORS.lines[mode];
    ctx.strokeStyle = color;
    ctx.lineWidth = 1 / scale;
    ctx.beginPath();
    for (let x = startX; x <= endX; x += GRID_SPACING) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += GRID_SPACING) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();
  }
}
