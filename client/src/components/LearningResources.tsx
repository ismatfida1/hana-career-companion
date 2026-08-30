import { BookOpen, ExternalLink, GraduationCap, Play, ScrollText, Sparkles, Wrench } from "lucide-react";
import { masterResourceLibrary, type ResourceItem } from "@/data/resourceLibrary";

type ResourceType = "university" | "youtube" | "book" | "docs" | "online" | "interactive";
type Resource = ResourceItem & { type: ResourceType; alternative?: { title: string; url: string } };

const labels: Record<ResourceType, string> = { university: "University curriculum", youtube: "YouTube", book: "Book", docs: "Documentation", online: "Online learning", interactive: "Interactive" };
const icons = { university: GraduationCap, youtube: Play, book: BookOpen, docs: ScrollText, online: ExternalLink, interactive: Wrench } as const;
const skillKeyHints: Array<[string, keyof typeof masterResourceLibrary]> = [
  ["algorithm", "foundations"], ["data structure", "foundations"], ["programming", "programming"], ["python", "python"], ["javascript", "javascript"], ["typescript", "typescript"], ["react", "react"], ["node", "node"], ["api", "rest"], ["http", "rest"], ["database", "databases"], ["sql", "databases"], ["mongodb", "mongodb"], ["redis", "redis"], ["java", "java"], ["spring", "spring"], [".net", "dotnet"], ["c++", "cpp"], ["rust", "rust"], ["go", "go"], ["kotlin", "kotlin"], ["swift", "swift"], ["flutter", "flutter"], ["mobile", "reactNative"], ["graphql", "graphql"], ["ai", "aiEngineering"], ["machine learning", "aiEngineering"], ["llm", "aiEngineering"], ["agent", "agents"], ["prompt", "prompting"], ["data science", "dataScience"], ["data", "dataScience"], ["cyber", "cybersecurity"], ["security", "cybersecurity"], ["design", "design"], ["accessibility", "accessibility"], ["performance", "performance"], ["open source", "openSource"], ["git", "git"], ["github", "github"], ["web", "web"], ["html", "html"], ["css", "css"]
];

function findLibrary(skill: string): ResourceItem[] {
  const normalized = ` ${skill.toLowerCase()} `;
  const key = skillKeyHints.find(([hint]) => normalized.includes(hint))?.[1];
  return key ? masterResourceLibrary[key] ?? [] : masterResourceLibrary.foundations ?? [];
}
function youtubeUrl(query: string) { return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${query} tutorial`)}`; }
function bookUrl(query: string) { return `https://books.google.com/books?q=${encodeURIComponent(query)}`; }

function buildResources(skill: string): Resource[] {
  const library = findLibrary(skill);
  const primary = library.find(item => item.role === "primary") ?? library[0];
  const documentation = library.find(item => item.role === "documentation") ?? library[1] ?? primary;
  const online = library.find(item => item.role === "practice" || item.role === "project") ?? library[2] ?? primary;
  const alternatives = library.filter(item => item.url !== primary?.url && item.url !== documentation?.url && item.url !== online?.url);
  const alt = (index: number, title: string, url: string) => alternatives[index] ?? { title, url, role: "documentation" as const };
  return [
    { title: primary?.title ?? `${skill} learning path`, url: primary?.url ?? "https://www.freecodecamp.org/learn/", type: "online", alternative: { title: alt(0, "MIT OpenCourseWare", "https://ocw.mit.edu/").title, url: alt(0, "MIT OpenCourseWare", "https://ocw.mit.edu/").url } },
    { title: "Harvard CS50x", url: "https://cs50.harvard.edu/x/2026/", type: "university", alternative: { title: "MIT OpenCourseWare · Algorithms", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/" } },
    { title: `${skill} — beginner video`, url: youtubeUrl(skill), type: "youtube", alternative: { title: `${skill} — full-course video`, url: youtubeUrl(`${skill} full course`) } },
    { title: `${skill}: recommended books`, url: bookUrl(`${skill} computer science`), type: "book", alternative: { title: "Open Library book search", url: `https://openlibrary.org/search?q=${encodeURIComponent(skill + " computer science")}` } },
    { title: documentation?.title ?? `${skill} documentation`, url: documentation?.url ?? `https://www.google.com/search?q=${encodeURIComponent(skill + " official documentation")}`, type: "docs", alternative: { title: alt(1, "MDN Web Docs", "https://developer.mozilla.org/").title, url: alt(1, "MDN Web Docs", "https://developer.mozilla.org/").url } },
    { title: online?.title ?? `${skill} practice`, url: online?.url ?? "https://www.freecodecamp.org/learn/", type: "interactive", alternative: { title: alt(2, "freeCodeCamp", "https://www.freecodecamp.org/learn/").title, url: alt(2, "freeCodeCamp", "https://www.freecodecamp.org/learn/").url } },
  ];
}

export default function LearningResources({ skill, skills }: { skill: string; skills?: string[] }) {
  const requested = Array.from(new Set([...(skills ?? []), skill].filter(Boolean)));
  const resources = buildResources(requested[0] ?? skill);
  return <section className="rounded-[30px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-6">
    <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-white/40">Learning kit · {requested.length > 1 ? `${requested.length} skills in this step` : "this step"}</p><h3 className="mt-1 font-display text-2xl font-semibold">Everything you need to learn it</h3><p className="mt-1 text-sm text-white/50">A focused route with a backup for every resource type.</p></div><Sparkles className="h-5 w-5 shrink-0 text-[#f1c77b]"/></div>
    {requested.length > 1 && <div className="mt-4 flex flex-wrap gap-2">{requested.slice(0, 5).map(item => <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/65">{item}</span>)}</div>}
    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{resources.map(resource => { const Icon = icons[resource.type]; return <article key={`${resource.type}-${resource.title}`} className="flex min-h-[178px] flex-col rounded-2xl border border-white/10 bg-[#132434]/80 p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#f1c77b]"><Icon className="h-4 w-4"/>{labels[resource.type]}</div><p className="mt-3 min-h-10 text-sm font-semibold text-white">{resource.title}</p><a href={resource.url} target="_blank" rel="noreferrer" className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#f1c77b] px-3 py-2 text-xs font-bold text-[#172630]">Open <ExternalLink className="h-3.5 w-3.5"/></a>{resource.alternative && <a href={resource.alternative.url} target="_blank" rel="noreferrer" className="mt-2 block text-xs font-semibold text-white/50 underline">Alternative: {resource.alternative.title}</a>}</article>; })}</div>
  </section>;
}
