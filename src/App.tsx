import { MouseEvent, useState } from "react";

export default function App() {
  const [action, setAction] = useState<string>("none");

  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    setAction("drawing");
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    if (action !== "drawing") return;
    const { clientX, clientY } = event;
    console.log("Drawing at", clientX, clientY);
  };

  const handleMouseUp = () => {
    setAction("none");
  };

  return (
    <div>
      <canvas
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ position: "absolute", zIndex: 1 }}
      />
    </div>
  );
}
