# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Solace is an Electron desktop application built with Vite, React 18, and TypeScript. The project is in early stages (v0.0.0, scaffolded skeleton).

## Commands

```bash
npm run dev       # Start Vite dev server (HMR for renderer, auto-reload for main process)
npm run build     # tsc → vite build → electron-builder (full production build + packaging)
npm run lint      # ESLint with --max-warnings 0 (warnings fail the build)
npm run preview   # Preview production renderer build locally
```

No test runner is configured yet.

## Architecture

Two-process Electron architecture with strict separation:

- **`electron/main.ts`** — Main process. Creates BrowserWindow, manages app lifecycle, handles native/OS integrations. Built to `dist-electron/main.js`.
- **`electron/preload.ts`** — Context bridge. Exposes `window.ipcRenderer` (on/off/send/invoke) to the renderer. All renderer-to-main communication must go through this file.
- **`src/`** — Renderer process (React app). Entry at `src/main.tsx`, root component `src/App.tsx`.
- **Build outputs** (`dist/`, `dist-electron/`, `release/`) are generated — never edit manually.

**Key rule:** Never import Electron APIs directly in `src/`. If renderer code needs native capability, add an IPC channel in `preload.ts` and handle it in `main.ts`.

## Build Pipeline

1. `tsc` — Type-checks both `src/` and `electron/` (strict mode)
2. `vite build` — Bundles renderer to `dist/`
3. `vite-plugin-electron` — Bundles main/preload to `dist-electron/`
4. `electron-builder` — Packages app per `electron-builder.json5` (NSIS for Windows, DMG for macOS, AppImage for Linux)

The package is ESM (`"type": "module"`). The main process uses `createRequire` for CJS compatibility where needed.

## Coding Conventions

- TypeScript with strict mode, functional React components only
- 2-space indentation, no semicolons, single quotes
- PascalCase for components (`SettingsPanel.tsx`), camelCase with `use` prefix for hooks (`useWindowState.ts`)
- Use `lucide-react` as the default icon library for new UI work; only add another icon set when Lucide does not cover the requirement
- Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:` — short imperative messages
- ESLint is the style authority — fix lint issues before committing

## IPC Pattern

Main process → Renderer: `win.webContents.send(channel, data)`
Renderer → Main: `window.ipcRenderer.invoke(channel, data)` (promise-based) or `.send(channel, data)` (fire-and-forget)
