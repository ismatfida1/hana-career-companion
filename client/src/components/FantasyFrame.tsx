import type { ReactNode } from "react";

interface FantasyFrameProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function FantasyFrame({ children, title, className = "" }: FantasyFrameProps) {
  return (
    <section className={`relative overflow-hidden rounded-[28px] border-2 border-[#f1c77b]/70 bg-[linear-gradient(135deg,rgba(255,248,226,.96),rgba(239,220,177,.92))] p-5 text-[#3f3425] shadow-[0_18px_60px_rgba(0,0,0,.22)] md:p-7 ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-[22px] border border-[#8f6b35]/30" />
      <div className="relative z-10">
        {title ? <h2 className="mb-5 text-center font-display text-2xl font-semibold tracking-wide text-[#4b3820]">{title}</h2> : null}
        {children}
      </div>
    </section>
  );
}
