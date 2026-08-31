import type { ReactNode, CSSProperties } from "react";

interface FantasyBackgroundProps {
  imageUrl: string;
  children?: ReactNode;
  className?: string;
  overlayClassName?: string;
  style?: CSSProperties;
}

export function FantasyBackground({ imageUrl, children, className = "", overlayClassName = "bg-black/25", style }: FantasyBackgroundProps) {
  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat ${className}`}
      style={{ backgroundImage: `url(${imageUrl})`, ...style }}
    >
      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 z-0 ${overlayClassName}`} />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
