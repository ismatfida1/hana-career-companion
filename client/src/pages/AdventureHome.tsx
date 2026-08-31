import { ArrowRight, BookOpen, Compass, Gamepad2, MessageCircle, Search, Sparkles, Trophy } from "lucide-react";
import { Link } from "wouter";
import { careerCatalog } from "@/data/careerCatalog";

const worlds = [
  ["Origin Village", "/assets/worlds/origin-village.svg", "Choose your direction", "/path"],
  ["Code Forge", "/assets/worlds/code-forge.svg", "Build foundations", "/roadmap"],
  ["Weblands", "/assets/worlds/webwilds.svg", "Make things people use", "/projects"],
  ["Cloudspire", "/assets/worlds/skyforge.svg", "Ship reliable projects", "/projects"],
  ["Summit of Builders", "/assets/worlds/beacon-summit.svg", "Find your next opportunity", "/opportunities"],
] as const;
const menu = [
  ["Roadmap", "Your focused learning route", "/roadmap", Compass],
  ["Projects", "Build evidence, one project at a time", "/projects", Gamepad2],
  ["Opportunities", "Find programs, competitions and scholarships", "/opportunities", Trophy],
  ["Ask Hana", "Get help with concepts, plans or blockers", "/chat", MessageCircle],
  ["Research", "Search a field, videos and universities", "/research", Search],
] as const;

export default function AdventureHome() {
  const date = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());
  return <main className="min-h-screen overflow-x-hidden bg-[#101d2b] text-[#fffaf4]">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(83,139,132,.26),transparent_32%),radial-gradient(circle_at_15%_80%,rgba(225,145,117,.16),transparent_30%)]" />
    <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-7 lg:px-10">
      <header className="flex items-center justify-between"><Link href="/" className="flex items-center gap-2 font-display text-xl font-bold"><Sparkles className="h-5 w-5"/>HANA</Link><Link href="/path" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10">Choose direction</Link></header>
      <section className="grid min-h-[76vh] items-center gap-6 py-8 lg:grid-cols-[.9fr_1.1fr]">
        <div className="order-2 lg:order-1"><p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.14em] text-white/65">{date} · Your adventure begins</p><h1 className="font-display text-5xl font-semibold leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl">Your CS<br/>Adventure.</h1><p className="mt-5 max-w-xl text-base leading-7 text-white/65 sm:text-lg">Meet Hana, choose a direction, and discover one useful next step at a time. The complete system stays behind the scenes so you never have to climb the whole mountain at once.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/path" className="inline-flex items-center gap-2 rounded-full bg-[#f1c77b] px-6 py-3.5 font-bold text-[#172630] shadow-lg transition hover:-translate-y-0.5">OPEN JOURNEY <ArrowRight className="h-4 w-4"/></Link><Link href="/chat" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 font-semibold hover:bg-white/10"><MessageCircle className="h-4 w-4"/> Ask Hana</Link></div><p className="mt-4 text-xs text-white/35">No sign-in required to explore.</p></div>
        <div className="order-1 flex min-h-[430px] items-center justify-center lg:order-2 lg:min-h-[650px]"><div className="relative w-full max-w-[650px]"><div className="absolute inset-12 rounded-full bg-[#5d9a91]/15 blur-3xl"/><img src="/assets/hana-phase1-approved-opening.png" alt="Hana, your career companion" className="relative z-10 mx-auto max-h-[620px] w-full object-contain drop-shadow-[0_30px_55px_rgba(0,0,0,.45)]" /></div></div>
      </section>
      <section className="pb-10"><div className="mb-5"><p className="text-xs font-bold uppercase tracking-[.18em] text-white/40">The adventure map</p><h2 className="mt-1 font-display text-3xl font-semibold">Five worlds. One next step.</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{worlds.map(([name,image,text,href])=><Link key={name} href={href} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[.055] p-3 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[.09]"><img src={image} alt="" className="h-32 w-full object-contain transition group-hover:scale-105"/><p className="mt-2 font-semibold">{name}</p><p className="mt-1 text-sm text-white/50">{text}</p></Link>)}</div></section>
      <section className="pb-12"><div className="mb-5"><p className="text-xs font-bold uppercase tracking-[.18em] text-white/40">Your console</p><h2 className="mt-1 font-display text-3xl font-semibold">Everything you need, without the clutter.</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{menu.map(([title,description,href,Icon])=><Link key={title} href={href} className="group rounded-3xl border border-white/10 bg-white/[.055] p-5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[.09]"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f1c77b] text-[#172630]"><Icon className="h-5 w-5"/></div><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-5 text-white/50">{description}</p><span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#f1c77b]">Open <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1"/></span></Link>)}</div></section>
      <section className="mb-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/[.045] p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-white/40">Explore before committing</p><h2 className="mt-2 font-display text-2xl font-semibold">Curious about AI engineering?</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">Search the web, find tutorials and university starting points, then ask Hana to turn your research into a focused plan.</p></div><Link href="/research?query=AI%20Engineering" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-[#20302e]"><BookOpen className="h-4 w-4"/> Research AI</Link></section>
      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/30">Hana · Learn at your pace · Build what matters · {careerCatalog.length} directions</footer>
    </div>
  </main>;
}
