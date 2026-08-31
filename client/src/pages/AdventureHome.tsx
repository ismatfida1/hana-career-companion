import { ArrowRight, BookOpen, Compass, Gamepad2, MessageCircle, Search, Sparkles, Trophy, Volume2 } from "lucide-react";
import { Link } from "wouter";
import { careerCatalog } from "@/data/careerCatalog";

const worlds = [
  ["Origin Village", "Choose your direction", "/path", "◈"],
  ["Code Forge", "Build foundations", "/roadmap", "⌘"],
  ["Weblands", "Make things people use", "/projects", "◇"],
  ["Cloudspire", "Ship reliable projects", "/research", "△"],
  ["Summit of Builders", "Find your next opportunity", "/opportunities", "✦"],
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
  return <main className="min-h-screen overflow-x-hidden bg-[#081725] text-[#fffaf4]">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(65,196,190,.18),transparent_30%),radial-gradient(circle_at_15%_75%,rgba(214,158,93,.12),transparent_28%)]" />
    <div className="relative mx-auto max-w-7xl px-3 py-4 sm:px-6 lg:px-10">
      <header className="relative z-30 flex items-center justify-between gap-3"><Link href="/" className="flex items-center gap-2 font-display text-xl font-bold"><Sparkles className="h-5 w-5 text-[#f1c77b]"/>HANA</Link><div className="flex gap-2"><Link href="/chat" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"><MessageCircle className="h-4 w-4"/> Ask Hana</Link><Link href="/path" className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 sm:inline-flex">Choose direction</Link></div></header>

      <section className="relative mt-3 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1b29] shadow-[0_32px_90px_rgba(0,0,0,.35)]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(55,190,185,.05)_48%,transparent_75%)]" aria-hidden="true" />
        <div className="absolute left-[8%] top-[20%] h-40 w-40 rounded-full border border-[#65cfc5]/15 shadow-[0_0_80px_rgba(65,196,190,.14)]" aria-hidden="true" />
        <div className="absolute right-[8%] top-[12%] h-64 w-64 rounded-full border border-[#f1c77b]/20 shadow-[0_0_100px_rgba(241,199,123,.12),inset_0_0_60px_rgba(241,199,123,.06)]" aria-hidden="true" />
        <div className="relative grid min-h-[650px] items-center gap-8 px-5 py-8 sm:px-10 lg:min-h-[700px] lg:grid-cols-[1.05fr_.95fr] lg:px-14">
          <div className="relative z-10 max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.22em] text-[#f1c77b]">{date} · Hana adventure console</p><h1 className="mt-4 font-display text-5xl font-semibold tracking-[-.055em] sm:text-7xl">HANA</h1><p className="mt-2 font-display text-xl uppercase tracking-[.14em] text-white/65 sm:text-2xl">Your CS Adventure</p><p className="mt-5 max-w-xl text-base leading-7 text-white/55">A real learning journey built from your roadmap, projects, opportunities and conversations with Hana.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/path" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#f1c77b] px-6 py-3 font-extrabold text-[#172630] shadow-[0_0_30px_rgba(241,199,123,.16)] hover:-translate-y-0.5">START JOURNEY <ArrowRight className="h-4 w-4"/></Link><Link href="/roadmap" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold hover:bg-white/10">View roadmap</Link></div></div>
          <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:justify-end"><div className="absolute h-72 w-72 rounded-full border border-[#65cfc5]/20 shadow-[0_0_90px_rgba(65,196,190,.16),inset_0_0_80px_rgba(65,196,190,.06)] sm:h-96 sm:w-96" aria-hidden="true"/><div className="relative flex h-80 w-64 items-end justify-center rounded-[40%] border border-white/10 bg-gradient-to-b from-white/[.07] to-black/20 p-4 shadow-2xl backdrop-blur sm:h-96 sm:w-80"><img src="/assets/hana-phase1-approved-opening.png" alt="Hana, your learning companion" className="h-full w-full object-contain object-center" draggable="false"/><div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-[#081725]/85 px-4 py-3 text-center backdrop-blur"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#f1c77b]">Hana</p><p className="mt-1 text-xs text-white/65">Your guide through the adventure</p></div></div></div>
        </div>
        <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-[#081725]/70 px-3 py-2 text-xs font-semibold text-white/60 backdrop-blur"><span className="h-2 w-2 rounded-full bg-[#8bd2bf] shadow-[0_0_12px_rgba(139,210,191,.8)]"/> Ready</div><button type="button" className="absolute bottom-5 right-5 z-20 rounded-full border border-white/10 bg-[#081725]/70 p-3 text-white/70 backdrop-blur" aria-label="Hana voice"><Volume2 className="h-4 w-4"/></button>
      </section>

      <section className="relative z-10 py-9 sm:py-11"><div className="mb-5"><p className="text-xs font-bold uppercase tracking-[.18em] text-white/40">The adventure map</p><h2 className="mt-1 font-display text-3xl font-semibold">Five worlds. One next step.</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{worlds.map(([name,text,href,symbol])=><Link key={name} href={href} className="group rounded-3xl border border-white/10 bg-white/[.045] p-5 backdrop-blur transition hover:-translate-y-1 hover:border-[#f1c77b]/25 hover:bg-white/[.075] focus:outline-none focus:ring-2 focus:ring-[#f1c77b]/70"><div className="flex h-28 items-center justify-center rounded-2xl border border-white/5 bg-[radial-gradient(circle,rgba(65,196,190,.11),transparent_62%)] font-display text-5xl text-[#f1c77b]/70">{symbol}</div><p className="mt-3 font-semibold">{name}</p><p className="mt-1 text-sm text-white/50">{text}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#f1c77b]">Enter <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1"/></span></Link>)}</div></section>

      <section className="relative z-10 pb-10"><div className="mb-5"><p className="text-xs font-bold uppercase tracking-[.18em] text-white/40">Your console</p><h2 className="mt-1 font-display text-3xl font-semibold">Everything you need, without the clutter.</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{menu.map(([title,description,href,Icon])=><Link key={title} href={href} className="group rounded-3xl border border-white/10 bg-white/[.045] p-5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[.075] focus:outline-none focus:ring-2 focus:ring-[#f1c77b]/70"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f1c77b] text-[#172630]"><Icon className="h-5 w-5"/></div><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-5 text-white/50">{description}</p><span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#f1c77b]">Open <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1"/></span></Link>)}</div></section>
      <section className="relative z-10 mb-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/[.045] p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-white/40">Explore before committing</p><h2 className="mt-2 font-display text-2xl font-semibold">Curious about AI engineering?</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">Search tutorials and university starting points, then ask Hana to turn your research into a focused plan.</p></div><Link href="/research?query=AI%20Engineering" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-[#20302e]"><BookOpen className="h-4 w-4"/> Research AI</Link></section>
      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-white/30">Hana · Learn at your pace · Build what matters · {careerCatalog.length} directions</footer>
    </div>
  </main>;
}
