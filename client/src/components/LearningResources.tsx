import { BookOpen, ExternalLink, GraduationCap, Play, ScrollText, Sparkles, Wrench, Zap, Crown, Bot } from "lucide-react";
import { useLocation } from "wouter";
import { masterResourceLibrary, type ResourceItem } from "@/data/resourceLibrary";
import { curatedBook, curatedVideo } from "@/data/curatedLearningResources";

type ResourceType = "university" | "youtube" | "book" | "docs" | "online" | "interactive";
type Resource = { title: string; url: string; type: ResourceType; alternative: { title: string; url: string }; note?: string };
type UniversityOption = { name: string; curriculum: string };

const labels: Record<ResourceType, string> = { university: "University curriculum", youtube: "Best free video", book: "Free/open book", docs: "Official documentation", online: "Free online learning", interactive: "Free practice" };
const icons = { university: GraduationCap, youtube: Play, book: BookOpen, docs: ScrollText, online: ExternalLink, interactive: Wrench } as const;
const skillKeyHints: Array<[string, keyof typeof masterResourceLibrary]> = [["algorithm", "foundations"], ["data structure", "foundations"], ["programming", "programming"], ["python", "python"], ["javascript", "javascript"], ["typescript", "typescript"], ["react", "react"], ["node", "node"], ["api", "rest"], ["http", "rest"], ["database", "databases"], ["sql", "databases"], ["mongodb", "mongodb"], ["redis", "redis"], ["java", "java"], ["spring", "spring"], [".net", "dotnet"], ["c++", "cpp"], ["rust", "rust"], ["go", "go"], ["kotlin", "kotlin"], ["swift", "swift"], ["flutter", "flutter"], ["mobile", "reactNative"], ["graphql", "graphql"], ["ai", "aiEngineering"], ["machine learning", "aiEngineering"], ["llm", "aiEngineering"], ["agent", "agents"], ["prompt", "prompting"], ["data science", "dataScience"], ["data", "dataScience"], ["cyber", "cybersecurity"], ["security", "cybersecurity"], ["design", "design"], ["accessibility", "accessibility"], ["performance", "performance"], ["open source", "openSource"], ["git", "git"], ["github", "github"], ["web", "web"], ["html", "html"], ["css", "css"]];

const freeDomains = ["freecodecamp.org", "cs50.harvard.edu", "ocw.mit.edu", "developer.mozilla.org", "react.dev", "nodejs.org", "typescriptlang.org", "python.org", "docs.python.org", "developer.android.com", "kotlinlang.org", "go.dev", "rust-lang.org", "doc.rust-lang.org", "docs.github.com", "git-scm.com", "w3.org", "web.dev", "roadmap.sh", "youtube.com", "youtu.be", "edx.org", "csadvising.seas.harvard.edu", "seas.harvard.edu", "catalog.mit.edu", "cs.stanford.edu", "automatetheboringstuff.com", "eloquentjavascript.net", "philip.greenspun.com", "teachyourselfcs.com", "learncpp.com", "en.cppreference.com", "isocpp.org", "oracle.com", "dev.java", "scikit-learn.org", "developers.google.com", "pytorch.org", "tensorflow.org", "huggingface.co", "developers.openai.com", "ai.google.dev", "anthropic.com", "graphql.org", "spec.graphql.org", "learning.postman.com", "spec.openapis.org", "sqlbolt.com", "sqlzoo.net", "postgresql.org", "dev.mysql.com", "mongodb.com", "learn.mongodb.com", "redis.io", "university.redis.io", "spring.io", "docs.spring.io", "microsoft.com", "learn.microsoft.com", "php.net", "laravel.com", "djangoproject.com", "docs.djangoproject.com", "ruby-lang.org", "rubyguides.com", "rubyonrails.org", "guides.rubyonrails.org", "gobyexample.com", "swift.org", "docs.swift.org", "apple.com", "docs.flutter.dev", "dart.dev", "reactnative.dev", "expo.dev", "kaggle.com", "portswigger.net", "nist.gov", "attack.mitre.org", "elastic.co", "developer.wordpress.org", "learn.wordpress.org", "m3.material.io", "webaim.org", "github.com", "firstcontributions.github.io", "goodfirstissue.dev", "up-for-grabs.net", "theodinproject.com", "fullstackopen.com", "frontendmentor.io"];

function isFreeUrl(url: string) {
  try { const host = new URL(url).hostname.replace(/^www\./, ""); return freeDomains.some(domain => host === domain || host.endsWith(`.${domain}`)); }
  catch { return false; }
}

const universityAlternatives: UniversityOption[] = [
  { name: "Harvard Computer Science degree requirements", curriculum: "https://csadvising.seas.harvard.edu/concentration/requirements/" },
  { name: "MIT Computer Science and Engineering degree chart", curriculum: "https://catalog.mit.edu/degree-charts/computer-science-engineering-course-6-3/" },
  { name: "Stanford Computer Science BS requirements", curriculum: "https://www.cs.stanford.edu/bs-degree-requirements" },
];

function stageKey(skills: string[]): string {
  const normalized = new Set(skills.map(item => item.trim().toLowerCase()));
  if (normalized.has("data structures") && normalized.has("debugging")) return "algorithms";
  if (normalized.has("html/css") && normalized.has("javascript")) return "product";
  if (normalized.has("databases") && normalized.has("backend")) return "systems";
  if (normalized.has("projects") && normalized.has("open source")) return "specialize";
  if (normalized.has("python") && normalized.has("linear algebra")) return "ai-foundations";
  if (normalized.has("supervised learning") || normalized.has("feature engineering")) return "machine-learning";
  if (normalized.has("pytorch") || normalized.has("tensorflow")) return "deep-learning";
  if (normalized.has("llm apis") || normalized.has("rag")) return "ai-engineering";
  if (normalized.has("pandas") || normalized.has("visualization") || normalized.has("eda")) return "data-analysis";
  if (normalized.has("ml") && normalized.has("evaluation")) return "data-modeling";
  if (normalized.has("linux") && normalized.has("networking")) return "security-foundations";
  if (normalized.has("threat modeling") || normalized.has("owasp")) return "defensive-security";
  if (normalized.has("web security") || normalized.has("api security")) return "application-security";
  if (normalized.has("cloud security") || normalized.has("iam")) return "infrastructure-security";
  if (normalized.has("html") && normalized.has("css")) return "web-foundations";
  if (normalized.has("react") && normalized.has("node.js")) return "client-server";
  if (normalized.has("databases") && normalized.has("docker")) return "production";
  if (normalized.has("code review") || normalized.has("ci/cd")) return "professional-engineering";
  if (normalized.has("programming") && normalized.has("git") && normalized.has("testing")) return "engineering-foundations";
  if (normalized.has("oop") || normalized.has("design patterns")) return "application-architecture";
  if (normalized.has("experiments") || normalized.has("communication")) return "decision-impact";
  if (normalized.has("reports") || normalized.has("incident response")) return "security-portfolio";
  return "foundations";
}

function findLibrary(skill: string): ResourceItem[] {
  const normalized = ` ${skill.toLowerCase()} `;
  const key = skillKeyHints.find(([hint]) => normalized.includes(hint))?.[1];
  return key ? masterResourceLibrary[key] ?? [] : masterResourceLibrary.foundations ?? [];
}

function stageSpecificLibrary(stage: string): ResourceItem[] {
  const pick = (key: keyof typeof masterResourceLibrary) => masterResourceLibrary[key] ?? [];
  switch (stage) {
    case "algorithms": return [...pick("foundations"), ...pick("python"), ...pick("openSource")];
    case "product": return [...pick("web"), ...pick("javascript"), ...pick("rest")];
    case "systems": return [...pick("databases"), ...pick("node")];
    case "specialize": return [...pick("openSource"), ...pick("github"), ...pick("git")];
    case "ai-foundations": return [...pick("python"), ...pick("dataScience"), ...pick("aiEngineering")];
    case "machine-learning": return [...pick("aiEngineering"), ...pick("dataScience")];
    case "deep-learning": return [...pick("aiEngineering"), ...pick("tensorflow")];
    case "ai-engineering": return [...pick("aiEngineering"), ...pick("agents"), ...pick("prompting")];
    case "data-analysis": return [...pick("dataScience"), ...pick("python")];
    case "data-modeling": return [...pick("dataScience"), ...pick("aiEngineering")];
    case "security-foundations": return [...pick("cybersecurity"), ...pick("foundations")];
    case "defensive-security": return [...pick("cybersecurity")];
    case "application-security": return [...pick("cybersecurity"), ...pick("rest")];
    case "infrastructure-security": return [...pick("cybersecurity")];
    case "web-foundations": return [...pick("web"), ...pick("html"), ...pick("css")];
    case "client-server": return [...pick("react"), ...pick("node"), ...pick("rest")];
    case "production": return [...pick("databases"), ...pick("node")];
    case "professional-engineering": return [...pick("openSource"), ...pick("github"), ...pick("git")];
    case "engineering-foundations": return [...pick("programming"), ...pick("git")];
    case "application-architecture": return [...pick("rest"), ...pick("programming")];
    case "decision-impact": return [...pick("dataScience"), ...pick("openSource")];
    case "security-portfolio": return [...pick("cybersecurity"), ...pick("openSource")];
    default: return [];
  }
}

function buildResources(skills: string[], university?: UniversityOption): Resource[] {
  const unique = new Map<string, ResourceItem>();
  for (const item of stageSpecificLibrary(stageKey(skills))) if (isFreeUrl(item.url) && !unique.has(item.url)) unique.set(item.url, item);
  for (const skill of skills) for (const item of findLibrary(skill)) if (isFreeUrl(item.url) && !unique.has(item.url)) unique.set(item.url, item);
  const library = [...unique.values()];
  const primary = library.find(item => item.role === "primary") ?? library[0];
  const documentation = library.find(item => item.role === "documentation") ?? library.find(item => item.role === "advanced") ?? library[1];
  const practice = library.find(item => item.role === "practice" || item.role === "project") ?? library[2] ?? library[0];
  const focus = skills[0] ?? "Computer Science";
  const video = curatedVideo(focus) ?? { title: `${focus} — free video course`, url: "https://www.youtube.com/@freecodecamp/search?query=" + encodeURIComponent(focus) };
  const book = curatedBook(focus);
  const fallback = { title: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/" };
  const uni = university ?? universityAlternatives[0];
  const uniAlt = universityAlternatives.find(item => item.curriculum !== uni.curriculum) ?? universityAlternatives[1];
  const nextAlternative = library.find(item => item.url !== primary?.url && item.url !== documentation?.url && item.url !== practice?.url);
  return [
    { title: uni.name, url: uni.curriculum, type: "university", alternative: { title: uniAlt.name, url: uniAlt.curriculum }, note: "Official degree requirements. Hana compares this with your roadmap only after you ask; it never changes your roadmap automatically." },
    { title: video.title, url: video.url, type: "youtube", alternative: { title: "freeCodeCamp channel search", url: "https://www.youtube.com/@freecodecamp/search?query=" + encodeURIComponent(focus) }, note: curatedVideo(focus) ? "Curated free educational video." : "Reputable free-channel search for this stage." },
    { title: book.title, url: book.url, type: "book", alternative: { title: "Teach Yourself Computer Science", url: "https://teachyourselfcs.com/" }, note: "Free/open web book or textbook-style resource." },
    { title: documentation?.title ?? `${focus} documentation`, url: documentation?.url ?? "https://developer.mozilla.org/", type: "docs", alternative: { title: nextAlternative?.title ?? "MDN Web Docs", url: nextAlternative?.url ?? "https://developer.mozilla.org/" } },
    { title: primary?.title ?? fallback.title, url: primary?.url ?? fallback.url, type: "online", alternative: { title: nextAlternative?.title ?? "MIT OpenCourseWare", url: nextAlternative?.url ?? "https://ocw.mit.edu/" } },
    { title: practice?.title ?? "freeCodeCamp practice", url: practice?.url ?? fallback.url, type: "interactive", alternative: { title: nextAlternative?.title ?? "freeCodeCamp", url: nextAlternative?.url ?? fallback.url } },
  ];
}

export default function LearningResources({ skill, skills, university }: { skill: string; skills?: string[]; university?: UniversityOption }) {
  const [, navigate] = useLocation();
  const requested = Array.from(new Set([...(skills ?? []), skill].filter(Boolean)));
  const focus = requested[0] ?? skill;
  const resources = buildResources(requested, university);
  const hana = (mode: "Small Quest" | "Grand Quest" | "Build With Hana") => navigate(`/chat?prompt=${encodeURIComponent(`${mode}: ${focus}. You are Hana, my build companion. Guide me one milestone at a time, explain the important decisions, give me a concrete checkpoint after each milestone, and help me debug instead of taking over.`)}`);
  return <section className="min-w-0 rounded-[30px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-6">
    <div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[.14em] text-white/40">Learning kit · {stageKey(requested)}</p><h3 className="mt-1 break-words font-display text-2xl font-semibold">Everything you need to learn it</h3><p className="mt-1 text-sm text-white/50">Resources are selected for this exact roadmap stage, then enriched with its skills.</p></div><Sparkles className="h-5 w-5 shrink-0 text-[#f1c77b]"/></div>
    {requested.length > 1 && <div className="mt-4 flex flex-wrap gap-2">{requested.slice(0, 6).map(item => <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/65">{item}</span>)}</div>}
    <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">{resources.map(resource => { const Icon = icons[resource.type]; return <article key={`${resource.type}-${resource.title}`} className="flex min-h-[210px] min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#132434]/80 p-4"><div className="flex min-w-0 flex-1 flex-col"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#f1c77b]"><Icon className="h-4 w-4 shrink-0"/>{labels[resource.type]}</div><p className="mt-3 min-h-10 break-words text-sm font-semibold text-white">{resource.title}</p>{resource.note && <p className="mt-1 break-words text-xs leading-5 text-white/40">{resource.note}</p>}<a href={resource.url} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex min-h-10 w-fit max-w-full items-center gap-2 rounded-full bg-[#f1c77b] px-3 py-2 text-xs font-bold text-[#172630]">Open <ExternalLink className="h-3.5 w-3.5 shrink-0"/></a><a href={resource.alternative.url} target="_blank" rel="noopener noreferrer" className="mt-2 block max-w-full break-words text-xs font-semibold text-white/50 underline">Alternative: {resource.alternative.title}</a></div></article>; })}</div>
    <div className="mt-5 grid min-w-0 gap-3 md:grid-cols-2"><article className="min-w-0 rounded-2xl border border-white/10 bg-[#132434]/80 p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#f1c77b]"><Zap className="h-4 w-4"/>Small Quest</div><h4 className="mt-2 font-semibold text-white">Quick proof of learning</h4><p className="mt-2 text-sm leading-6 text-white/55">Build a small, focused version that demonstrates this stage without turning it into a giant project.</p><button onClick={()=>hana("Small Quest")} className="mt-3 min-h-10 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#172630]">Start Small Quest with Hana</button></article><article className="min-w-0 rounded-2xl border border-white/10 bg-[#132434]/80 p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#f1c77b]"><Crown className="h-4 w-4"/>Grand Quest</div><h4 className="mt-2 font-semibold text-white">Portfolio-depth build</h4><p className="mt-2 text-sm leading-6 text-white/55">Build the deeper version with testing, documentation, polish, error handling, and deployment.</p><button onClick={()=>hana("Grand Quest")} className="mt-3 min-h-10 rounded-full bg-[#f1c77b] px-3 py-2 text-xs font-bold text-[#172630]">Start Grand Quest with Hana</button></article></div>
    <button onClick={()=>hana("Build With Hana")} className="mt-3 inline-flex min-h-10 items-center gap-2 text-xs font-bold text-white/55 underline"><Bot className="h-3.5 w-3.5"/>Build With Hana · deep detailed mode</button>
  </section>;
}
