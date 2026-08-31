import { ArrowRight, BriefcaseBusiness, MessageCircle, Map, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { careerCatalog, defaultCareerPath, type CareerPathId } from "@/data/careerCatalog";

const worlds = [
  ["Origin Village", "/assets/worlds/origin-village.svg", "Roadmap", "/roadmap"],
  ["Code Forge", "/assets/worlds/code-forge.svg", "Projects", "/projects"],
  ["Webwilds", "/assets/worlds/webwilds.svg", "Opportunities", "/opportunities"],
  ["Skyforge", "/assets/worlds/skyforge.svg", "Research", "/research"],
  ["Beacon Summit", "/assets/worlds/beacon-summit.svg", "Ask Hana", "/chat"],
] as const;

export default function JourneyStart() {
  const [, navigate] = useLocation();
  const selected = (typeof window !== "undefined" ? window.localStorage.getItem("hana-career-path") : null) as CareerPathId | null;
  const path = careerCatalog.find(p => p.id === selected) ?? careerCatalog.find(p => p.id === defaultCareerPath) ?? careerCatalog[0];
  const choose = (id: CareerPathId) => { window.localStorage.setItem("hana-career-path", id); navigate("/roadmap"); };
  return <main className="relative min-h-screen overflow-hidden bg-[#06131e] text-white">
    <img src="/assets/worlds/origin-village.svg" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
    <div className="absolute inset-0 bg-gradient-to-b from-[#06131e]/35 via-[#06131e]/55 to-[#06131e]/98" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(71,213,210,.16),transparent_35%)]" />
    <header className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-9"><Link href="/" className="font-display text-xl tracking-[.22em] text-[#f1c77b]">HANA</Link><Link href="/settings" className="rounded-full border border-white/20 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[.14em] backdrop-blur">Options</Link></header>
    <section className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[38px] border border-[#f1c77b]/30 bg-[#081923]/20 shadow-[0_0_100px_rgba(45,195,200,.14)]">
        <div className="absolute left-6 top-6 h-12 w-12 border-l border-t border-[#f1c77b]/70"/><div className="absolute right-6 top-6 h-12 w-12 border-r border-t border-[#f1c77b]/70"/><div className="absolute bottom-6 left-6 h-12 w-12 border-b border-l border-[#f1c77b]/70"/><div className="absolute bottom-6 right-6 h-12 w-12 border-b border-r border-[#f1c77b]/70"/>
        <div className="relative grid min-h-[650px] items-end lg:grid-cols-[1fr_390px]">
          <div className="relative z-20 self-end p-7 pb-12 text-center lg:p-12 lg:text-left"><p className="text-[10px] font-bold uppercase tracking-[.38em] text-[#f1c77b]">THE ADVENTURE BEGINS</p><h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">Welcome, adventurer.</h1><p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">Hana has opened five worlds for your CS journey. Choose your direction and explore at your own pace.</p><div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">{careerCatalog.slice(0,6).map(item=><button key={item.id} onClick={()=>choose(item.id)} className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition ${path.id===item.id?"border-[#f1c77b] bg-[#f1c77b] text-[#12212a]":"border-white/15 bg-black/25 text-white/75 hover:bg-white/10"}`}>{item.title}</button>)}</div></div>
          <div className="relative z-10 flex h-full min-h-[430px] items-end justify-center p-5 lg:min-h-[650px]"><img src="/assets/hana-phase1-approved-opening.png" alt="Hana" className="max-h-[560px] w-auto max-w-full object-contain drop-shadow-[0_0_45px_rgba(90,225,230,.35)]"/></div>
        </div>
      </div>
    </section>
    <section className="relative z-20 border-t border-white/10 bg-[#06131e]/95 px-4 py-8 backdrop-blur-xl"><div className="mx-auto max-w-6xl"><div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.28em] text-[#f1c77b]/70">Your world map</p><h2 className="mt-1 font-display text-2xl">Where will Hana take you?</h2></div><Sparkles className="h-5 w-5 text-[#f1c77b]"/></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{worlds.map(([name,image,label,href])=><Link key={name} href={href} className="group relative h-40 overflow-hidden rounded-2xl border border-white/10 bg-[#0d202c] transition hover:-translate-y-1 hover:border-[#f1c77b]/50"><img src={image} alt={name} className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-110 group-hover:opacity-100"/><div className="absolute inset-0 bg-gradient-to-t from-[#06131e] via-transparent to-transparent"/><div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-xs font-bold uppercase tracking-[.13em] text-[#f1c77b]">{label}</p><p className="mt-1 text-[11px] text-white/55">{name}</p></div></Link>)}</div><div className="mt-5 flex flex-wrap justify-center gap-3"><Link href="/roadmap" className="inline-flex items-center gap-2 rounded-full border border-[#f1c77b]/30 bg-[#f1c77b]/10 px-5 py-3 text-xs font-bold text-[#f1c77b]"><Map className="h-4 w-4"/>Roadmap</Link><Link href="/opportunities" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold"><BriefcaseBusiness className="h-4 w-4"/>Opportunities</Link><Link href="/chat" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold"><MessageCircle className="h-4 w-4"/>Ask Hana</Link></div></div></section>
  </main>;
}
