import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Check, ChevronRight, ExternalLink, GraduationCap, Search, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { careerCatalog, defaultCareerPath, getCareerPath, type CareerPathId } from "@/data/careerCatalog";
import HanaGameFrame from "@/components/HanaGameFrame";
import LearningResources from "@/components/LearningResources";

const universities = [
  { name: "Harvard CS50", url: "https://cs50.harvard.edu/x/", curriculum: "https://cs50.harvard.edu/x/2026/" },
  { name: "MIT OCW", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/", curriculum: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/" },
  { name: "Stanford CS", url: "https://cs.stanford.edu/courses", curriculum: "https://cs.stanford.edu/courses" },
] as const;
const featuredPathIds: CareerPathId[] = ["computer-science", "software-engineering", "ai-ml", "data-science", "cybersecurity", "web-fullstack"];

export default function CareerPath() {
  const [, navigate] = useLocation();
  const [selectedPath, setSelectedPath] = useState<CareerPathId>(() => {
    if (typeof window === "undefined") return defaultCareerPath;
    const saved = window.localStorage.getItem("hana-career-path");
    return saved && careerCatalog.some(p => p.id === saved) ? saved as CareerPathId : defaultCareerPath;
  });
  const [stageIndex, setStageIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");
  const [university, setUniversity] = useState("Harvard CS50");
  const [adjustPrompt, setAdjustPrompt] = useState(false);
  const path = getCareerPath(selectedPath);
  const stage = path.stages[Math.min(stageIndex, path.stages.length - 1)];
  const firstSkill = path.skills.find(skill => stage?.skills.includes(skill.name)) ?? path.skills[0];
  const visiblePaths = useMemo(() => {
    const pool = showAll ? careerCatalog : careerCatalog.filter(p => featuredPathIds.includes(p.id));
    const needle = search.trim().toLowerCase();
    return needle ? pool.filter(p => `${p.title} ${p.shortTitle} ${p.description} ${p.roles.join(" ")}`.toLowerCase().includes(needle)) : pool;
  }, [showAll, search]);
  const selectedUniversity = universities.find(item => item.name === university) ?? universities[0];
  const comparePrompt = encodeURIComponent(`Compare my ${path.title} Hana roadmap with the official ${selectedUniversity.name} curriculum at ${selectedUniversity.curriculum}. Browse the official curriculum, identify meaningful overlaps and gaps, and ask me whether I want Hana to adjust the roadmap. Do not automatically change anything until I say yes. Keep the explanation practical and not overwhelming.`);

  const choose = (id: CareerPathId) => { setSelectedPath(id); setStageIndex(0); setAdjustPrompt(false); window.localStorage.setItem("hana-career-path", id); };

  return <HanaGameFrame title={`${path.title} · Roadmap`}>
    <div className="grid gap-5 lg:grid-cols-[1.02fr_.98fr]">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[.055] shadow-xl backdrop-blur">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-white/40">Choose your direction</p><h2 className="mt-1 font-display text-2xl font-semibold">{path.shortTitle} · one journey</h2></div><Sparkles className="h-5 w-5 text-[#f1c77b]"/></div>
        <div className="grid gap-2 p-4 sm:grid-cols-2">{visiblePaths.map(item => <button key={item.id} onClick={() => choose(item.id)} className={`rounded-2xl border p-3 text-left transition ${selectedPath === item.id ? "border-[#f1c77b]/60 bg-[#f1c77b]/10" : "border-white/10 bg-white/[.03] hover:bg-white/[.07]"}`}><div className="flex items-start justify-between gap-2"><span className="text-sm font-semibold">{item.title}</span>{selectedPath===item.id&&<Check className="h-4 w-4 text-[#f1c77b]"/>}</div><span className="mt-1 block text-xs leading-5 text-white/45">{item.description}</span></button>)}</div>
        <div className="flex gap-2 border-t border-white/10 p-4"><div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"/><input value={search} onChange={e=>{setSearch(e.target.value);setShowAll(true)}} placeholder="Search a direction…" className="w-full rounded-full border border-white/10 bg-black/10 py-2.5 pl-9 pr-4 text-sm text-white outline-none placeholder:text-white/30"/></div><button onClick={()=>setShowAll(v=>!v)} className="rounded-full border border-white/10 bg-white/[.04] px-4 text-sm font-semibold">{showAll?"Fewer":"All"}</button></div>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-6">
        <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#f1c77b]/75">World {stageIndex+1} of {path.stages.length}</p><h2 className="mt-2 font-display text-3xl font-semibold">{stage.world}</h2><p className="mt-1 text-lg font-semibold text-white/80">{stage.title}</p></div><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">Next step</span></div>
        <p className="mt-5 text-sm leading-6 text-white/60">{stage.outcome}</p><div className="mt-4 flex flex-wrap gap-2">{stage.skills.map(skill=><span key={skill} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70">{skill}</span>)}</div>
        <div className="mt-6 grid gap-2">{path.stages.map((item,index)=><button key={item.world} onClick={()=>setStageIndex(index)} className={`flex items-center gap-3 rounded-2xl border p-3 text-left ${index===stageIndex?"border-[#f1c77b]/50 bg-[#f1c77b]/10":"border-white/10 bg-white/[.03]"}`}><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">{String(index+1).padStart(2,"0")}</span><span className="min-w-0 flex-1"><span className="block text-xs uppercase tracking-[.12em] text-white/35">{item.world}</span><span className="mt-1 block text-sm font-semibold">{item.title}</span></span><ChevronRight className="h-4 w-4 text-white/30"/></button>)}</div>
        <button onClick={()=>navigate("/chat?prompt="+encodeURIComponent(`I'm at the ${stage.world} stage of ${path.title}. Help me understand this stage and what I should do first.`))} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f1c77b] px-5 py-3 font-bold text-[#172630]">Ask Hana about this step <ArrowRight className="h-4 w-4"/></button>
      </section>
    </div>

    <div className="mt-5"><LearningResources skill={firstSkill?.name ?? stage.skills[0] ?? path.title} /></div>

    <section className="mt-5 rounded-[30px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-6"><div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.14em] text-white/40">Optional university curriculum check</p><h2 className="mt-2 font-display text-2xl font-semibold">Match Hana to your university — only when you choose.</h2><p className="mt-2 text-sm leading-6 text-white/50">Hana can browse the official curriculum, compare it with your route, and then ask whether you want an adjustment. Nothing changes automatically.</p></div><GraduationCap className="h-6 w-6 text-[#f1c77b]"/></div><div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-center"><select value={university} onChange={e=>setUniversity(e.target.value)} className="rounded-2xl border border-white/10 bg-[#132434] px-4 py-3 text-sm text-white outline-none">{universities.map(u=><option key={u.name}>{u.name}</option>)}</select><a href={`/chat?prompt=${comparePrompt}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-[#172630]">Compare curriculum <ExternalLink className="h-4 w-4"/></a></div>{adjustPrompt&&<div className="mt-4 rounded-2xl border border-[#f1c77b]/30 bg-[#f1c77b]/10 p-4 text-sm"><p className="font-semibold">Would you like Hana to adjust your roadmap to match this curriculum?</p><div className="mt-3 flex gap-2"><button onClick={()=>navigate(`/chat?prompt=${encodeURIComponent(`I said yes to adjusting my ${path.title} roadmap to better match the official ${selectedUniversity.name} curriculum. Browse the official curriculum and propose the smallest useful adjustments. Do not overwhelm me; show only what changes and why.`)}`)} className="rounded-full bg-[#f1c77b] px-4 py-2 text-sm font-bold text-[#172630]">Yes, adjust</button><button onClick={()=>setAdjustPrompt(false)} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold">Not now</button></div></div>}
      <button onClick={()=>setAdjustPrompt(true)} className="mt-3 text-sm font-semibold text-[#f1c77b]">I already compared it — ask me whether to adjust</button>
    </section>

    <section className="mt-5 grid gap-3 sm:grid-cols-3"><button onClick={()=>navigate("/projects")} className="rounded-2xl border border-white/10 bg-white/[.055] p-5 text-left transition hover:bg-white/[.09]"><p className="font-semibold">Projects</p><p className="mt-1 text-sm text-white/45">Turn this skill into something you can show.</p></button><button onClick={()=>navigate("/opportunities")} className="rounded-2xl border border-white/10 bg-white/[.055] p-5 text-left transition hover:bg-white/[.09]"><p className="font-semibold">Opportunities</p><p className="mt-1 text-sm text-white/45">Find programs without deadline-pressure design.</p></button><button onClick={()=>navigate("/research?query="+encodeURIComponent(path.title))} className="rounded-2xl border border-white/10 bg-white/[.055] p-5 text-left transition hover:bg-white/[.09]"><p className="font-semibold">Research field</p><p className="mt-1 text-sm text-white/45">Search current resources, videos and universities.</p></button></section>
  </HanaGameFrame>;
}
