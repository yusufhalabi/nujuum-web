import { useRef, useEffect } from 'react';

const PLAYBACK_ID = 'Ix2ltzLkc3VaqEeUtXq02ezXjQlOOkM8011CVJG01BVYbs';
const CROSSFADE_BEFORE = 1.5; // seconds before end to begin crossfade

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

    function startCrossfade(fromIdx: number) {
      if (crossfading.current) return;
      crossfading.current = true;

      const toIdx = 1 - fromIdx;
      const from = players[fromIdx];
      const to = players[toIdx];
      const fadeMs = Math.max((from.duration - from.currentTime) * 1000, 50);

      to.currentTime = 0;
      to.play().catch(() => {});

      from.style.transition = `opacity ${fadeMs}ms linear`;
      from.style.opacity = '0';
      to.style.transition = `opacity ${fadeMs}ms linear`;
      to.style.opacity = '1';

      activeIdx = toIdx;

      setTimeout(() => {
        from.pause();
        from.currentTime = 0;
        from.removeEventListener('timeupdate', handleTimeUpdate);
        to.addEventListener('timeupdate', handleTimeUpdate);
        crossfading.current = false;
      }, fadeMs + 50);
    }

    function handleTimeUpdate(event: Event) {
      const player = event.currentTarget as any;
      if (!player.duration || crossfading.current) return;
      if (player.duration - player.currentTime < CROSSFADE_BEFORE) {
        startCrossfade(activeIdx);
      }
    }

    b.style.opacity = '0';
    a.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      a.removeEventListener('timeupdate', handleTimeUpdate);
      b.removeEventListener('timeupdate', handleTimeUpdate);
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
        style={playerStyle}
      />
      <mux-player
        ref={refB}
        playback-id={PLAYBACK_ID}
        muted
        preload="auto"
        style={playerStyle}
      />
    </div>
  );
}
