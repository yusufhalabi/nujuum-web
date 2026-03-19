# Smooth Video Loop Design

**Date:** 2026-03-19
**File affected:** `src/App.tsx`

## Problem

The background video (served via Mux) jumps visually at loop boundaries. The video content itself has a hard cut between end and start frames (ambient sand dune footage — not designed to loop seamlessly), so a crossfade dissolve between two buffered instances is the correct approach.

The current implementation has three bugs that cause visible artifacts:

1. **Opacity bug (two-phase):** The outgoing player fades to `opacity: 0.5` instead of `0` during the CSS transition. Additionally, after the `setTimeout` fires and cleanup runs, the player has only visually reached `0.5` — meaning the ghost content was visible throughout. Both the wrong transition target and the resulting residual state are resolved by a single fix: changing the target to `opacity: 0`.

2. **Z-index bug:** No explicit z-index is set on either player at initialization. The second player in the DOM (B) is naturally on top due to stacking order. At crossfade time there is no swap, so on alternate loops the wrong player occludes the other. Fix: initialize A at `zIndex: 2` and B at `zIndex: 1`, then swap at each crossfade — incoming gets `zIndex: 2`, outgoing gets `zIndex: 1`.

3. **Timing imprecision:** `fadeMs` is computed as `(from.duration - from.currentTime) * 1000` inside `startCrossfade`, which is called from a `timeupdate` handler. The result is a dynamically derived duration that varies each loop depending on when `timeupdate` happens to fire (up to ~250ms of jitter). This is replaced by a fixed constant, which is both predictable and simpler.

## Solution: Improved Dual-Buffer Crossfade

All changes are confined to `src/App.tsx`.

### 1. Timing — requestAnimationFrame loop

Replace the `timeupdate` event listener with a `requestAnimationFrame` loop. Each frame (~16ms at 60fps), check:

```
activePlayer.duration - activePlayer.currentTime < CROSSFADE_BEFORE
```

This reduces trigger jitter from ~250ms to ~1 frame (~16ms), giving a consistent and predictable crossfade start point every loop. The rAF handle is stored in a `let rafId` variable captured by the effect closure, and `cancelAnimationFrame(rafId)` is called in the `useEffect` cleanup to avoid memory leaks.

### 2. Readiness gate

Before starting the crossfade, check `incomingPlayer.readyState >= 3` (HAVE_FUTURE_DATA — browser has buffered enough to play smoothly). If not ready, set `crossfading.current = true` immediately (to block re-entry from the rAF loop), then attach a one-time `canplay` listener and proceed with the crossfade when it fires. The listener reference must be stored in a variable captured by the effect closure (e.g., `let pendingCanplay: (() => void) | null`) so it can be removed from the element in the `useEffect` cleanup, in case the component unmounts while the deferred crossfade is pending.

### 3. Crossfade mechanics (bug fixes)

- **Initial state:** Player A starts with `zIndex: 2`, player B starts with `zIndex: 1`.
- **Per-crossfade:** Incoming player gets `zIndex: 2`, outgoing gets `zIndex: 1`.
- Outgoing player fades to `opacity: 0` (was `0.5`)
- Crossfade duration: fixed `CROSSFADE_DURATION = 2000` ms (was dynamically computed, leading to jitter)
- CSS transition easing: `ease-in-out` (was `linear`) — produces a more cinematic dissolve for ambient footage

## Constants

```ts
const CROSSFADE_BEFORE = 3;       // seconds before end to trigger crossfade (must be > CROSSFADE_DURATION / 1000)
const CROSSFADE_DURATION = 2000;  // ms, fixed fade duration
```

`CROSSFADE_BEFORE` must be strictly greater than `CROSSFADE_DURATION / 1000` (2s). Equal values are a degenerate edge case — the crossfade trigger would fire exactly as the video ends, leaving no margin for the dissolve to complete under real-world latency. If smaller, the video ends before the dissolve completes, cutting the fade short.

## Non-goals

- Canvas compositing (overkill for ambient background)
- Editing the video to loop seamlessly at the content level
- Any changes outside `src/App.tsx`
