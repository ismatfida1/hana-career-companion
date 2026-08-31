import { ArrowRight, BriefcaseBusiness, Compass, MessageCircle, Rocket, Search, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { careerCatalog, defaultCareerPath } from "@/data/careerCatalog";
import HanaGameFrame from "@/components/HanaGameFrame";

const worlds = [
  ["Origin Village", "/assets/worlds/origin-village.svg", "Choose a direction"],
  ["Code Forge", "/assets/worlds/code-forge.svg", "Learn the foundations"],
  ["Weblands", "/assets/worlds/webwilds.svg", "Make something useful"],
  ["Cloudspire", "/assets/worlds/skyforge.svg", "Build and ship"],
  ["Summit of Builders", "/assets/worlds/beacon-summit.svg", "Show your work"],
] as const;

export default function CareerHub() {
  const saved = typeof window !== "undefined" ? window.localStorage.getItem("hana-career-path") : null;
  const selected = careerCatalog.find(p => p.id === saved) ?? careerCatalog.find(p => p.id === defaultCareerPath) ?? careerCatalog[0];
  return <HanaGameFrame title={`${selected.shortTitle} · Adventure Hub`}>
    <div className="min-w-0 space-y-5">
      <section className="grid min-w-0 gap-6 rounded-[30px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-7 lg:grid-cols-[1.08fr_.92fr]">
        <div className="flex min-w-0 flex-col justify-center"><p className="text-xs font-bold uppercase tracking-[.16em] text-white/40">Hana · your next chapter</p><h2 className="mt-2 break-words font-display text-4xl font-semibold leading-tight tracking-[-.055em] sm:text-5xl">Welcome to your {selected.shortTitle} adventure.</h2><p className="mt-5 max-w-xl text-base leading-7 text-white/55">You don't need to understand the whole career yet. Hana keeps the full route ready and brings forward one useful next step.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/path" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f1c77b] px-5 py-3 font-semibold text-[#172630] shadow-lg">Continue my roadmap <ArrowRight className="h-4 w-4"/></Link><Link href="/chat" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-semibold"><MessageCircle className="h-4 w-4"/>Talk to Hana</Link></div></div>
        <div className="min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#142737] p-4 sm:p-5"><img src="/assets/hana-phase1-approved-opening.png" alt="Hana" className="mx-auto h-auto max-h-[520px] w-full object-contain"/></div>
      </section>

      <section className="min-w-0 rounded-[30px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-7"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-white/40">Your world</p><h2 className="mt-2 break-words font-display text-3xl font-semibold">Five worlds that make the roadmap feel like an adventure.</h2></div><Compass className="h-5 w-5 shrink-0 text-[#f1c77b]"/></div><div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-5">{worlds.map(([name,image,text])=><div key={name} className="min-w-0 overflow-hidden rounded-[24px] border border-white/10 bg-[#132434]/70"><img src={image} alt="" className="h-28 w-full object-contain p-2"/><div className="p-4"><p className="font-semibold">{name}</p><p className="mt-1 break-words text-sm text-white/45">{text}</p></div></div>)}</div></section>

      <section className="min-w-0 rounded-[30px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-white/40">Keep the mountain hidden</p><h2 className="mt-2 font-display text-3xl font-semibold">What can Hana do for you?</h2><div className="mt-5 grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-4"><Link href="/path" className="min-w-0 rounded-[24px] border border-white/10 bg-[#132434]/70 p-5"><Compass className="h-5 w-5 text-[#f1c77b]"/><h3 className="mt-4 font-semibold">Personal roadmap</h3><p className="mt-2 text-sm text-white/45">See the full route only when you want it.</p></Link><Link href="/projects" className="min-w-0 rounded-[24px] border border-white/10 bg-[#132434]/70 p-5"><Rocket className="h-5 w-5 text-[#f1c77b]"/><h3 className="mt-4 font-semibold">One project</h3><p className="mt-2 text-sm text-white/45">Turn the next skill into something you can show.</p></Link><Link href="/opportunities" className="min-w-0 rounded-[24px] border border-white/10 bg-[#132434]/70 p-5"><BriefcaseBusiness className="h-5 w-5 text-[#f1c77b]"/><h3 className="mt-4 font-semibold">Opportunities</h3><p className="mt-2 text-sm text-white/45">Find programs that fit your path.</p></Link><Link href="/research" className="min-w-0 rounded-[24px] border border-white/10 bg-[#132434]/70 p-5"><Search className="h-5 w-5 text-[#f1c77b]"/><h3 className="mt-4 font-semibold">Research a field</h3><p className="mt-2 text-sm text-white/45">Search current resources and university information.</p></Link></div><div className="mt-5 min-w-0 rounded-[26px] border border-white/10 bg-black/10 p-5"><div className="flex min-w-0 items-start gap-4"><div className="rounded-2xl bg-[#f1c77b] p-3 text-[#172630]"><Sparkles className="h-5 w-5"/></div><div className="min-w-0"><p className="break-words font-semibold">Currently exploring: {selected.title}</p><p className="mt-1 break-words text-sm text-white/45">{selected.roles.slice(0,3).join(" · ")}</p><p className="mt-3 break-words text-sm text-white/45">Learning resources are attached to the skills in your path, with alternatives so one unavailable link never blocks you.</p></div></div></div></section>
    </div>
  </HanaGameFrame>;
}
