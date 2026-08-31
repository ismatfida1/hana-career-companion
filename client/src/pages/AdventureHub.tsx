import { ArrowRight, BookOpen, Compass, Gamepad2, MessageCircle, Sparkles, Trophy, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";

const worlds = [
  ["01", "ROADMAP", "Code Forge", "/roadmap", "/assets/worlds/code-forge.svg", "Follow your skill path"],
  ["02", "PROJECTS", "Weblands", "/projects", "/assets/worlds/webwilds.svg", "Build proof of your skills"],
  ["03", "OPPORTUNITIES", "Summit of Builders", "/opportunities", "/assets/worlds/beacon-summit.svg", "Find current opportunities"],
  ["04", "RESEARCH", "Cloudspire", "/research", "/assets/worlds/skyforge.svg", "Explore universities and resources"],
  ["05", "ASK HANA", "Origin Village", "/chat", "/assets/worlds/origin-village.svg", "Talk through your next move"],
] as const;

export default function AdventureHub() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const selectWorld = (index: number) => {
    setSelected(index);
    setTransitioning(true);
    window.setTimeout(() => navigate(worlds[index][3]), 260);
  };

  const moveSelection = (delta: number) => {
    setSelected(current => (current + delta + worlds.length) % worlds.length);
  };

  useEffect(() => {
    document.title = "HANA — Choose your next world";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        moveSelection(1);
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        moveSelection(-1);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectWorld(selected);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <main
      className={`relative min-h-screen overflow-x-hidden bg-[#06131e] text-white transition duration-300 ${transitioning ? "scale-[1.015] opacity-0" : "opacity-100"}`}
      onTouchStart={event => { touchStartX.current = event.changedTouches[0]?.clientX ?? null; }}
      onTouchEnd={event => {
        if (touchStartX.current == null) return;
        const delta = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
        if (Math.abs(delta) > 45) moveSelection(delta < 0 ? 1 : -1);
        touchStartX.current = null;
      }}
    >
      <img src="/assets/worlds/origin-village.svg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,16,25,.18),rgba(5,16,25,.88))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(70,205,195,.2),transparent_30%)] animate-pulse" />

      <header className="relative z-30 mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-6">
        <Link href="/" className="font-display text-lg font-bold tracking-[.22em]">HANA</Link>
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-[#07131e]/60 px-3 py-2 text-[10px] font-bold uppercase tracking-[.15em] text-white/70 backdrop-blur-md"><Sparkles className="h-3.5 w-3.5 text-[#f1c77b]" /> Your adventure</div>
      </header>

      <section className="relative z-20 mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl flex-col px-4 pb-8 pt-2 sm:px-8 sm:pb-12">
        <div className="grid items-end gap-5 lg:grid-cols-[1fr_230px]">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[.35em] text-[#f1c77b]">HANA · YOUR CS CAREER ADVENTURE</p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Choose your next world.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">Your learning path is a game. Explore a world, learn a skill, complete a quest, build something, and come back to Hana when you get stuck.</p>
          </div>

          <div className="relative mx-auto flex w-full max-w-[210px] items-end justify-center lg:mx-0 lg:justify-end">
            <img src="/assets/hana-phase1-approved-opening.png" alt="Hana, your career companion" className="h-36 w-40 animate-bounce object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,.45)] [animation-duration:5s] sm:h-44 sm:w-48" />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-[#07131e]/85 px-3 py-1 text-[10px] font-semibold whitespace-nowrap backdrop-blur-md">Hana · “Let’s build your future.”</div>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#07131e]/55 px-4 py-3 backdrop-blur-md"><Zap className="h-4 w-4 text-[#f1c77b]" /><div><p className="text-[9px] font-bold uppercase tracking-[.16em] text-white/35">Energy</p><p className="text-sm font-bold">80 / 100</p></div></div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#07131e]/55 px-4 py-3 backdrop-blur-md"><Sparkles className="h-4 w-4 text-[#f1c77b]" /><div><p className="text-[9px] font-bold uppercase tracking-[.16em] text-white/35">XP</p><p className="text-sm font-bold">120 · Level 3</p></div></div>
          <Link href="/mission" className="group flex items-center justify-between gap-3 rounded-2xl border border-[#f1c77b]/30 bg-[#f1c77b]/10 px-4 py-3 backdrop-blur-md transition hover:bg-[#f1c77b]/20"><div><p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#f1c77b]/70">Today’s mission</p><p className="text-sm font-bold">Learn how APIs work</p></div><ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" role="menu" aria-label="Hana adventure worlds">
          {worlds.map(([number, label, world, href, image, description], index) => {
            const focused = selected === index;
            return (
              <Link
                key={href}
                href={href}
                role="menuitem"
                aria-current={focused ? "page" : undefined}
                tabIndex={focused ? 0 : -1}
                onFocus={() => setSelected(index)}
                onMouseEnter={() => setSelected(index)}
                onClick={event => { event.preventDefault(); selectWorld(index); }}
                className={`group relative min-h-[220px] overflow-hidden rounded-[26px] border bg-[#07131e]/60 shadow-2xl backdrop-blur-sm transition duration-300 focus:outline-none ${focused ? "-translate-y-1.5 scale-[1.015] border-[#f1c77b]/80 ring-2 ring-[#f1c77b]/70 shadow-[0_0_35px_rgba(241,199,123,.2)]" : "border-white/15 hover:-translate-y-1 hover:border-[#f1c77b]/60"}`}
              >
                <img src={image} alt="" aria-hidden="true" className={`absolute inset-0 h-full w-full object-cover object-center transition duration-500 ${focused ? "scale-105 opacity-95" : "opacity-65 group-hover:scale-105 group-hover:opacity-90"}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06131e] via-[#06131e]/55 to-transparent" />
                <div className="relative flex h-full min-h-[220px] flex-col justify-between p-4 sm:p-5">
                  <div className="flex items-start justify-between"><span className="rounded-full border border-white/15 bg-black/25 px-2.5 py-1 text-[9px] font-black tracking-[.15em] text-white/60">WORLD {number}</span><span className={`rounded-full px-2 py-1 text-[9px] ${focused ? "bg-[#f1c77b] text-[#172630]" : "bg-black/25 text-white/45"}`}>{focused ? "SELECTED" : "OPEN"}</span></div>
                  <div><p className="text-[9px] font-black uppercase tracking-[.18em] text-[#f1c77b]">{label}</p><h2 className="mt-1 font-display text-xl font-semibold">{world}</h2><p className="mt-1 text-xs leading-5 text-white/55">{description}</p><span className="mt-3 inline-flex items-center gap-1 text-[10px] font-black tracking-[.13em] text-white/80">ENTER WORLD <ArrowRight className={`h-3.5 w-3.5 transition ${focused ? "translate-x-1" : "group-hover:translate-x-1"}`} /></span></div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <Link href="/roadmap" className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 backdrop-blur-md hover:bg-white/10"><Compass className="h-4 w-4 text-[#f1c77b]" /><span className="text-sm font-semibold">Journey / Roadmap</span></Link>
          <Link href="/opportunities" className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 backdrop-blur-md hover:bg-white/10"><Trophy className="h-4 w-4 text-[#f1c77b]" /><span className="text-sm font-semibold">Latest opportunities</span></Link>
          <Link href="/chat" className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 backdrop-blur-md hover:bg-white/10"><MessageCircle className="h-4 w-4 text-[#f1c77b]" /><span className="text-sm font-semibold">Ask Hana</span></Link>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-[9px] font-bold uppercase tracking-[.16em] text-white/35"><span className="inline-flex items-center gap-1.5"><Gamepad2 className="h-3.5 w-3.5" /> Game mode</span><span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Learning + building</span><span>↑ ↓ / swipe · Enter to select</span><span>Progress saves automatically</span></div>
      </section>
    </main>
  );
}
