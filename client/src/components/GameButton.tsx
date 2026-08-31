import type { ButtonHTMLAttributes } from "react";

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function GameButton({ variant = "primary", className = "", children, ...props }: GameButtonProps) {
  const base = "inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:pointer-events-none disabled:opacity-50";
  const styles = variant === "primary"
    ? "bg-[#f1c77b] text-[#172630] shadow-[0_8px_30px_rgba(241,199,123,.25)] hover:bg-[#f6d38d]"
    : "border border-[#8f6b35]/40 bg-[#fffaf0]/80 text-[#4b3820] shadow-sm hover:bg-white";
  return <button className={`${base} ${styles} ${className}`} {...props}>{children}</button>;
}
