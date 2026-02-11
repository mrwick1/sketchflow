import { HelpCircle, X } from "lucide-react";
import { useRef } from "react";
import { Kbd } from "../ui";
import styles from "./info.module.css";

export function Info() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      <button
        className={styles.trigger}
        aria-label="Open information dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        <HelpCircle size={18} />
      </button>

      <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="info-dialog-title">
        <div className={styles.header}>
          <h2 id="info-dialog-title" className={styles.title}>
            How to Use SketchFlow
          </h2>
          <button
            className={styles.close}
            aria-label="Close"
            onClick={() => dialogRef.current?.close()}
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.sectionLabel}>Tools</p>
          <ul className={styles.list}>
            <li><Kbd>1</Kbd> Pan — Hold <Kbd>Space</Kbd> + drag, or middle mouse button</li>
            <li><Kbd>2</Kbd> Select — Click to select, drag to move, handles to resize</li>
            <li><Kbd>3</Kbd> Rectangle — Draw rectangles with hand-drawn style</li>
            <li><Kbd>4</Kbd> Ellipse — Draw ellipses</li>
            <li><Kbd>5</Kbd> Diamond — Draw diamond shapes</li>
            <li><Kbd>6</Kbd> Line — Draw straight lines</li>
            <li><Kbd>7</Kbd> Arrow — Draw arrows</li>
            <li><Kbd>8</Kbd> Pencil — Freehand drawing with pressure sensitivity</li>
            <li><Kbd>9</Kbd> Text — Click to place and type text</li>
            <li><Kbd>0</Kbd> Eraser — Click elements to delete</li>
          </ul>

          <p className={styles.sectionLabel}>Shortcuts</p>
          <ul className={styles.list}>
            <li>
              Command Palette — <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
            </li>
            <li>
              Undo — <Kbd>Ctrl</Kbd> + <Kbd>Z</Kbd>
            </li>
            <li>
              Redo — <Kbd>Ctrl</Kbd> + <Kbd>Y</Kbd> or <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>Z</Kbd>
            </li>
            <li>
              Zoom — <Kbd>Ctrl</Kbd> + scroll
            </li>
            <li>
              Pan — <Kbd>Space</Kbd> + drag
            </li>
          </ul>
        </div>
      </dialog>
    </div>
  );
}
