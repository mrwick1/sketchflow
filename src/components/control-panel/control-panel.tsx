import { useCanvasStore } from "../../store/useCanvasStore";
import { exportToPng, exportToSvg } from "../../utilities";
import { Tooltip } from "../ui";
import { Minus, Plus, Github, Undo2, Redo2, Moon, Sun, Download, FileCode } from "lucide-react";
import styles from "./control-panel.module.css";

export function ControlPanel() {
  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);
  const onZoom = useCanvasStore((s) => s.onZoom);
  const scale = useCanvasStore((s) => s.scale);
  const setScale = useCanvasStore((s) => s.setScale);
  const theme = useCanvasStore((s) => s.theme);
  const toggleTheme = useCanvasStore((s) => s.toggleTheme);
  const getElementsArray = useCanvasStore((s) => s.getElementsArray);
  const elements = useCanvasStore((s) => s.elements);

  const isEmpty = elements.size === 0;

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.group}>
          <Tooltip label="Zoom out" position="top">
            <button className={styles.btn} onClick={() => onZoom(-0.1)} aria-label="Zoom out">
              <Minus size={16} />
            </button>
          </Tooltip>
          <button
            className={`${styles.btn} ${styles.scale}`}
            onClick={() => setScale(1)}
            aria-label="Reset zoom"
          >
            {new Intl.NumberFormat("en-GB", { style: "percent" }).format(scale)}
          </button>
          <Tooltip label="Zoom in" position="top">
            <button className={styles.btn} onClick={() => onZoom(0.1)} aria-label="Zoom in">
              <Plus size={16} />
            </button>
          </Tooltip>
        </div>

        <div className={styles.group}>
          <Tooltip label="Undo" position="top">
            <button className={styles.btn} onClick={undo} aria-label="Undo">
              <Undo2 size={16} />
            </button>
          </Tooltip>
          <Tooltip label="Redo" position="top">
            <button className={styles.btn} onClick={redo} aria-label="Redo">
              <Redo2 size={16} />
            </button>
          </Tooltip>
        </div>

        <div className={styles.group}>
          <Tooltip label="Export PNG" position="top">
            <button
              className={styles.btn}
              onClick={() => exportToPng(getElementsArray())}
              disabled={isEmpty}
              aria-label="Export PNG"
            >
              <Download size={16} />
            </button>
          </Tooltip>
          <Tooltip label="Export SVG" position="top">
            <button
              className={styles.btn}
              onClick={() => exportToSvg(getElementsArray())}
              disabled={isEmpty}
              aria-label="Export SVG"
            >
              <FileCode size={16} />
            </button>
          </Tooltip>
        </div>

        <div className={styles.group}>
          <Tooltip label={theme === "light" ? "Dark mode" : "Light mode"} position="top">
            <button className={styles.btn} onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </Tooltip>
        </div>
      </div>

      <a
        className={styles.attribution}
        href="https://github.com/mrwick1"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Github size={14} />
        Built by Arjun KR
      </a>
    </>
  );
}
