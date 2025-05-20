# SketchFlow

A collaborative drawing application built with React, TypeScript, and Rough.js. Create hand-drawn style diagrams with freehand drawing, geometric shapes, text tools, and intuitive canvas manipulation.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

<!-- ![SketchFlow Demo](docs/demo.gif) -->

## Features

- **Freehand Drawing** — Pencil tool with pressure-sensitive strokes via Perfect Freehand
- **Geometric Shapes** — Line and rectangle tools with Rough.js hand-drawn style
- **Text Tool** — Add and edit text elements directly on canvas
- **Selection & Transform** — Click to select, drag to move, handles to resize
- **Zoom & Pan** — Scroll to zoom, middle-click or spacebar to pan
- **Undo/Redo** — Full history stack with Ctrl+Z / Ctrl+Y
- **Keyboard Shortcuts** — Number keys for quick tool switching

## Getting Started

```bash
git clone https://github.com/mrwick1/sketchflow.git
cd sketchflow
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests with Vitest |
| `npm run cy:open` | Open Cypress for E2E testing |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1` | Selection tool |
| `2` | Rectangle |
| `3` | Line |
| `4` | Pencil |
| `5` | Text |
| `6` | Pan |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo |
| `Ctrl+Scroll` | Zoom in/out |
| `Space+Drag` | Pan canvas |

## Tech Stack

- **React 18** + **TypeScript** — Type-safe component architecture
- **Rough.js** — Hand-drawn style rendering on HTML5 Canvas
- **Perfect Freehand** — Pressure-sensitive pencil strokes
- **MUI** — Accessible toolbar and dialog components
- **Vite** — Fast HMR development and optimized builds
- **Cypress** — E2E tests for all drawing tools
- **Vitest** — Unit tests for utility functions

## Project Structure

```
src/
├── components/
│   ├── action-bar/        # Tool selection toolbar
│   ├── control-panel/     # Zoom and undo/redo controls
│   └── info/              # Help dialog with shortcuts
├── hooks/
│   ├── useHistory.ts      # Undo/redo state management
│   └── usePressedKeys.ts  # Keyboard input tracking
├── utilities/
│   ├── create-element.ts  # Element factory
│   ├── draw-element.ts    # Canvas rendering with Rough.js
│   ├── get-element-at-position.ts  # Hit detection
│   ├── near-point/        # Proximity detection
│   └── resized-coordinates/  # Resize calculations
├── types.ts               # TypeScript type definitions
└── App.tsx                # Main canvas application
```

## Architecture

The app uses a custom canvas rendering pipeline with Rough.js for the hand-drawn aesthetic. State management is handled through React hooks with a custom history system supporting undo/redo. The element system is extensible — each tool type implements a common interface for creation, drawing, and transformation.

Key patterns:
- **Element lifecycle**: Create → Draw → Select → Move/Resize → Update
- **Coordinate system**: Client coordinates transformed through pan offset and scale
- **History**: Immutable state snapshots with index-based undo/redo

## License

[MIT](LICENSE)
