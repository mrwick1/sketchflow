import { useEffect } from "react";
import { useCanvasStore } from "../store/useCanvasStore";

export function useWheelHandler() {
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const { onZoom, panOffset, setPanOffset } = useCanvasStore.getState();

      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        onZoom(event.deltaY * -0.01);
      } else {
        setPanOffset({
          x: panOffset.x - event.deltaX,
          y: panOffset.y - event.deltaY,
        });
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
  }, []);
}
