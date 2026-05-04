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

Three-layer Electron architecture, all under `src/`:

- **`src/main/`** — Main process. Entry `src/main/main.ts`. Creates BrowserWindow, manages app lifecycle, handles native/OS integrations and ACP agent management. Built to `dist-electron/main.js`.
- **`src/preload/`** — Context bridge. Entry `src/preload/preload.ts`. Exposes `window.solace` (system/window/acp APIs) to the renderer via `contextBridge.exposeInMainWorld`. All renderer-to-main communication must go through this file.
- **`src/renderer/`** — Renderer process (React app). Entry at `src/renderer/main.tsx`, root component `src/renderer/App.tsx`. Uses `@/` path alias.
- **`src/shared/`** — Shared types and constants (IPC channels, ACP types, IPC API interfaces) used by both main and preload.
- **Build outputs** (`dist/`, `dist-electron/`, `release/`) are generated — never edit manually.

**Key rule:** Never import Electron APIs directly in `src/renderer/`. If renderer code needs native capability, add an IPC channel in `src/shared/constants/ipc-channels.ts`, expose it in `src/preload/preload.ts`, and handle it in `src/main/main.ts`.

## Build Pipeline

1. `tsc` — Type-checks `src/` (strict mode)
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
