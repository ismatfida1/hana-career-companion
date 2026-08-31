import { ArrowRight, BriefcaseBusiness, ExternalLink, Sparkles, Search, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import HanaGameFrame from "@/components/HanaGameFrame";

type Opportunity = { title: string; description: string; url: string; why: string; source?: string; free?: boolean; deadline?: string; eligibility?: string; alternative?: { title: string; url: string } };
const fallbackSources: Opportunity[] = [];

export default function Opportunities() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Opportunity[]>(fallbackSources);
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState("");

  const find = async () => {
    setLoading(true);
    setUpdated(false);
    setError("");
    try {
      const selectedPath = typeof window !== "undefined" ? window.localStorage.getItem("hana-career-path") : "";
      const q = query.trim() || `latest free-entry opportunities for ${selectedPath || "computer science students"}: hackathons, Google developer programs, competitions, scholarships, open-source programs`;
      const r = await fetch(`/api/opportunities?q=${encodeURIComponent(q)}`);
      const d = await r.json() as { opportunities?: Opportunity[]; error?: string };
      if (!r.ok) throw new Error(d.error ?? "Opportunity search failed");
      const safeItems = (d.opportunities ?? []).filter(item => item.free === true && /^https:\/\//i.test(item.url));
      setItems(safeItems);
      setUpdated(true);
      if (!safeItems.length) setError("Hana could not verify a current free-entry opportunity from the trusted sources for this search. Try a more specific search or ask Hana to research it.");
    } catch (err) {
      setItems([]);
      setError(err instanceof Error ? err.message : "Live opportunity search is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void find(); }, []);

  return <HanaGameFrame title="Opportunities · Find your opening">
    <section className="min-w-0 rounded-[30px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-6">
      <div className="flex min-w-0 items-start gap-3"><Search className="h-6 w-6 shrink-0 text-[#f1c77b]"/><div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[.16em] text-white/40">Beacon Summit · Live quest board</p><h2 className="mt-1 break-words font-display text-2xl font-semibold">Find opportunities that are actually open.</h2><p className="mt-2 break-words text-sm leading-6 text-white/50">Hana searches current web sources and only displays results that pass its trusted-domain, HTTPS, and free-entry checks. Deadlines and eligibility should still be confirmed on the official page.</p><div className="mt-4 flex flex-col gap-3 sm:flex-row"><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&void find()} placeholder="AI hackathons, Google programs, cybersecurity competitions…" className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none placeholder:text-white/30"/><button onClick={()=>void find()} disabled={loading} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#f1c77b] px-5 py-3 font-bold text-[#172630]"><RefreshCw className={`h-4 w-4 ${loading?'animate-spin':''}`}/>{loading?"Checking…":"Find latest"}</button></div></div></div>
      {updated && !error && <p className="mt-3 text-xs text-white/35">Quest board refreshed from live sources. Only verified free-entry HTTPS results are shown.</p>}
      {error && <div className="mt-4 flex min-w-0 items-start gap-2 rounded-2xl border border-[#f1c77b]/20 bg-[#f1c77b]/5 p-3 text-sm text-white/65"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#f1c77b]"/><span className="break-words">{error}</span></div>}
    </section>

    {items.length > 0 ? <section className="mt-5 grid min-w-0 gap-4 md:grid-cols-2">{items.map(item=><article key={item.url} className="min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-6"><div className="flex min-w-0 items-center justify-between gap-3"><div className="rounded-2xl bg-[#f1c77b] p-3 text-[#172630]"><BriefcaseBusiness className="h-5 w-5"/></div><div className="flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-300"><CheckCircle2 className="h-4 w-4"/>Verified free-entry</div></div><p className="mt-4 break-words text-xs font-bold uppercase tracking-[.14em] text-white/35">{item.source ?? "Official source"}</p><h2 className="mt-2 break-words font-display text-2xl font-semibold">{item.title}</h2><p className="mt-2 break-words text-sm leading-6 text-white/55">{item.description}</p>{item.deadline&&<p className="mt-3 break-words text-xs font-semibold text-white/60">Deadline: {item.deadline}</p>}{item.eligibility&&<p className="mt-1 break-words text-xs text-white/45">Eligibility: {item.eligibility}</p>}<div className="mt-4 break-words rounded-2xl border border-white/10 bg-black/10 p-3 text-sm text-white/65"><strong className="text-white">Why Hana recommends it:</strong> {item.why}</div><div className="mt-5 flex min-w-0 flex-wrap gap-2"><a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-full bg-[#f1c77b] px-4 py-2.5 text-sm font-bold text-[#172630]">Open official source <ExternalLink className="h-4 w-4 shrink-0"/></a><button onClick={()=>navigate(`/chat?prompt=${encodeURIComponent(`Research this opportunity deeply: ${item.title} ${item.url}. Check current deadline, eligibility, location/online status, entry fee, theme, required skills, and whether it fits my career path. Only recommend it if the entry is free.`)}`)} className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/70"><Sparkles className="h-4 w-4 shrink-0"/>Ask Hana to verify</button>{item.alternative&&<a href={item.alternative.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 max-w-full items-center rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/55">Alternative: {item.alternative.title}</a>}</div></article>)}</section> : <section className="mt-5 rounded-[28px] border border-white/10 bg-white/[.055] p-6 text-center shadow-xl backdrop-blur"><p className="text-xs font-bold uppercase tracking-[.16em] text-white/40">No unverified cards</p><h2 className="mt-2 font-display text-2xl font-semibold">Hana won't pretend a directory is an open opportunity.</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/50">When a current free-entry opportunity cannot be verified, this page stays honest instead of filling the board with stale or generic links.</p></section>}

    <section className="mt-5 min-w-0 rounded-[30px] border border-white/10 bg-white/[.055] p-6 shadow-xl backdrop-blur sm:p-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-white/40">Hana opportunity mode</p><h2 className="mt-2 break-words font-display text-2xl font-semibold">Choose your next quest.</h2><p className="mt-2 max-w-2xl break-words text-sm leading-6 text-white/50">Hana can research hackathons, Google or other major developer programs, competitions, scholarships, and open-source opportunities for your selected path.</p><button onClick={()=>navigate(`/chat?prompt=${encodeURIComponent("Browse the latest free-entry opportunities for my selected career path. Find hackathons, Google or other major developer programs, competitions, scholarships, and open-source opportunities. Verify current details from official sources, exclude paid-entry opportunities, rank the strongest few by fit, and explain why each is worth considering.")}`)} className="mt-5 inline-flex min-h-11 max-w-full items-center gap-2 rounded-full bg-[#f1c77b] px-5 py-3 font-bold text-[#172630]">Ask Hana for latest recommendations <ArrowRight className="h-4 w-4 shrink-0"/></button></section>
  </HanaGameFrame>;
}
