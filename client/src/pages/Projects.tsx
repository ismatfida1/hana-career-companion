import { ArrowRight, ExternalLink, Github, Rocket, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import HanaGameFrame from "@/components/HanaGameFrame";

const projects = [
  { title: "API Explorer", level: "Starter", description: "Build a tiny app that sends a GET request and displays useful data.", skills: ["HTTP", "JavaScript", "APIs"], url: "https://developer.mozilla.org/en-US/docs/Web/HTTP" },
  { title: "Career Compass", level: "Intermediate", description: "Create a small dashboard that compares skills, roles, and learning resources for a field you care about.", skills: ["React", "Data", "UX"], url: "https://react.dev/learn" },
  { title: "Open Source First Step", level: "Intermediate", description: "Find a beginner-friendly issue, improve documentation, and publish the contribution as evidence.", skills: ["Git", "GitHub", "Communication"], url: "https://github.com/explore" },
];

export default function Projects() {
  const [, navigate] = useLocation();
  return <HanaGameFrame title="Projects · Build evidence">
    <div className="grid gap-4 lg:grid-cols-3">{projects.map(project => <article key={project.title} className="rounded-[28px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-6"><div className="flex items-center justify-between"><div className="rounded-2xl bg-[#f1c77b] p-3 text-[#172630]"><Rocket className="h-5 w-5"/></div><span className="text-xs font-bold uppercase tracking-wider text-white/40">{project.level}</span></div><h2 className="mt-5 font-display text-2xl font-semibold">{project.title}</h2><p className="mt-2 text-sm leading-6 text-white/55">{project.description}</p><div className="mt-4 flex flex-wrap gap-2">{project.skills.map(skill=><span key={skill} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70">{skill}</span>)}</div><a href={project.url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#f1c77b]">Learn the relevant skill <ExternalLink className="h-4 w-4"/></a><button onClick={()=>navigate(`/chat?prompt=${encodeURIComponent(`Help me build the ${project.title} project. Give me the smallest useful first task.`)}`)} className="mt-4 block text-xs font-bold text-white/45 underline">Ask Hana about this build</button></article>)}</div>
    <section className="mt-5 rounded-[30px] border border-white/10 bg-white/[.055] p-6 shadow-xl backdrop-blur sm:p-7"><div className="flex items-start gap-4"><div className="rounded-2xl bg-white p-3 text-[#172630]"><Github className="h-5 w-5"/></div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-white/40">Evidence vault</p><h2 className="mt-2 font-display text-2xl font-semibold">Make the result visible.</h2><p className="mt-2 text-sm leading-6 text-white/50">Keep the code on GitHub, write a short README, and link the finished result from your portfolio. The artifact matters more than a progress percentage.</p><a href="https://skills.github.com/" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#f1c77b] px-4 py-2.5 text-sm font-bold text-[#172630]">GitHub Skills <ArrowRight className="h-4 w-4"/></a></div></div></section>
    <p className="mt-5 text-center text-sm text-white/35"><Sparkles className="mr-1 inline h-4 w-4"/>Hana's rule: make the next thing finishable.</p>
  </HanaGameFrame>;
}
