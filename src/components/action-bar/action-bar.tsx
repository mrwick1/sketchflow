import { TOOLS } from "../../engine/tools/types";
import { useCanvasStore } from "../../store/useCanvasStore";

import { Hand, MousePointer2, Square, Minus, Pencil, Type } from "lucide-react";
import "./action-bar-style.css";

export function ActionBar() {
  const tool = useCanvasStore((s) => s.activeTool);
  const setTool = useCanvasStore((s) => s.setActiveTool);

  return (
    <div className="actionBar">
      {Object.values(TOOLS).map((t, index) => (
        <div
          className={`inputWrapper ${tool === t ? "selected" : ""}`}
          key={t}
          onClick={() => setTool(t)}
        >
          <input
            type="radio"
            id={t}
            checked={tool === t}
            onChange={() => setTool(t)}
            readOnly
          />
          <label htmlFor={t}>{t}</label>
          {t === "pan" && <Hand size={16} />}
          {t === "selection" && <MousePointer2 size={16} />}
          {t === "rectangle" && <Square size={16} />}
          {t === "line" && <Minus size={16} />}
          {t === "pencil" && <Pencil size={16} />}
          {t === "text" && <Type size={16} />}
          <span>{index + 1}</span>
        </div>
      ))}
    </div>
  );
}
