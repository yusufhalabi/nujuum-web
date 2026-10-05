import type { ReactNode } from "react";
import { go, signupEvent } from "./navigation";
export function Link({
  to,
  children,
  className = "",
  onClick,
  ...props
}: {
  to: string;
  children: ReactNode;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={to}
      className={className}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented && e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
          e.preventDefault();
          if (to.split("?")[0] === "/get-started") {
            window.dispatchEvent(new Event(signupEvent));
          } else {
            go(to);
          }
        }
      }}
    >
      {children}
    </a>
  );
}
