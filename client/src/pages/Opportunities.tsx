import { ArrowRight, BriefcaseBusiness, ExternalLink, HeartHandshake, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import HanaGameFrame from "@/components/HanaGameFrame";

const opportunities = [
  { title: "Hackathons", description: "Practice shipping a small idea with a team and create portfolio evidence.", url: "https://devpost.com/hackathons", why: "Good for learning by building." },
  { title: "Open-source contributions", description: "Find real repositories where documentation, tests, and beginner-friendly issues can become evidence.", url: "https://github.com/explore", why: "Good for visible engineering experience." },
  { title: "Scholarships & programs", description: "Research university, fellowship, mentorship, and student programs that match your interests.", url: "https://www.opportunitiesforafricans.com/", why: "Good for expanding your learning options." },
];

export default function Opportunities() {
  const [, navigate] = useLocation();
  return <HanaGameFrame title="Opportunities · Find your opening">
    <section className="grid gap-4 md:grid-cols-3">{opportunities.map(item=><article key={item.title} className="rounded-[28px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-6"><div className="flex items-center justify-between"><div className="rounded-2xl bg-[#f1c77b] p-3 text-[#172630]"><BriefcaseBusiness className="h-5 w-5"/></div><HeartHandshake className="h-5 w-5 text-[#db8b71]"/></div><h2 className="mt-5 font-display text-2xl font-semibold">{item.title}</h2><p className="mt-2 text-sm leading-6 text-white/55">{item.description}</p><div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-3 text-sm text-white/65"><strong className="text-white">Why explore it:</strong> {item.why}</div><a href={item.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#f1c77b]">Open opportunity source <ExternalLink className="h-4 w-4"/></a></article>)}</section>
    <section className="mt-5 rounded-[30px] border border-white/10 bg-white/[.055] p-6 shadow-xl backdrop-blur sm:p-7"><Sparkles className="h-5 w-5 text-[#f1c77b]"/><h2 className="mt-3 font-display text-2xl font-semibold">Fit before pressure.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">Hana can browse current opportunities and explain why each one fits your direction. No countdown badges or guilt-driven progress.</p><button onClick={()=>navigate(`/chat?prompt=${encodeURIComponent("Find current opportunities, scholarships, competitions, or programs relevant to my selected career path. Browse the web, explain why each is a good fit, and show only the strongest few.")}`)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f1c77b] px-5 py-3 font-bold text-[#172630]">Ask Hana to find opportunities <ArrowRight className="h-4 w-4"/></button></section>
  </HanaGameFrame>;
}
