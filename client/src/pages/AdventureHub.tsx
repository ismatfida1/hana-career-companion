import { ArrowRight, BookOpen, BriefcaseBusiness, CalendarDays, Compass, ExternalLink, MessageCircle, Rocket, Search, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { careerCatalog, defaultCareerPath } from "@/data/careerCatalog";

const worlds = [
  ["Origin Village", "/assets/worlds/origin-village.svg", "Choose your direction"],
  ["Code Forge", "/assets/worlds/code-forge.svg", "Build foundations"],
  ["Webwilds", "/assets/worlds/webwilds.svg", "Make useful things"],
  ["Skyforge", "/assets/worlds/skyforge.svg", "Ship real projects"],
  ["Beacon Summit", "/assets/worlds/beacon-summit.svg", "Show your work"],
] as const;

const nextSteps = [
  { title: "Learn one concept", text: "Understand how an API lets two parts of an app communicate.", href: "/path", icon: BookOpen },
  { title: "Build one small thing", text: "Turn the concept into a tiny project you can keep and improve.", href: "/projects", icon: Rocket },
  { title: "Find a real opportunity", text: "Explore hackathons, internships, scholarships, and communities that fit your direction.", href: "/opportunities", icon: BriefcaseBusiness },
];

export default function AdventureHub() {
  const date = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date());
  const selected = typeof window !== "undefined" ? window.localStorage.getItem("hana-career-path") : null;
  const path = careerCatalog.find(item => item.id === selected) ?? careerCatalog.find(item => item.id === defaultCareerPath) ?? careerCatalog[0];

  return (
    <main className="min-h-screen bg-[#FBF7F1] text-[#2d3c39]">
      <header className="sticky top-0 z-40 border-b border-[#eadfd3]/90 bg-[#FBF7F1]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <Link href="/" className="font-display text-xl font-bold tracking-wide">HANA</Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/" className="rounded-full px-3 py-2 text-sm font-semibold hover:bg-white">Home</Link>
            <Link href="/path" className="rounded-full px-3 py-2 text-sm font-semibold hover:bg-white">Roadmap</Link>
            <Link href="/projects" className="rounded-full px-3 py-2 text-sm font-semibold hover:bg-white">Projects</Link>
            <Link href="/opportunities" className="rounded-full px-3 py-2 text-sm font-semibold hover:bg-white">Opportunities</Link>
            <Link href="/research" className="rounded-full px-3 py-2 text-sm font-semibold hover:bg-white">Research</Link>
            <Link href="/chat" className="rounded-full bg-[#315d58] px-4 py-2 text-sm font-semibold text-white hover:bg-[#254c48]">Ask Hana</Link>
          </nav>
          <Link href="/path" className="rounded-full border border-[#dfd3c7] bg-white px-3 py-2 text-xs font-semibold md:hidden">Change path</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:px-8 md:py-12 lg:grid-cols-[1.05fr_.95fr]">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e8ddd1] bg-white px-3 py-2 text-xs font-bold uppercase tracking-[.14em] text-[#7d7166]"><CalendarDays className="h-3.5 w-3.5" /> {date}</div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-[#9b8e80]">Your adventure continues</p>
          <h1 className="mt-2 max-w-2xl font-display text-5xl font-semibold leading-[1.02] tracking-[-.055em] sm:text-6xl">One useful next step, not a mountain of tasks.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#76695d]">Hana is guiding your <strong>{path.title}</strong> journey. The complete roadmap exists behind the scenes, but today you only need one clear move.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/path" className="inline-flex items-center gap-2 rounded-full bg-[#315d58] px-5 py-3.5 font-semibold text-white shadow-lg hover:bg-[#254c48]">Open my roadmap <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/chat" className="inline-flex items-center gap-2 rounded-full border border-[#dfd3c7] bg-white px-5 py-3.5 font-semibold hover:bg-[#fffaf4]"><MessageCircle className="h-4 w-4" /> Talk to Hana</Link>
          </div>
        </div>
        <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-[2.5rem] border border-[#e4d8cc] bg-[#142737] p-5 shadow-[0_30px_80px_rgba(55,48,40,.18)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,.14),transparent_38%)]" />
          <img src="/assets/hana-phase1-approved-opening.png" alt="Hana, your learning companion" className="relative z-10 max-h-[560px] w-full object-contain" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-10 md:px-8">
        <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#9b8e80]">The world map</p><h2 className="mt-2 font-display text-3xl font-semibold">Five worlds, one focused journey.</h2></div><Compass className="h-5 w-5 text-[#6ca595]" /></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {worlds.map(([name, image, text], index) => <div key={name} className="overflow-hidden rounded-[24px] border border-[#e5dbcf] bg-white shadow-sm"><img src={image} alt="" className="h-28 w-full object-contain" /><div className="p-4"><div className="text-xs font-bold text-[#a0958a]">0{index + 1}</div><div className="mt-1 font-semibold">{name}</div><div className="mt-1 text-sm text-[#7a6f65]">{text}</div></div></div>)}
        </div>
      </section>

      <section className="border-y border-[#eadfd3] bg-white/70">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
          <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#9b8e80]">Your navigation</p><h2 className="mt-2 font-display text-3xl font-semibold">Everything you need, without the clutter.</h2></div>
          <div className="grid gap-4 md:grid-cols-3">
            {nextSteps.map(({ title, text, href, icon: Icon }) => <Link key={href} href={href} className="group rounded-[26px] border border-[#e7ddd2] bg-[#fffdf9] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><div className="flex items-center justify-between"><div className="rounded-2xl bg-[#edf5f0] p-3 text-[#4f806f]"><Icon className="h-5 w-5" /></div><ArrowRight className="h-5 w-5 text-[#b0a399] transition group-hover:translate-x-1" /></div><h3 className="mt-5 font-display text-xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#76695d]">{text}</p></Link>)}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href="/research" className="rounded-[24px] border border-[#e7ddd2] bg-[#f7f1e9] p-5"><div className="flex items-center gap-3"><Search className="h-5 w-5 text-[#db8b71]" /><div><div className="font-semibold">Research a field</div><div className="text-sm text-[#7a6f65]">Search the web, watch learning videos, compare universities, then ask Hana to turn what you find into a plan.</div></div></div></Link>
            <a href="https://developers.google.com/" target="_blank" rel="noreferrer" className="rounded-[24px] border border-[#e7ddd2] bg-[#fffaf4] p-5"><div className="flex items-center gap-3"><ExternalLink className="h-5 w-5 text-[#6ca595]" /><div><div className="font-semibold">Explore real developer resources</div><div className="text-sm text-[#7a6f65]">Open official documentation and learning ecosystems when you are ready for depth.</div></div></div></a>
          </div>
        </div>
      </section>
    </main>
  );
}
