import { type RefObject, useLayoutEffect } from "react";
import rough from "roughjs";
import { useCanvasStore } from "../store/useCanvasStore";
import { selectScaleOffset } from "../store/selectors";
import { drawElement } from "../utilities";
import { useShallow } from "zustand/shallow";

export function useCanvasRenderer(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const elements = useCanvasStore((s) => s.elements);
  const action = useCanvasStore((s) => s.action);
  const selectedElementId = useCanvasStore((s) => s.selectedElementId);
  const panOffset = useCanvasStore((s) => s.panOffset);
  const scale = useCanvasStore((s) => s.scale);
  const canvasSize = useCanvasStore((s) => s.canvasSize);
  const getElementsArray = useCanvasStore((s) => s.getElementsArray);
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

    const elementsArr = getElementsArray();
    elementsArr.forEach((element) => {
      if (action === "writing" && selectedElementId === element.id) return;
      drawElement(roughCanvas, context, element);
    });
    context.restore();
  }, [elements, action, selectedElementId, panOffset, scale, canvasSize, scaleOffset, getElementsArray, canvasRef]);
}
