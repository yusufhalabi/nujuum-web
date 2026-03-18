# Nujuum Web — Landing Page Design Spec

**Date:** 2026-03-18

## Overview

A single-page landing page for nujuum-web. The page displays a full-screen, autoplaying MUX video. While the video loads, a static image (`first_frame.jpg`) is shown as the poster/placeholder. No navigation, no other content.

## Stack

- **Vite** (build tool)
- **React** (UI)
- **TypeScript** (type safety)
- **`@mux/mux-player-react`** (MUX video player component)

## Architecture

Single-page app with minimal structure:

```
nujuum-web/
├── public/
│   └── first_frame.jpg        # Poster image (moved from repo root to public/ during setup)
├── src/
│   ├── App.tsx                # Root component — renders MuxPlayer full-screen
│   ├── main.tsx               # React entry point
│   └── index.css              # Global resets (margin: 0, padding: 0, overflow: hidden)
├── index.html                 # Must include: <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Component Design

**`App.tsx`**

Renders a single `<MuxPlayer>` component from `@mux/mux-player-react` with the following props:

| Prop | Value |
|------|-------|
| `playbackId` | `Ix2ltzLkc3VaqEeUtXq02ezXjQlOOkM8011CVJG01BVYbs` |
| `poster` | `/first_frame.jpg` |
| `autoPlay` | `true` |
| `muted` | `true` |
| `loop` | `true` |
| `controls` | `false` |
| `style` | `width: 100vw, height: 100vh, objectFit: "cover"` |

The player natively handles the poster → video transition when the video is ready.

## Styling

Global CSS resets in `index.css`:

```css
*, *::before, *::after { box-sizing: border-box; }
html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
```

No other CSS needed — layout is handled via inline style on `<MuxPlayer>`.

## Data Flow

```
Browser request → Vite dev server / static host
  → index.html loads React
  → App.tsx mounts MuxPlayer
  → MuxPlayer shows first_frame.jpg poster immediately
  → MuxPlayer fetches video from MUX CDN
  → Video starts playing, poster fades out
```

## Error Handling

MUX Player handles network/load errors internally (shows a fallback UI). No custom error handling needed for this scope.

## Testing

Manual verification:
- [ ] Poster image visible before video loads
- [ ] Video autoplays muted on load
- [ ] Video loops
- [ ] No scrollbars or extra whitespace visible
- [ ] Looks correct on mobile viewport sizes
