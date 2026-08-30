import { Link } from "wouter";
import { ArrowRight, Compass, MessageCircle, Sparkles } from "lucide-react";
import { careerCatalog } from "@/data/careerCatalog";

const worlds = [
  ["Origin Village", "/assets/worlds/origin-village.svg", "Choose your direction"],
  ["Code Forge", "/assets/worlds/code-forge.svg", "Build foundations"],
  ["Webwilds", "/assets/worlds/webwilds.svg", "Make things people use"],
  ["Skyforge", "/assets/worlds/skyforge.svg", "Ship real projects"],
  ["Beacon Summit", "/assets/worlds/beacon-summit.svg", "Show what you can do"],
] as const;

export default function AdventureHome() {
  const date = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());
  return (
    <main className="min-h-screen bg-[#FBF7F1] text-[#2d3c39]">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between"><div className="font-display text-xl font-bold tracking-wide">HANA</div><Link href="/path" className="text-sm font-semibold text-[#5f716c] hover:text-[#315d58]">Explore paths</Link></header>
        <section className="grid min-h-[72vh] items-center gap-10 py-10 lg:grid-cols-[1fr_.9fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#eadfd3] bg-white px-3 py-2 text-sm shadow-sm"><Sparkles className="h-4 w-4 text-[#db8b71]" /> {date}</div>
            <h1 className="font-display text-5xl font-semibold leading-[1.03] tracking-[-0.055em] sm:text-6xl lg:text-7xl">Your CS Adventure.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#76695d]">Meet Hana, choose a direction, and discover one useful next step at a time. The full roadmap is there when you want it—but you never have to climb the whole mountain at once.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/path" className="inline-flex items-center gap-2 rounded-full bg-[#315d58] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#315d58]/15 hover:bg-[#254c48]">Choose my direction <ArrowRight className="h-4 w-4" /></Link><Link href="/chat" className="inline-flex items-center gap-2 rounded-full border border-[#ddd1c5] bg-white px-6 py-3.5 font-semibold hover:bg-[#fffaf4]"><MessageCircle className="h-4 w-4" /> Ask Hana</Link></div>
            <p className="mt-4 text-xs text-[#a19589]">No sign-in required to explore your journey.</p>
          </div>
          <div className="flex min-h-[480px] items-center justify-center overflow-hidden rounded-[2.5rem] border border-[#eadfd3] bg-[#fffaf4] p-6 shadow-[0_25px_70px_rgba(85,67,52,.1)] sm:min-h-[600px]"><img src="/assets/hana-phase1-approved-opening.png" alt="Hana, your career companion" className="max-h-[560px] w-full object-contain" /></div>
        </section>
        <section className="pb-12"><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a19589]">The adventure</p><h2 className="mt-1 font-display text-2xl font-semibold">Five worlds, one calm journey.</h2></div><Compass className="h-5 w-5 text-[#6ca595]" /></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{worlds.map(([name, image, text]) => <div key={name} className="rounded-3xl border border-[#eadfd3] bg-white p-3 shadow-sm"><img src={image} alt="" className="h-28 w-full object-contain" /><p className="mt-2 font-semibold">{name}</p><p className="mt-1 text-sm text-[#76695d]">{text}</p></div>)}</div></section>
        <section className="rounded-[2rem] border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a19589]">A direction is not a commitment</p><h2 className="mt-2 font-display text-3xl font-semibold">Explore what could fit you.</h2><p className="mt-2 max-w-2xl text-[#76695d]">Hana currently supports {careerCatalog.length} technical directions. Pick one now, switch later, and let the roadmap adapt.</p><Link href="/path" className="mt-5 inline-flex items-center gap-2 font-semibold text-[#315d58]">See all directions <ArrowRight className="h-4 w-4" /></Link></section>
      </div>
    </main>
  );
}
