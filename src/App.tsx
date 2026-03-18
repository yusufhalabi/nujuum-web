import MuxPlayer from '@mux/mux-player-react';

export default function App() {
  return (
    <MuxPlayer
      playbackId="Ix2ltzLkc3VaqEeUtXq02ezXjQlOOkM8011CVJG01BVYbs"
      poster="/first_frame.jpg"
      autoPlay
      muted
      loop
      style={{
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        '--controls': 'none',
      }}
    />
  );
}
