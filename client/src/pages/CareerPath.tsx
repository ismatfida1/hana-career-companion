import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, ExternalLink, Search, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { careerCatalog, defaultCareerPath, getCareerPath, type CareerPathId } from "@/data/careerCatalog";
import { cn } from "@/lib/utils";

const featuredPathIds: CareerPathId[] = ["computer-science", "software-engineering", "ai-ml", "data-science", "cybersecurity", "web-fullstack"];

export default function CareerPath() {
  const [, navigate] = useLocation();
  const [selectedPath, setSelectedPath] = useState<CareerPathId>(() => {
    if (typeof window === "undefined") return defaultCareerPath;
    const saved = window.localStorage.getItem("hana-career-path");
    return saved && careerCatalog.some(path => path.id === saved) ? saved as CareerPathId : defaultCareerPath;
  });
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");
  const [showAlternative, setShowAlternative] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => { window.localStorage.setItem("hana-career-path", selectedPath); }, [selectedPath]);
  const path = getCareerPath(selectedPath);
  const firstStage = path.stages[0];
  const nextStage = path.stages[1];
  const primarySkill = path.skills.find(skill => firstStage?.skills.includes(skill.name)) ?? path.skills[0];
  const primary = primarySkill?.resources[0];
  const alternative = primarySkill?.resources[1];
  const visiblePaths = useMemo(() => {
    const pool = showAll ? careerCatalog : careerCatalog.filter(item => featuredPathIds.includes(item.id));
    const needle = search.trim().toLowerCase();
    return needle ? pool.filter(item => `${item.title} ${item.shortTitle} ${item.description} ${item.roles.join(" ")}`.toLowerCase().includes(needle)) : pool;
  }, [showAll, search]);
  const choose = (id: CareerPathId) => { setSelectedPath(id); setShowAlternative(false); setExpanded(false); window.localStorage.setItem("hana-career-path", id); };

  return <main className="min-h-screen bg-[#FBF7F1] px-4 py-6 pb-16 text-[#2d3c39] md:px-7 md:py-10"><div className="mx-auto max-w-6xl">
    <header className="flex items-start justify-between gap-4"><div><p className="eyebrow">Hana · choose your direction</p><h1 className="display-title mt-2">Pick a direction. Hana will handle the mountain.</h1><p className="body-copy mt-3 max-w-2xl">You can change direction anytime. For now, we only need to choose what feels worth exploring.</p></div><button onClick={()=>navigate("/")} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#dfd3c7] bg-white px-4 py-2 text-sm font-semibold"><ArrowLeft className="h-4 w-4"/>Back</button></header>

    <section className="mt-7 rounded-[30px] border border-[#e4d9cc] bg-white/80 p-5 shadow-sm md:p-7"><div className="flex items-center justify-between"><div><p className="eyebrow">Start simple</p><h2 className="mt-2 font-display text-2xl font-semibold">What do you want to explore?</h2></div><Sparkles className="h-5 w-5 text-[#db8b71]"/></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{visiblePaths.slice(0, showAll ? undefined : 6).map(item=><button key={item.id} onClick={()=>choose(item.id)} className={cn("rounded-2xl border p-4 text-left transition hover:-translate-y-0.5", selectedPath===item.id ? "border-[#78a799] bg-[#edf6f1] shadow-sm" : "border-[#e7ddd2] bg-[#fffdf9] hover:border-[#bfd7cf]")}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{item.title}</p><p className="mt-1 text-xs leading-5 text-[#76695d]">{item.description}</p></div>{selectedPath===item.id&&<span className="rounded-full bg-[#315d58] p-1 text-white"><Check className="h-3 w-3"/></span>}</div></button>)}</div><div className="mt-4 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a39587]"/><input value={search} onChange={e=>{setSearch(e.target.value);setShowAll(true)}} placeholder="Search a direction…" className="w-full rounded-full border border-[#e3d9ce] bg-[#fffdf9] py-2.5 pl-9 pr-4 text-sm outline-none"/></div><button onClick={()=>setShowAll(v=>!v)} className="rounded-full border border-[#e3d9ce] bg-white px-4 py-2.5 text-sm font-semibold">{showAll?"Show fewer":"See all directions"}</button></div></section>

    <section className="mt-7 rounded-[30px] border border-[#bcd7cc] bg-[#edf5f0] p-5 md:p-7"><div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between"><div className="max-w-2xl"><p className="eyebrow">Your next step</p><h2 className="mt-2 font-display text-3xl font-semibold">{firstStage?.title}</h2><p className="mt-3 text-sm leading-6 text-[#5f6b66]">{firstStage?.outcome}</p><div className="mt-4 flex flex-wrap gap-2">{firstStage?.skills.map(skill=><span key={skill} className="pill pill-sage">{skill}</span>)}</div></div><button onClick={()=>navigate("/journey")} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#315d58] px-5 py-3 font-semibold text-white">Enter my adventure <ArrowRight className="h-4 w-4"/></button></div><div className="mt-6 rounded-2xl border border-[#d6e5dd] bg-white p-4"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#8b7d70]">Start learning</p><p className="mt-1 font-semibold">{primarySkill?.name}</p><p className="mt-1 text-sm text-[#76695d]">One primary resource. No decision pile.</p>{primary&&<a href={primary.url} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-between rounded-xl bg-[#315d58] px-4 py-3 text-sm font-bold text-white"><span>{primary.title}</span><ExternalLink className="h-4 w-4"/></a>}{alternative&&<button onClick={()=>setShowAlternative(v=>!v)} className="mt-3 text-sm font-semibold text-[#4f806f]">{showAlternative?"Hide alternative":"This isn't clicking? Show another way"}</button>}{showAlternative&&alternative&&<a href={alternative.url} target="_blank" rel="noreferrer" className="mt-2 flex items-center justify-between rounded-xl border border-[#dfe9e3] bg-[#fffdf9] px-4 py-3 text-sm font-semibold text-[#4f806f]"><span>{alternative.title}</span><ExternalLink className="h-4 w-4"/></a>}</div></section>

    <section className="mt-7 rounded-[30px] border border-[#e7dccf] bg-white p-5 shadow-sm md:p-7"><button onClick={()=>setExpanded(v=>!v)} className="flex w-full items-center justify-between text-left"><div><p className="eyebrow">The full route</p><h2 className="mt-2 font-display text-2xl font-semibold">{path.title}</h2><p className="mt-1 text-sm text-[#76695d]">Available when you want to look ahead—not something you have to finish today.</p></div><ArrowRight className={cn("h-5 w-5 transition",expanded&&"rotate-90")}/></button>{expanded&&<div className="mt-5 space-y-2">{path.stages.map((stage,index)=><details key={`${stage.world}-${stage.title}`} className="rounded-2xl border border-[#eee5da] bg-[#fffdf9] p-4" open={index===0}><summary className="flex cursor-pointer list-none items-center gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf5f0] text-xs font-bold text-[#4f806f]">{String(index+1).padStart(2,"0")}</span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold uppercase tracking-[.12em] text-[#a39587]">{stage.world}</span><span className="mt-1 block font-semibold">{stage.title}</span></span><span className="text-xs text-[#8b7d70]">{index===0?"Now":"Later"}</span></summary><div className="mt-3 border-t border-[#eee5da] pt-3 text-sm leading-6 text-[#76695d]">{stage.outcome}</div></details>)}</div>}{nextStage&&<div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#f7f1e9] p-4 text-sm"><BookOpen className="h-4 w-4 text-[#4f806f]"/><span>After your first step, Hana will reveal <strong>{nextStage.title}</strong>.</span></div>}</section>

    <section className="mt-7 grid gap-3 sm:grid-cols-3"><button onClick={()=>navigate("/projects")} className="rounded-2xl border border-[#e7ddd2] bg-white p-5 text-left hover:border-[#bcd7cc]"><p className="font-semibold">One project</p><p className="mt-1 text-sm text-[#76695d]">Turn your next skill into something you can show.</p></button><button onClick={()=>navigate("/opportunities")} className="rounded-2xl border border-[#e7ddd2] bg-white p-5 text-left hover:border-[#bcd7cc]"><p className="font-semibold">Opportunities</p><p className="mt-1 text-sm text-[#76695d]">See options that fit without deadline pressure.</p></button><button onClick={()=>navigate("/research")} className="rounded-2xl border border-[#e7ddd2] bg-white p-5 text-left hover:border-[#bcd7cc]"><p className="font-semibold">Research this field</p><p className="mt-1 text-sm text-[#76695d]">Search the web, videos, and universities.</p></button></section>
  </div></main>;
}
