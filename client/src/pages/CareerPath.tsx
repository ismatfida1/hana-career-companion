import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, BookOpen, Check, Compass, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  careerCatalog,
  defaultCareerPath,
  getCareerPath,
  type CareerPathId,
} from "@/data/careerCatalog";
import { useAuth } from "@/_core/hooks/useAuth";

const featuredPathIds: CareerPathId[] = ["computer-science", "ai-ml", "cybersecurity"];

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
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const profileQuery = trpc.learner.profile.useQuery(undefined, { enabled: !!user });
  const saveProfile = trpc.learner.saveProfile.useMutation({
    onSuccess: async () => {
      await profileQuery.refetch();
    },
  });

  const [selectedPath, setSelectedPath] = useState<CareerPathId>(defaultCareerPath);
  const [showAllPaths, setShowAllPaths] = useState(false);
  const [search, setSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");

  useEffect(() => {
    const saved = profileQuery.data?.careerPath;
    if (saved && careerCatalog.some(path => path.id === saved)) {
      setSelectedPath(saved as CareerPathId);
    }
  }, [profileQuery.data?.careerPath]);

  const path = getCareerPath(selectedPath);
  const visiblePaths = useMemo(() => {
    const pool = showAllPaths ? careerCatalog : careerCatalog.filter(item => featuredPathIds.includes(item.id));
    const needle = search.trim().toLowerCase();
    if (!needle) return pool;
    return pool.filter(item => `${item.title} ${item.shortTitle} ${item.description} ${item.roles.join(" ")}`.toLowerCase().includes(needle));
  }, [search, showAllPaths]);

  const visibleSkills = useMemo(() => {
    const needle = skillSearch.trim().toLowerCase();
    if (!needle) return path.skills;
    return path.skills.filter(skill => `${skill.name} ${skill.summary}`.toLowerCase().includes(needle));
  }, [path, skillSearch]);

  const selectPath = (id: CareerPathId) => {
    setSelectedPath(id);
    setSkillSearch("");
    setSearch("");
    setShowAllPaths(false);
  };

  const save = () => {
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

  if (loading || profileQuery.isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-12 text-sm text-[#76695d]">Loading your path…</div>;
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-12">
        <section className="surface-card w-full rounded-[30px] p-7 text-center md:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf3ee] text-[#4f8c7b]"><Compass className="h-7 w-7" /></div>
          <p className="eyebrow mt-6">Hana Career Path</p>
          <h1 className="display-title mt-2">Choose your direction first.</h1>
          <p className="body-copy mx-auto mt-4 max-w-xl">Pick a path, see the first five stages, and explore deeper skills only when you need them.</p>
          <Button onClick={startLogin} className="mt-7 rounded-full bg-[#315d58] px-6 hover:bg-[#254c48]">Sign in to build my path <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-7 pb-16 md:px-6 md:py-10">
      <header className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Your direction</p>
          <h1 className="display-title mt-2 max-w-3xl">Choose a path. Hana will handle the rest.</h1>
          <p className="body-copy mt-3 max-w-2xl">You only see the next five stages first. The deeper skill library stays available when you want alternatives.</p>
        </div>
        <Button onClick={() => navigate("/")} variant="outline" className="rounded-full self-start md:self-auto">Back to Hana <ArrowRight className="ml-2 h-4 w-4" /></Button>
      </header>

      <section className="surface-card rounded-[28px] p-5 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Start simple</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[#2d3c39]">What do you want to become?</h2>
          </div>
          <Sparkles className="h-5 w-5 text-[#db8b71]" />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {careerCatalog.filter(item => featuredPathIds.includes(item.id)).map(item => (
            <button key={item.id} onClick={() => selectPath(item.id)} className={cn("rounded-2xl border p-4 text-left transition", selectedPath === item.id ? "border-[#7eafa0] bg-[#edf6f1] shadow-sm" : "border-[#e7ddd2] bg-[#fffdf9] hover:border-[#c8dbd3]")}> 
              <div className="flex items-start justify-between gap-3">
                <div><p className="font-semibold text-[#2d3c39]">{item.title}</p><p className="mt-1 text-xs leading-5 text-[#76695d]">{item.description}</p></div>
                {selectedPath === item.id && <span className="rounded-full bg-[#315d58] p-1 text-white"><Check className="h-3.5 w-3.5" /></span>}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">{item.roles.slice(0, 2).map(role => <span key={role} className="pill">{role}</span>)}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a39587]" />
            <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Explore another path…" className="w-full rounded-full border border-[#e7ddd2] bg-[#fffdf9] py-2.5 pl-9 pr-4 text-sm text-[#2d3c39] outline-none focus:border-[#9bbeb1]" />
          </div>
          <Button variant="outline" onClick={() => setShowAllPaths(value => !value)} className="rounded-full">{showAllPaths ? "Show essentials" : "Explore all paths"}</Button>
        </div>

        {showAllPaths && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePaths.map(item => (
              <button key={item.id} onClick={() => selectPath(item.id)} className={cn("rounded-2xl border px-4 py-3 text-left", selectedPath === item.id ? "border-[#7eafa0] bg-[#edf6f1]" : "border-[#eee5da] bg-white")}>{item.title}<span className="mt-1 block text-xs text-[#8b7d70]">{item.roles[0]} · {item.roles[1]}</span></button>
            ))}
            {visiblePaths.length === 0 && <p className="text-sm text-[#76695d]">No path matches that search.</p>}
          </div>
        )}
      </section>

      <section className="mt-7 rounded-[28px] bg-[#fffaf4] p-5 md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="eyebrow">Your roadmap</p>
            <h2 className="display-title mt-2">{path.title}</h2>
            <p className="body-copy mt-3 max-w-2xl">{path.description}</p>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <Button onClick={save} disabled={saveProfile.isPending} className="rounded-full bg-[#315d58] hover:bg-[#254c48]">{saveProfile.isPending ? "Saving…" : "Make this my path"} <ArrowRight className="ml-2 h-4 w-4" /></Button>
            {profileQuery.data?.careerPath === selectedPath && <span className="text-xs font-semibold text-[#4f806f]">Saved as your current path</span>}
          </div>
        </div>

        <div className="mt-7 grid gap-3">
          {path.stages.map((stage, index) => (
            <details key={`${stage.world}-${stage.title}`} className="group rounded-2xl border border-[#e8dfd3] bg-white/70 p-4" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center gap-4">
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold", index === 0 ? "bg-[#315d58] text-white" : "bg-[#eaf3ee] text-[#4f806f]")}>{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1"><span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#a39587]">{stage.world}</span><span className="mt-1 block font-semibold text-[#2d3c39]">{stage.title}</span></span>
                <span className="text-xs text-[#8b7d70]">{index === 0 ? "Start here" : "Next stage"}</span>
              </summary>
              <div className="ml-13 mt-4 grid gap-3 border-t border-[#eee5da] pt-4 md:grid-cols-[1.2fr_0.8fr]">
                <p className="text-sm leading-6 text-[#5f6b66]">{stage.outcome}</p>
                <div className="flex flex-wrap gap-2">{stage.skills.map(skill => <span key={skill} className="pill pill-sage">{skill}</span>)}</div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-7 surface-card rounded-[28px] p-5 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><p className="eyebrow">Explore without overwhelm</p><h2 className="mt-2 font-display text-2xl font-semibold text-[#2d3c39]">Skills inside {path.shortTitle}</h2><p className="mt-2 text-sm leading-6 text-[#76695d]">Each skill has a recommended resource and an alternative. You do not need to learn all of them.</p></div>
          <div className="relative w-full md:w-80"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a39587]" /><input value={skillSearch} onChange={event => setSkillSearch(event.target.value)} placeholder="Search this path’s skills…" className="w-full rounded-full border border-[#e7ddd2] bg-[#fffdf9] py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#9bbeb1]" /></div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {visibleSkills.map(skill => (
            <details key={skill.name} className="rounded-2xl border border-[#eee5da] bg-[#fffdf9] p-4">
              <summary className="flex cursor-pointer list-none items-center gap-3"><BookOpen className="h-4 w-4 text-[#4f806f]" /><span className="flex-1"><span className="block font-semibold text-[#2d3c39]">{skill.name}</span><span className="mt-1 block text-xs text-[#8b7d70]">{skill.summary}</span></span><ArrowRight className="h-4 w-4 text-[#a39587] transition group-open:rotate-90" /></summary>
              <div className="mt-4 space-y-2 border-t border-[#eee5da] pt-3">{skill.resources.map(resource => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-[#4f806f] hover:bg-[#edf6f1]"><span>{resource.title}</span><ArrowRight className="h-4 w-4" /></a>)}</div>
            </details>
          ))}
          {visibleSkills.length === 0 && <p className="text-sm text-[#76695d]">No skill matches that search. Try a broader term.</p>}
        </div>
      </section>

      <section className="mt-7 rounded-[28px] border border-[#e8dfd3] bg-[#fffaf4] p-5 md:p-7">
        <p className="eyebrow">Related directions</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {relatedPathIds[selectedPath].map(id => { const related = getCareerPath(id); return <button key={id} onClick={() => selectPath(id)} className="rounded-2xl border border-[#e8dfd3] bg-white/70 px-4 py-3 text-left font-semibold text-[#2d3c39] hover:border-[#b9d4c9]">{related.title}<span className="mt-1 block text-xs font-normal text-[#8b7d70]">Switch path</span></button>; })}
        </div>
      </section>
    </main>
  );
}
