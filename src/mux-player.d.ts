import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'mux-player': React.HTMLAttributes<HTMLElement> & {
        ref?: React.Ref<HTMLElement>;
        'playback-id'?: string;
        poster?: string;
        autoplay?: boolean | string;
        muted?: boolean;
        loop?: boolean;
        preload?: string;
      };
    }
  }
}
