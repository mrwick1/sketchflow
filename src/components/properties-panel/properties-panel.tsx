import type { ElementStyle } from "../../engine/elements/types";
import { useCanvasStore } from "../../store/useCanvasStore";
import styles from "./properties-panel.module.css";

const STROKE_COLORS = [
  "#1A1A1A", "#E8E8E8", "#343A40", "#C92A2A", "#A61E4D", "#862E9C",
  "#5F3DC4", "#364FC7", "#0055FF", "#0B7285", "#2B8A3E", "#E67700",
];

const FILL_COLORS = [
  "none", "#FFE3E3", "#FFF0F6", "#F3F0FF", "#E7F5FF", "#E3FAFC",
  "#EBFBEE", "#FFF9DB", "#FFF4E6", "#F8F9FA", "#DEE2E6", "#868E96",
];

const STROKE_WIDTHS = [1, 2, 3, 5];

const DRAWING_TOOLS = new Set(["rectangle", "ellipse", "diamond", "line", "arrow", "pencil", "text"]);
const FILL_TYPES = new Set(["rectangle", "ellipse", "diamond"]);

export function PropertiesPanel() {
  const activeTool = useCanvasStore((s) => s.activeTool);
  const selectedElementId = useCanvasStore((s) => s.selectedElementId);
  const activeStyle = useCanvasStore((s) => s.activeStyle);
  const setActiveStyle = useCanvasStore((s) => s.setActiveStyle);
  const getElement = useCanvasStore((s) => s.getElement);
  const pushHistory = useCanvasStore((s) => s.pushHistory);
  const updateElementStyle = useCanvasStore((s) => s.updateElementStyle);
  const overwriteHistory = useCanvasStore((s) => s.overwriteHistory);

  const selectedElement = selectedElementId ? getElement(selectedElementId) : undefined;
  const isVisible = DRAWING_TOOLS.has(activeTool) || selectedElement != null;

  if (!isVisible) return null;

  const currentStyle: ElementStyle = selectedElement ? selectedElement.style : activeStyle;
  const showFill = selectedElement
    ? FILL_TYPES.has(selectedElement.type)
    : FILL_TYPES.has(activeTool);

  const applyStyle = (update: Partial<ElementStyle>) => {
    if (selectedElement) {
      pushHistory();
      updateElementStyle(selectedElement.id, update);
      overwriteHistory();
    } else {
      setActiveStyle(update);
    }
  };

  return (
    <div className={styles.panel}>
      <section>
        <div className={styles.sectionLabel}>Stroke</div>
        <div className={styles.colorGrid}>
          {STROKE_COLORS.map((color) => (
            <button
              key={color}
              className={styles.swatch}
              style={{ background: color }}
              data-active={currentStyle.strokeColor === color}
              aria-label={`Stroke color ${color}`}
              onClick={() => applyStyle({ strokeColor: color })}
            />
          ))}
        </div>
      </section>

      {showFill && (
        <section>
          <div className={styles.sectionLabel}>Fill</div>
          <div className={styles.colorGrid}>
            {FILL_COLORS.map((color) => (
              <button
                key={color}
                className={`${styles.swatch}${color === "none" ? ` ${styles.swatchNone}` : ""}`}
                style={color !== "none" ? { background: color } : undefined}
                data-active={currentStyle.fillColor === color}
                aria-label={color === "none" ? "No fill" : `Fill color ${color}`}
                onClick={() => applyStyle({ fillColor: color })}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className={styles.sectionLabel}>Width</div>
        <div className={styles.widthGroup}>
          {STROKE_WIDTHS.map((w) => (
            <button
              key={w}
              className={styles.widthButton}
              data-active={currentStyle.strokeWidth === w}
              onClick={() => applyStyle({ strokeWidth: w })}
            >
              {w}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
