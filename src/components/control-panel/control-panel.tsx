import { useCanvasStore } from "../../store/useCanvasStore";

import "./control-panel-style.css";
import { Minus, Plus, Github, Undo2, Redo2 } from "lucide-react";

export function ControlPanel() {
  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);
  const onZoom = useCanvasStore((s) => s.onZoom);
  const scale = useCanvasStore((s) => s.scale);
  const setScale = useCanvasStore((s) => s.setScale);

  return (
    <>
      <div className="controlPanel">
        <div className="zoomPanel">
          <button onClick={() => onZoom(-0.1)} aria-label="Zoom Out" title="Zoom Out">
            <Minus size={16} />
          </button>
          <button
            onClick={() => setScale(1)}
            aria-label="Set scale to 100%"
            title="Set scale to 100%"
          >
            {new Intl.NumberFormat("en-GB", { style: "percent" }).format(
              scale
            )}
          </button>
          <button onClick={() => onZoom(0.1)} aria-label="Zoom In" title="Zoom In">
            <Plus size={16} />
          </button>
        </div>

        <div className="editPanel">
          <button onClick={undo} aria-label="Undo last action" title="Undo last action">
            <Undo2 size={16} />
          </button>
          <button onClick={redo} aria-label="Redo last action" title="Redo last action">
            <Redo2 size={16} />
          </button>
        </div>
      </div>{" "}
      <a className="link" href="https://github.com/mrwick1" target="_blank">
        <Github size={16} />
        Built by Arjun KR
      </a>
    </>
  );
}
