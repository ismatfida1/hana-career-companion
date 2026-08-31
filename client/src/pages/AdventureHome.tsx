import { ArrowRight, Play, Volume2, VolumeX } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { FantasyBackground } from "@/components/FantasyBackground";
import { GameButton } from "@/components/GameButton";
import { useTheme } from "@/contexts/ThemeContext";

export default function AdventureHome() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoaded(true), 180);
    return () => window.clearTimeout(timer);
  }, []);

  const dark = theme === "dark";

  return (
    <FantasyBackground
      imageUrl="/assets/worlds/origin-village.svg"
      className={`hana-adventure-home min-h-[100svh] bg-center transition-colors duration-700 ${dark ? "saturate-[.82]" : "saturate-[1.12]"}`}
      overlayClassName={dark ? "bg-[linear-gradient(90deg,rgba(4,8,22,.28),rgba(6,8,25,.20),rgba(18,8,38,.48))]" : "bg-[linear-gradient(90deg,rgba(255,250,238,.20),rgba(244,251,246,.08),rgba(7,31,31,.24))]"}
    >
      <header className="hana-home-header absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-9">
        <span className={`font-display text-xl tracking-[.22em] drop-shadow-lg ${dark ? "text-[#f1c77b]" : "text-[#285c55]"}`}>HANA</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setIsMuted(value => !value)} className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border backdrop-blur-md transition ${dark ? "border-[#f1c77b]/40 bg-[#071722]/55 text-[#f1c77b]" : "border-[#477f74]/25 bg-white/55 text-[#2d665e]"}`} aria-label={isMuted ? "Unmute" : "Mute"}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button type="button" onClick={toggleTheme} className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-bold uppercase tracking-[.14em] shadow-lg backdrop-blur-md transition ${dark ? "border-[#a6a9ff]/35 bg-[#071722]/55 text-[#fff7df]" : "border-[#477f74]/25 bg-white/60 text-[#285c55]"}`} aria-label="Switch between bright and dark mode">
            {dark ? "Dark" : "Bright"}
          </button>
        </div>
      </header>

      <main className="hana-home-main relative flex min-h-[100svh] items-center overflow-hidden px-5 pb-24 pt-24 sm:px-9 sm:pb-20">
        <div className="hana-home-layout relative mx-auto grid w-full max-w-7xl items-center gap-4 lg:grid-cols-[minmax(0,1fr)_44%]">
          <div className={`hana-home-copy relative z-20 max-w-[78%] sm:max-w-2xl transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
            <p className={`text-[10px] font-bold uppercase tracking-[.48em] drop-shadow-md sm:text-xs ${dark ? "text-[#f1c77b]" : "text-[#2e786b]"}`}>YOUR CS ADVENTURE</p>
            <h1 className={`mt-2 font-display text-7xl font-semibold tracking-[.06em] drop-shadow-[0_5px_25px_rgba(0,0,0,.7)] sm:text-9xl ${dark ? "text-white" : "text-[#173c3c]"}`}>HANA</h1>
            <p className={`mt-3 font-display text-lg uppercase tracking-[.2em] drop-shadow-lg sm:text-2xl ${dark ? "text-[#f8ead0]" : "text-[#2b5e59]"}`}>The journey begins.</p>
            <p className={`mt-5 max-w-xl text-sm leading-6 drop-shadow-md sm:text-base sm:leading-7 ${dark ? "text-white/85" : "text-[#315a58]/80"}`}>
              Enter the fantasy-tech world. Hana guides you through learning, building, opportunities, and your path into computer science.
            </p>
            <div className="mt-7 sm:mt-9">
              <GameButton onClick={() => navigate("/journey")} className="hana-home-start min-w-56 border-2 border-[#e9c56f] bg-gradient-to-b from-[#2f725f] to-[#174b40] text-[#fff8e8] shadow-[0_8px_0_#12382f,0_0_35px_rgba(241,199,123,.35)] hover:from-[#3b846d] hover:to-[#205a4d] hover:shadow-[0_9px_0_#12382f,0_0_48px_rgba(241,199,123,.5)]">
                <span className="mr-2 text-[#f1c77b]">✦</span><Play className="mr-2 h-4 w-4 fill-current" />START JOURNEY<ArrowRight className="ml-2 h-4 w-4" /><span className="ml-2 text-[#f1c77b]">✦</span>
              </GameButton>
            </div>
            <p className={`mt-4 text-xs uppercase tracking-[.25em] ${dark ? "text-[#f5dfb2]/80" : "text-[#35655f]/70"}`}>One quest at a time.</p>
          </div>

          <div className={`hana-home-companion pointer-events-none relative z-10 flex min-h-[250px] items-end justify-center transition-all duration-1000 delay-150 sm:min-h-[360px] lg:min-h-[600px] lg:justify-end ${isLoaded ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}>
            <div className={`absolute bottom-8 right-[12%] h-56 w-56 rounded-full blur-3xl ${dark ? "bg-[#7774ff]/25" : "bg-[#58b89f]/25"}`} aria-hidden="true" />
            <img src="/assets/hana-phase1-approved-opening.png" alt="Hana, your AI career companion" className="relative z-10 h-[280px] w-[265px] object-contain object-bottom drop-shadow-[0_28px_35px_rgba(0,0,0,.48)] sm:h-[390px] sm:w-[370px] lg:h-[570px] lg:w-[500px]" />
          </div>
        </div>
      </main>

      <nav className={`hana-home-nav z-30 flex max-w-[calc(100%-1rem)] flex-wrap justify-center gap-1 rounded-full border p-1.5 shadow-[0_10px_35px_rgba(0,0,0,.25)] backdrop-blur-xl ${dark ? "border-[#f1c77b]/25 bg-[#071722]/55" : "border-[#477f74]/20 bg-white/50"}`}>
        <button onClick={() => navigate("/roadmap")} className={`rounded-full px-3 py-2 text-[9px] font-bold uppercase tracking-wider transition sm:px-4 sm:text-[10px] ${dark ? "text-[#f8ead0]/75 hover:bg-[#f1c77b]/15 hover:text-white" : "text-[#315a58]/75 hover:bg-white/60 hover:text-[#173c3c]"}`}>Roadmap</button>
        <button onClick={() => navigate("/projects")} className={`rounded-full px-3 py-2 text-[9px] font-bold uppercase tracking-wider transition sm:px-4 sm:text-[10px] ${dark ? "text-[#f8ead0]/75 hover:bg-[#f1c77b]/15 hover:text-white" : "text-[#315a58]/75 hover:bg-white/60 hover:text-[#173c3c]"}`}>Projects</button>
        <button onClick={() => navigate("/opportunities")} className={`rounded-full px-3 py-2 text-[9px] font-bold uppercase tracking-wider transition sm:px-4 sm:text-[10px] ${dark ? "text-[#f8ead0]/75 hover:bg-[#f1c77b]/15 hover:text-white" : "text-[#315a58]/75 hover:bg-white/60 hover:text-[#173c3c]"}`}>Opportunities</button>
        <button onClick={() => navigate("/chat")} className={`rounded-full px-3 py-2 text-[9px] font-bold uppercase tracking-wider transition sm:px-4 sm:text-[10px] ${dark ? "text-[#f8ead0]/75 hover:bg-[#f1c77b]/15 hover:text-white" : "text-[#315a58]/75 hover:bg-white/60 hover:text-[#173c3c]"}`}>Ask Hana</button>
      </nav>
    </FantasyBackground>
  );
}
