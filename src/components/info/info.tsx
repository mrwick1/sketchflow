import { HelpCircle, X } from "lucide-react";
import "./info-style.css";
import { useRef } from "react";

export function Info() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      <button
        className="infoButton"
        aria-label="Open information dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        <HelpCircle size={18} />
      </button>
      <dialog ref={dialogRef} className="infoDialog" aria-labelledby="info-dialog-title">
        <div className="dialogHeader">
          <h2 id="info-dialog-title" className="dialogTitle">
            How to Use SketchFlow
          </h2>
          <button
            className="closeButton"
            aria-label="Close"
            onClick={() => dialogRef.current?.close()}
          >
            <X size={18} />
          </button>
        </div>
        <div className="infoContent">
          <p>Welcome to SketchFlow! Get started with these simple steps:</p>
          <ul>
            <li>
              <strong>Choose a Tool:</strong> Select from pencil, line,
              rectangle, or text tools to start drawing.
            </li>
            <li>
              <strong>Draw & Move:</strong> Click and drag on the canvas to
              draw. Select an element and drag to move.
            </li>
            <li>
              <strong>Edit Text:</strong> Select the text tool and click on the
              canvas to start typing.
            </li>
            <li>
              <strong>Zoom:</strong> Use Ctrl + Scroll to zoom in and out of the
              canvas.
            </li>
            <li>
              <strong>Pan:</strong> Hold Space and drag to move around the
              canvas, or hold the middle mouse button.
            </li>
          </ul>
          <p>Keyboard Shortcuts:</p>
          <ul>
            <li>
              <strong>Undo:</strong> Ctrl + Z
            </li>
            <li>
              <strong>Redo:</strong> Ctrl + Y or Ctrl + Shift + Z
            </li>
            <li>
              <strong>Zoom In:</strong> Ctrl + Plus
            </li>
            <li>
              <strong>Zoom Out:</strong> Ctrl + Minus
            </li>
          </ul>
          <p>Enjoy creating your masterpiece!</p>
        </div>
      </dialog>
    </div>
  );
}
