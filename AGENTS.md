# Repository Guidelines

## Project Structure & Module Organization
This repository is an Electron desktop app built with Vite, React, and TypeScript. Frontend code lives in `src/`: `main.tsx` boots React, `App.tsx` is the root UI, and shared styles are in `App.css` and `index.css`. Electron process code lives in `electron/`: `main.ts` creates the application window and `preload.ts` exposes safe renderer APIs. Static assets belong in `public/` or `src/assets/`. Build outputs are generated into `dist/`, `dist-electron/`, and `release/`; do not edit those directories manually.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start the Vite development server for renderer work.
- `npm run build`: run TypeScript checks, build the renderer, and package the Electron app with `electron-builder`.
- `npm run preview`: preview the production renderer build locally.
- `npm run lint`: run ESLint across the repository and fail on warnings.

## Coding Style & Naming Conventions
Use TypeScript and functional React components. Follow the existing 2-space indentation, semicolon-free style, and single-quote preference where applicable. Name React components in PascalCase (`SettingsPanel.tsx`), hooks in camelCase with a `use` prefix (`useWindowState.ts`), and keep Electron entry files descriptive (`main.ts`, `preload.ts`). Use `lucide-react` as the default icon library whenever UI work needs icons; only introduce another icon set when Lucide clearly lacks the required asset. Let ESLint drive consistency; fix lint issues before opening a PR.

## Testing Guidelines
No automated test runner is configured yet. For now, treat `npm run lint` as the minimum quality gate and perform a manual smoke test in development mode before submitting changes. When adding tests, place renderer tests beside the feature or under `src/__tests__/`, and prefer names like `App.test.tsx` or `window-state.test.ts`.

## Commit & Pull Request Guidelines
The current history uses short, imperative commit messages, including Conventional Commit style such as `feat: 初始化 Electron、Vite 和 React 项目骨架。`. Prefer prefixes like `feat:`, `fix:`, `refactor:`, and `docs:`. Keep each commit focused. PRs should include a concise summary, note any Electron-specific behavior changes, link related issues when applicable, and attach screenshots or screen recordings for UI updates.

## Architecture Notes
Keep Node and OS integrations inside `electron/`, not in React components. If renderer code needs native capability, expose it through `preload.ts` instead of importing Electron APIs directly into `src/`.
