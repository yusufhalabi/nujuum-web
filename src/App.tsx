type Style = React.CSSProperties & { [key: `--${string}`]: string };

export default function App() {
  return (
    <mux-player
      playback-id="Ix2ltzLkc3VaqEeUtXq02ezXjQlOOkM8011CVJG01BVYbs"
      poster="/first_frame.jpg"
      autoplay
      muted
      loop
      preload="auto"
      style={{
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        aspectRatio: 'unset',
        '--controls': 'none',
        '--video-object-fit': 'cover',
        '--loading-indicator-display': 'none',
      } as Style}
    />
  );
}
