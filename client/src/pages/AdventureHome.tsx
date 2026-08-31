import { ArrowRight, Volume2 } from "lucide-react";
import { Link } from "wouter";

export default function AdventureHome() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06131e] text-white">
      <img src="/assets/worlds/origin-village.svg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-90" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,13,21,.88)_0%,rgba(4,13,21,.52)_46%,rgba(4,13,21,.18)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(64,202,194,.18),transparent_32%),linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.5))]" />

      <header className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-9 sm:py-7">
        <div className="font-display text-xl font-bold tracking-[.22em]">HANA</div>
        <Link href="/settings" className="rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-[.14em] backdrop-blur-md hover:bg-white/10">Options</Link>
      </header>

      <section className="relative z-10 flex min-h-screen items-center px-5 py-24 sm:px-10 lg:px-16">
        <div className="max-w-xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.28em] text-[#f1c77b]">A learning adventure</p>
          <h1 className="font-display text-6xl font-semibold leading-[.9] tracking-[-.06em] sm:text-8xl">HANA</h1>
          <p className="mt-5 font-display text-xl uppercase tracking-[.18em] text-white/75 sm:text-2xl">Your CS Adventure</p>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base">Enter a living fantasy-tech world where your roadmap becomes the journey and every skill becomes a quest.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/journey" className="group inline-flex min-h-14 items-center gap-3 rounded-full border border-[#f1c77b]/70 bg-[#f1c77b] px-7 py-3.5 font-extrabold tracking-wide text-[#14242d] shadow-[0_0_38px_rgba(241,199,123,.25)] transition hover:-translate-y-1 hover:shadow-[0_0_55px_rgba(241,199,123,.38)]">START JOURNEY <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" /></Link>
            <button type="button" aria-label="Hana voice" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur-md hover:bg-white/10"><Volume2 className="h-4 w-4" /></button>
          </div>
          <div className="mt-7 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-white/40"><span className="h-1.5 w-1.5 rounded-full bg-[#8bd2bf] shadow-[0_0_12px_rgba(139,210,191,.9)]" /> System ready · Your journey is saved automatically</div>
        </div>
      </section>
    </main>
  );
}
