import type { CanvasStore } from "./types";

export const selectScaleOffset = (state: CanvasStore) => {
  const { scale, canvasSize } = state;
  return {
    x: (canvasSize.width * scale - canvasSize.width) / 2,
    y: (canvasSize.height * scale - canvasSize.height) / 2,
  };
};
