import { useEffect, useMemo, useState } from "react";
import { ExternalLink, GraduationCap, Search, Sparkles, Youtube, ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "wouter";
import { careerCatalog, defaultCareerPath, type CareerPathId } from "@/data/careerCatalog";
import HanaGameFrame from "@/components/HanaGameFrame";
import LearningResources from "@/components/LearningResources";

type Result = { title: string; url: string; snippet: string };
const universities = [
  ["Harvard CS50", "https://cs50.harvard.edu/x/", "https://cs50.harvard.edu/x/2026/"],
  ["MIT OCW · Algorithms", "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/", "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/"],
  ["Stanford CS courses", "https://cs.stanford.edu/courses", "https://cs.stanford.edu/courses"],
  ["UC Berkeley CS", "https://eecs.berkeley.edu/academics/undergraduate/eecs-courses/", "https://eecs.berkeley.edu/academics/undergraduate/eecs-courses/"],
] as const;

export default function Research() {
  const [params] = useSearchParams();
  const saved = typeof window !== "undefined" ? window.localStorage.getItem("hana-career-path") : null;
  const initial = careerCatalog.find(p => p.id === saved) ?? careerCatalog.find(p => p.id === defaultCareerPath) ?? careerCatalog[0];
  const requested = params.get("query") ?? initial.title;
  const requestedPath = careerCatalog.find(p => `${p.title} ${p.shortTitle}`.toLowerCase().includes(requested.toLowerCase())) ?? (requested.toLowerCase().includes("ai engineering") ? careerCatalog.find(p => p.id === "ai-ml") : undefined);
  const [query, setQuery] = useState(requested);
  const [field, setField] = useState<CareerPathId>(requestedPath?.id ?? initial.id);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const selected = useMemo(() => careerCatalog.find(p => p.id === field) ?? initial, [field, initial]);
  const firstStage = selected.stages[0];
  const firstSkill = selected.skills.find(skill => firstStage?.skills.includes(skill.name)) ?? selected.skills[0];
  const youtube = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + " beginner tutorial")}`;
  const askHana = encodeURIComponent(`Research ${selected.title} for me. Browse current reliable sources, find the strongest beginner learning resources, useful university curricula, videos, and opportunities. Then turn the research into a calm one-next-step plan.`);

  const runSearch = async () => {
    const clean = query.trim(); if (!clean) return;
    setLoading(true);
    try { const response = await fetch(`/api/research?q=${encodeURIComponent(clean)}`); const data = await response.json() as { results?: Result[] }; setResults(data.results ?? []); }
    catch { setResults([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { void runSearch(); }, []);

  return <HanaGameFrame title="Research · Explore the world">
    <section className="rounded-[30px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-6"><div className="flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30"/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&void runSearch()} className="w-full rounded-2xl border border-white/10 bg-black/10 py-4 pl-12 pr-4 text-white outline-none placeholder:text-white/30" placeholder="Search AI engineering, cybersecurity, data science…"/></div><button onClick={()=>void runSearch()} disabled={loading} className="rounded-2xl bg-[#f1c77b] px-6 py-3 font-bold text-[#172630]">{loading?"Searching…":"Search web"}</button></div><div className="mt-4 flex flex-wrap gap-2"><a href={youtube} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold"><Youtube className="h-4 w-4"/>Best video hunt</a><Link href={`/chat?prompt=${askHana}`} className="inline-flex items-center gap-2 rounded-full bg-[#f1c77b] px-4 py-2 text-sm font-bold text-[#172630]"><Sparkles className="h-4 w-4"/>Ask Hana to research</Link></div></section>
    {results.length>0&&<section className="mt-5 rounded-[30px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-white/40">Live web results</p><h2 className="mt-1 font-display text-2xl font-semibold">Useful starting points</h2></div><span className="text-xs text-white/35">Current search</span></div><div className="mt-4 grid gap-3">{results.map(result=><a key={result.url} href={result.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-[#132434]/70 p-4 hover:bg-white/[.06]"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{result.title}</p><p className="mt-1 text-sm leading-6 text-white/45">{result.snippet}</p></div><ExternalLink className="h-4 w-4 shrink-0 text-[#f1c77b]"/></div></a>)}</div></section>}
    <section className="mt-5 grid gap-5 lg:grid-cols-[.75fr_1.25fr]"><div className="rounded-[30px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-white/40">Choose your field</p><select value={field} onChange={e=>setField(e.target.value as CareerPathId)} className="mt-3 w-full rounded-2xl border border-white/10 bg-[#132434] px-4 py-3 text-white outline-none">{careerCatalog.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select><h2 className="mt-5 font-display text-2xl font-semibold">{selected.title}</h2><p className="mt-2 text-sm leading-6 text-white/50">{selected.description}</p><div className="mt-4 flex flex-wrap gap-2">{selected.roles.slice(0,3).map(role=><span key={role} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/65">{role}</span>)}</div></div><LearningResources skill={firstSkill?.name ?? firstStage?.skills[0] ?? selected.title}/></section>
    <section className="mt-5 rounded-[30px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-6"><div className="flex items-start gap-3"><GraduationCap className="h-6 w-6 text-[#f1c77b]"/><div><p className="text-xs font-bold uppercase tracking-[.14em] text-white/40">University curriculum</p><h2 className="mt-2 font-display text-2xl font-semibold">Open the actual curriculum, not the university homepage.</h2><p className="mt-2 text-sm leading-6 text-white/50">These links go to course/curriculum pages. Hana can compare one with your route and ask before changing anything.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{universities.map(([name,landing,curriculum])=><div key={name} className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><p className="font-semibold">{name}</p><div className="mt-3 flex flex-wrap gap-2"><a href={curriculum} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#172630]">Open curriculum <ExternalLink className="h-3 w-3"/></a><Link href={`/chat?prompt=${encodeURIComponent(`Compare my ${selected.title} roadmap with the official ${name} curriculum at ${curriculum}. Browse it, explain overlaps and gaps, and ask me whether I want adjustments. Do not change anything automatically.`)}`} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/70">Compare with Hana <ArrowRight className="h-3 w-3"/></Link></div><a href={landing} target="_blank" rel="noreferrer" className="mt-2 block text-xs text-white/35 underline">University page</a></div>)}</div></section>
  </HanaGameFrame>;
}
