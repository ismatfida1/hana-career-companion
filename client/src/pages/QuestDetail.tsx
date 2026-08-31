import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Check, ExternalLink, Lock, Play, Wrench } from "lucide-react";
import { useLocation } from "wouter";
import HanaGameFrame from "@/components/HanaGameFrame";
import { getQuest } from "@/data/questCatalog";

export default function QuestDetail() {
  const [location, navigate] = useLocation();
  const id = useMemo(() => new URLSearchParams(location.split("?")[1] ?? "").get("id"), [location]);
  const quest = getQuest(id);
  const storageKey = `hana-quest-${quest.id}`;
  const [completed, setCompleted] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as string[]; } catch { return []; }
  });

  const toggle = (objectiveId: string, index: number) => {
    if (index > 0 && !completed.includes(quest.objectives[index - 1].id)) return;
    const next = completed.includes(objectiveId) ? completed.filter(id => id !== objectiveId) : [...completed, objectiveId];
    setCompleted(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  };
  const openFlow = () => {
    const next = quest.objectives.find(item => !completed.includes(item.id));
    if (next) toggle(next.id, quest.objectives.findIndex(item => item.id === next.id));
    else navigate(`/chat?prompt=${encodeURIComponent(`I completed the ${quest.title} quest. Help me reflect on what I learned and choose the next step.`)}`);
  };

  return <HanaGameFrame title={`${quest.title} · Quest`}>
    <section className="relative overflow-hidden rounded-[30px] border border-[#f1c77b]/25 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-7">
      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-300/5 blur-3xl" aria-hidden="true" />
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#f1c77b]/75">Quest detail · {completed.length}/{quest.objectives.length} complete</p>
        <h2 className="mt-2 max-w-3xl break-words font-display text-3xl font-semibold sm:text-4xl">{quest.title}</h2>
        <p className="mt-2 text-lg font-semibold text-white/75">{quest.subtitle}</p>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-white/55">{quest.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">{quest.tags.map(tag => <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/65">{tag}</span>)}</div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-black/10 p-4"><p className="text-xs uppercase tracking-wider text-white/35">Eligibility</p><p className="mt-1 text-sm font-semibold text-white/75">{quest.eligibility}</p></div><a href={quest.sourceUrl} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:bg-white/10"><p className="text-xs uppercase tracking-wider text-white/35">Learning source</p><p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#f1c77b]">Open source <ExternalLink className="h-3.5 w-3.5" /></p></a></div>
      </div>
    </section>

    <section className="rounded-[30px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-7">
      <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-white/40">Objective path</p><h3 className="mt-1 font-display text-2xl font-semibold">Learn → Practice → Build → Prove</h3></div><Wrench className="h-5 w-5 text-[#f1c77b]" /></div>
      <div className="mt-5 space-y-3">{quest.objectives.map((objective, index) => { const done = completed.includes(objective.id); const unlocked = index === 0 || completed.includes(quest.objectives[index - 1].id); const Icon = objective.type === "lesson" ? BookOpen : objective.type === "build" ? Wrench : objective.type === "prove" ? Check : Play; return <button key={objective.id} type="button" disabled={!unlocked} onClick={() => toggle(objective.id, index)} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${done ? "border-emerald-300/30 bg-emerald-300/10" : unlocked ? "border-[#f1c77b]/30 bg-[#f1c77b]/5 hover:bg-[#f1c77b]/10" : "border-white/10 bg-black/10 opacity-60"}`}><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${done ? "bg-emerald-300/20 text-emerald-200" : unlocked ? "bg-[#f1c77b]/15 text-[#f1c77b]" : "bg-white/5 text-white/30"}`}>{unlocked ? <Icon className="h-4 w-4" /> : <Lock className="h-4 w-4" />}</span><span className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-[.16em] text-white/35">Step {index + 1} · {objective.type}</span><span className="mt-1 block break-words text-sm font-semibold text-white/85">{objective.label}</span></span>{done && <Check className="h-5 w-5 shrink-0 text-emerald-200" />}</button>; })}</div>
      <button type="button" onClick={openFlow} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f1c77b] px-5 py-3 font-bold text-[#172630]">{completed.length === quest.objectives.length ? "Reflect with Hana" : "Open Quest"}<ArrowRight className="h-4 w-4" /></button>
    </section>
  </HanaGameFrame>;
}
