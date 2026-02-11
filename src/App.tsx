import { useEffect } from "react";
import { Canvas } from "./canvas/Canvas";
import { ActionBar, CommandPalette, ControlPanel, Info, PropertiesPanel } from "./components";
import { useLocalPersistence } from "./hooks/useLocalPersistence";
import { useCanvasStore } from "./store/useCanvasStore";

export default function App() {
  const theme = useCanvasStore((s) => s.theme);
  useLocalPersistence();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div>
      <Info />
      <ActionBar />
      <Canvas />
      <PropertiesPanel />
      <ControlPanel />
      <CommandPalette />
    </div>
  );
}
