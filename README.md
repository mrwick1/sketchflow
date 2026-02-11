# SketchFlow

A hand-drawn style whiteboard built with React, TypeScript, and Rough.js. Create sketchy diagrams with 10 drawing tools, style customization, dark mode, and a snappy command palette.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Features

- **10 Drawing Tools** — Pan, Select, Rectangle, Ellipse, Diamond, Line, Arrow, Pencil, Text, Eraser
- **Hand-drawn Aesthetic** — Rough.js rendering + Perfect Freehand pressure-sensitive strokes
- **Style Customization** — Stroke color, fill, width, opacity, roughness per element
- **Dark Mode** — Full light/dark theme with auto-adjusted stroke colors
- **Command Palette** — Ctrl+K for instant access to all tools and actions
- **Export** — PNG and SVG export of your drawings
- **Grid Background** — Toggleable dot/line/no grid via command palette
- **Selection Handles** — Dashed bounding box and corner handles on selected elements
- **Undo/Redo** — Full history stack with Ctrl+Z / Ctrl+Shift+Z
- **Local Persistence** — Elements, style, theme, and grid preference saved to localStorage
- **Zoom & Pan** — Ctrl+scroll to zoom, Space+drag or middle-click to pan

## Getting Started

```bash
git clone https://github.com/mrwick1/sketchflow.git
cd sketchflow
yarn install
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start dev server |
| `yarn build` | Type-check and build for production |
| `yarn lint` | Run ESLint |
| `yarn test` | Run unit tests with Vitest |

## Keyboard Shortcuts

| Key | Tool |
|-----|------|
| `1` | Pan |
| `2` | Selection |
| `3` | Rectangle |
| `4` | Ellipse |
| `5` | Diamond |
| `6` | Line |
| `7` | Arrow |
| `8` | Pencil |
| `9` | Text |
| `0` | Eraser |
| `Ctrl+K` | Command Palette |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+Scroll` | Zoom in/out |
| `Space+Drag` | Pan canvas |

## Tech Stack

- **React 19** + **TypeScript** — Type-safe component architecture
- **Rough.js** — Hand-drawn style rendering on HTML5 Canvas
- **Perfect Freehand** — Pressure-sensitive pencil strokes
- **Zustand** + **Immer** — Lightweight state management with immutable updates
- **CSS Modules** — Zero-runtime scoped styling
- **Vite 7** — Fast HMR development and optimized builds
- **Vitest** — Unit tests for utility functions

## Project Structure

```
src/
├── app/                    # App shell and layout
├── canvas/                 # Canvas renderer, events, keyboard shortcuts
├── components/
│   ├── action-bar/         # Tool selection toolbar
│   ├── command-palette/    # Ctrl+K command palette
│   ├── control-panel/      # Zoom and undo/redo controls
│   ├── info/               # Help dialog
│   ├── properties-panel/   # Style customization panel
│   └── ui/                 # Shared UI primitives (Kbd, etc.)
├── engine/
│   ├── elements/           # Element types and defaults
│   └── tools/              # Tool and action type definitions
├── hooks/                  # usePressedKeys, useLocalPersistence
├── store/
│   ├── slices/             # Zustand slices (elements, viewport, tool, ui, style)
│   ├── selectors.ts        # Derived state selectors
│   └── useCanvasStore.ts   # Combined store
├── theme/                  # CSS custom properties for light/dark
└── utilities/              # Element creation, drawing, hit-testing, export, grid
```

## Architecture

The app renders to an HTML5 Canvas using Rough.js for the hand-drawn aesthetic. State lives in a single Zustand store composed of five slices (elements, viewport, tool, ui, style) with Immer for immutable updates. Elements are stored in a `Map<string, CanvasElement>` for O(1) lookup by ID.

Key patterns:
- **Element lifecycle**: Create → Draw → Select → Move/Resize → Update
- **Coordinate system**: Client coordinates transformed through pan offset and scale
- **History**: Immutable Map snapshots with index-based undo/redo
- **Rendering**: clear → grid → elements → selection handles (per frame)

## License

[MIT](LICENSE)
