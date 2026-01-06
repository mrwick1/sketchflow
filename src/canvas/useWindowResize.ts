import { useEffect } from "react";
import { useCanvasStore } from "../store/useCanvasStore";

export function useWindowResize() {
  const setCanvasSize = useCanvasStore((s) => s.setCanvasSize);

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCanvasSize]);
}
