import rough from "roughjs";
import getStroke from "perfect-freehand";
import type { CanvasElement } from "../engine/elements/types";
import { getCanvasBounds } from "./get-bounds";
import { getSvgPathFromStroke } from "./svg-path";

const SVG_NS = "http://www.w3.org/2000/svg";

export const exportToSvg = (elements: CanvasElement[]): void => {
  const bounds = getCanvasBounds(elements);
  if (!bounds) return;

  const width = bounds.x2 - bounds.x1;
  const height = bounds.y2 - bounds.y1;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("xmlns", SVG_NS);
  svg.setAttribute("width", width.toString());
  svg.setAttribute("height", height.toString());
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  // White background
  const bg = document.createElementNS(SVG_NS, "rect");
  bg.setAttribute("width", width.toString());
  bg.setAttribute("height", height.toString());
  bg.setAttribute("fill", "#FFFFFF");
  svg.appendChild(bg);

  // Wrapper group to translate content
  const wrapper = document.createElementNS(SVG_NS, "g");
  wrapper.setAttribute("transform", `translate(${-bounds.x1}, ${-bounds.y1})`);
  svg.appendChild(wrapper);

  const rc = rough.svg(svg);

  for (const element of elements) {
    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute("opacity", element.style.opacity.toString());

    switch (element.type) {
      case "line":
      case "rectangle":
      case "ellipse":
      case "diamond": {
        const node = rc.draw(element.roughElement);
        group.appendChild(node);
        break;
      }
      case "arrow": {
        const node = rc.draw(element.roughElement);
        group.appendChild(node);

        // Arrowhead
        const { x1, y1, x2, y2 } = element;
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const headLength = 15;
        const headAngle = Math.PI / 6;

        const line1 = document.createElementNS(SVG_NS, "line");
        line1.setAttribute("x1", x2.toString());
        line1.setAttribute("y1", y2.toString());
        line1.setAttribute("x2", (x2 - headLength * Math.cos(angle - headAngle)).toString());
        line1.setAttribute("y2", (y2 - headLength * Math.sin(angle - headAngle)).toString());
        line1.setAttribute("stroke", element.style.strokeColor);
        line1.setAttribute("stroke-width", element.style.strokeWidth.toString());

        const line2 = document.createElementNS(SVG_NS, "line");
        line2.setAttribute("x1", x2.toString());
        line2.setAttribute("y1", y2.toString());
        line2.setAttribute("x2", (x2 - headLength * Math.cos(angle + headAngle)).toString());
        line2.setAttribute("y2", (y2 - headLength * Math.sin(angle + headAngle)).toString());
        line2.setAttribute("stroke", element.style.strokeColor);
        line2.setAttribute("stroke-width", element.style.strokeWidth.toString());

        group.appendChild(line1);
        group.appendChild(line2);
        break;
      }
      case "pencil": {
        const strokePoints = getStroke(element.points as { x: number; y: number }[]);
        const formatted: [number, number][] = strokePoints.map((p) => [p[0], p[1]]);
        const pathData = getSvgPathFromStroke(formatted);

        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", pathData);
        path.setAttribute("fill", element.style.strokeColor);
        group.appendChild(path);
        break;
      }
      case "text": {
        const text = document.createElementNS(SVG_NS, "text");
        text.setAttribute("x", element.x1.toString());
        text.setAttribute("y", element.y1.toString());
        text.setAttribute("font-family", "sans-serif");
        text.setAttribute("font-size", element.fontSize.toString());
        text.setAttribute("fill", element.style.strokeColor);
        text.setAttribute("dominant-baseline", "hanging");
        text.textContent = element.text;
        group.appendChild(text);
        break;
      }
    }

    wrapper.appendChild(group);
  }

  const serialized = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([serialized], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sketchflow.svg";
  a.click();
  URL.revokeObjectURL(url);
};
