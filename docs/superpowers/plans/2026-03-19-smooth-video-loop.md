# Smooth Video Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix visual artifacts (ghost frames, double-exposure) at the Mux background video loop boundary by correcting opacity, z-index, and timing bugs in the crossfade logic.

**Architecture:** Two stacked `mux-player` web components alternate as active/incoming. A `requestAnimationFrame` loop detects when the active player is within `CROSSFADE_BEFORE` seconds of its end and triggers a CSS opacity dissolve. Z-index swaps ensure the incoming player always renders on top. A readiness gate checks `readyState >= 3` before starting the dissolve to prevent buffer gaps.

**Tech Stack:** React 19, TypeScript, Vite, mux-player web component (loaded via CDN script tag)

**Spec:** `docs/superpowers/specs/2026-03-19-smooth-video-loop-design.md`

---

## File Map

| File | Change |
|------|--------|
| `src/App.tsx` | All changes — constants, JSX z-index, useEffect rewrite |

No new files are created.

---

### Task 1: Add `CROSSFADE_DURATION` constant and set initial z-index in JSX

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add the `CROSSFADE_DURATION` constant**

In `src/App.tsx`, after the existing `CROSSFADE_BEFORE` constant, add:

```ts
const CROSSFADE_DURATION = 2000; // ms, fixed fade duration
```

The file top should now read:

```ts
const PLAYBACK_ID = 'Ix2ltzLkc3VaqEeUtXq02ezXjQlOOkM8011CVJG01BVYbs';
const CROSSFADE_BEFORE = 3; // seconds before end to trigger crossfade (must be > CROSSFADE_DURATION / 1000)
const CROSSFADE_DURATION = 2000; // ms, fixed fade duration
```

- [ ] **Step 2: Add initial z-index to each player in JSX**

The two `<mux-player>` elements currently share `playerStyle` for their `style` prop. Add `zIndex` directly to each. Player A (the initial active player) starts at `2` (on top), player B starts at `1`.

Replace:
```tsx
      <mux-player
        ref={refA}
        playback-id={PLAYBACK_ID}
        poster="/first_frame.jpg"
        autoplay
        muted
        preload="auto"
        style={playerStyle}
      />
      <mux-player
        ref={refB}
        playback-id={PLAYBACK_ID}
        muted
        preload="auto"
        style={playerStyle}
      />
```

With:
```tsx
      <mux-player
        ref={refA}
        playback-id={PLAYBACK_ID}
        poster="/first_frame.jpg"
        autoplay
        muted
        preload="auto"
        style={{ ...playerStyle, zIndex: 2 }}
      />
      <mux-player
        ref={refB}
        playback-id={PLAYBACK_ID}
        muted
        preload="auto"
        style={{ ...playerStyle, zIndex: 1 }}
      />
```

- [ ] **Step 3: Type-check**

```bash
cd /Users/yaseenhalabi/Desktop/nujuum-web && npm run build 2>&1 | tail -20
```

Expected: build completes with no TypeScript errors (Vite output lines, no red error lines).

---

### Task 2: Rewrite `useEffect` — rAF loop, readiness gate, crossfade bug fixes

**Files:**
- Modify: `src/App.tsx`

This is the main logic rewrite. Replace the entire `useEffect` body (lines 26–79 in the original file) with the implementation below.

- [ ] **Step 1: Replace the useEffect**

Replace the full `useEffect` block:

```ts
  useEffect(() => {
    const a = refA.current;
    const b = refB.current;
    if (!a || !b) return;

    const players = [a, b] as any[];
    let activeIdx = 0;
    let rafId: number;
    let pendingCanplayTarget: any = null;
    let pendingCanplay: (() => void) | null = null;

    function doStartCrossfade(fromIdx: number) {
      const toIdx = 1 - fromIdx;
      const from = players[fromIdx];
      const to = players[toIdx];

      to.style.zIndex = '2';
      from.style.zIndex = '1';

      to.currentTime = 0;
      to.play().catch(() => {});

      from.style.transition = `opacity ${CROSSFADE_DURATION}ms ease-in-out`;
      from.style.opacity = '0';
      to.style.transition = `opacity ${CROSSFADE_DURATION}ms ease-in-out`;
      to.style.opacity = '1';

      activeIdx = toIdx;

      setTimeout(() => {
        from.pause();
        from.currentTime = 0;
        from.style.transition = '';
        from.style.opacity = '0';
        crossfading.current = false;
      }, CROSSFADE_DURATION + 50);
    }

    function startCrossfade(fromIdx: number) {
      if (crossfading.current) return;
      crossfading.current = true;

      const toIdx = 1 - fromIdx;
      const to = players[toIdx];

      if (to.readyState >= 3) {
        doStartCrossfade(fromIdx);
      } else {
        const handler = () => {
          to.removeEventListener('canplay', handler);
          pendingCanplayTarget = null;
          pendingCanplay = null;
          doStartCrossfade(fromIdx);
        };
        pendingCanplayTarget = to;
        pendingCanplay = handler;
        to.addEventListener('canplay', handler);
      }
    }

    function tick() {
      const active = players[activeIdx] as any;
      if (active.duration && !crossfading.current) {
        if (active.duration - active.currentTime < CROSSFADE_BEFORE) {
          startCrossfade(activeIdx);
        }
      }
      rafId = requestAnimationFrame(tick);
    }

    b.style.opacity = '0';
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      if (pendingCanplay && pendingCanplayTarget) {
        pendingCanplayTarget.removeEventListener('canplay', pendingCanplay);
      }
    };
  }, []);
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/yaseenhalabi/Desktop/nujuum-web && npm run build 2>&1 | tail -20
```

Expected: build completes with no TypeScript errors.

- [ ] **Step 3: Lint check**

```bash
cd /Users/yaseenhalabi/Desktop/nujuum-web && npm run lint 2>&1 | tail -20
```

Expected: no errors (warnings about `any` casts are acceptable given the mux-player web component typing situation).

---

### Task 3: Browser verification and commit

**Files:**
- No new changes — verification and commit only

- [ ] **Step 1: Start dev server**

```bash
cd /Users/yaseenhalabi/Desktop/nujuum-web && npm run dev
```

Open the URL shown (typically `http://localhost:5173`) in a browser.

- [ ] **Step 2: Verify loop 1 (A → B crossfade)**

Watch the video. After approximately `[video_duration - 3]` seconds, the dissolve from player A to player B should begin. Confirm:
- The fade is smooth (no hard cut, no brightness spike)
- No ghost/double-exposure of the end frame over the beginning frame
- The new video is already playing before the fade completes (not buffering mid-fade)

- [ ] **Step 3: Verify loop 2 (B → A crossfade)**

Let the video play through a second full loop. This is the crossfade direction that previously had the worst artifact (B on top fading to 0.5 instead of 0). Confirm the same smoothness as loop 1.

- [ ] **Step 4: Commit**

```bash
cd /Users/yaseenhalabi/Desktop/nujuum-web && git add src/App.tsx && git commit -m "$(cat <<'EOF'
fix: smooth video loop crossfade — opacity, z-index, rAF timing

- Fix outgoing player fading to 0.5 instead of 0 (ghost frame bug)
- Add explicit z-index swap so incoming player always renders on top
- Replace timeupdate listener with requestAnimationFrame loop for
  sub-frame trigger precision
- Add readyState >= 3 gate before starting dissolve to prevent
  buffer-gap artifacts on slow connections
- Switch from computed fadeMs to fixed CROSSFADE_DURATION = 2000ms
- Change CSS transition easing from linear to ease-in-out

Co-Authored-By: Claude Sonnet 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```
