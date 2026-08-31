import { ArrowRight, BookOpen, Compass, Gamepad2, MessageCircle, Search, Sparkles, Trophy, Volume2 } from "lucide-react";
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

const sceneActions = [
  { label: "START JOURNEY", href: "/path", hint: "Choose your direction" },
  { label: "ENTER ROADMAP", href: "/roadmap", hint: "See your five-world path" },
  { label: "ASK HANA", href: "/chat", hint: "Talk to your companion" },
] as const;

export default function AdventureHome() {
  const date = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#101d2b] text-[#fffaf4]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(83,139,132,.26),transparent_32%),radial-gradient(circle_at_15%_80%,rgba(225,145,117,.16),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-3 py-4 sm:px-6 lg:px-10">
        <header className="relative z-30 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <Sparkles className="h-5 w-5" />HANA
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/chat" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10">
              <MessageCircle className="h-4 w-4" /> Ask Hana
            </Link>
            <Link href="/path" className="hidden rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 sm:inline-flex">
              Choose direction
            </Link>
          </div>
        </header>

        <section className="relative mt-3 overflow-hidden rounded-[2rem] border border-white/10 bg-[#101d2b] shadow-[0_32px_90px_rgba(0,0,0,.3)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(244,199,123,.09),transparent_28%)]" aria-hidden="true" />

          <div className="relative min-h-[680px] sm:min-h-[760px] lg:min-h-[820px]">
            <img
              src="/assets/hana-phase1-approved-opening.png"
              alt="Fantasy world with Hana, your learning companion"
              className="absolute inset-0 h-full w-full object-cover object-center sm:object-contain"
              draggable="false"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#101d2b] via-transparent to-[#101d2b]/20" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#101d2b]/45 via-transparent to-[#101d2b]/10" aria-hidden="true" />

            <div className="absolute inset-x-3 top-3 z-20 flex items-start justify-between gap-3 sm:inset-x-5 sm:top-5">
              <div className="rounded-2xl border border-white/10 bg-[#101d2b]/60 px-3 py-2 backdrop-blur-md sm:px-4">
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/45">{date}</p>
                <p className="mt-1 text-xs font-semibold text-white/80 sm:text-sm">Hana’s Adventure Console</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#101d2b]/60 px-3 py-2 text-xs font-semibold text-white/70 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#8bd2bf] shadow-[0_0_12px_rgba(139,210,191,.8)]" /> Ready
              </div>
            </div>

            <div className="absolute inset-x-3 bottom-4 z-20 sm:inset-x-6 sm:bottom-6 lg:inset-x-8">
              <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-white/10 bg-[#101d2b]/72 p-4 shadow-[0_25px_80px_rgba(0,0,0,.35)] backdrop-blur-xl sm:p-5 lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#f1c77b]">A message from Hana</p>
                    <h1 className="mt-2 font-display text-3xl font-semibold leading-none tracking-[-.045em] sm:text-4xl lg:text-5xl">Ready for your next world?</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">Choose an action below. Every button is a real game action that takes you deeper into your journey.</p>
                  </div>
                  <button type="button" className="shrink-0 rounded-full border border-white/10 bg-white/5 p-3 text-white/75 hover:bg-white/10" aria-label="Hana is speaking" title="Hana is speaking">
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {sceneActions.map(({ label, href, hint }) => (
                    <Link
                      key={label}
                      href={href}
                      className="group rounded-2xl border border-white/10 bg-white/[.06] px-4 py-3 transition hover:-translate-y-0.5 hover:border-[#f1c77b]/40 hover:bg-white/[.11] focus:outline-none focus:ring-2 focus:ring-[#f1c77b]/70"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span>
                          <span className="block text-sm font-extrabold tracking-[.08em] text-white">{label}</span>
                          <span className="mt-1 block text-xs text-white/45">{hint}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-[#f1c77b] transition group-hover:translate-x-1" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 py-9 sm:py-11">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-white/40">The adventure map</p>
              <h2 className="mt-1 font-display text-3xl font-semibold">Five worlds. One next step.</h2>
            </div>
            <Gamepad2 className="hidden h-6 w-6 text-white/35 sm:block" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {worlds.map(([name, image, text, href]) => (
              <Link key={name} href={href} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[.055] p-3 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[.09] focus:outline-none focus:ring-2 focus:ring-[#f1c77b]/70">
                <div className="rounded-2xl bg-black/10 p-2">
                  <img src={image} alt="" className="h-28 w-full object-contain transition group-hover:scale-105" />
                </div>
                <p className="mt-2 font-semibold">{name}</p>
                <p className="mt-1 text-sm text-white/50">{text}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#f1c77b]">Enter <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative z-10 pb-10">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-white/40">Your console</p>
            <h2 className="mt-1 font-display text-3xl font-semibold">Everything you need, without the clutter.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {menu.map(([title, description, href, Icon]) => (
              <Link key={title} href={href} className="group rounded-3xl border border-white/10 bg-white/[.055] p-5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[.09] focus:outline-none focus:ring-2 focus:ring-[#f1c77b]/70">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f1c77b] text-[#172630]"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-5 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-5 text-white/50">{description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#f1c77b]">Open <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative z-10 mb-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/[.045] p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-white/40">Explore before committing</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">Curious about AI engineering?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">Search the web, find tutorials and university starting points, then ask Hana to turn your research into a focused plan.</p>
          </div>
          <Link href="/research?query=AI%20Engineering" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-[#20302e] focus:outline-none focus:ring-2 focus:ring-[#f1c77b]">
            <BookOpen className="h-4 w-4" /> Research AI
          </Link>
        </section>

        <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-white/30">Hana · Learn at your pace · Build what matters · {careerCatalog.length} directions</footer>
      </div>
    </main>
  );
}
