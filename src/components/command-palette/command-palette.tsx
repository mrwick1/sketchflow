import { useState, useEffect, useRef, useMemo, useCallback, type ComponentType } from "react";
import { useCanvasStore } from "../../store/useCanvasStore";
import { exportToPng, exportToSvg } from "../../utilities";
import {
  Hand, MousePointer2, Square, Circle, Diamond, Minus,
  ArrowUpRight, Pencil, Type, Eraser, Undo2, Redo2,
  ZoomIn, ZoomOut, Maximize, Sun, Moon, Download,
  FileCode, Trash2, Grid3x3,
} from "lucide-react";
import styles from "./command-palette.module.css";

interface Command {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  shortcut?: string;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const setActiveTool = useCanvasStore((s) => s.setActiveTool);
  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);
  const onZoom = useCanvasStore((s) => s.onZoom);
  const setScale = useCanvasStore((s) => s.setScale);
  const toggleTheme = useCanvasStore((s) => s.toggleTheme);
  const getElementsArray = useCanvasStore((s) => s.getElementsArray);
  const clearCanvas = useCanvasStore((s) => s.clearCanvas);
  const theme = useCanvasStore((s) => s.theme);
  const setGridStyle = useCanvasStore((s) => s.setGridStyle);

  const commands: Command[] = useMemo(
    () => [
      { id: "pan", label: "Pan", icon: Hand, shortcut: "1", action: () => setActiveTool("pan") },
      { id: "selection", label: "Select", icon: MousePointer2, shortcut: "2", action: () => setActiveTool("selection") },
      { id: "rectangle", label: "Rectangle", icon: Square, shortcut: "3", action: () => setActiveTool("rectangle") },
      { id: "ellipse", label: "Ellipse", icon: Circle, shortcut: "4", action: () => setActiveTool("ellipse") },
      { id: "diamond", label: "Diamond", icon: Diamond, shortcut: "5", action: () => setActiveTool("diamond") },
      { id: "line", label: "Line", icon: Minus, shortcut: "6", action: () => setActiveTool("line") },
      { id: "arrow", label: "Arrow", icon: ArrowUpRight, shortcut: "7", action: () => setActiveTool("arrow") },
      { id: "pencil", label: "Pencil", icon: Pencil, shortcut: "8", action: () => setActiveTool("pencil") },
      { id: "text", label: "Text", icon: Type, shortcut: "9", action: () => setActiveTool("text") },
      { id: "eraser", label: "Eraser", icon: Eraser, shortcut: "0", action: () => setActiveTool("eraser") },
      { id: "undo", label: "Undo", icon: Undo2, shortcut: "Ctrl+Z", action: undo },
      { id: "redo", label: "Redo", icon: Redo2, shortcut: "Ctrl+Shift+Z", action: redo },
      { id: "zoom-in", label: "Zoom In", icon: ZoomIn, action: () => onZoom(0.1) },
      { id: "zoom-out", label: "Zoom Out", icon: ZoomOut, action: () => onZoom(-0.1) },
      { id: "reset-zoom", label: "Reset Zoom", icon: Maximize, action: () => setScale(1) },
      {
        id: "toggle-theme",
        label: theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode",
        icon: theme === "light" ? Moon : Sun,
        action: toggleTheme,
      },
      { id: "grid-dots", label: "Grid: Dots", icon: Grid3x3, action: () => setGridStyle("dots") },
      { id: "grid-lines", label: "Grid: Lines", icon: Grid3x3, action: () => setGridStyle("lines") },
      { id: "grid-none", label: "Grid: None", icon: Grid3x3, action: () => setGridStyle("none") },
      { id: "export-png", label: "Export as PNG", icon: Download, action: () => exportToPng(getElementsArray()) },
      { id: "export-svg", label: "Export as SVG", icon: FileCode, action: () => exportToSvg(getElementsArray()) },
      { id: "clear-canvas", label: "Clear Canvas", icon: Trash2, action: clearCanvas },
    ],
    [setActiveTool, undo, redo, onZoom, setScale, toggleTheme, setGridStyle, getElementsArray, clearCanvas, theme]
  );

  const filtered = useMemo(() => {
    if (!query) return commands;
    const lower = query.toLowerCase();
    return commands.filter((cmd) => cmd.label.toLowerCase().includes(lower));
  }, [commands, query]);

  // Clamp activeIndex to valid range (avoids needing an effect)
  const safeIndex = filtered.length > 0
    ? Math.min(activeIndex, filtered.length - 1)
    : 0;

  const openPalette = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
  }, []);

  // Open/close on Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          closePalette();
        } else {
          openPalette();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, openPalette, closePalette]);

  const execute = (cmd: Command) => {
    closePalette();
    cmd.action();
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setActiveIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Stop tool shortcuts from firing while typing in palette
    e.stopPropagation();

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % filtered.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[safeIndex]) {
          execute(filtered[safeIndex]);
        }
        break;
      case "Escape":
        closePalette();
        break;
    }
  };

  if (!open) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={closePalette} />
      <div className={styles.dialog} onKeyDown={handleKeyDown}>
        <input
          ref={inputRef}
          className={styles.input}
          placeholder="Type a command..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
        />
        <div className={styles.list}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>No commands found</div>
          ) : (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  className={styles.item}
                  data-active={i === safeIndex}
                  onClick={() => execute(cmd)}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <Icon size={16} />
                  <span className={styles.label}>{cmd.label}</span>
                  {cmd.shortcut && (
                    <span className={styles.shortcut}>{cmd.shortcut}</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
