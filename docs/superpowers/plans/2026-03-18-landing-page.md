# Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-screen autoplaying MUX video landing page with a poster image shown until the video loads.

**Architecture:** Single `App.tsx` component renders a `<MuxPlayer>` at 100vw × 100vh with `object-fit: cover`. The MUX player natively handles the poster → video transition. No routing, no extra components.

**Tech Stack:** Vite, React 18, TypeScript, `@mux/mux-player-react`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `package.json` | Create | Project metadata, deps, scripts |
| `vite.config.ts` | Create | Minimal Vite config |
| `tsconfig.json` | Create | TypeScript config |
| `index.html` | Create | HTML entry with correct viewport meta |
| `src/main.tsx` | Create | React entry — mounts `<App>` into `#root` |
| `src/index.css` | Create | Global resets (margin/padding zero, overflow hidden) |
| `src/App.tsx` | Create | Root component — full-screen MuxPlayer |
| `public/first_frame.jpg` | Move | Poster image served at `/first_frame.jpg` |

---

### Task 1: Scaffold Vite + React + TypeScript project

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`

- [ ] **Step 1: Scaffold project with Vite**

Run from inside `nujuum-web/`:
```bash
npm create vite@latest . -- --template react-ts
```
When prompted about non-empty directory, choose to ignore/overwrite (the only existing content is `docs/` and `.git`).

- [ ] **Step 2: Verify scaffold output**

Run:
```bash
ls
```
Expected: `index.html`, `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `src/`, `public/` are present.

- [ ] **Step 3: Install dependencies**

```bash
npm install
```
Expected: `node_modules/` created, no errors.

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```
Expected: Server starts at `http://localhost:5173` (or similar). Kill with Ctrl+C once confirmed.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json index.html src/ public/
git commit -m "chore: scaffold Vite + React + TS project"
```

---

### Task 2: Install MUX Player and move poster image

**Files:**
- Modify: `package.json` (adds `@mux/mux-player-react`)
- Move: `first_frame.jpg` → `public/first_frame.jpg`

- [ ] **Step 1: Install `@mux/mux-player-react`**

```bash
npm install @mux/mux-player-react
```
Expected: Package added to `dependencies` in `package.json`, no errors.

- [ ] **Step 2: Move poster image to `public/`**

```bash
mv first_frame.jpg public/first_frame.jpg
```
Expected: `public/first_frame.jpg` exists, no file at repo root.

- [ ] **Step 3: Verify image is served correctly**

Start dev server and navigate to `http://localhost:5173/first_frame.jpg` in a browser.
Expected: Image displays. Kill server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json public/first_frame.jpg
git commit -m "chore: install mux-player-react, move poster to public/"
```

---

### Task 3: Global CSS resets

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace `src/index.css` with global resets**

Replace the entire file contents with:
```css
*, *::before, *::after {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "style: add global resets for full-screen layout"
```

---

### Task 4: Update `index.html` viewport meta

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update the viewport meta tag**

Find the existing `<meta name="viewport" ...>` line in `index.html` and replace it with:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```
Also update the `<title>` to `Nujuum`.

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "chore: update viewport meta for edge-to-edge display"
```

---

### Task 5: Write `App.tsx` with full-screen MuxPlayer

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace `src/App.tsx` with the MuxPlayer component**

Replace the entire file contents with:
```tsx
import MuxPlayer from '@mux/mux-player-react';
import './index.css';

export default function App() {
  return (
    <MuxPlayer
      playbackId="Ix2ltzLkc3VaqEeUtXq02ezXjQlOOkM8011CVJG01BVYbs"
      poster="/first_frame.jpg"
      autoPlay
      muted
      loop
      controls={false}
      style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
    />
  );
}
```

- [ ] **Step 2: Verify `src/main.tsx` imports `index.css`**

Open `src/main.tsx`. If it already imports `./index.css`, no change needed. If not, add:
```tsx
import './index.css';
```
(Remove the import from `App.tsx` if it ends up duplicated.)

- [ ] **Step 3: Start dev server and manually verify**

```bash
npm run dev
```

Open `http://localhost:5173` and verify:
- [ ] Poster image (`first_frame.jpg`) is visible immediately on load
- [ ] Video begins autoplaying muted
- [ ] Video loops after finishing
- [ ] No scrollbars, no whitespace borders
- [ ] Resize window — video fills screen at all sizes
- [ ] Open browser DevTools → toggle mobile device — no scrollbars, full-screen coverage

Kill server with Ctrl+C.

- [ ] **Step 4: Build for production and verify no errors**

```bash
npm run build
```
Expected: `dist/` folder created, no TypeScript or build errors.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/main.tsx
git commit -m "feat: add full-screen MUX video landing page"
```

---

## Done

At this point the landing page is complete. The site:
- Shows `first_frame.jpg` as a poster while the video loads
- Autoplays the MUX video muted and looped, full-screen
- Has no scrollbars, no extra UI
