import { useRef, useEffect, useState } from 'react';
import { supabase } from './supabase';

const PLAYBACK_ID = 'Ix2ltzLkc3VaqEeUtXq02ezXjQlOOkM8011CVJG01BVYbs';
const CROSSFADE_BEFORE = 3; // seconds before end to trigger crossfade (must be > CROSSFADE_DURATION / 1000)
const CROSSFADE_DURATION = 2000; // ms, fixed fade duration
const PREWARM_BEFORE = 4; // seconds before end to pre-warm inactive player

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
  const prewarmed = useRef(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const ua = navigator.userAgent;
      const os = /(Windows|Mac|Linux|Android|iOS|iPhone|iPad)/.exec(ua)?.[1] ?? 'Unknown';
      const browserMatch =
        ua.match(/(Chrome|Firefox|Safari|Edge|Opera|OPR|Brave)\/[\d.]+/) ??
        ua.match(/(MSIE|Trident)\/[\d.]+/);
      const browser = browserMatch?.[1]?.replace('OPR', 'Opera') ?? 'Unknown';

      let ip = '';
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        ip = (await res.json()).ip;
      } catch { /* ip stays empty */ }

      const { error: dbError } = await supabase
        .from('Waitlist')
        .insert({ email, ip, os, browser });

      if (dbError) {
        if (dbError.code === '23505') {
          setError('This email is already on the waitlist!');
        } else {
          setError('Something went wrong. Please try again.');
        }
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

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

      // Only fade the outgoing (top) player. Do NOT swap z-index yet.
      from.style.transition = `opacity ${CROSSFADE_DURATION}ms ease-in-out`;
      from.style.opacity = '0';

      activeIdx = toIdx;

      setTimeout(() => {
        from.pause();
        from.currentTime = 0;
        from.style.transition = '';
        from.style.opacity = '1'; // restore (hidden behind active)

        // NOW swap z-index
        players[toIdx].style.zIndex = '2';
        from.style.zIndex = '1';

        crossfading.current = false;
        prewarmed.current = false;
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
        const remaining = active.duration - active.currentTime;

        if (remaining < PREWARM_BEFORE && !prewarmed.current) {
          prewarmed.current = true;
          const inactive = players[1 - activeIdx] as any;
          inactive.currentTime = 0;
          inactive.play().catch(() => {});
        }

        if (remaining < CROSSFADE_BEFORE) {
          startCrossfade(activeIdx);
        }
      }
      rafId = requestAnimationFrame(tick);
    }

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
        background: 'rgba(0, 0, 0, 0.25)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '16vh',
        gap: '48px',
        pointerEvents: 'none',
      }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <span className="logo-wordmark">Nujuum</span>
          <p
            className="subtitle-text"
            style={{
              margin: 0,
              fontFamily: 'AppleGaramond, Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: '0.01em',
              fontWeight: 500,
            }}
          >
            Speak Syrian Arabic
          </p>
        </div>
        {submitted ? (
          <p style={{
            color: '#fff',
            fontFamily: 'AppleGaramond, Georgia, serif',
            fontSize: '1.2rem',
            pointerEvents: 'auto',
          }}>
            You're on the list!
          </p>
        ) : (
          <form
            className="waitlist-form"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              pointerEvents: 'auto',
            }}
            onSubmit={handleSubmit}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '100px',
              padding: '6px 6px 6px 20px',
              gap: '8px',
              border: '1px solid rgba(255,255,255,0.25)',
            }}>
              <input
                type="email"
                required
                placeholder="Enter your email..."
                className="waitlist-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                disabled={submitting}
                className="waitlist-btn"
                style={{
                  background: 'linear-gradient(160deg, #ffffff 0%, #e8e8e8 50%, #f5f5f5 100%)',
                  color: '#111',
                  border: 'none',
                  borderRadius: '100px',
                  padding: '10px 22px',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  cursor: submitting ? 'wait' : 'pointer',
                  whiteSpace: 'nowrap',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? 'Joining...' : 'Join waitlist'}
              </button>
            </div>
            {error && (
              <p style={{ color: '#ff6b6b', fontSize: '0.85rem', margin: 0 }}>
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
