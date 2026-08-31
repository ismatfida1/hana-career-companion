import { ArrowRight, Moon, Sun } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { FantasyBackground } from "@/components/FantasyBackground";
import { GameButton } from "@/components/GameButton";
import { useTheme } from "@/contexts/ThemeContext";

const menuItems = [
  { label: "ROADMAP", href: "/roadmap" },
  { label: "PROJECTS", href: "/projects" },
  { label: "OPPORTUNITIES", href: "/opportunities" },
  { label: "CHAT WITH HANA", href: "/chat" },
] as const;

export default function JourneyStart() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme, switchable } = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState("ROADMAP");

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 160);
    return () => window.clearTimeout(timer);
  }, []);

  const dark = theme === "dark";

  return (
    <FantasyBackground
      imageUrl="/assets/worlds/origin-village.svg"
      className={`hana-cinematic-menu min-h-[100svh] overflow-hidden transition-colors duration-700 ${dark ? "saturate-[.8]" : "saturate-[1.08]"}`}
      overlayClassName={dark
        ? "bg-[linear-gradient(90deg,rgba(4,8,22,.76),rgba(6,8,25,.36),rgba(18,8,38,.38))]"
        : "bg-[linear-gradient(90deg,rgba(250,249,239,.72),rgba(244,251,246,.24),rgba(7,31,31,.20))]"}
    >
      <main className="relative min-h-[100svh]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_52%,transparent_0%,transparent_28%,rgba(2,10,16,.18)_72%,rgba(2,10,16,.45)_100%)]" aria-hidden="true" />

        <div className="relative z-20 flex min-h-[100svh] w-full items-center px-5 py-8 sm:px-9 lg:px-14">
          <section className={`w-full max-w-7xl transition-all duration-1000 ${loaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
            <div className="max-w-[680px]">
              <p className={`text-[10px] font-bold uppercase tracking-[.46em] drop-shadow-md sm:text-xs ${dark ? "text-[#f1c77b]" : "text-[#2e786b]"}`}>THE ADVENTURE CONTINUES</p>
              <h1 className={`mt-1 font-display text-6xl font-semibold tracking-[.07em] drop-shadow-[0_5px_26px_rgba(0,0,0,.65)] sm:text-8xl lg:text-9xl ${dark ? "text-[#fff8e8]" : "text-[#173c3c]"}`}>HANA</h1>
              <p className={`mt-1 font-display text-base uppercase tracking-[.24em] drop-shadow-lg sm:text-xl ${dark ? "text-[#f1c77b]" : "text-[#285c55]"}`}>Your CS adventure</p>

              <div className="mt-8 grid max-w-[390px] gap-3 sm:mt-10">
                {menuItems.map((item, index) => {
                  const active = selected === item.label;
                  return (
                    <GameButton
                      key={item.href}
                      onMouseEnter={() => setSelected(item.label)}
                      onFocus={() => setSelected(item.label)}
                      onClick={() => navigate(item.href)}
                      className={`group min-h-12 justify-between rounded-xl border-2 px-5 text-left text-sm tracking-[.14em] transition-all duration-200 ${
                        active
                          ? dark
                            ? "border-[#b8b8ff] bg-gradient-to-r from-[#2d346d] to-[#574b9c] text-[#fff8e8] shadow-[0_0_28px_rgba(126,122,255,.34)]"
                            : "border-[#e6c46d] bg-gradient-to-r from-[#2e725f] to-[#1b5045] text-[#fff8e8] shadow-[0_0_28px_rgba(83,176,148,.30)]"
                          : dark
                            ? "border-[#aaa8d9]/30 bg-[#071722]/55 text-[#f8ead0]/80 hover:border-[#b8b8ff]/70"
                            : "border-[#477f74]/25 bg-white/55 text-[#285c55]/85 hover:border-[#e6c46d]/70"
                      }`}
                    >
                      <span className="flex items-center gap-3"><span className={`text-xs ${active ? "opacity-100" : "opacity-40"}`}>✦</span>{item.label}</span>
                      <ArrowRight className={`h-4 w-4 transition-transform ${active ? "translate-x-1 opacity-100" : "opacity-40"}`} />
                    </GameButton>
                  );
                })}

                <button
                  type="button"
                  onClick={() => toggleTheme?.()}
                  disabled={!switchable}
                  className={`mt-2 flex min-h-11 items-center justify-between rounded-xl border px-5 py-3 text-left backdrop-blur-md transition ${
                    dark ? "border-[#aaa8d9]/30 bg-[#071722]/55 text-[#fff8e8] hover:border-[#b8b8ff]/60" : "border-[#477f74]/25 bg-white/55 text-[#285c55] hover:border-[#e6c46d]/60"
                  }`}
                  aria-label="Switch between bright and dark mode"
                >
                  <span><span className="block text-[10px] font-bold uppercase tracking-[.22em]">OPTIONS</span><span className={`mt-1 block text-[10px] ${dark ? "text-white/55" : "text-[#315a58]/60"}`}>{dark ? "Switch to bright world" : "Switch to dark world"}</span></span>
                  {dark ? <Moon className="h-4 w-4 text-[#b8b8ff]" /> : <Sun className="h-4 w-4 text-[#e2b955]" />}
                </button>
              </div>

              <p className={`mt-5 text-[10px] uppercase tracking-[.28em] ${dark ? "text-[#f5dfb2]/70" : "text-[#35655f]/65"}`}>Select a destination • One quest at a time</p>
            </div>
          </section>

          <div className={`pointer-events-none absolute inset-y-0 right-[-3%] flex w-[58%] items-end justify-end transition-all duration-1000 delay-150 ${loaded ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}>
            <div className={`absolute bottom-[8%] right-[18%] h-72 w-72 rounded-full blur-3xl ${dark ? "bg-[#7774ff]/25" : "bg-[#58b89f]/22"}`} />
            <img src="/assets/hana-phase1-approved-opening.png" alt="Hana, your AI career companion" className="relative z-10 max-h-[82svh] w-auto max-w-[58vw] object-contain object-bottom drop-shadow-[0_30px_42px_rgba(0,0,0,.52)]" />
          </div>
        </div>
      </main>
    </FantasyBackground>
  );
}
