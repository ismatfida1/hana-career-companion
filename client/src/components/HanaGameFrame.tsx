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
    if (document.referrer.startsWith(window.location.origin) && window.history.length > 1) window.history.back();
    else window.location.assign(baseLocation === "/roadmap" ? "/" : "/roadmap");
  };

  return (
    <main className="hana-game-frame min-h-[100svh] w-full overflow-x-hidden bg-[#08141d] text-[#fffaf4]">
      <header className="hana-game-nav sticky top-0 z-50 w-full border-b border-[#f1c77b]/15 bg-[#07131d]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-2 px-3 py-3 sm:px-7 lg:px-10">
          <button type="button" onClick={goBack} aria-label="Go back" className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 text-sm font-semibold"><ArrowLeft className="h-4 w-4"/><span className="hidden sm:inline">Back</span></button>
          <Link href="/" className="hidden shrink-0 items-center gap-2 px-2 font-display text-lg font-bold sm:flex"><Sparkles className="h-4 w-4 text-[#f1c77b]"/>HANA</Link>
          <div className="min-w-0 flex-1 px-2 text-center"><p className="truncate text-[10px] font-bold uppercase tracking-[.18em] text-[#f1c77b]/70">{world.world}</p><h1 className="truncate font-display text-sm font-semibold sm:text-base">{title}</h1></div>
          <Link href="/" aria-label="Home" className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 text-sm font-semibold"><Home className="h-4 w-4"/><span className="hidden sm:inline">Home</span></Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-7 sm:py-6 lg:px-10">
        <section className="hana-game-world relative mb-5 w-full overflow-hidden rounded-[28px] border border-[#f1c77b]/20 bg-[#0b1b26] shadow-[0_18px_60px_rgba(0,0,0,.35)]">
          <div className="relative min-h-[230px] sm:min-h-[300px]">
            <img src={world.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-75" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#07131d]/95 via-[#07131d]/55 to-[#07131d]/50" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#07131d]/85 via-transparent to-[#07131d]/10" />
            <div className="relative z-10 flex min-h-[230px] w-full items-end gap-4 px-4 py-5 sm:min-h-[300px] sm:px-7 sm:py-7">
              <div className="min-w-0 flex-1 pb-1"><p className="break-words text-xs font-bold uppercase tracking-[.16em] text-[#f1c77b]">Hana adventure · {world.world}</p><h2 className="mt-2 break-words font-display text-2xl font-semibold tracking-[-.04em] text-white drop-shadow-lg sm:text-4xl">{title}</h2></div>
              <div className="relative z-10 flex h-28 w-24 shrink-0 items-end justify-center overflow-hidden rounded-2xl border border-[#f1c77b]/20 bg-[#07131d]/35 shadow-lg sm:h-40 sm:w-36" aria-label="Hana companion"><img src="/assets/hana-phase1-approved-opening.png" alt="Hana, your companion" loading="eager" className="h-full w-full object-contain object-bottom drop-shadow-[0_8px_18px_rgba(0,0,0,.45)]" /></div>
            </div>
          </div>
        </section>
        <div className="hana-game-content w-full min-w-0 space-y-5">{children}</div>
      </div>
    </main>
  );
}
