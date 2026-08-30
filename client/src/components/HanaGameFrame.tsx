import type { ReactNode } from "react";
import { ArrowLeft, Home, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";

const pageWorlds = {
  "/roadmap": { world: "Code Forge", image: "/assets/worlds/code-forge.svg" },
  "/projects": { world: "Webwilds", image: "/assets/worlds/webwilds.svg" },
  "/opportunities": { world: "Beacon Summit", image: "/assets/worlds/beacon-summit.svg" },
  "/research": { world: "Skyforge", image: "/assets/worlds/skyforge.svg" },
  "/chat": { world: "Origin Village", image: "/assets/worlds/origin-village.svg" },
} as const;

export default function HanaGameFrame({ children, title }: { children: ReactNode; title: string }) {
  const [location] = useLocation();
  const world = pageWorlds[location as keyof typeof pageWorlds] ?? pageWorlds["/roadmap"];
  return <main className="min-h-screen overflow-x-hidden bg-[#101d2b] text-[#fffaf4]">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(83,139,132,.22),transparent_30%),radial-gradient(circle_at_15%_80%,rgba(225,145,117,.13),transparent_28%)]" />
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101d2b]/85 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-7 lg:px-10"><div className="flex items-center gap-2"><Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold transition hover:bg-white/10"><ArrowLeft className="h-4 w-4" />Back</Link><Link href="/" className="hidden items-center gap-2 px-2 font-display text-lg font-bold sm:flex"><Sparkles className="h-4 w-4 text-[#f1c77b]" />HANA</Link></div><div className="text-center"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/40">{world.world}</p><h1 className="font-display text-sm font-semibold sm:text-base">{title}</h1></div><Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold transition hover:bg-white/10"><Home className="h-4 w-4" /><span className="hidden sm:inline">Home</span></Link></div></header>
    <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-7 lg:px-10">
      <div className="relative mb-5 min-h-[180px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[.04] shadow-2xl sm:min-h-[220px]">
        <img src={world.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-contain p-3 opacity-30 sm:p-5" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101d2b]/95 via-[#101d2b]/55 to-[#101d2b]/75" />
        <div className="relative flex min-h-[180px] items-end px-5 py-7 sm:min-h-[220px] sm:px-7"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#f1c77b]/75">Hana adventure · {world.world}</p><h2 className="mt-2 max-w-3xl font-display text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{title}</h2></div></div>
      </div>
      {children}
    </div>
  </main>;
}
