import type { ReactNode } from "react";
import { go } from "./navigation";
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
          go(to);
        }
      }}
    >
      {children}
    </a>
  );
}
