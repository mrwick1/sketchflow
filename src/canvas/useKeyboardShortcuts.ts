import { useEffect } from "react";
import { useCanvasStore } from "../store/useCanvasStore";
import type { Tool } from "../engine/tools/types";

const TOOL_KEYS: Record<string, Tool> = {
  "1": "pan",
  "2": "selection",
  "3": "rectangle",
  "4": "ellipse",
  "5": "diamond",
  "6": "line",
  "7": "arrow",
  "8": "pencil",
  "9": "text",
  "0": "eraser",
};

export function useKeyboardShortcuts() {
  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);
  const setActiveTool = useCanvasStore((s) => s.setActiveTool);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement?.tagName === "TEXTAREA") return;

      if (event.ctrlKey || event.metaKey) {
        if (event.key === "z") {
          if (event.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if (event.key === "y") {
          redo();
        }
        return;
      }

      const tool = TOOL_KEYS[event.key];
      if (tool) {
        setActiveTool(tool);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, setActiveTool]);
}
