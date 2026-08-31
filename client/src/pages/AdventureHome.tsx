import { ArrowRight, Play, Volume2, VolumeX } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

export default function AdventureHome() {
  const [, navigate] = useLocation();
  const [isMuted, setIsMuted] = useState(true);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06131e] text-white">
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/worlds/origin-village.svg"
          alt="Origin Village fantasy world"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04101a]/90 via-[#04101a]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06131e]/90 via-transparent to-black/20" />
      </div>

      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-9">
        <span className="font-display text-xl tracking-[.22em] text-[#f1c77b]">HANA</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMuted(value => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur transition hover:bg-white/10"
            aria-label={isMuted ? "Unmute Hana" : "Mute Hana"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <Link
            href="/settings"
            className="rounded-full border border-white/20 bg-black/30 px-4 py-2.5 text-xs font-bold uppercase tracking-[.14em] backdrop-blur transition hover:bg-white/10"
          >
            Options
          </Link>
        </div>
      </header>

      <section className="relative z-10 flex min-h-screen items-center px-5 pb-16 pt-28 sm:px-10 lg:px-20">
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_360px]">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[.4em] text-[#f1c77b]">YOUR CS ADVENTURE</p>
            <h1 className="mt-2 font-display text-6xl font-semibold tracking-[.04em] sm:text-8xl">HANA</h1>
            <p className="mt-3 font-display text-lg uppercase tracking-[.2em] text-white/80 sm:text-2xl">The journey begins.</p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              Enter the fantasy-tech world. Hana will guide you through learning, building,
              opportunities, and your path into computer science.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/journey")}
                className="inline-flex min-h-14 items-center gap-3 rounded-full bg-[#f1c77b] px-8 font-black uppercase tracking-[.15em] text-[#14242d] shadow-[0_0_40px_rgba(241,199,123,.28)] transition hover:-translate-y-1 hover:shadow-[0_0_55px_rgba(241,199,123,.4)] active:translate-y-0"
              >
                <Play className="h-4 w-4 fill-current" />
                Start Journey
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/opportunities"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-black/25 px-5 text-xs font-bold uppercase tracking-[.12em] backdrop-blur transition hover:bg-white/10"
              >
                Explore Opportunities
              </Link>
            </div>
          </div>

          <div className="relative flex min-h-[320px] items-end justify-center lg:min-h-[500px]">
            <div className="absolute bottom-12 h-48 w-48 rounded-full bg-[#f1c77b]/10 blur-3xl" />
            <img
              src="/assets/hana-phase1-approved-opening.png"
              alt="Hana, your CS adventure companion"
              className="relative z-10 max-h-[430px] w-auto max-w-[82vw] object-contain drop-shadow-[0_0_45px_rgba(90,225,230,.35)]"
            />
            <div className="absolute bottom-5 z-20 max-w-xs rounded-2xl border border-white/15 bg-black/45 px-4 py-3 text-center text-xs leading-5 text-white/80 backdrop-blur-xl">
              <span className="font-semibold text-[#f1c77b]">Hana:</span> Ready when you are. Let’s build your future one quest at a time.
            </div>
          </div>
        </div>
      </section>

      <nav className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 flex-wrap justify-center gap-2 rounded-full border border-white/10 bg-black/35 p-2 backdrop-blur-xl sm:gap-4">
        <Link href="/roadmap" className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white/70 transition hover:bg-white/10 hover:text-white">Roadmap</Link>
        <Link href="/projects" className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white/70 transition hover:bg-white/10 hover:text-white">Projects</Link>
        <Link href="/opportunities" className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white/70 transition hover:bg-white/10 hover:text-white">Opportunities</Link>
        <Link href="/chat" className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white/70 transition hover:bg-white/10 hover:text-white">Ask Hana</Link>
      </nav>
    </main>
  );
}
