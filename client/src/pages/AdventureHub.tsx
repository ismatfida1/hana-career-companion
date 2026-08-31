import { ArrowRight, Compass, MessageCircle, Sparkles, Trophy, Gamepad2, BookOpen } from "lucide-react";
import { Link } from "wouter";

const worlds = [
  ["ROADMAP", "Code Forge", "/roadmap", "/assets/worlds/code-forge.svg", "Follow your skill path"],
  ["OPPORTUNITIES", "Summit of Builders", "/opportunities", "/assets/worlds/beacon-summit.svg", "Find quests worth pursuing"],
  ["PROJECTS", "Weblands", "/projects", "/assets/worlds/webwilds.svg", "Build proof of your skills"],
  ["RESEARCH", "Cloudspire", "/research", "/assets/worlds/skyforge.svg", "Explore universities and resources"],
  ["ASK HANA", "Origin Village", "/chat", "/assets/worlds/origin-village.svg", "Talk through your next move"],
] as const;

export default function AdventureHub() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06131e] text-white">
      <img src="/assets/worlds/origin-village.svg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-90" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,16,25,.28),rgba(5,16,25,.86))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(70,205,195,.18),transparent_34%)]" />

      <header className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-9 sm:py-7">
        <Link href="/" className="font-display text-lg font-bold tracking-[.22em]">HANA</Link>
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-white/60 backdrop-blur-md"><Sparkles className="h-3.5 w-3.5 text-[#f1c77b]" /> Your adventure</div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col justify-center px-5 pb-12 pt-4 sm:px-9">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[.28em] text-[#f1c77b]">Origin Village · Chapter 01</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.05em] sm:text-6xl">The path is yours now.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">Hana has opened the worlds. Choose where you want to go — every panel below is a real interactive part of your adventure.</p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {worlds.map(([label, world, href, image, description]) => (
            <Link key={href} href={href} className="group relative min-h-[245px] overflow-hidden rounded-[28px] border border-white/15 bg-black/25 shadow-2xl backdrop-blur-[2px] transition duration-300 hover:-translate-y-2 hover:border-[#f1c77b]/55 hover:shadow-[0_20px_60px_rgba(0,0,0,.4)] focus:outline-none focus:ring-2 focus:ring-[#f1c77b]">
              <img src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06131e] via-[#06131e]/45 to-transparent" />
              <div className="relative flex h-full min-h-[245px] flex-col justify-end p-5">
                <span className="text-[10px] font-bold uppercase tracking-[.18em] text-[#f1c77b]">{label}</span>
                <h2 className="mt-2 font-display text-xl font-semibold">{world}</h2>
                <p className="mt-1 text-xs leading-5 text-white/55">{description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-white/75">ENTER WORLD <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Link href="/roadmap" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur-md hover:bg-white/10"><Compass className="h-4 w-4 text-[#f1c77b]" /><span className="text-sm font-semibold">Continue roadmap</span></Link>
          <Link href="/opportunities" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur-md hover:bg-white/10"><Trophy className="h-4 w-4 text-[#f1c77b]" /><span className="text-sm font-semibold">Open opportunity board</span></Link>
          <Link href="/chat" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur-md hover:bg-white/10"><MessageCircle className="h-4 w-4 text-[#f1c77b]" /><span className="text-sm font-semibold">Ask Hana anything</span></Link>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-[.16em] text-white/35"><span className="inline-flex items-center gap-1.5"><Gamepad2 className="h-3.5 w-3.5" /> Interactive worlds</span><span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Real learning data</span><span>Progress saves automatically</span></div>
      </section>
    </main>
  );
}
