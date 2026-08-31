import { ArrowRight, Play, Volume2, VolumeX } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { FantasyBackground } from "@/components/FantasyBackground";
import { GameButton } from "@/components/GameButton";

export default function AdventureHome() {
  const [, navigate] = useLocation();
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoaded(true), 300);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <FantasyBackground
      imageUrl="/assets/worlds/origin-village.svg"
      className="min-h-[100svh] bg-center"
      overlayClassName="bg-gradient-to-b from-[#06131e]/20 via-[#06131e]/35 to-[#06131e]/80"
    >
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-9">
        <span className="font-display text-xl tracking-[.22em] text-[#f1c77b] drop-shadow-lg">HANA</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMuted(value => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#f1c77b]/40 bg-[#071722]/55 text-[#f1c77b] shadow-lg backdrop-blur-md transition hover:border-[#f1c77b]/70 hover:bg-[#071722]/75"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <Link
            href="/settings"
            className="rounded-full border border-[#f1c77b]/40 bg-[#071722]/55 px-4 py-2.5 text-xs font-bold uppercase tracking-[.14em] text-[#f8e7c2] shadow-lg backdrop-blur-md transition hover:border-[#f1c77b]/70 hover:bg-[#071722]/75"
          >
            Options
          </Link>
        </div>
      </header>

      <main className="relative flex min-h-[100svh] items-center justify-center px-5 pb-28 pt-24">
        <div
          className={`w-full max-w-4xl text-center transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
        >
          <p className="text-[10px] font-bold uppercase tracking-[.48em] text-[#f1c77b] drop-shadow-md sm:text-xs">
            YOUR CS ADVENTURE
          </p>
          <h1 className="mt-2 font-display text-7xl font-semibold tracking-[.06em] text-white drop-shadow-[0_5px_25px_rgba(0,0,0,.7)] sm:text-9xl">
            HANA
          </h1>
          <p className="mt-3 font-display text-lg uppercase tracking-[.2em] text-[#f8ead0] drop-shadow-lg sm:text-2xl">
            The journey begins.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/85 drop-shadow-md sm:text-base">
            Enter the fantasy-tech world. Hana guides you through learning, building, opportunities, and your path into computer science.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <GameButton onClick={() => navigate("/journey")} className="min-w-56 border-2 border-[#e9c56f] bg-gradient-to-b from-[#2f725f] to-[#174b40] text-[#fff8e8] shadow-[0_8px_0_#12382f,0_0_35px_rgba(241,199,123,.35)] hover:from-[#3b846d] hover:to-[#205a4d] hover:shadow-[0_9px_0_#12382f,0_0_48px_rgba(241,199,123,.5)]">
              <span className="mr-2 text-[#f1c77b]">✦</span>
              <Play className="mr-2 h-4 w-4 fill-current" />
              START JOURNEY
              <ArrowRight className="ml-2 h-4 w-4" />
              <span className="ml-2 text-[#f1c77b]">✦</span>
            </GameButton>
          </div>

          <p className="mt-5 text-xs uppercase tracking-[.25em] text-[#f5dfb2]/80">
            One quest at a time.
          </p>
        </div>
      </main>

      <nav className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 flex-wrap justify-center gap-1 rounded-full border border-[#f1c77b]/25 bg-[#071722]/55 p-2 shadow-[0_10px_35px_rgba(0,0,0,.25)] backdrop-blur-xl">
        <Link href="/roadmap" className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#f8ead0]/75 transition hover:bg-[#f1c77b]/15 hover:text-white">Roadmap</Link>
        <Link href="/projects" className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#f8ead0]/75 transition hover:bg-[#f1c77b]/15 hover:text-white">Projects</Link>
        <Link href="/opportunities" className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#f8ead0]/75 transition hover:bg-[#f1c77b]/15 hover:text-white">Opportunities</Link>
        <Link href="/chat" className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#f8ead0]/75 transition hover:bg-[#f1c77b]/15 hover:text-white">Ask Hana</Link>
      </nav>
    </FantasyBackground>
  );
}
