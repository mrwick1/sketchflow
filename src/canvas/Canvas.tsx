import { useEffect, useRef } from "react";
import { useCanvasStore } from "../store/useCanvasStore";
import { selectScaleOffset } from "../store/selectors";
import { useShallow } from "zustand/shallow";
import { useCanvasRenderer } from "./useCanvasRenderer";
import { useCanvasEvents } from "./useCanvasEvents";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";
import { useWheelHandler } from "./useWheelHandler";
import { useWindowResize } from "./useWindowResize";
import { updateElement } from "./updateElement";
import styles from "./canvas.module.css";

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useCanvasRenderer(canvasRef);
  useKeyboardShortcuts();
  useWheelHandler();
  useWindowResize();
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasEvents(canvasRef);

  const action = useCanvasStore((s) => s.action);
  const selectedElementId = useCanvasStore((s) => s.selectedElementId);
  const getElement = useCanvasStore((s) => s.getElement);
  const panOffset = useCanvasStore((s) => s.panOffset);
  const scale = useCanvasStore((s) => s.scale);
  const canvasSize = useCanvasStore((s) => s.canvasSize);
  const setAction = useCanvasStore((s) => s.setAction);
  const setSelectedElementId = useCanvasStore((s) => s.setSelectedElementId);
  const setInteraction = useCanvasStore((s) => s.setInteraction);
  const scaleOffset = useCanvasStore(useShallow(selectScaleOffset));

  const selectedElement = selectedElementId ? getElement(selectedElementId) : null;

  // Focus textarea when entering writing mode
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === "writing" && textArea && selectedElementId) {
      const el = getElement(selectedElementId);
      setTimeout(() => {
        textArea.focus();
        textArea.value = (el && el.type === "text" ? el.text : "") || "";
      }, 0);
    }
  }, [action, selectedElementId, getElement]);

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (selectedElementId) {
      const element = getElement(selectedElementId);
      if (element) {
        const { id, x1, y1, type } = element;
        const x2 = element.x2 || x1;
        const y2 = element.y2 || y1;

        setAction("none");
        setSelectedElementId(null);
        setInteraction({ kind: "none" });

        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          updateElement(ctx, id, x1, y1, x2, y2, type, { text: event.target.value });
        }
      }
    } else {
      console.error("No element selected when handleBlur was called");
    }
  };

  return (
    <>
      {action === "writing" ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          className={styles.textArea}
          style={{
            top: selectedElement
              ? (selectedElement.y1 - 2) * scale +
                panOffset.y * scale -
                scaleOffset.y
              : 0,
            left: selectedElement
              ? selectedElement.x1 * scale + panOffset.x * scale - scaleOffset.x
              : 0,
            fontSize: `${24 * scale}px`,
          }}
        />
      ) : null}
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ position: "absolute", zIndex: 1 }}
      />
    </>
  );
}
