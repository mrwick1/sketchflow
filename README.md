# SketchFlow

A collaborative drawing application built with React, TypeScript, and Rough.js. Features freehand drawing, geometric shapes, text tools, and intuitive canvas manipulation.


![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)

## Features

- **Drawing Tools** — Pencil, line, rectangle with Rough.js hand-drawn style
- **Text Tool** — Add and edit text elements on canvas
- **Selection & Transform** — Move, resize, and manipulate elements
- **Zoom & Pan** — Scroll to zoom, middle-click to pan
- **Undo/Redo** — Full history management with Ctrl+Z/Ctrl+Y
- **Keyboard Shortcuts** — Efficient workflow with hotkeys

## Tech Stack

- **React 18** + **TypeScript** — Type-safe component architecture
- **Rough.js** — Hand-drawn style rendering on HTML Canvas
- **Perfect Freehand** — Pressure-sensitive pencil strokes
- **Vite** — Fast development and optimized builds
- **MUI** — Accessible toolbar components
- **Cypress** + **Vitest** — E2E and unit testing

## Getting Started

```bash
git clone https://github.com/mrwick1/sketchflow.git
cd sketchflow
npm install
npm run dev
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1` | Selection tool |
| `2` | Rectangle |
| `3` | Line |
| `4` | Pencil |
| `5` | Text |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |

## Architecture

The app uses a custom canvas rendering pipeline with Rough.js for the hand-drawn aesthetic. State management is handled through React hooks with a custom history system supporting undo/redo. The element system is extensible — each tool type implements a common interface for creation, drawing, and transformation.

## License

MIT
