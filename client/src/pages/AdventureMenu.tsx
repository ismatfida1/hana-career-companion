import { ArrowRight, MessageCircle, Moon, Route, Settings, Sparkles, Sun, Trophy } from "lucide-react";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

const menuItems = [
  { label: "ROADMAP", description: "Follow your CS skill journey", href: "/roadmap", icon: Route },
  { label: "PROJECTS", description: "Build proof of what you can do", href: "/projects", icon: Sparkles },
  { label: "OPPORTUNITIES", description: "Find competitions and next steps", href: "/opportunities", icon: Trophy },
  { label: "CHAT WITH HANA", description: "Ask Hana what to do next", href: "/chat", icon: MessageCircle },
] as const;

export default function AdventureMenu() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  const dark = theme === "dark";

  return (
    <main className={`relative min-h-[100svh] overflow-hidden ${dark ? "bg-[#07091b] text-[#fffdf5]" : "bg-[#e8f3ed] text-[#173a3b]"}`}>
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ${dark ? "scale-[1.03] saturate-[.8]" : "saturate-[1.12]"}`}
        style={{ backgroundImage: "url('/assets/worlds/origin-village.svg')" }}
        aria-hidden="true"
      />
      <div className={`absolute inset-0 transition-colors duration-700 ${dark ? "bg-[linear-gradient(90deg,rgba(5,8,24,.90)_0%,rgba(10,10,35,.72)_43%,rgba(18,8,38,.22)_72%,rgba(6,8,22,.48)_100%)]" : "bg-[linear-gradient(90deg,rgba(239,248,242,.90)_0%,rgba(232,244,238,.70)_40%,rgba(224,241,235,.15)_70%,rgba(11,36,40,.18)_100%)]"}`} aria-hidden="true" />
      <div className={`absolute inset-0 transition-colors duration-700 ${dark ? "bg-[radial-gradient(circle_at_78%_45%,rgba(89,91,255,.25),transparent_30%)]" : "bg-[radial-gradient(circle_at_78%_45%,rgba(91,213,181,.22),transparent_32%)]"}`} aria-hidden="true" />

      <header className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-9 md:px-12">
        <button type="button" onClick={() => navigate("/")} className={`font-display text-xl font-semibold tracking-[.25em] transition ${dark ? "text-[#f7dfaa]" : "text-[#2b625b]"}`}>HANA</button>
        <div className="flex items-center gap-2">
          <span className={`hidden rounded-full border px-3 py-2 text-[10px] font-bold uppercase tracking-[.18em] sm:inline-flex ${dark ? "border-white/15 bg-black/20 text-white/55" : "border-[#477f74]/20 bg-white/45 text-[#37675f]"}`}>Main menu</span>
          <button type="button" onClick={toggleTheme} className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[10px] font-bold uppercase tracking-[.14em] backdrop-blur-md transition ${dark ? "border-[#a5a7ff]/35 bg-[#11132d]/55 text-[#f6f0d8] hover:bg-[#181a3c]" : "border-[#4c887c]/25 bg-white/55 text-[#285852] hover:bg-white/80"}`} aria-label="Switch theme">
            {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {dark ? "Dark" : "Bright"}
          </button>
          <button type="button" onClick={() => navigate("/settings")} className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[10px] font-bold uppercase tracking-[.14em] backdrop-blur-md transition ${dark ? "border-[#a5a7ff]/35 bg-[#11132d]/55 text-[#f6f0d8] hover:bg-[#181a3c]" : "border-[#4c887c]/25 bg-white/55 text-[#285852] hover:bg-white/80"}`}>
            <Settings className="h-4 w-4" /> OPTIONS
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100svh-84px)] w-full max-w-7xl items-center px-5 pb-8 pt-2 sm:px-9 md:px-12">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,42%)]">
          <div className={`max-w-xl transition-all duration-700 ${ready ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
            <p className={`text-[10px] font-black uppercase tracking-[.42em] ${dark ? "text-[#9eeeff]" : "text-[#2f796c]"}`}>HANA · YOUR CS ADVENTURE</p>
            <h1 className={`mt-3 font-display text-5xl font-semibold leading-[.94] tracking-[-.04em] sm:text-7xl ${dark ? "text-[#fffdf5] drop-shadow-[0_4px_24px_rgba(0,0,0,.5)]" : "text-[#173b3c]"}`}>Choose your<br />next world.</h1>
            <p className={`mt-5 max-w-lg text-sm leading-6 sm:text-base ${dark ? "text-white/70" : "text-[#315a58]/75"}`}>Your learning path is a game. Explore a world, learn a skill, build something, and come back to Hana whenever you get stuck.</p>

            <nav className="mt-8 grid max-w-xl gap-2.5" aria-label="Hana main menu">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button key={item.href} type="button" onClick={() => navigate(item.href)} className={`group flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left backdrop-blur-md transition-all duration-300 hover:translate-x-1 ${dark ? "border-white/10 bg-[#0d1029]/58 text-white hover:border-[#9fa4ff]/55 hover:bg-[#171a3d]" : "border-[#47786e]/15 bg-white/55 text-[#234f4c] hover:border-[#579e90]/45 hover:bg-white/80"}`}>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${dark ? "border-[#8e93ff]/25 bg-[#6e72ff]/10 text-[#a7f2ff]" : "border-[#6ba998]/25 bg-[#d9efe7] text-[#39776b]"}`}><Icon className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-black tracking-[.12em]">{item.label}</span><span className={`mt-0.5 block text-xs ${dark ? "text-white/45" : "text-[#315a58]/60"}`}>{item.description}</span></span>
                    <span className={`text-[9px] font-bold ${dark ? "text-white/25" : "text-[#315a58]/30"}`}>0{index + 1}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 opacity-35 transition group-hover:translate-x-1 group-hover:opacity-100" />
                  </button>
                );
              })}
              <button type="button" onClick={toggleTheme} className={`group mt-1 flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left backdrop-blur-md transition ${dark ? "border-[#8c8fff]/25 bg-[#171936]/45 hover:bg-[#202348]" : "border-[#6ba998]/20 bg-white/45 hover:bg-white/75"}`}>
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${dark ? "bg-[#6c70ff]/15 text-[#a7f2ff]" : "bg-[#d9efe7] text-[#39776b]"}`}>{dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</span>
                <span className="flex-1"><span className="block text-xs font-black uppercase tracking-[.16em]">OPTIONS</span><span className={`block text-[11px] ${dark ? "text-white/45" : "text-[#315a58]/55"}`}>Switch between bright and dark adventure worlds.</span></span>
                <span className={`relative h-6 w-11 rounded-full p-1 transition ${dark ? "bg-[#6f73ff]" : "bg-[#5c9c8e]"}`}><span className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${dark ? "translate-x-5" : "translate-x-0"}`} /></span>
              </button>
            </nav>
          </div>

          <div className={`relative flex min-h-[330px] items-end justify-center lg:min-h-[540px] lg:justify-end transition-all duration-1000 delay-100 ${ready ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}>
            <div className={`absolute bottom-8 right-[12%] h-56 w-56 rounded-full blur-3xl ${dark ? "bg-[#7774ff]/20" : "bg-[#57b89f]/20"}`} aria-hidden="true" />
            <img src="/assets/hana-phase1-approved-opening.png" alt="Hana, your AI career companion" className="relative z-10 h-[360px] w-[330px] object-contain object-bottom drop-shadow-[0_28px_35px_rgba(0,0,0,.45)] sm:h-[450px] sm:w-[420px] lg:h-[560px] lg:w-[500px]" />
            <div className={`absolute bottom-4 right-0 z-20 max-w-[230px] rounded-2xl border px-4 py-3 text-xs font-semibold shadow-xl backdrop-blur-md ${dark ? "border-[#a1a4ff]/30 bg-[#0b0d24]/80 text-[#fffdf5]" : "border-[#4c887c]/20 bg-white/80 text-[#234f4c]"}`}>Hana · “Let’s build your future.”</div>
          </div>
        </div>
      </section>
    </main>
  );
}
