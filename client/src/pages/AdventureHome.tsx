import { ArrowRight, Play, Volume2, VolumeX } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { FantasyBackground } from "@/components/FantasyBackground";
import { FantasyFrame } from "@/components/FantasyFrame";
import { GameButton } from "@/components/GameButton";

export default function AdventureHome() {
  const [, navigate] = useLocation();
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => setIsLoaded(true), 450); return () => window.clearTimeout(timer); }, []);

  return (
    <FantasyBackground imageUrl="/assets/worlds/origin-village.svg" overlayClassName="bg-gradient-to-b from-[#06131e]/35 via-[#06131e]/55 to-[#06131e]/95">
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-9">
        <span className="font-display text-xl tracking-[.22em] text-[#f1c77b]">HANA</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => setIsMuted(value => !value)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition hover:bg-white/10" aria-label={isMuted ? "Unmute" : "Mute"}>{isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}</button>
          <Link href="/settings" className="rounded-full border border-white/20 bg-black/30 px-4 py-2.5 text-xs font-bold uppercase tracking-[.14em] text-white backdrop-blur hover:bg-white/10">Options</Link>
        </div>
      </header>

      <main className="relative flex min-h-screen items-center justify-center px-4 pb-20 pt-24">
        <div className={`grid w-full max-w-6xl items-center gap-8 transition-all duration-1000 lg:grid-cols-[1fr_390px] ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          <div className="max-w-2xl text-center lg:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[.4em] text-[#f1c77b]">YOUR CS ADVENTURE</p>
            <h1 className="mt-2 font-display text-6xl font-semibold tracking-[.04em] text-white sm:text-8xl">HANA</h1>
            <p className="mt-3 font-display text-lg uppercase tracking-[.2em] text-white/80 sm:text-2xl">The journey begins.</p>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base lg:mx-0">Enter the fantasy-tech world. Hana guides you through learning, building, opportunities, and your path into computer science.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <GameButton onClick={() => navigate("/journey")}><Play className="mr-2 h-4 w-4 fill-current" />Start Journey<ArrowRight className="ml-1 h-4 w-4" /></GameButton>
              <Link href="/opportunities" className="inline-flex min-h-11 items-center rounded-full border border-white/25 bg-black/20 px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-white backdrop-blur hover:bg-white/10">Explore Opportunities</Link>
            </div>
          </div>

          <FantasyFrame className="mx-auto w-full max-w-[390px] bg-[#071722]/55 text-white backdrop-blur-sm">
            <div className="flex aspect-[4/5] items-end justify-center overflow-hidden rounded-2xl bg-black/10 p-3">
              <img src="/assets/hana-phase1-approved-opening.png" alt="Hana, your CS adventure companion" className="h-full w-full object-contain drop-shadow-[0_0_45px_rgba(90,225,230,.35)]" />
            </div>
            <p className="mt-3 text-center text-sm text-white/80"><span className="font-semibold text-[#f1c77b]">Hana:</span> Ready when you are. One quest at a time.</p>
          </FantasyFrame>
        </div>
      </main>

      <nav className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-black/40 p-2 backdrop-blur-xl">
        <Link href="/roadmap" className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white/70 hover:bg-white/10 hover:text-white">Roadmap</Link>
        <Link href="/projects" className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white/70 hover:bg-white/10 hover:text-white">Projects</Link>
        <Link href="/opportunities" className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white/70 hover:bg-white/10 hover:text-white">Opportunities</Link>
        <Link href="/chat" className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white/70 hover:bg-white/10 hover:text-white">Ask Hana</Link>
      </nav>
    </FantasyBackground>
  );
}
