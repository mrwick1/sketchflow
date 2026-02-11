import { Fragment, type ComponentType } from "react";
import { TOOLS, type Tool } from "../../engine/tools/types";
import { useCanvasStore } from "../../store/useCanvasStore";
import { Tooltip } from "../ui";
import {
  Hand, MousePointer2, Square, Circle, Diamond, Minus,
  ArrowUpRight, Pencil, Type, Eraser,
} from "lucide-react";
import styles from "./action-bar.module.css";

const TOOL_ICONS: Record<Tool, ComponentType<{ size?: number }>> = {
  pan: Hand,
  selection: MousePointer2,
  rectangle: Square,
  ellipse: Circle,
  diamond: Diamond,
  line: Minus,
  arrow: ArrowUpRight,
  pencil: Pencil,
  text: Type,
  eraser: Eraser,
};

const TOOL_LABELS: Record<Tool, string> = {
  pan: "Pan",
  selection: "Select",
  rectangle: "Rectangle",
  ellipse: "Ellipse",
  diamond: "Diamond",
  line: "Line",
  arrow: "Arrow",
  pencil: "Pencil",
  text: "Text",
  eraser: "Eraser",
};

const SEPARATOR_AFTER = new Set([1, 6]);

export function ActionBar() {
  const tool = useCanvasStore((s) => s.activeTool);
  const setTool = useCanvasStore((s) => s.setActiveTool);

  return (
    <div className={styles.bar}>
      {Object.values(TOOLS).map((t, index) => {
        const Icon = TOOL_ICONS[t];
        return (
          <Fragment key={t}>
            <Tooltip label={TOOL_LABELS[t]}>
              <button
                className={styles.tool}
                data-active={tool === t}
                aria-pressed={tool === t}
                aria-label={TOOL_LABELS[t]}
                onClick={() => setTool(t)}
              >
                <Icon size={20} />
                <span className={styles.shortcut}>
                  {index === 9 ? "0" : index + 1}
                </span>
              </button>
            </Tooltip>
            {SEPARATOR_AFTER.has(index) && (
              <div className={styles.separator} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
