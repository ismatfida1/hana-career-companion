import { ExternalLink, GraduationCap, Search, Sparkles, Youtube } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { careerCatalog, defaultCareerPath } from "@/data/careerCatalog";

const universities = [
  ["NUST", "https://nust.edu.pk/"],
  ["FAST-NUCES", "https://www.nu.edu.pk/"],
  ["COMSATS", "https://www.comsats.edu.pk/"],
  ["University of the Punjab", "https://pu.edu.pk/"],
  ["LUMS", "https://lums.edu.pk/"],
] as const;

export default function Research() {
  const [, navigate] = useLocation();
  const saved = typeof window !== "undefined" ? window.localStorage.getItem("hana-career-path") : null;
  const initial = careerCatalog.find(p => p.id === saved) ?? careerCatalog.find(p => p.id === defaultCareerPath) ?? careerCatalog[0];
  const [query, setQuery] = useState(initial.title);
  const [field, setField] = useState(initial.title);
  const selected = useMemo(() => careerCatalog.find(p => p.title === field) ?? initial, [field, initial]);
  const google = `https://www.google.com/search?q=${encodeURIComponent(query + " career roadmap skills jobs")}`;
  const youtube = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + " tutorial")}`;
  const universitiesSearch = `https://www.google.com/search?q=${encodeURIComponent(query + " university degree Pakistan")}`;
  const hanaPrompt = encodeURIComponent(`I am exploring ${selected.title}. Using this field's skills and roles, devise a focused beginner-to-career plan. Give me one next step, the skills in order, project ideas, learning resources, and what university subjects would help. Keep it practical and not overwhelming.`);

  return (
    <main className="min-h-screen bg-[#FBF7F1] px-5 py-8 text-[#2d3c39] md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#9b8e80]">Hana Research Desk</p><h1 className="mt-2 font-display text-4xl font-semibold tracking-[-.04em]">Research a field before you choose it.</h1><p className="mt-3 max-w-2xl text-[#76695d]">Search the live web, browse learning videos, compare universities, then bring what you find back to Hana for a focused plan.</p></div><Link href="/" className="rounded-full border border-[#dfd3c7] bg-white px-4 py-2 text-sm font-semibold">Back</Link></header>
        <section className="mt-8 rounded-[28px] border border-[#e7ddd2] bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-col gap-4 md:flex-row"><div className="relative flex-1"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a0958a]"/><input value={query} onChange={e => setQuery(e.target.value)} className="w-full rounded-2xl border border-[#ded3c7] bg-[#fffdf9] py-4 pl-12 pr-4 text-base outline-none focus:border-[#8db8aa]" placeholder="Search a field, e.g. AI engineering" /></div><button onClick={() => window.open(google, "_blank", "noopener,noreferrer")} className="rounded-2xl bg-[#315d58] px-5 py-3 font-semibold text-white">Search web</button></div>
          <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => window.open(youtube, "_blank", "noopener,noreferrer")} className="inline-flex items-center gap-2 rounded-full border border-[#e1d6ca] bg-[#fffaf4] px-4 py-2 text-sm font-semibold"><Youtube className="h-4 w-4"/> YouTube tutorials</button><button onClick={() => window.open(universitiesSearch, "_blank", "noopener,noreferrer")} className="inline-flex items-center gap-2 rounded-full border border-[#e1d6ca] bg-[#fffaf4] px-4 py-2 text-sm font-semibold"><GraduationCap className="h-4 w-4"/> University search</button><button onClick={() => navigate(`/chat?prompt=${hanaPrompt}`)} className="inline-flex items-center gap-2 rounded-full border border-[#bcd7cc] bg-[#edf5f0] px-4 py-2 text-sm font-semibold text-[#4f806f]"><Sparkles className="h-4 w-4"/> Ask Hana to devise my plan</button></div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <div className="rounded-[28px] border border-[#e7ddd2] bg-white p-5 shadow-sm md:p-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#9b8e80]">Field map</p><h2 className="mt-2 font-display text-2xl font-semibold">Start from a real technical direction</h2><select value={field} onChange={e => setField(e.target.value)} className="mt-5 w-full rounded-2xl border border-[#ded3c7] bg-[#fffdf9] px-4 py-3 text-sm">{careerCatalog.map(p => <option key={p.id}>{p.title}</option>)}</select><p className="mt-4 text-sm leading-6 text-[#76695d]">{selected.description}</p><div className="mt-4 flex flex-wrap gap-2">{selected.roles.map(role => <span key={role} className="rounded-full bg-[#f2eee8] px-3 py-1.5 text-xs font-semibold">{role}</span>)}</div><div className="mt-6 rounded-2xl bg-[#f7f1e9] p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#9b8e80]">Hana's research prompt</p><p className="mt-2 text-sm leading-6 text-[#665d54]">“What skills matter for this field, what can I build, which resources are credible, and which university subjects support it?”</p></div></div>
          <div className="rounded-[28px] border border-[#e7ddd2] bg-[#fffaf4] p-5 shadow-sm md:p-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#9b8e80]">Quick university starting points</p><h2 className="mt-2 font-display text-2xl font-semibold">Compare official university pages</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{universities.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-[#e7ddd2] bg-white p-4 font-semibold hover:border-[#bcd7cc]"><span>{name}</span><ExternalLink className="h-4 w-4"/></a>)}</div><p className="mt-5 text-sm leading-6 text-[#76695d]">University pages are starting points, not rankings. Use Hana to compare curriculum fit with your selected direction.</p></div>
        </section>
      </div>
    </main>
  );
}
