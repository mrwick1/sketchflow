import type { Options } from "roughjs/bin/core";
import type { ElementStyle } from "../engine/elements/types";

export const styleToRoughOptions = (style: ElementStyle, seed?: number): Options => {
  const options: Options = {
    stroke: style.strokeColor,
    strokeWidth: style.strokeWidth,
    roughness: style.roughness,
    seed,
  };
  if (style.fillColor !== "none") {
    options.fill = style.fillColor;
    options.fillStyle = "hachure";
  }
  return options;
};
