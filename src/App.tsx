import { Canvas } from "./canvas/Canvas";
import { ActionBar, ControlPanel, Info } from "./components";

export default function App() {
  return (
    <div>
      <Info />
      <ActionBar />
      <Canvas />
      <ControlPanel />
    </div>
  );
}
