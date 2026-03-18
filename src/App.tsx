import MuxPlayer from '@mux/mux-player-react';

export default function App() {
  return (
    <MuxPlayer
      playbackId="Ix2ltzLkc3VaqEeUtXq02ezXjQlOOkM8011CVJG01BVYbs"
      poster="/first_frame.jpg"
      autoPlay
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
        '--controls': 'none',
        '--video-object-fit': 'cover',
        '--loading-indicator-display': 'none',
      }}
    />
  );
}
