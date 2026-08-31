import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Compass, ExternalLink, Github, HeartHandshake, Layers3, MessageCircle, Send, Sparkles, Trophy, X } from "lucide-react";

const ART = "/assets/hana-phase1-approved-opening.png";

const resources = [
  ["CS50x", "https://cs50.harvard.edu/x/"],
  ["MDN Web Docs", "https://developer.mozilla.org/en-US/docs/Learn_web_development"],
  ["Python Docs", "https://docs.python.org/3/tutorial/"],
  ["GitHub Skills", "https://skills.github.com/"],
  ["freeCodeCamp", "https://www.freecodecamp.org/learn/"],
  ["Hugging Face Learn", "https://huggingface.co/learn"],
];

const missions = [
  { title: "Understand how APIs help apps talk to each other", detail: "Learn one idea, try one request, then apply it in a project.", time: "20 min" },
  { title: "Make your first GitHub proof commit", detail: "Commit a small improvement and write what you learned.", time: "15 min" },
  { title: "Build one useful UI component", detail: "Turn a concept into a visible piece of your portfolio.", time: "25 min" },
];

function hanaReply(message: string) {
  const q = message.toLowerCase();
  if (q.includes("api")) return "Think of an API like a waiter: your app asks for something, the API carries the request, and a service sends data back. Start with one GET request and inspect the response.";
  if (q.includes("github")) return "For GitHub, make one small public proof: a clean README, a meaningful commit, and a short note explaining what you learned. Small evidence beats an empty portfolio.";
  if (q.includes("project")) return "Choose a project you can finish in a few days. Build the smallest useful version first, then add one feature that shows your target skill.";
  if (q.includes("overwhelm") || q.includes("stuck") || q.includes("confused")) return "You do not need to solve everything tonight. Pick one tiny next step: open the current mission, spend 20 focused minutes on it, and come back with the exact point that blocked you.";
  if (q.includes("career") || q.includes("learn next")) return "For a software-engineering path, keep the sequence simple: programming fundamentals → Git/GitHub → web + APIs → databases → deployment → portfolio projects.";
  return "I’m Hana. Start with one small action: tell me what you’re learning, what you’re building, or exactly where you’re stuck, and I’ll turn it into a next step.";
}

export default function EmergencyHana() {
  const [view, setView] = useState<"home" | "roadmap" | "projects" | "opportunities" | "chat">("home");
  const [menu, setMenu] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "hana", text: "Hi, I’m Hana 🌿 What would feel most useful right now?" }]);
  const [selectedMission, setSelectedMission] = useState(0);

  const roadmap = useMemo(() => [
    ["01", "Origin Village", "Computer Science Foundations", "Python · Git · problem solving", true],
    ["02", "Code Forge", "Programming & Problem Solving", "Functions · data structures · debugging", completed >= 1],
    ["03", "Weblands", "Web Development", "HTML · CSS · JavaScript · APIs", completed >= 2],
    ["04", "Cloudspire", "Backend & Cloud", "Databases · deployment · reliability", completed >= 3],
    ["05", "Summit of Builders", "Career & Opportunities", "Portfolio · open source · opportunities", completed >= 4],
  ], [completed]);

  const send = (text = input) => {
    const clean = text.trim();
    if (!clean) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text: clean }, { role: "hana", text: hanaReply(clean) }]);
  };

  const nav = (next: typeof view) => { setView(next); setMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="min-h-screen overflow-hidden bg-[#07151d] text-[#f8f1e7]">
      <div className="fixed inset-0 -z-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(120deg, rgba(5,18,25,.94) 8%, rgba(8,25,31,.78) 44%, rgba(8,20,28,.42) 72%, rgba(4,12,19,.76)), url('${ART}')` }} />
      <div className="fixed inset-0 -z-0 bg-[radial-gradient(circle_at_72%_34%,rgba(145,232,205,.18),transparent_25%),linear-gradient(180deg,rgba(1,9,15,.05),rgba(1,8,13,.72))]" />

      <header className="relative z-20 flex items-center justify-between border-b border-white/10 bg-[#081923]/70 px-4 py-3 backdrop-blur-xl md:px-8 md:py-4">
        <button onClick={() => nav("home")} className="flex items-center gap-3 text-left">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-white/10 shadow-lg"><Sparkles className="h-5 w-5 text-[#d8f2c9]" /></span>
          <span><span className="block font-display text-2xl font-semibold tracking-[-.04em]">HANA</span><span className="block text-[10px] font-bold uppercase tracking-[.18em] text-white/45">Your CS adventure</span></span>
        </button>
        <div className="hidden items-center gap-2 md:flex">
          {[<[string, typeof Compass]>["roadmap", Compass], ["projects", Layers3], ["opportunities", Trophy], ["chat", MessageCircle]].map(([id, Icon]) => <button key={id} onClick={() => nav(id as typeof view)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10"><Icon className="mr-1 inline h-4 w-4" />{id[0].toUpperCase() + id.slice(1)}</button>)}
        </div>
        <button onClick={() => setMenu(!menu)} className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold md:hidden">{menu ? "Close" : "Menu"}</button>
      </header>

      {menu && <div className="relative z-20 grid gap-2 border-b border-white/10 bg-[#081923]/95 p-4 backdrop-blur-xl md:hidden">
        {(["roadmap", "projects", "opportunities", "chat"] as const).map(id => <button key={id} onClick={() => nav(id)} className="rounded-2xl bg-white/5 px-4 py-3 text-left font-semibold">{id[0].toUpperCase() + id.slice(1)}</button>)}
      </div>}

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 pb-16 md:px-8 md:py-12">
        {view === "home" && <>
          <section className="max-w-3xl pt-3 md:pt-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[.22em] text-[#d6edc9]">A personal computer science adventure</p>
            <h1 className="font-display text-5xl font-semibold leading-[.95] tracking-[-.06em] md:text-7xl">Learn one small thing.<br />Build something real.<br /><span className="text-[#d5efc8]">Find your next step.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/68 md:text-lg">Hana turns the huge CS journey into clear missions, real resources, projects, opportunities, and a calm place to ask for help.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => nav("roadmap")} className="rounded-full border border-[#d6edc9]/40 bg-[#d6edc9] px-6 py-3 text-sm font-bold text-[#17312d] shadow-xl">Start Journey <ArrowRight className="ml-1 inline h-4 w-4" /></button>
              <button onClick={() => nav("chat")} className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur">Ask Hana <MessageCircle className="ml-1 inline h-4 w-4" /></button>
            </div>
          </section>

          <section className="mt-12 grid gap-4 md:grid-cols-3">
            {[[BookOpen, "Daily missions", "One focused next action instead of a giant to-do list."], [Layers3, "Build proof", "Projects and GitHub evidence attached to learning."], [Trophy, "Find opportunities", "Hackathons, open source, fellowships and career paths."]].map(([Icon, title, text]) => <article key={title as string} className="rounded-[26px] border border-white/10 bg-[#091b26]/68 p-5 shadow-2xl backdrop-blur-xl"><div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-white/10"><Icon className="h-5 w-5 text-[#d6edc9]" /></div><h2 className="font-display text-2xl font-semibold">{title as string}</h2><p className="mt-2 text-sm leading-6 text-white/55">{text as string}</p></article>)}
          </section>
        </>}

        {view === "roadmap" && <section className="mx-auto max-w-5xl">
          <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#d6edc9]">World 01 · Navigation</p><h1 className="mt-2 font-display text-4xl font-semibold md:text-6xl">Follow the glowing path.</h1><p className="mt-3 max-w-2xl text-white/60">Five connected worlds take you from foundations to portfolio-ready work. Locked worlds preview what comes next.</p></div>
          <div className="grid gap-4">{roadmap.map(([num, world, title, detail, unlocked], i) => <button key={num as string} onClick={() => unlocked && setSelectedMission(i % missions.length)} className={`rounded-[28px] border p-5 text-left backdrop-blur-xl transition md:p-6 ${unlocked ? "border-white/12 bg-[#0a202a]/72 hover:bg-[#102a35]" : "cursor-not-allowed border-white/8 bg-black/25 opacity-55"}`}><div className="flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 font-display text-lg font-semibold">{unlocked ? num as string : "🔒"}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-[11px] font-bold uppercase tracking-[.14em] text-[#d6edc9]/75">{world as string}</span><span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[.1em]">{unlocked ? "Open" : "Locked"}</span></div><h2 className="mt-2 font-display text-2xl font-semibold">{title as string}</h2><p className="mt-2 text-sm text-white/55">{detail as string}</p></div><ArrowRight className="mt-2 h-5 w-5 text-white/45" /></div></button>)}</div>
          <div className="mt-6 rounded-[28px] border border-[#d6edc9]/20 bg-[#d6edc9]/8 p-5"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#d6edc9]">Today’s mission</p><h2 className="mt-2 font-display text-2xl font-semibold">{missions[selectedMission].title}</h2><p className="mt-2 text-sm leading-6 text-white/58">{missions[selectedMission].detail}</p><button onClick={() => { setCompleted(c => Math.min(5, c + 1)); nav("projects"); }} className="mt-4 rounded-full bg-[#d6edc9] px-5 py-2.5 text-sm font-bold text-[#17312d]">Mark mission complete <CheckCircle2 className="ml-1 inline h-4 w-4" /></button></div>
        </section>}

        {view === "projects" && <section><div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#d6edc9]">World 02 · Guild workshop</p><h1 className="mt-2 font-display text-4xl font-semibold md:text-6xl">Build proof, one checkpoint at a time.</h1></div><div className="grid gap-5 md:grid-cols-2"><article className="rounded-[28px] border border-white/10 bg-[#0a202a]/74 p-6 backdrop-blur-xl"><p className="text-xs font-bold uppercase tracking-[.14em] text-white/40">Active project</p><h2 className="mt-3 font-display text-3xl font-semibold">Weather & discovery app</h2><p className="mt-3 text-sm leading-6 text-white/56">A portfolio project for practicing APIs, UI design, error handling, and GitHub evidence.</p><div className="mt-6 h-2 rounded-full bg-white/10"><div className="h-full w-[46%] rounded-full bg-[#d6edc9]" /></div><p className="mt-3 text-xs font-semibold text-white/45">46% · Current checkpoint: connect the first GET request</p><div className="mt-5 flex flex-wrap gap-2"><a href="https://github.com/ismatfida1/hana-career-companion" target="_blank" rel="noreferrer" className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold">View HANA GitHub <Github className="ml-1 inline h-4 w-4" /></a><button onClick={() => nav("chat")} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">Ask Hana for help</button></div></article><article className="rounded-[28px] border border-white/10 bg-[#0a202a]/74 p-6 backdrop-blur-xl"><p className="text-xs font-bold uppercase tracking-[.14em] text-white/40">Proof checklist</p><div className="mt-4 grid gap-3">{["Write one clean README", "Make one meaningful commit", "Document what the API returns", "Share a short project reflection"].map((item, i) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3"><span className={`grid h-7 w-7 place-items-center rounded-full ${i < 2 ? "bg-[#d6edc9] text-[#17312d]" : "bg-white/10 text-white/55"}`}>{i < 2 ? "✓" : i + 1}</span><span className="text-sm text-white/68">{item}</span></div>)}</div></article></div></section>}

        {view === "opportunities" && <section><div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#d6edc9]">World 03 · Adventurer’s Board</p><h1 className="mt-2 font-display text-4xl font-semibold md:text-6xl">Find a quest with a reason.</h1><p className="mt-3 max-w-2xl text-white/58">Explore the categories Hana connects to your learning path: hackathons, open source, fellowships, internships, volunteering, and research.</p></div><div className="grid gap-4 md:grid-cols-3">{[["Hackathons", "Build under a deadline and learn by doing."], ["Open source", "Practice GitHub collaboration and real contribution."], ["Fellowships", "Find mentorship, community, and career exposure."]].map(([title, text]) => <article key={title} className="rounded-[28px] border border-white/10 bg-[#0a202a]/74 p-6 backdrop-blur-xl"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10"><Trophy className="h-5 w-5 text-[#d6edc9]" /></div><h2 className="mt-4 font-display text-2xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-white/55">{text}</p><a href="https://github.com/explore" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center text-sm font-semibold text-[#d6edc9]">Explore <ExternalLink className="ml-1 h-4 w-4" /></a></article>)}</div></section>}

        {view === "chat" && <section className="mx-auto max-w-5xl"><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#d6edc9]">World 04 · Hana’s study</p><h1 className="mt-2 font-display text-4xl font-semibold md:text-6xl">Ask Hana anything.</h1><p className="mt-3 text-white/58">A reliable submission-mode companion for concepts, projects, planning, and getting unstuck.</p></div><div className="grid gap-5 lg:grid-cols-[1fr_280px]"><section className="flex min-h-[560px] flex-col rounded-[28px] border border-white/10 bg-[#071923]/78 p-4 backdrop-blur-xl md:p-6"><div className="flex items-center gap-3 border-b border-white/10 pb-4"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10"><HeartHandshake className="h-5 w-5 text-[#d6edc9]" /></span><div><p className="font-semibold">Hana</p><p className="text-xs text-white/40">Career companion · ready</p></div><span className="ml-auto h-2 w-2 rounded-full bg-[#d6edc9]" /></div><div className="flex-1 space-y-4 overflow-y-auto py-5">{messages.map((m, i) => <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[88%] rounded-[20px] px-4 py-3 text-sm leading-6 ${m.role === "user" ? "bg-[#d6edc9] text-[#17312d]" : "bg-white/7 text-white/74"}`}>{m.text}</div></div>)}</div><div className="mt-2 flex flex-wrap gap-2">{["Explain APIs simply", "What should I learn next?", "I’m stuck on my project"].map(p => <button key={p} onClick={() => send(p)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/65">{p}</button>)}</div><div className="mt-3 flex items-end gap-3 rounded-[20px] border border-white/10 bg-white/5 p-2"><textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Tell Hana what’s on your mind…" className="min-h-[58px] flex-1 resize-none border-0 bg-transparent p-2 text-sm text-white outline-none placeholder:text-white/30" /><button onClick={() => send()} className="rounded-2xl bg-[#d6edc9] p-3 text-[#17312d]"><Send className="h-4 w-4" /></button></div></section><aside className="rounded-[28px] border border-white/10 bg-[#0a202a]/74 p-5 backdrop-blur-xl"><p className="text-xs font-bold uppercase tracking-[.15em] text-white/40">Starter resources</p><div className="mt-4 grid gap-2">{resources.map(([title, url]) => <a key={title} href={url} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/8 bg-white/4 p-3 transition hover:bg-white/8"><p className="text-sm font-semibold text-white/80">{title}</p><p className="mt-1 text-[11px] text-white/35">Open source <ExternalLink className="ml-1 inline h-3 w-3" /></p></a>)}</div><a href="https://github.com/ismatfida1/hana-career-companion" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center text-sm font-semibold text-[#d6edc9]">HANA source on GitHub <Github className="ml-1 h-4 w-4" /></a></aside></div></section>}
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-[#06131b]/75 px-4 py-5 text-xs text-white/35 backdrop-blur-xl md:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between"><span>HANA // Your CS Adventure</span><span>Learn · Build · Prove · Explore</span></div></footer>
      {view !== "home" && <button onClick={() => nav("home")} className="fixed bottom-5 left-5 z-30 rounded-full border border-white/10 bg-[#081923]/90 px-4 py-2 text-xs font-semibold text-white/65 shadow-2xl backdrop-blur">← Return home</button>}
      {view === "chat" && messages.length > 1 && <button onClick={() => setMessages([{ role: "hana", text: "Hi, I’m Hana 🌿 What would feel most useful right now?" }])} className="fixed bottom-5 right-5 z-30 rounded-full border border-white/10 bg-[#081923]/90 px-4 py-2 text-xs font-semibold text-white/65 shadow-2xl backdrop-blur">Clear chat <X className="ml-1 inline h-3.5 w-3.5" /></button>}
    </div>
  );
}
