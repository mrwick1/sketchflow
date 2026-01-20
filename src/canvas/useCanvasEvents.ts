import { type MouseEvent, type RefObject, useCallback } from "react";
import { useCanvasStore } from "../store/useCanvasStore";
import { selectScaleOffset } from "../store/selectors";
import { usePressedKeys } from "../hooks/usePressedKeys";
import { updateElement } from "./updateElement";
import { useShallow } from "zustand/shallow";
import {
  adjustElementCoordinates,
  adjustmentRequired,
  createElement,
  cursorForPosition,
  getElementAtPosition,
  resizedCoordinates,
} from "../utilities";

export function useCanvasEvents(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const action = useCanvasStore((s) => s.action);
  const activeTool = useCanvasStore((s) => s.activeTool);
  const interaction = useCanvasStore((s) => s.interaction);
  const selectedElementId = useCanvasStore((s) => s.selectedElementId);
  const panOffset = useCanvasStore((s) => s.panOffset);
  const startPanMousePosition = useCanvasStore((s) => s.startPanMousePosition);
  const scale = useCanvasStore((s) => s.scale);
  const scaleOffset = useCanvasStore(useShallow(selectScaleOffset));

  const getElement = useCanvasStore((s) => s.getElement);
  const getElementsArray = useCanvasStore((s) => s.getElementsArray);
  const pushHistory = useCanvasStore((s) => s.pushHistory);
  const addElement = useCanvasStore((s) => s.addElement);
  const overwriteHistory = useCanvasStore((s) => s.overwriteHistory);
  const replaceAndOverwrite = useCanvasStore((s) => s.replaceAndOverwrite);
  const deleteElement = useCanvasStore((s) => s.deleteElement);
  const setAction = useCanvasStore((s) => s.setAction);
  const setInteraction = useCanvasStore((s) => s.setInteraction);
  const setSelectedElementId = useCanvasStore((s) => s.setSelectedElementId);
  const setStartPanMousePosition = useCanvasStore((s) => s.setStartPanMousePosition);
  const setPanOffset = useCanvasStore((s) => s.setPanOffset);

  const pressedKeys = usePressedKeys();

  const getMouseCoordinates = useCallback(
    (event: MouseEvent) => {
      const clientX =
        (event.clientX - panOffset.x * scale + scaleOffset.x) / scale;
      const clientY =
        (event.clientY - panOffset.y * scale + scaleOffset.y) / scale;
      return { clientX, clientY };
    },
    [panOffset, scale, scaleOffset]
  );

  const getCanvasContext = useCallback((): CanvasRenderingContext2D | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext("2d");
  }, [canvasRef]);

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      if (action === "writing") return;

      const { clientX, clientY } = getMouseCoordinates(event);

      if (activeTool === "pan" || event.button === 1 || pressedKeys.has(" ")) {
        setAction("panning");
        setStartPanMousePosition({ x: clientX, y: clientY });
        document.body.style.cursor = "grabbing";
        return;
      }

      if (activeTool === "eraser") {
        const hit = getElementAtPosition(clientX, clientY, getElementsArray());
        if (hit) {
          pushHistory();
          deleteElement(hit.element.id);
          overwriteHistory();
        }
        return;
      }

      if (activeTool === "selection") {
        const elementsArr = getElementsArray();
        const hit = getElementAtPosition(clientX, clientY, elementsArr);

        if (hit) {
          const { element, position } = hit;

          if (element.type === "pencil") {
            const pointOffsets = element.points.map((point) => ({
              dx: clientX - point.x,
              dy: clientY - point.y,
            }));
            setInteraction({
              kind: "moving",
              elementId: element.id,
              pointOffsets,
              offsetX: 0,
              offsetY: 0,
            });
          } else {
            const offsetX = clientX - element.x1;
            const offsetY = clientY - element.y1;
            setInteraction(
              position === "inside"
                ? {
                    kind: "moving",
                    elementId: element.id,
                    offsetX,
                    offsetY,
                  }
                : {
                    kind: "resizing",
                    elementId: element.id,
                    position,
                  }
            );
          }

          setSelectedElementId(element.id);
          pushHistory();

          if (position === "inside") {
            setAction("moving");
          } else {
            setAction("resizing");
          }
        } else {
          // Clicked empty space — deselect
          setSelectedElementId(null);
        }
      } else {
        const activeStyle = useCanvasStore.getState().activeStyle;
        const newElement = createElement(clientX, clientY, clientX, clientY, activeTool, activeStyle);
        pushHistory();
        addElement(newElement);
        overwriteHistory();
        setSelectedElementId(newElement.id);
        setInteraction({ kind: "drawing", elementId: newElement.id });
        setAction(activeTool === "text" ? "writing" : "drawing");
      }
    },
    [
      action, activeTool, pressedKeys, getMouseCoordinates,
      getElementsArray, pushHistory, addElement, overwriteHistory, deleteElement,
      setAction, setInteraction, setSelectedElementId, setStartPanMousePosition,
    ]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      const { clientX, clientY } = getMouseCoordinates(event);

      if (action === "panning") {
        const deltaX = clientX - startPanMousePosition.x;
        const deltaY = clientY - startPanMousePosition.y;
        setPanOffset({
          x: panOffset.x + deltaX,
          y: panOffset.y + deltaY,
        });
        return;
      }

      if (activeTool === "selection") {
        const elementsArr = getElementsArray();
        const hit = getElementAtPosition(clientX, clientY, elementsArr);

        if (hit) {
          (event.target as HTMLElement).style.cursor = cursorForPosition(
            hit.position
          );
        } else {
          (event.target as HTMLElement).style.cursor = "default";
        }
      } else if (activeTool === "eraser") {
        const hit = getElementAtPosition(clientX, clientY, getElementsArray());
        (event.target as HTMLElement).style.cursor = hit ? "pointer" : "default";
      }

      const ctx = getCanvasContext();
      if (!ctx) return;

      if (action === "drawing" && interaction.kind === "drawing") {
        const element = getElement(interaction.elementId);
        if (element) {
          updateElement(ctx, interaction.elementId, element.x1, element.y1, clientX, clientY, activeTool);
        }
      } else if (action === "moving" && interaction.kind === "moving") {
        const element = getElement(interaction.elementId);
        if (!element) return;

        if (element.type === "pencil" && interaction.pointOffsets) {
          const newPoints = element.points.map((_, index) => ({
            x: clientX - interaction.pointOffsets![index].dx,
            y: clientY - interaction.pointOffsets![index].dy,
          }));
          replaceAndOverwrite(element.id, { ...element, points: newPoints });
        } else {
          const { offsetX, offsetY } = interaction;
          const newX1 = clientX - offsetX;
          const newY1 = clientY - offsetY;
          const newX2 = newX1 + (element.x2 - element.x1);
          const newY2 = newY1 + (element.y2 - element.y1);
          const options =
            element.type === "text" ? { text: element.text } : undefined;
          updateElement(ctx, element.id, newX1, newY1, newX2, newY2, element.type, options);
        }
      } else if (action === "resizing" && interaction.kind === "resizing") {
        const element = getElement(interaction.elementId);
        if (!element) return;

        const { x1, y1, x2, y2 } = resizedCoordinates(
          clientX,
          clientY,
          interaction.position,
          { x1: element.x1, y1: element.y1, x2: element.x2, y2: element.y2 }
        );
        updateElement(ctx, element.id, x1, y1, x2, y2, element.type);
      }
    },
    [
      action, activeTool, interaction, panOffset, startPanMousePosition,
      getMouseCoordinates, getCanvasContext, getElement, getElementsArray,
      replaceAndOverwrite, setPanOffset,
    ]
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      const { clientX, clientY } = getMouseCoordinates(event);
      const ctx = getCanvasContext();

      if (selectedElementId && ctx) {
        const element = getElement(selectedElementId);
        if (element) {
          if (
            (action === "drawing" || action === "resizing") &&
            adjustmentRequired(element.type)
          ) {
            const { x1, y1, x2, y2 } = adjustElementCoordinates(element);
            updateElement(ctx, element.id, x1, y1, x2, y2, element.type);
          }

          if (
            element.type === "text" &&
            interaction.kind === "moving"
          ) {
            const { offsetX, offsetY } = interaction;
            if (
              clientX - offsetX === element.x1 &&
              clientY - offsetY === element.y1
            ) {
              setAction("writing");
              return;
            }
          }
        }
      }

      if (action === "writing") {
        return;
      }

      if (action === "panning") {
        document.body.style.cursor = "default";
      }

      // Keep selection visible after move/resize with selection tool
      const keepSelection =
        activeTool === "selection" &&
        (action === "moving" || action === "resizing");

      setAction("none");
      if (!keepSelection) {
        setSelectedElementId(null);
      }
      setInteraction({ kind: "none" });
    },
    [
      action, activeTool, interaction, selectedElementId,
      getMouseCoordinates, getCanvasContext, getElement,
      setAction, setInteraction, setSelectedElementId,
    ]
  );

  return { handleMouseDown, handleMouseMove, handleMouseUp };
}
