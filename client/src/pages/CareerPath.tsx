import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, BookOpen, Check, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { careerCatalog, defaultCareerPath, getCareerPath, type CareerPathId } from "@/data/careerCatalog";
import { useAuth } from "@/_core/hooks/useAuth";

const featuredPathIds: CareerPathId[] = ["computer-science", "software-engineering", "ai-ml", "data-science", "cybersecurity", "web-fullstack"];
const relatedPathIds: Record<CareerPathId, CareerPathId[]> = {
  "computer-science": ["software-engineering", "systems-embedded", "ai-ml"],
  "software-engineering": ["web-fullstack", "cloud-devops", "qa-testing"],
  "ai-ml": ["data-science", "software-engineering", "computer-science"],
  "data-science": ["ai-ml", "computer-science", "software-engineering"],
  cybersecurity: ["cloud-devops", "computer-science", "web-fullstack"],
  "web-fullstack": ["software-engineering", "mobile", "ui-ux-product"],
  mobile: ["web-fullstack", "software-engineering", "ui-ux-product"],
  "cloud-devops": ["software-engineering", "cybersecurity", "systems-embedded"],
  "systems-embedded": ["computer-science", "cloud-devops", "game-development"],
  "game-development": ["systems-embedded", "software-engineering", "ui-ux-product"],
  "ui-ux-product": ["web-fullstack", "mobile", "software-engineering"],
  "qa-testing": ["software-engineering", "web-fullstack", "cloud-devops"],
};

export default function CareerPath() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const profileQuery = trpc.learner.profile.useQuery(undefined, { enabled: !!user, retry: false });
  const saveProfile = trpc.learner.saveProfile.useMutation({ onSuccess: () => profileQuery.refetch() });
  const [selectedPath, setSelectedPath] = useState<CareerPathId>(() => {
    if (typeof window === "undefined") return defaultCareerPath;
    const saved = window.localStorage.getItem("hana-career-path");
    return saved && careerCatalog.some(path => path.id === saved) ? saved as CareerPathId : defaultCareerPath;
  });
  const [showAllPaths, setShowAllPaths] = useState(false);
  const [search, setSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");

  useEffect(() => {
    const saved = profileQuery.data?.careerPath;
    if (saved && careerCatalog.some(path => path.id === saved)) setSelectedPath(saved as CareerPathId);
  }, [profileQuery.data?.careerPath]);
  useEffect(() => { window.localStorage.setItem("hana-career-path", selectedPath); }, [selectedPath]);

  const path = getCareerPath(selectedPath);
  const visiblePaths = useMemo(() => {
    const pool = showAllPaths ? careerCatalog : careerCatalog.filter(item => featuredPathIds.includes(item.id));
    const needle = search.trim().toLowerCase();
    return needle ? pool.filter(item => `${item.title} ${item.shortTitle} ${item.description} ${item.roles.join(" ")}`.toLowerCase().includes(needle)) : pool;
  }, [search, showAllPaths]);
  const visibleSkills = useMemo(() => {
    const needle = skillSearch.trim().toLowerCase();
    return needle ? path.skills.filter(skill => `${skill.name} ${skill.summary}`.toLowerCase().includes(needle)) : path.skills;
  }, [path, skillSearch]);
  const selectPath = (id: CareerPathId) => { setSelectedPath(id); setSearch(""); setSkillSearch(""); window.localStorage.setItem("hana-career-path", id); };

  const save = () => {
    window.localStorage.setItem("hana-career-path", selectedPath);
    if (!user) return;
    const current = profileQuery.data;
    saveProfile.mutate({
      careerGoal: current?.careerGoal || path.roles[0],
      careerPath: selectedPath,
      experienceLevel: current?.experienceLevel || "Beginner",
      dailyMinutes: current?.dailyMinutes || 30,
      interests: current?.interests || "",
      learningStyle: current?.learningStyle || "Examples first",
      memoryEnabled: current?.memoryEnabled ?? true,
    });
  };

  return (
    <main className="min-h-screen bg-[#fbf7f1] px-4 py-6 pb-16 text-[#2d3c39] md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow">Hana · choose your direction</p><h1 className="display-title mt-2 max-w-3xl">Pick one direction. You can change it later.</h1><p className="body-copy mt-3 max-w-2xl">Follow one focused route first. Every other technical direction stays available when you want to compare.</p></div><Button onClick={() => navigate("/")} variant="outline" className="rounded-full self-start"><ArrowLeft className="mr-2 h-4 w-4"/>Back to opening</Button></header>
        <section className="rounded-[30px] border border-[#e4d9cc] bg-white/80 p-5 shadow-[0_20px_60px_rgba(75,62,49,.08)] backdrop-blur md:p-7"><div className="flex items-center justify-between gap-4"><div><p className="eyebrow">Start simple</p><h2 className="mt-2 font-display text-2xl font-semibold">What do you want to become?</h2></div><Sparkles className="h-5 w-5 text-[#db8b71]"/></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{careerCatalog.filter(item => featuredPathIds.includes(item.id)).map(item => <button key={item.id} onClick={() => selectPath(item.id)} className={cn("rounded-2xl border p-4 text-left transition hover:-translate-y-0.5", selectedPath === item.id ? "border-[#78a799] bg-[#edf6f1] shadow-sm" : "border-[#e7ddd2] bg-[#fffdf9] hover:border-[#bfd7cf]")}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{item.title}</p><p className="mt-1 text-xs leading-5 text-[#76695d]">{item.description}</p></div>{selectedPath === item.id && <span className="rounded-full bg-[#315d58] p-1 text-white"><Check className="h-3 w-3"/></span>}</div><div className="mt-3 flex flex-wrap gap-1.5">{item.roles.slice(0,2).map(role => <span key={role} className="pill">{role}</span>)}</div></button>)}</div><div className="mt-4 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a39587]"/><input value={search} onChange={e => { setSearch(e.target.value); setShowAllPaths(true); }} placeholder="Search every technical direction…" className="w-full rounded-full border border-[#e3d9ce] bg-[#fffdf9] py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#9bbeb1]"/></div><Button variant="outline" onClick={() => setShowAllPaths(v => !v)} className="rounded-full">{showAllPaths ? "Hide extra directions" : "See all directions"}</Button></div>{showAllPaths && <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{visiblePaths.map(item => <button key={item.id} onClick={() => selectPath(item.id)} className={cn("rounded-2xl border p-4 text-left", selectedPath === item.id ? "border-[#78a799] bg-[#edf6f1]" : "border-[#e8ded3] bg-white hover:border-[#bfd7cf]")}><p className="font-semibold">{item.title}</p><p className="mt-1 text-xs text-[#81766c]">{item.roles.slice(0,3).join(" · ")}</p></button>)}{visiblePaths.length === 0 && <p className="text-sm text-[#76695d]">No direction matches that search.</p>}</div>}</section>
        <section className="mt-7 rounded-[30px] border border-[#e7dccf] bg-[#fffaf4] p-5 md:p-7"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow">Your selected route</p><h2 className="display-title mt-2">{path.title}</h2><p className="body-copy mt-3 max-w-2xl">{path.description}</p></div><div className="flex flex-col items-start gap-2 md:items-end"><Button onClick={save} disabled={saveProfile.isPending} className="rounded-full bg-[#315d58] hover:bg-[#254c48]">{saveProfile.isPending ? "Saving…" : user ? "Save my path" : "Use this path"}<ArrowRight className="ml-2 h-4 w-4"/></Button><span className="text-xs font-semibold text-[#4f806f]">{user && profileQuery.data?.careerPath === selectedPath ? "Saved to your learner profile" : "Saved locally on this device"}</span></div></div><div className="mt-7 grid gap-3">{path.stages.map((stage,index) => <details key={`${stage.world}-${stage.title}`} className="group rounded-2xl border border-[#e8dfd4] bg-white/80 p-4" open={index===0}><summary className="flex cursor-pointer list-none items-center gap-4"><span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold", index===0 ? "bg-[#315d58] text-white" : "bg-[#eaf3ee] text-[#4f806f]")}>{String(index+1).padStart(2,"0")}</span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#a39587]">{stage.world}</span><span className="mt-1 block font-semibold">{stage.title}</span></span><span className="text-xs text-[#8b7d70]">{index===0 ? "Start here" : "Next"}</span></summary><div className="mt-4 grid gap-3 border-t border-[#eee5da] pt-4 md:grid-cols-[1.2fr_.8fr]"><p className="text-sm leading-6 text-[#5f6b66]">{stage.outcome}</p><div className="flex flex-wrap gap-2">{stage.skills.map(skill => <span key={skill} className="pill pill-sage">{skill}</span>)}</div></div></details>)}</div></section>
        <section className="mt-7 rounded-[30px] border border-[#e7dccf] bg-white/80 p-5 md:p-7"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow">Learn only what you need next</p><h2 className="mt-2 font-display text-2xl font-semibold">Skills + alternative resources</h2><p className="mt-2 text-sm leading-6 text-[#76695d]">Every skill has a primary resource and an alternative. Pick one and keep moving.</p></div><div className="relative w-full md:w-80"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a39587]"/><input value={skillSearch} onChange={e => setSkillSearch(e.target.value)} placeholder="Search skills…" className="w-full rounded-full border border-[#e4d9cf] bg-[#fffdf9] py-2.5 pl-9 pr-4 text-sm outline-none"/></div></div><div className="mt-5 grid gap-3 lg:grid-cols-2">{visibleSkills.map(skill => <details key={skill.name} className="rounded-2xl border border-[#eee5da] bg-[#fffdf9] p-4"><summary className="flex cursor-pointer list-none items-start gap-3"><BookOpen className="mt-0.5 h-4 w-4 text-[#4f806f]"/><span className="flex-1"><span className="block font-semibold">{skill.name}</span><span className="mt-1 block text-xs leading-5 text-[#8b7d70]">{skill.summary}</span></span><ArrowRight className="h-4 w-4 text-[#a39587]"/></summary><div className="mt-4 space-y-2 border-t border-[#eee5da] pt-3">{skill.resources.map(resource => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-[#eee5da] bg-white px-3 py-2.5 text-sm font-semibold text-[#4f806f] hover:bg-[#edf6f1]"><span className="truncate">{resource.title}</span><ArrowRight className="h-4 w-4 shrink-0"/></a>)}</div></details>)}</div></section>
        <section className="mt-7 rounded-[30px] border border-[#e7dccf] bg-[#f7f1e9] p-5 md:p-7"><p className="eyebrow">Natural next moves</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{relatedPathIds[selectedPath].map(id => { const related=getCareerPath(id); return <button key={id} onClick={() => selectPath(id)} className="rounded-2xl border border-[#e7ddd3] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#bcd7cc]"><p className="font-semibold">{related.title}</p><p className="mt-1 text-xs text-[#85796e]">{related.roles.slice(0,2).join(" · ")}</p></button>; })}</div></section>
      </div>
    </main>
  );
}
