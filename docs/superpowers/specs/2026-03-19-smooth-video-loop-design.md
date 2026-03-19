# Smooth Video Loop Design

**Date:** 2026-03-19
**File affected:** `src/App.tsx`

## Problem

The background video (served via Mux) jumps visually at loop boundaries. The video content itself has a hard cut between end and start frames (ambient sand dune footage — not designed to loop seamlessly), so a crossfade dissolve between two buffered instances is the correct approach.

The current implementation has three bugs that cause visible artifacts:

1. **Opacity bug**: The outgoing player fades to `opacity: 0.5` instead of `0`, leaving ghost video content bleeding through the incoming player.
2. **Z-index bug**: No explicit z-index management — whichever player is second in the DOM is always on top, causing the wrong player to occlude the other on the second crossfade.
3. **Timing imprecision**: `timeupdate` fires ~4 times/second, so the crossfade can trigger up to 250ms late, making the fade duration derived from remaining time unpredictable.

## Solution: Improved Dual-Buffer Crossfade

All changes are confined to `src/App.tsx`.

### 1. Timing — requestAnimationFrame loop

Replace the `timeupdate` event listener with a `requestAnimationFrame` loop. Each frame (~16ms at 60fps), check:

```
activePlayer.duration - activePlayer.currentTime < CROSSFADE_BEFORE
```

This reduces trigger jitter from ~250ms to ~1 frame (~16ms), giving a consistent and predictable crossfade start point every loop.

The rAF loop is cancelled in the `useEffect` cleanup to avoid memory leaks.

### 2. Readiness gate

Before starting the crossfade, check `incomingPlayer.readyState >= 3` (HAVE_FUTURE_DATA — browser has buffered enough to play smoothly). If not ready, attach a one-time `canplay` listener and defer the crossfade start until it fires. This prevents the incoming video from showing a frozen or blank frame at the start of the dissolve.

### 3. Crossfade mechanics (bug fixes)

- Outgoing player fades to `opacity: 0` (was `0.5`)
- Incoming player gets `zIndex: 2`, outgoing gets `zIndex: 1` — ensures correct render order regardless of DOM position
- Crossfade duration: fixed `CROSSFADE_DURATION = 2000` ms (was computed from remaining time, which was imprecise)
- CSS transition easing: `ease-in-out` (was `linear`) — more cinematic dissolve for ambient footage

## Constants

```ts
const CROSSFADE_BEFORE = 3;       // seconds before end to begin monitoring
const CROSSFADE_DURATION = 2000;  // ms, fixed fade duration
```

## Non-goals

- Canvas compositing (overkill for ambient background)
- Editing the video to loop seamlessly at the content level
- Any changes outside `src/App.tsx`
