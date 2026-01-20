import { type RefObject, useLayoutEffect } from "react";
import rough from "roughjs";
import { useCanvasStore } from "../store/useCanvasStore";
import { selectScaleOffset } from "../store/selectors";
import { drawElement, drawGrid, drawSelectionHandles } from "../utilities";
import { useShallow } from "zustand/shallow";

export function useCanvasRenderer(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const elements = useCanvasStore((s) => s.elements);
  const action = useCanvasStore((s) => s.action);
  const selectedElementId = useCanvasStore((s) => s.selectedElementId);
  const panOffset = useCanvasStore((s) => s.panOffset);
  const scale = useCanvasStore((s) => s.scale);
  const canvasSize = useCanvasStore((s) => s.canvasSize);
  const getElementsArray = useCanvasStore((s) => s.getElementsArray);
  const getElement = useCanvasStore((s) => s.getElement);
  const gridStyle = useCanvasStore((s) => s.gridStyle);
  const theme = useCanvasStore((s) => s.theme);
  const scaleOffset = useCanvasStore(useShallow(selectScaleOffset));

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const roughCanvas = rough.canvas(canvas);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(
      panOffset.x * scale - scaleOffset.x,
      panOffset.y * scale - scaleOffset.y
    );
    context.scale(scale, scale);

    // Grid (behind everything)
    drawGrid(context, gridStyle, canvasSize.width, canvasSize.height, panOffset, scale, scaleOffset, theme === "dark");

    // Elements
    const elementsArr = getElementsArray();
    elementsArr.forEach((element) => {
      if (action === "writing" && selectedElementId === element.id) return;
      drawElement(roughCanvas, context, element);
    });

    // Selection handles (on top)
    if (selectedElementId && action === "none") {
      const selected = getElement(selectedElementId);
      if (selected) {
        drawSelectionHandles(context, selected, scale);
      }
    }

    context.restore();
  }, [elements, action, selectedElementId, panOffset, scale, canvasSize, scaleOffset, getElementsArray, getElement, gridStyle, theme, canvasRef]);
}
