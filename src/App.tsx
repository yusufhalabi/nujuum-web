import { useRef, useEffect } from 'react';

const PLAYBACK_ID = 'Ix2ltzLkc3VaqEeUtXq02ezXjQlOOkM8011CVJG01BVYbs';
const CROSSFADE_BEFORE = 3; // seconds before end to trigger crossfade (must be > CROSSFADE_DURATION / 1000)
const CROSSFADE_DURATION = 2000; // ms, fixed fade duration

type Style = React.CSSProperties & { [key: `--${string}`]: string };

const playerStyle: Style = {
  display: 'block',
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  aspectRatio: 'unset',
  '--controls': 'none',
  '--media-object-fit': 'cover',
  '--media-object-position': 'center',
  '--loading-indicator-display': 'none',
};

export default function App() {
  const refA = useRef<HTMLElement>(null);
  const refB = useRef<HTMLElement>(null);
  const crossfading = useRef(false);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000' }}>
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
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '28vh',
        gap: '24px',
        pointerEvents: 'none',
      }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <p style={{
            margin: 0,
            fontFamily: 'AppleGaramond, Georgia, serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: '#fff',
            letterSpacing: '0.01em',
            fontWeight: 700,
          }}>
            Learn Arabic with
          </p>
          <img
            src="/Nujuum Logo.png"
            alt="Nujuum"
            style={{ height: 'clamp(48px, 8vw, 80px)', width: 'auto' }}
          />
        </div>
        <form
          className="waitlist-form"
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '100px',
            padding: '6px 6px 6px 20px',
            gap: '8px',
            border: '1px solid rgba(255,255,255,0.25)',
            pointerEvents: 'auto',
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email..."
            className="waitlist-input"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '1rem',
              width: '220px',
            }}
          />
          <button
            type="submit"
            className="waitlist-btn"
            style={{
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '100px',
              padding: '10px 22px',
              fontSize: '0.95rem',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Join waitlist
          </button>
        </form>
      </div>
    </div>
  );
}
