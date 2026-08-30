import { ArrowRight, BookOpen, Check, ChevronRight, Compass, ExternalLink, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { careerCatalog, defaultCareerPath, type CareerPathId } from "@/data/careerCatalog";

const featuredPathIds: CareerPathId[] = ["computer-science", "software-engineering", "ai-ml", "data-science", "cybersecurity", "web-fullstack"];
const worldAssets = [
  "/assets/worlds/origin-village.svg",
  "/assets/worlds/code-forge.svg",
  "/assets/worlds/webwilds.svg",
  "/assets/worlds/skyforge.svg",
  "/assets/worlds/beacon-summit.svg",
];

function readSavedPath(): CareerPathId {
  if (typeof window === "undefined") return defaultCareerPath;
  const saved = window.localStorage.getItem("hana-career-path");
  return saved && careerCatalog.some(item => item.id === saved) ? saved as CareerPathId : defaultCareerPath;
}

export default function JourneyStart() {
  const [, navigate] = useLocation();
  const [selectedPath, setSelectedPath] = useState<CareerPathId>(readSavedPath);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");
  const [stageIndex, setStageIndex] = useState(0);

  const path = useMemo(() => careerCatalog.find(item => item.id === selectedPath) ?? careerCatalog[0], [selectedPath]);
  const visiblePaths = useMemo(() => {
    const pool = showAll ? careerCatalog : careerCatalog.filter(item => featuredPathIds.includes(item.id));
    const needle = search.trim().toLowerCase();
    return needle ? pool.filter(item => `${item.title} ${item.shortTitle} ${item.description} ${item.roles.join(" ")}`.toLowerCase().includes(needle)) : pool;
  }, [search, showAll]);
  const stage = path.stages[Math.min(stageIndex, path.stages.length - 1)];
  const heroWorld = worldAssets[Math.min(stageIndex, worldAssets.length - 1)];
  const stageSkills = path.skills.filter(skill => stage.skills.some(tag => skill.name.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(skill.name.toLowerCase()))).slice(0, 4);
  const resources = (stageSkills.length ? stageSkills : path.skills.slice(0, 4)).flatMap(skill => skill.resources.map(resource => ({ skill: skill.name, ...resource })));

  const choosePath = (id: CareerPathId) => {
    setSelectedPath(id);
    setStageIndex(0);
    window.localStorage.setItem("hana-career-path", id);
  };

  return (
    <main className="min-h-screen bg-[#fbf7f1] text-[#2d3c39]">
      <section className="relative isolate overflow-hidden border-b border-[#eadfd3]">
        <img src={heroWorld} alt={`${stage.world} learning world`} className="absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-500" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(251,247,241,.96)_0%,rgba(251,247,241,.84)_36%,rgba(251,247,241,.42)_68%,rgba(31,48,50,.10)_100%)]" />
        <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-8 px-5 py-10 md:grid-cols-[1.05fr_.95fr] md:px-8 lg:py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#5f574e] shadow-sm backdrop-blur"><Compass className="h-3.5 w-3.5" /> Hana · Your CS Adventure</div>
            <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold tracking-[-0.055em] text-[#2d3c39] sm:text-5xl lg:text-6xl">Choose your direction. Hana builds the road ahead.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#60584f] md:text-lg">Pick a direction, meet five worlds, then learn through focused missions, projects, and real resources. You can change paths anytime.</p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {careerCatalog.filter(item => featuredPathIds.includes(item.id)).map(item => (
                <button key={item.id} onClick={() => choosePath(item.id)} className={`rounded-2xl border p-4 text-left backdrop-blur-md transition hover:-translate-y-0.5 ${selectedPath === item.id ? "border-[#6f9f91] bg-white/92 shadow-[0_12px_30px_rgba(49,93,88,.10)]" : "border-white/80 bg-white/68 hover:bg-white/88"}`}>
                  <div className="flex items-start justify-between gap-2"><span className="font-semibold">{item.title}</span>{selectedPath === item.id && <Check className="h-4 w-4 text-[#4f806f]" />}</div>
                  <span className="mt-1 block text-xs leading-5 text-[#76695d]">{item.description}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => { window.localStorage.setItem("hana-career-path", selectedPath); navigate("/path"); }} className="rounded-full bg-[#315d58] px-6 shadow-lg hover:bg-[#254c48]">Start this journey <ArrowRight className="ml-2 h-4 w-4" /></Button>
              <Button onClick={() => { setShowAll(true); document.getElementById("path-explorer")?.scrollIntoView({ behavior: "smooth" }); }} variant="outline" className="rounded-full border-white/90 bg-white/75">Explore every path</Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#756b61]"><span className="rounded-full bg-white/75 px-3 py-1.5 backdrop-blur">12 technical directions</span><span className="rounded-full bg-white/75 px-3 py-1.5 backdrop-blur">5 worlds per journey</span><span className="rounded-full bg-white/75 px-3 py-1.5 backdrop-blur">1 clear next step</span></div>
          </div>

          <div className="flex items-center justify-center md:justify-end">
            <div className="relative w-full max-w-[430px] rounded-[38px] border border-white/90 bg-white/55 p-3 shadow-[0_30px_90px_rgba(71,62,50,.20)] backdrop-blur-xl">
              <div className="relative flex min-h-[500px] items-end justify-center overflow-visible rounded-[30px] bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,.18),transparent_45%),#142737] px-4 pt-6 sm:min-h-[560px]">
                <img src="/assets/hana-phase1-approved-opening.png" alt="Hana, your learning companion" className="relative z-10 max-h-[540px] w-auto max-w-[100%] object-contain object-center drop-shadow-[0_25px_35px_rgba(0,0,0,.22)]" />
                <div className="absolute bottom-4 left-4 right-4 z-20 rounded-2xl border border-white/70 bg-[#fffaf4]/92 p-4 shadow-lg backdrop-blur-md"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8f8173]">Hana is ready</p><p className="mt-1 text-lg font-semibold">{path.title}</p><p className="mt-1 text-sm text-[#76695d]">{path.roles.slice(0, 2).join(" · ")}</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9a8d80]">Your five worlds</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">A visible adventure, not a giant syllabus.</h2></div><span className="rounded-full bg-[#eaf3ee] px-3 py-1.5 text-xs font-semibold text-[#4f806f]">{stage.world} · World {stageIndex + 1}/5</span></div>

        <div className="mt-6 grid gap-3 md:grid-cols-5">
          {path.stages.map((item, index) => (
            <button key={`${item.world}-${item.title}`} onClick={() => setStageIndex(index)} className={`group relative overflow-hidden rounded-[22px] border p-0 text-left transition hover:-translate-y-0.5 ${stageIndex === index ? "border-[#78a799] bg-[#edf6f1] shadow-md" : "border-[#e7ddd2] bg-white"}`}>
              <img src={worldAssets[index]} alt="" aria-hidden="true" className="h-24 w-full object-cover opacity-90 transition group-hover:scale-[1.03]" />
              <div className="p-4"><div className="flex items-center justify-between"><span className="text-xs font-bold text-[#8c8074]">0{index + 1}</span><ChevronRight className="h-4 w-4 text-[#a99b8d]" /></div><p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#9b8d7f]">{item.world}</p><p className="mt-1 font-semibold">{item.title}</p></div>
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_.72fr]">
          <div className="rounded-[28px] border border-[#e6dccf] bg-white p-5 md:p-7"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9a8d80]">World {String(stageIndex + 1).padStart(2, "0")}</p><h3 className="mt-2 font-display text-2xl font-semibold">{stage.title}</h3></div><Sparkles className="h-5 w-5 text-[#db8b71]" /></div><p className="mt-4 max-w-2xl text-sm leading-6 text-[#6b6259]">{stage.outcome}</p><div className="mt-5 flex flex-wrap gap-2">{stage.skills.map(skill => <span key={skill} className="rounded-full bg-[#f2eee8] px-3 py-1.5 text-xs font-semibold text-[#6e655c]">{skill}</span>)}</div><Button onClick={() => navigate("/path")} className="mt-7 rounded-full bg-[#315d58] hover:bg-[#254c48]">Open full roadmap <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
          <div className="rounded-[28px] border border-[#e6dccf] bg-[#fffaf4] p-5 md:p-7"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9a8d80]">Start learning</p><h3 className="mt-2 font-display text-xl font-semibold">Recommended links</h3><div className="mt-5 space-y-2">{resources.slice(0, 6).map(resource => <a key={`${resource.skill}-${resource.url}`} href={resource.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-[#e8dfd3] bg-white px-3.5 py-3 text-sm font-semibold text-[#4f806f] hover:bg-[#edf6f1]"><BookOpen className="h-4 w-4 shrink-0" /><span className="min-w-0 flex-1"><span className="block truncate">{resource.title}</span><span className="block text-xs font-normal text-[#9a8d80]">{resource.skill}</span></span><ExternalLink className="h-4 w-4 shrink-0" /></a>)}</div></div>
        </div>
      </section>

      <section id="path-explorer" className="border-t border-[#eadfd3] bg-[#f7f1e9] px-5 py-10 md:px-8 md:py-14"><div className="mx-auto max-w-7xl"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9a8d80]">Explore without overwhelm</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">Every technical direction, one calm chooser.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#76695d]">See the essentials first. Search or expand when you want to compare alternatives.</p></div><div className="relative w-full md:w-80"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a8d80]"/><input value={search} onChange={e => { setSearch(e.target.value); setShowAll(true); }} placeholder="Search careers…" className="w-full rounded-full border border-[#e2d7ca] bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#9bbeb1]" /></div></div><button onClick={() => setShowAll(v => !v)} className="mt-6 flex w-full items-center justify-between rounded-[24px] border border-[#e4dacc] bg-white px-5 py-4 text-left shadow-sm"><span><span className="block font-semibold">{showAll ? "Showing all available directions" : "Explore all 12 directions"}</span><span className="mt-1 block text-sm text-[#7d7267]">Choose a path without changing the core Hana experience.</span></span><ArrowRight className="h-5 w-5 text-[#4f806f]"/></button>{showAll && <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{visiblePaths.map(item => <button key={item.id} onClick={() => choosePath(item.id)} className={`rounded-2xl border bg-white p-4 text-left transition hover:-translate-y-0.5 ${selectedPath === item.id ? "border-[#78a799] bg-[#edf6f1]" : "border-[#e5dbcf]"}`}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{item.title}</p><p className="mt-1 text-xs leading-5 text-[#80756a]">{item.description}</p></div>{selectedPath === item.id && <Check className="h-4 w-4 text-[#4f806f]"/>}</div><div className="mt-3 flex flex-wrap gap-1.5">{item.roles.slice(0, 2).map(role => <span key={role} className="rounded-full bg-[#f3eee7] px-2.5 py-1 text-[11px] font-semibold text-[#756a5f]">{role}</span>)}</div></button>)}</div>}</div></section>
    </main>
  );
}
