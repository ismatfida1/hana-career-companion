import { ArrowRight, BookOpen, Check, ChevronRight, Compass, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { careerCatalog, defaultCareerPath, type CareerPathId } from "@/data/careerCatalog";
import HanaGameFrame from "@/components/HanaGameFrame";

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
  const choosePath = (id: CareerPathId) => { setSelectedPath(id); setStageIndex(0); window.localStorage.setItem("hana-career-path", id); };

  return <HanaGameFrame title="Choose your direction">
    <div className="min-w-0 space-y-5">
      <section className="min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-white/[.055] shadow-xl backdrop-blur">
        <div className="relative min-h-[560px] overflow-hidden">
          <img src={heroWorld} alt={`${stage.world} learning world`} className="absolute inset-0 h-full w-full object-contain object-center opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101d2b]/95 via-[#101d2b]/70 to-[#101d2b]/60" />
          <div className="relative z-10 grid min-h-[560px] min-w-0 items-end gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0 max-w-3xl self-center"><div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60"><Compass className="h-3.5 w-3.5 text-[#f1c77b]"/>Hana · Your CS Adventure</div><h2 className="mt-5 break-words font-display text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Choose your direction. Hana builds the road ahead.</h2><p className="mt-5 max-w-2xl break-words text-base leading-7 text-white/60 md:text-lg">Pick a direction, meet five worlds, then learn through focused missions, projects, and real resources. You can change paths anytime.</p></div>
            <div className="min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#142737]/85 p-3 shadow-2xl"><div className="relative flex min-h-[420px] items-end justify-center overflow-hidden rounded-[22px] bg-black/10 px-3 pt-6"><img src="/assets/hana-phase1-approved-opening.png" alt="Hana, your learning companion" className="relative z-10 max-h-[420px] w-auto max-w-full object-contain object-center"/><div className="absolute bottom-3 left-3 right-3 z-20 rounded-2xl border border-white/10 bg-[#101d2b]/85 p-3 text-center backdrop-blur"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#f1c77b]/80">Hana is ready</p><p className="mt-1 font-semibold">{path.title}</p></div></div></div>
          </div>
        </div>
      </section>

      <section className="min-w-0 rounded-[30px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-7"><div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[.16em] text-white/40">Pick a path</p><h2 className="mt-2 break-words font-display text-3xl font-semibold">Start with one direction.</h2></div><div className="relative w-full min-w-0 md:w-80"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"/><input value={search} onChange={e=>{setSearch(e.target.value);setShowAll(true)}} placeholder="Search careers…" className="w-full rounded-full border border-white/10 bg-black/10 py-2.5 pl-9 pr-4 text-sm text-white outline-none placeholder:text-white/30"/></div></div><div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">{visiblePaths.map(item=><button key={item.id} onClick={()=>choosePath(item.id)} className={`min-w-0 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${selectedPath===item.id?"border-[#f1c77b]/60 bg-[#f1c77b]/10":"border-white/10 bg-white/[.03] hover:bg-white/[.07]"}`}><div className="flex items-start justify-between gap-2"><span className="break-words font-semibold">{item.title}</span>{selectedPath===item.id&&<Check className="h-4 w-4 shrink-0 text-[#f1c77b]"/>}</div><span className="mt-1 block break-words text-xs leading-5 text-white/45">{item.description}</span></button>)}</div><div className="mt-4 flex flex-wrap gap-3"><Button onClick={()=>{window.localStorage.setItem("hana-career-path",selectedPath);navigate("/path")}} className="min-h-11 rounded-full bg-[#f1c77b] px-6 text-[#172630]">Start this journey <ArrowRight className="ml-2 h-4 w-4"/></Button><Button onClick={()=>setShowAll(v=>!v)} variant="outline" className="min-h-11 rounded-full border-white/10 bg-white/5 text-white">{showAll?"Show featured paths":"Explore all 12 directions"}</Button></div></section>

      <section className="min-w-0 rounded-[30px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-7"><div className="flex items-end justify-between gap-3"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[.16em] text-white/40">Your five worlds</p><h2 className="mt-2 break-words font-display text-3xl font-semibold">A visible adventure, not a giant syllabus.</h2></div><span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/50">{stage.world} · World {stageIndex+1}/5</span></div><div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2 md:grid-cols-5">{path.stages.map((item,index)=><button key={item.world} onClick={()=>setStageIndex(index)} className={`group min-w-0 overflow-hidden rounded-[22px] border text-left transition hover:-translate-y-0.5 ${stageIndex===index?"border-[#f1c77b]/50 bg-[#f1c77b]/10":"border-white/10 bg-white/[.03]"}`}><img src={worldAssets[index]} alt="" aria-hidden="true" className="h-24 w-full object-contain p-2 opacity-80"/><div className="p-4"><div className="flex items-center justify-between"><span className="text-xs font-bold text-white/35">0{index+1}</span><ChevronRight className="h-4 w-4 text-white/30"/></div><p className="mt-3 break-words text-xs font-semibold uppercase tracking-[.12em] text-white/35">{item.world}</p><p className="mt-1 break-words font-semibold">{item.title}</p></div></button>)}</div></section>

      <section className="grid min-w-0 gap-5 lg:grid-cols-[1fr_.72fr]"><div className="min-w-0 rounded-[28px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-7"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-white/40">World {String(stageIndex+1).padStart(2,"0")}</p><h3 className="mt-2 break-words font-display text-2xl font-semibold">{stage.title}</h3></div><Sparkles className="h-5 w-5 shrink-0 text-[#f1c77b]"/></div><p className="mt-4 break-words text-sm leading-6 text-white/55">{stage.outcome}</p><div className="mt-5 flex flex-wrap gap-2">{stage.skills.map(skill=><span key={skill} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/65">{skill}</span>)}</div><Button onClick={()=>navigate(`/roadmap`)} className="mt-7 min-h-11 rounded-full bg-[#f1c77b] text-[#172630]">Open full roadmap <ArrowRight className="ml-2 h-4 w-4"/></Button></div><div className="min-w-0 rounded-[28px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-7"><p className="text-xs font-bold uppercase tracking-[.14em] text-white/40">Start learning</p><h3 className="mt-2 break-words font-display text-xl font-semibold">Recommended links</h3><div className="mt-5 space-y-2">{resources.slice(0,6).map(resource=><a key={`${resource.skill}-${resource.url}`} href={resource.url} target="_blank" rel="noopener noreferrer" className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-[#132434]/70 px-3.5 py-3 text-sm font-semibold text-white/75 hover:bg-white/10"><BookOpen className="h-4 w-4 shrink-0 text-[#f1c77b]"/><span className="min-w-0 flex-1"><span className="block break-words">{resource.title}</span><span className="block text-xs font-normal text-white/35">{resource.skill}</span></span></a>)}</div></div></section>
    </div>
  </HanaGameFrame>;
}
