import type { ReactNode } from "react";
import { ArrowLeft, Home, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";

const pageWorlds = {
  "/roadmap": { world: "Code Forge", image: "/assets/worlds/code-forge.svg" },
  "/mission": { world: "Code Forge", image: "/assets/worlds/code-forge.svg" },
  "/career-path": { world: "Code Forge", image: "/assets/worlds/code-forge.svg" },
  "/path": { world: "Origin Village", image: "/assets/worlds/origin-village.svg" },
  "/onboarding": { world: "Origin Village", image: "/assets/worlds/origin-village.svg" },
  "/projects": { world: "Weblands", image: "/assets/worlds/webwilds.svg" },
  "/opportunities": { world: "Summit of Builders", image: "/assets/worlds/beacon-summit.svg" },
  "/research": { world: "Cloudspire", image: "/assets/worlds/skyforge.svg" },
  "/chat": { world: "Origin Village", image: "/assets/worlds/origin-village.svg" },
  "/journey": { world: "Origin Village", image: "/assets/worlds/origin-village.svg" },
  "/profile": { world: "Origin Village", image: "/assets/worlds/origin-village.svg" },
  "/settings": { world: "Origin Village", image: "/assets/worlds/origin-village.svg" },
} as const;

export default function HanaGameFrame({ children, title }: { children: ReactNode; title: string }) {
  const [location] = useLocation();
  const baseLocation = location.split("?")[0];
  const world = pageWorlds[baseLocation as keyof typeof pageWorlds] ?? pageWorlds["/roadmap"];
  const goBack = () => {
    if (typeof window === "undefined") return;
    const sameOriginReferrer = document.referrer ? document.referrer.startsWith(window.location.origin) : false;
    if (sameOriginReferrer && window.history.length > 1) { window.history.back(); return; }
    window.location.assign(baseLocation === "/roadmap" ? "/" : "/roadmap");
  };
  return <main className="hana-game-frame relative min-h-screen overflow-x-clip bg-[#101d2b] text-[#fffaf4] [isolation:isolate]">
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,rgba(83,139,132,.22),transparent_30%),radial-gradient(circle_at_15%_80%,rgba(225,145,117,.13),transparent_28%)]" />
    <header className="hana-game-nav sticky top-0 z-50 border-b border-white/10 bg-[#101d2b]/90 backdrop-blur-xl"><div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-7 lg:px-10"><div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2"><button type="button" onClick={goBack} aria-label="Go back" className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-2 text-sm font-semibold transition hover:bg-white/10 active:scale-95 sm:gap-2 sm:px-3"><ArrowLeft className="h-4 w-4"/><span className="hidden sm:inline">Back</span></button><Link href="/" className="hidden min-w-0 items-center gap-2 px-2 font-display text-lg font-bold sm:flex"><Sparkles className="h-4 w-4 shrink-0 text-[#f1c77b]"/>HANA</Link></div><div className="min-w-0 flex-1 px-1 text-center sm:px-3"><p className="truncate text-[10px] font-bold uppercase tracking-[.18em] text-white/40">{world.world}</p><h1 className="truncate font-display text-sm font-semibold sm:text-base">{title}</h1></div><Link href="/" aria-label="Home" className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-2 text-sm font-semibold transition hover:bg-white/10 active:scale-95 sm:px-3"><Home className="h-4 w-4"/><span className="hidden sm:inline">Home</span></Link></div></header>
    <div className="relative mx-auto w-full max-w-7xl min-w-0 px-3 py-4 sm:px-7 sm:py-6 lg:px-10"><section className="hana-game-world relative isolate mb-5 min-h-[190px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[.04] shadow-2xl sm:min-h-[250px]" aria-label={`${world.world} world scene`}><img src={world.image} alt="" aria-hidden="true" className="hana-game-world-art absolute inset-0 h-full w-full object-contain object-center p-2 opacity-35 sm:p-4"/><div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#101d2b]/96 via-[#101d2b]/60 to-[#101d2b]/82"/><div className="hana-game-world-content relative z-10 grid min-h-[190px] grid-cols-[minmax(0,1fr)_minmax(96px,150px)] items-end gap-3 px-4 py-5 sm:min-h-[250px] sm:grid-cols-[minmax(0,1fr)_180px] sm:px-7 sm:py-7 lg:grid-cols-[minmax(0,1fr)_210px]"><div className="min-w-0 max-w-3xl"><p className="break-words text-xs font-bold uppercase tracking-[.16em] text-[#f1c77b]/75">Hana adventure · {world.world}</p><h2 className="mt-2 break-words font-display text-2xl font-semibold tracking-[-.04em] sm:text-4xl">{title}</h2></div><div className="hana-companion-slot relative flex h-36 min-w-0 items-end justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/10 sm:h-44 lg:h-48" aria-label="Hana companion"><img src="/assets/hana-phase1-approved-opening.png" alt="Hana, your companion" loading="eager" className="h-full w-full object-contain object-right-bottom"/><div className="absolute bottom-2 left-2 right-2 rounded-full border border-white/10 bg-[#101d2b]/80 px-2 py-1 text-center text-[10px] font-semibold text-white/75 backdrop-blur">Hana · your guide</div></div></div></section><div className="hana-game-content relative z-10 min-w-0 space-y-5 [&_*]:min-w-0">{children}</div></div>
  </main>;
}
