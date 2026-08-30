import { ArrowLeft, ExternalLink, GraduationCap, Search, Sparkles, Youtube } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "wouter";
import { careerCatalog, defaultCareerPath } from "@/data/careerCatalog";

type Result = { title: string; url: string; snippet: string };
const universities = [["NUST", "https://nust.edu.pk/"], ["FAST-NUCES", "https://www.nu.edu.pk/"], ["COMSATS", "https://www.comsats.edu.pk/"], ["University of the Punjab", "https://pu.edu.pk/"], ["LUMS", "https://lums.edu.pk/"]] as const;

export default function Research() {
  const [params] = useSearchParams();
  const saved = typeof window !== "undefined" ? window.localStorage.getItem("hana-career-path") : null;
  const initial = careerCatalog.find(p => p.id === saved) ?? careerCatalog.find(p => p.id === defaultCareerPath) ?? careerCatalog[0];
  const requested = params.get("query") ?? initial.title;
  const requestedPath = careerCatalog.find(p => `${p.title} ${p.shortTitle}`.toLowerCase().includes(requested.toLowerCase())) ?? (requested.toLowerCase().includes("ai engineering") ? careerCatalog.find(p => p.id === "ai-ml") : undefined);
  const [query, setQuery] = useState(requested);
  const [field, setField] = useState(requestedPath?.id ?? initial.id);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const selected = useMemo(() => careerCatalog.find(p => p.id === field) ?? initial, [field, initial]);
  const youtube = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + " tutorial beginner")}`;
  const universitySearch = `https://www.google.com/search?q=${encodeURIComponent(query + " university degree curriculum")}`;

  const runSearch = async () => {
    const clean = query.trim();
    if (!clean) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/research?q=${encodeURIComponent(clean)}`);
      const data = await response.json() as { results?: Result[] };
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally { setLoading(false); }
  };
  useEffect(() => { if (requested.trim()) void runSearch(); }, []);

  const firstStage = selected.stages[0];
  const firstSkill = selected.skills.find(skill => firstStage?.skills.includes(skill.name)) ?? selected.skills[0];
  const primary = firstSkill?.resources[0];
  const alternative = firstSkill?.resources[1];
  const hanaPrompt = encodeURIComponent(`I am exploring ${selected.title}. Based on this field, devise a beginner-friendly plan. Show only one next step now, recommend one primary learning resource, and give me the next step only after I finish it. Keep the plan practical and not overwhelming.`);

  return <main className="min-h-screen bg-[#FBF7F1] px-4 py-6 pb-16 text-[#2d3c39] md:px-8 md:py-10"><div className="mx-auto max-w-6xl">
    <header className="flex items-start justify-between gap-4"><div><p className="eyebrow">Hana Research Desk</p><h1 className="display-title mt-2">Explore a field without climbing the whole mountain.</h1><p className="body-copy mt-3 max-w-2xl">Search the live web, find a learning spark, see university starting points, then let Hana turn what you found into one clear next step.</p></div><Link href="/" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#dfd3c7] bg-white px-4 py-2 text-sm font-semibold"><ArrowLeft className="h-4 w-4"/>Back</Link></header>

    <section className="mt-7 rounded-[28px] border border-[#e7ddd2] bg-white p-5 shadow-sm md:p-7"><div className="flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a0958a]"/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&void runSearch()} className="w-full rounded-2xl border border-[#ded3c7] bg-[#fffdf9] py-4 pl-12 pr-4 outline-none focus:border-[#8db8aa]" placeholder="Search a field, e.g. AI Engineering"/></div><button onClick={()=>void runSearch()} disabled={loading} className="rounded-2xl bg-[#315d58] px-6 py-3 font-semibold text-white">{loading ? "Searching…" : "Search"}</button></div><div className="mt-3 flex flex-wrap gap-2"><a href={youtube} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#e1d6ca] bg-[#fffaf4] px-4 py-2 text-sm font-semibold"><Youtube className="h-4 w-4"/>YouTube spark</a><a href={universitySearch} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#e1d6ca] bg-[#fffaf4] px-4 py-2 text-sm font-semibold"><GraduationCap className="h-4 w-4"/>Find degrees</a><Link href={`/chat?prompt=${hanaPrompt}`} className="inline-flex items-center gap-2 rounded-full border border-[#bcd7cc] bg-[#edf5f0] px-4 py-2 text-sm font-semibold text-[#4f806f]"><Sparkles className="h-4 w-4"/>Ask Hana for my plan</Link></div></section>

    {results.length > 0 && <section className="mt-6 rounded-[28px] border border-[#e7ddd2] bg-white p-5 shadow-sm md:p-7"><div className="flex items-center justify-between"><div><p className="eyebrow">Live research</p><h2 className="mt-2 font-display text-2xl font-semibold">A few useful results</h2></div><span className="text-xs text-[#8b7d70]">Free web search</span></div><div className="mt-4 grid gap-3">{results.map(result=><a key={result.url} href={result.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-[#eee5da] bg-[#fffdf9] p-4 transition hover:border-[#bcd7cc]"><div className="flex items-start justify-between gap-4"><div><p className="font-semibold">{result.title}</p><p className="mt-1 text-sm leading-6 text-[#76695d]">{result.snippet}</p></div><ExternalLink className="h-4 w-4 shrink-0 text-[#4f806f]"/></div></a>)}</div></section>}

    <section className="mt-6 grid gap-6 lg:grid-cols-[.85fr_1.15fr]"><div className="rounded-[28px] border border-[#e7ddd2] bg-white p-5 shadow-sm md:p-7"><p className="eyebrow">Field direction</p><select value={field} onChange={e=>setField(e.target.value)} className="mt-3 w-full rounded-2xl border border-[#ded3c7] bg-[#fffdf9] px-4 py-3">{careerCatalog.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select><h2 className="mt-5 font-display text-2xl font-semibold">{selected.title}</h2><p className="mt-2 text-sm leading-6 text-[#76695d]">{selected.description}</p><div className="mt-4 flex flex-wrap gap-2">{selected.roles.slice(0,3).map(role=><span key={role} className="pill">{role}</span>)}</div></div>
      <div className="rounded-[28px] border border-[#bcd7cc] bg-[#edf5f0] p-5 md:p-7"><p className="eyebrow">Your next step</p><h2 className="mt-2 font-display text-2xl font-semibold">{firstStage?.title}</h2><p className="mt-2 text-sm leading-6 text-[#5f6b66]">{firstStage?.outcome}</p><div className="mt-4 rounded-2xl border border-[#d6e5dd] bg-white p-4"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#8b7d70]">Start with {firstSkill?.name}</p><p className="mt-1 text-sm text-[#76695d]">One focused resource. You do not need the rest yet.</p>{primary && <a href={primary.url} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-between rounded-xl bg-[#315d58] px-4 py-3 text-sm font-bold text-white"><span>Start learning · {primary.title}</span><ExternalLink className="h-4 w-4"/></a>}{alternative && <details className="mt-3"><summary className="cursor-pointer text-sm font-semibold text-[#4f806f]">This isn't clicking? Show one other way</summary><a href={alternative.url} target="_blank" rel="noreferrer" className="mt-2 flex items-center justify-between rounded-xl border border-[#dfe9e3] bg-[#fffdf9] px-4 py-3 text-sm font-semibold text-[#4f806f]"><span>{alternative.title}</span><ExternalLink className="h-4 w-4"/></a></details>}</div></div></section>

    <section className="mt-6 rounded-[28px] border border-[#e7ddd2] bg-white p-5 shadow-sm md:p-7"><p className="eyebrow">University starting points</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{universities.map(([name,url])=><a key={name} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-[#e7ddd2] bg-[#fffdf9] p-4 font-semibold hover:border-[#bcd7cc]"><span>{name}</span><ExternalLink className="h-4 w-4"/></a>)}</div></section>
  </div></main>;
}
