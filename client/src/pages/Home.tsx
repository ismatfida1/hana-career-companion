import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleHelp,
  Compass,
  Flame,
  GitBranch,
  Github,
  HeartHandshake,
  House,
  Info,
  Layers3,
  LockKeyhole,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Network,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Star,
  Target,
  Trophy,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useTheme } from "@/contexts/ThemeContext";

type View = "home" | "roadmap" | "mission" | "projects" | "opportunities" | "chat" | "profile" | "settings" | "onboarding";

type HanaMessage = { role: "hana" | "user"; text: string; actions?: string[] };

const navItems: { id: View; label: string; icon: typeof House }[] = [
  { id: "home", label: "Home", icon: House },
  { id: "roadmap", label: "Roadmap", icon: Compass },
  { id: "projects", label: "Projects", icon: Layers3 },
  { id: "opportunities", label: "Opportunities", icon: Trophy },
  { id: "chat", label: "Ask Hana", icon: MessageCircle },
];

const roadmapStages = [
  { number: "01", title: "Programming foundations", subtitle: "Build your base", state: "current", nodes: ["Python fundamentals", "Git & GitHub", "Problem solving"] },
  { number: "02", title: "Core computer science", subtitle: "Think like an engineer", state: "next", nodes: ["Data structures", "Algorithms", "Databases", "Networking"] },
  { number: "03", title: "Build for the web", subtitle: "Turn ideas into products", state: "locked", nodes: ["Frontend", "Backend", "REST APIs", "Authentication"] },
  { number: "04", title: "Professional engineering", subtitle: "Ship with confidence", state: "locked", nodes: ["Testing", "System design", "Deployment", "Cloud"] },
  { number: "05", title: "Career launch", subtitle: "Make your work visible", state: "locked", nodes: ["Portfolio", "Open source", "Interview prep"] },
];

type OpportunityCard = { id?: number; title: string; org: string; type: string; match: string; deadline: string; tags: string[]; tone: "coral" | "mint" | "lilac"; officialUrl?: string };

const demoOpportunities: OpportunityCard[] = [
  { title: "Build for Tomorrow", org: "Civic Tech Lab", type: "Online hackathon", match: "Strong fit", deadline: "12 days", tags: ["Beginner-friendly", "Online", "Python"], tone: "coral" },
  { title: "Open Source Springboard", org: "Code Commons", type: "Mentored program", match: "Good fit", deadline: "24 days", tags: ["GitHub", "Mentorship", "Remote"], tone: "mint" },
  { title: "Women in Computing Fellowship", org: "Northstar Foundation", type: "Fellowship", match: "Explore", deadline: "41 days", tags: ["Students", "Community", "Career"], tone: "lilac" },
];

const companionStates: Record<string, string> = {
  concept: "/manus-storage/hana-mission-concept_f48fe2c0.png",
  example: "/manus-storage/hana-mission-example_b1399bbd.png",
  "try-it": "/manus-storage/hana-mission-try_3d4722c1.png",
  feedback: "/manus-storage/hana-mission-feedback_6d89ab7b.png",
  "apply-it": "/manus-storage/hana-mission-apply_e5a97fa2.png",
  reflect: "/manus-storage/hana-mission-reflect_447ec078.png",
  default: "/manus-storage/hana-new-companion-concept_628f65ae.png",
};

function HanaAvatar({ mood = "encouraging", small = false }: { mood?: string; small?: boolean }) {
  const image = companionStates[mood] ?? companionStates.default;
  return (
    <div className={cn("hana-avatar relative shrink-0 overflow-hidden rounded-[34%] bg-[#142737] shadow-[0_12px_30px_rgba(49,91,108,0.2)]", `hana-avatar-${mood}`, small ? "h-12 w-12" : "h-20 w-20")} aria-label={`Hana is in the ${mood} learning state`}>
      <img src={image} alt="Hana, the fantasy learning companion" className="h-full w-full object-cover" />
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display-title mt-2 max-w-2xl">{title}</h1>
        <p className="body-copy mt-3 max-w-2xl">{description}</p>
      </div>
      {action}
    </div>
  );
}

function ProgressBar({ value, tone = "sage" }: { value: number; tone?: "sage" | "coral" | "lilac" }) {
  return <div className={cn("h-2 overflow-hidden rounded-full bg-[#eee8df]", tone === "coral" && "bg-[#f7e3db]", tone === "lilac" && "bg-[#ece6f4]")}><div className={cn("h-full rounded-full transition-all", tone === "sage" && "bg-[#6ca595]", tone === "coral" && "bg-[#e9917d]", tone === "lilac" && "bg-[#9d8cc2]")} style={{ width: `${value}%` }} /></div>;
}

function StuckDialog({ onClose, onNavigate }: { onClose: () => void; onNavigate: (view: View) => void }) {
  const blockers = ["I don’t understand the concept", "My code isn’t working", "I don’t know what to learn", "I don’t know how to start", "I’m losing motivation", "I need help with my project", "Something else"];
  const [selected, setSelected] = useState<string | null>(null);
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#2d3c39]/30 p-4 backdrop-blur-sm"><div className="surface-card w-full max-w-lg rounded-[28px] p-6 shadow-[0_25px_70px_rgba(49,44,35,.2)] md:p-8"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><HanaAvatar small mood="listening" /><div><p className="eyebrow">Hana is listening</p><h2 className="mt-2 font-display text-2xl font-semibold text-[#2d3c39]">What’s blocking you?</h2></div></div><button onClick={onClose} className="icon-button" aria-label="Close support dialog"><X className="h-4 w-4" /></button></div><p className="mt-5 text-sm leading-6 text-[#76695d]">Choose the closest match. You don’t need the perfect words for Hana to help.</p><div className="mt-6 grid gap-2">{blockers.map(blocker => <button key={blocker} onClick={() => setSelected(blocker)} className={cn("rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition", selected === blocker ? "border-[#8db8aa] bg-[#eef6f0] text-[#4f806f]" : "border-[#e7ddd2] bg-[#fffdf9] text-[#65736d] hover:border-[#cfe2d8]")}>{blocker}{selected === blocker && <Check className="float-right h-4 w-4" />}</button>)}</div><Button onClick={() => { onClose(); onNavigate("chat"); }} disabled={!selected} className="mt-6 w-full rounded-full bg-[#315d58] hover:bg-[#254c48]">Talk it through with Hana <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>;
}

function HomeView({ onNavigate, onMission }: { onNavigate: (view: View) => void; onMission: () => void }) {
  const [stuckOpen, setStuckOpen] = useState(false);
  const [missionState, setMissionState] = useState<"not-started" | "in-progress" | "completed">("not-started");
  return (
    <>
      <div className="hero-grid mb-7 overflow-hidden rounded-[28px] border border-[#eadfd3] bg-[#fffaf4] p-6 shadow-[0_18px_45px_rgba(85,67,52,0.06)] md:p-8">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <HanaAvatar mood="encouraging" />
            <div>
              <p className="eyebrow">Tuesday, October 15</p>
              <h1 className="display-title mt-1">Good evening, Alex.</h1>
              <p className="body-copy mt-2 max-w-md">You’ve been building a thoughtful rhythm. Hana saved your place in APIs for today.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-center">
            <button className="icon-button" aria-label="Notifications"><Bell className="h-4 w-4" /></button>
            <button className="icon-button" aria-label="More options"><MoreHorizontal className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="relative z-10 mt-7 flex flex-wrap items-center gap-3 text-sm text-[#76695d]">
          <span className="pill pill-sage"><Sparkles className="h-3.5 w-3.5" /> Hana is feeling encouraging</span>
          <span className="pill"><Flame className="h-3.5 w-3.5 text-[#dc866e]" /> 6 day rhythm</span>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="mission-card relative overflow-hidden rounded-[26px] p-6 text-white md:p-8">
          <div className="relative z-10 max-w-xl">
            <div className="flex items-center justify-between gap-4">
              <span className="mission-label"><Target className="h-3.5 w-3.5" /> Today’s mission</span>
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">{missionState === "not-started" ? "Not started" : missionState === "in-progress" ? "In progress" : "Mission complete"} · 20 min</span>
            </div>
            <h2 className="mt-8 max-w-md font-display text-3xl font-semibold tracking-[-0.04em] md:text-4xl">Understand how REST APIs help apps talk to each other.</h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/75">A focused next step for your weather app. You’ll learn the idea, try a request, and apply it in your project.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => { setMissionState("in-progress"); onMission(); }} className="rounded-full bg-[#fffaf4] px-5 text-[#315d58] hover:bg-white"><Play className="mr-2 h-4 w-4 fill-current" /> {missionState === "not-started" ? "Start mission" : missionState === "in-progress" ? "Continue mission" : "View progress"}</Button>
              <button onClick={() => onNavigate("roadmap")} className="rounded-full border border-white/25 px-5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10">View roadmap <ArrowRight className="ml-1 inline h-4 w-4" /></button>
            </div>
          </div>
          <div className="mission-orbit orbit-one" /><div className="mission-orbit orbit-two" /><div className="mission-spark spark-one">✦</div><div className="mission-spark spark-two">✦</div>
        </section>

        <section className="surface-card flex flex-col justify-between rounded-[26px] p-6 md:p-7">
          <div>
            <div className="flex items-center justify-between"><p className="eyebrow">Your next best step</p><Zap className="h-5 w-5 text-[#db8b71]" /></div>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-[-0.03em] text-[#2d3c39]">Build a tiny GET request.</h2>
            <p className="mt-3 text-sm leading-6 text-[#76695d]">You’re ready to connect your interface to live data. One small request is enough for today.</p>
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-[#eee4d8] pt-5"><span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a19589]">Because it unlocks your project</span><button onClick={onMission} className="rounded-full bg-[#eaf3ee] p-3 text-[#4f8c7b] transition hover:bg-[#dceee4]" aria-label="Start next step"><ArrowRight className="h-4 w-4" /></button></div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr_0.95fr]">
        <section className="surface-card rounded-[26px] p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Learning progress</p><h2 className="mt-2 font-display text-xl font-semibold text-[#2d3c39]">Your CS journey</h2></div><span className="rounded-full bg-[#fff1eb] px-3 py-1.5 text-xs font-bold text-[#c87764]">Level 7</span></div><div className="mt-6 space-y-4">{[["Python",72,"sage"],["DSA",41,"coral"],["Git & GitHub",65,"lilac"],["Web development",34,"sage"]].map(([label,value,tone]) => <div key={label as string}><div className="mb-2 flex justify-between text-sm"><span className="font-medium text-[#4e5f5a]">{label as string}</span><span className="text-xs font-semibold text-[#9d9287]">{value as number}% learned</span></div><ProgressBar value={value as number} tone={tone as "sage" | "coral" | "lilac"} /></div>)}</div></section>

        <section className="surface-card rounded-[26px] p-6"><div className="flex items-start justify-between"><div><p className="eyebrow">A gentle rhythm</p><h2 className="mt-2 font-display text-xl font-semibold text-[#2d3c39]">You’ve shown up 6 days.</h2></div><div className="rounded-2xl bg-[#fff0e9] p-3 text-[#db856d]"><Flame className="h-5 w-5" /></div></div><p className="mt-4 text-sm leading-6 text-[#76695d]">Consistency is a tool, not a test. If yesterday got busy, Hana will help you continue without starting over.</p><div className="mt-6 flex items-center gap-2">{[1,1,1,1,1,1,0].map((active,index) => <div key={index} className={cn("flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold", active ? "bg-[#e8f1ea] text-[#5a987f]" : "bg-[#f6f0e9] text-[#b8aa9c]")}>{active ? <Check className="h-4 w-4" /> : "—"}</div>)}</div><p className="mt-4 text-xs font-semibold text-[#a09283]">6 active days · no guilt, just your next step</p></section>

        <section className="support-card rounded-[26px] p-6 text-white"><div className="flex items-center justify-between"><div className="rounded-2xl bg-white/15 p-3"><HeartHandshake className="h-5 w-5" /></div><span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/65">Always here</span></div><h2 className="mt-7 font-display text-2xl font-semibold tracking-[-0.03em]">I’m stuck</h2><p className="mt-3 text-sm leading-6 text-white/75">Tell Hana what’s blocking you. She’ll meet you there and find a smaller next step.</p><Button onClick={() => setStuckOpen(true)} className="mt-7 w-full rounded-full bg-white text-[#765b62] hover:bg-[#fff8f4]">Talk it through <ArrowRight className="ml-2 h-4 w-4" /></Button></section>
      </div>

      <section className="mt-5 surface-card rounded-[26px] p-6 md:p-7"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="eyebrow">Keep the loop moving</p><h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[#2d3c39]">Small actions become career evidence.</h2><p className="mt-2 text-sm text-[#76695d]">Choose the kind of support you need right now.</p></div><div className="flex flex-wrap gap-2">{[["Continue learning",BookOpen,"mission"],["Work on project",Layers3,"projects"],["Find opportunity",Trophy,"opportunities"],["Ask Hana",MessageCircle,"chat"]].map(([label,Icon,target]) => <button key={label as string} onClick={() => onNavigate(target as View)} className="quick-action"><Icon className="h-4 w-4 text-[#6ca595]" />{label as string}<ChevronRight className="ml-auto h-4 w-4 text-[#b6a99d]" /></button>)}</div></div>      </section>
      {stuckOpen && <StuckDialog onClose={() => setStuckOpen(false)} onNavigate={onNavigate} />}
    </>
  );
}

function RoadmapView({ onMission }: { onMission: () => void }) {
  const [selectedNode, setSelectedNode] = useState("REST APIs");
  const { data: profile } = trpc.learner.profile.useQuery();
  const { data: learnerMissions } = trpc.learner.missions.useQuery();
  const currentMission = learnerMissions?.find(mission => mission.state !== "completed") ?? learnerMissions?.[0];
  const goal = profile?.careerGoal || "software engineering";
  const activeNode = currentMission?.title || selectedNode;
  const personalizedStages = roadmapStages.map((stage, index) => index === 0 ? { ...stage, subtitle: `Start here for ${goal}`, nodes: [currentMission?.title || "Python fundamentals", "Git & GitHub", "Problem solving"] } : index === 2 && goal.toLowerCase().includes("ai") ? { ...stage, title: "Build for intelligent products", subtitle: "Turn data into useful tools", nodes: ["Python for data", "APIs", "Model basics", "Evaluation"] } : stage);
  return <>
    <PageHeader eyebrow="Your direction" title="A roadmap that moves with you." description={`A staged path toward ${goal}, adapted around what you already know and what your projects need next.`} action={<Button onClick={onMission} className="rounded-full bg-[#315d58] hover:bg-[#254c48]"><Play className="mr-2 h-4 w-4 fill-current" /> Continue mission</Button>} />
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <div className="space-y-4">{personalizedStages.map(stage => <section key={stage.number} className={cn("surface-card rounded-[24px] p-5 md:p-6", stage.state === "current" && "border-[#c8dfd4] bg-[#f7fbf7]")}><div className="flex items-start gap-4"><div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-display font-bold", stage.state === "current" ? "bg-[#315d58] text-white" : stage.state === "next" ? "bg-[#f6ebe5] text-[#c27a67]" : "bg-[#f2ede7] text-[#b7aa9d]")}>{stage.number}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-display text-xl font-semibold text-[#2d3c39]">{stage.title}</h2><p className="mt-1 text-sm text-[#8a7d70]">{stage.subtitle}</p></div><span className={cn("rounded-full px-3 py-1.5 text-xs font-bold", stage.state === "current" ? "bg-[#e4f0e8] text-[#5b937d]" : stage.state === "next" ? "bg-[#fff0e8] text-[#c27b68]" : "bg-[#f5f0eb] text-[#ac9f91]")}>{stage.state === "current" ? "In focus" : stage.state === "next" ? "Next up" : "Locked"}</span></div><div className="mt-5 flex flex-wrap gap-2">{stage.nodes.map(node => <button key={node} onClick={() => setSelectedNode(node)} className={cn("roadmap-node", (selectedNode === node || activeNode === node) && stage.state !== "locked" && "roadmap-node-active", stage.state === "locked" && "cursor-not-allowed opacity-55")}><span className={cn("mr-2 inline-block h-2 w-2 rounded-full", stage.state === "current" ? "bg-[#6ca595]" : stage.state === "next" ? "bg-[#e9917d]" : "bg-[#c5bbb0]")} />{node}{stage.state === "locked" && <LockKeyhole className="ml-2 h-3.5 w-3.5" />}</button>)}</div></div></div></section>)}</div>
      <aside className="surface-card h-fit rounded-[24px] p-6 xl:sticky xl:top-7"><div className="flex items-center justify-between"><p className="eyebrow">Selected node</p><button className="icon-button h-8 w-8"><MoreHorizontal className="h-4 w-4" /></button></div><h2 className="mt-3 font-display text-2xl font-semibold text-[#2d3c39]">{activeNode}</h2><div className="mt-3 flex items-center gap-2 text-sm text-[#6ca595]"><span className="h-2.5 w-2.5 rounded-full bg-[#6ca595]" />{currentMission?.state === "in-progress" ? "In progress" : "Current focus"} · 20 minutes</div><div className="my-6 h-px bg-[#eee4d8]" /><p className="text-sm font-semibold text-[#4d5e59]">You’ll learn</p><ul className="mt-3 space-y-3 text-sm text-[#76695d]">{["What an API is", "HTTP requests and responses", "Methods and status codes", "How REST architecture fits together"].map(item => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6ca595]" />{item}</li>)}</ul><div className="mt-6 rounded-2xl bg-[#fff6ee] p-4"><div className="flex items-start gap-2"><Info className="mt-0.5 h-4 w-4 text-[#db8b71]" /><p className="text-xs leading-5 text-[#806b5f]">Hana recommends this as your next step because it fits your {profile?.experienceLevel || "beginner"} level and moves you toward {goal} without asking you to plan everything at once.</p></div></div><Button onClick={onMission} className="mt-6 w-full rounded-full bg-[#315d58] hover:bg-[#254c48]">Open learning path <ArrowRight className="ml-2 h-4 w-4" /></Button></aside>
    </div>
  </>;
}

function MissionView({ onBack }: { onBack: () => void }) {
  const missionPreviewStep = Number(new URLSearchParams(window.location.search).get("step"));
  const [step, setStep] = useState(() => Number.isFinite(missionPreviewStep) ? Math.min(5, Math.max(0, missionPreviewStep)) : 0);
  const { data: learnerMissions } = trpc.learner.missions.useQuery();
  const updateMission = trpc.learner.updateMission.useMutation();
  const activeMissionId = learnerMissions?.[0]?.id;
  const moveToStep = (nextStep: number) => {
    const boundedStep = Math.min(nextStep, 5);
    setStep(boundedStep);
    if (activeMissionId) updateMission.mutate({ missionId: activeMissionId, progress: boundedStep === 5 ? 100 : Math.round((boundedStep / 5) * 100), currentStep: ["Concept", "Example", "Try it", "Feedback", "Apply it", "Reflect"][boundedStep], state: boundedStep === 5 ? "completed" : "in-progress" });
  };
  const [answer, setAnswer] = useState<string | null>(null);
  const explanationStyles = ["Simple", "Example", "Visual explanation", "Step-by-step", "Technical", "Interview style"];
  const [explanationStyle, setExplanationStyle] = useState("Simple");
  const steps = ["Concept", "Example", "Try it", "Feedback", "Apply it", "Reflect"];
  const content = [
    { title: "What is an API?", body: "An API is a set of rules that lets one piece of software ask another piece of software for something. Your weather app can ask a weather service for today’s forecast without knowing how that service stores its data.", prompt: "Think of it like a restaurant: your app is the diner, the API is the waiter, and the service is the kitchen." },
    { title: "See the conversation", body: "When your app makes a GET request, it sends a clear question. The service sends back a response, often as JSON your interface can use.", prompt: "GET /forecast?city=Lisbon → { temperature: 22, condition: 'sunny' }" },
    { title: "Try it", body: "Which request would you use to retrieve today’s weather without changing anything on the server?", prompt: "Choose one answer to continue.", choices: ["GET", "POST", "DELETE"] },
    { title: answer === "GET" ? "Exactly." : "Let’s untangle it.", body: answer === "GET" ? "GET is used to retrieve information. You connected the idea to the action your project needs next." : "For reading information, GET is the usual starting point. You can try the question again before moving on.", prompt: answer === "GET" ? "Ready to apply it to your weather app?" : "Which method retrieves information?" },
    { title: "Apply it", body: "In your project, create one small request that asks a weather API for a city. You don’t need styling yet—just make the request and inspect the response.", prompt: "Mini task · 10 minutes · evidence: a visible JSON response", choices: ["I’ll do this", "Show me an example"] },
    { title: "Reflect", body: "Could you explain what happens when your weather app sends a GET request? Use your own words—even a rough answer helps Hana see what clicked.", prompt: "Your reflection is private to your learning record.", choices: ["I can explain it", "I need a simpler explanation"] },
  ];
  const current = content[step];
  return <div className="mx-auto max-w-5xl"><button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#7b6d61] transition hover:text-[#315d58]"><ArrowRight className="h-4 w-4 rotate-180" /> Back to Home</button><div className="mission-shell rounded-[30px] border border-[#eadfd3] bg-[#fffaf4] p-5 shadow-[0_18px_45px_rgba(85,67,52,0.06)] md:p-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">Today’s mission · REST APIs</p><h1 className="display-title mt-2">Learn by doing.</h1></div><div className="rounded-full bg-[#e8f1ea] px-4 py-2 text-xs font-bold text-[#5d947f]">{step + 1} of {steps.length}</div></div><div className="mt-8 grid grid-cols-3 gap-1.5 md:grid-cols-6">{steps.map((label,index) => <button key={label} onClick={() => moveToStep(index)} className={cn("rounded-xl px-2 py-3 text-center text-[10px] font-bold uppercase tracking-[0.1em] transition md:text-xs", index === step ? "bg-[#315d58] text-white" : index < step ? "bg-[#e2efe7] text-[#57907c]" : "bg-[#f4ede6] text-[#b5a89a]")}>{index < step ? <Check className="mx-auto mb-1 h-3.5 w-3.5" /> : <span className="mb-1 block">0{index + 1}</span>}{label}</button>)}</div><div className="mt-10 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start"><div className="flex flex-col items-center text-center lg:items-start lg:text-left"><HanaAvatar mood={["concept", "example", "try-it", "feedback", "apply-it", "reflect"][step]} /><span className="mt-4 pill pill-sage">{step === 0 ? "A clear place to start" : step === 5 ? "You’re doing the thinking" : "Hana is with you"}</span><p className="mt-4 max-w-xs text-sm leading-6 text-[#76695d]">No rush. The goal is not to get everything right—it’s to make the next idea a little clearer.</p></div><div className="rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(80,61,43,0.05)] md:p-8"><p className="eyebrow">{steps[step]}</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-[#2d3c39]">{current.title}</h2><p className="mt-5 text-[15px] leading-7 text-[#5f6e69]">{current.body}</p><div className="mt-6 rounded-2xl bg-[#eff6f0] p-5 text-sm leading-6 text-[#4e7569]"><Sparkles className="mb-2 h-4 w-4 text-[#6ca595]" />{current.prompt}</div>{current.choices && <div className="mt-6 grid gap-3">{current.choices.map(choice => <button key={choice} onClick={() => { setAnswer(choice); if (step === 2 && choice === "GET") moveToStep(3); }} className={cn("flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition", answer === choice ? "border-[#6ca595] bg-[#eff6f0] text-[#4d806f]" : "border-[#eee4d8] bg-[#fffdf9] text-[#5b6964] hover:border-[#c9ddd3] hover:bg-[#f9fcf9]")}>{choice}<ChevronRight className="h-4 w-4 text-[#b4a79b]" /></button>)}</div>}<div className="mt-8 flex flex-wrap gap-3"><Button onClick={() => moveToStep(step + 1)} className="rounded-full bg-[#315d58] px-5 hover:bg-[#254c48]">{step === steps.length - 1 ? "Complete reflection" : "Continue"}<ArrowRight className="ml-2 h-4 w-4" /></Button><button onClick={() => setExplanationStyle(explanationStyles[(explanationStyles.indexOf(explanationStyle) + 1) % explanationStyles.length])} className="rounded-full border border-[#e7ddd2] px-5 py-2 text-sm font-semibold text-[#76695d] hover:bg-[#faf5ef]">Explain differently · {explanationStyle}</button></div></div></div></div></div>;
}

function ProjectsView({ onChat }: { onChat: () => void }) {
  const { data: projectRecords, isLoading: projectsLoading } = trpc.learner.projects.useQuery();
  const demoProjects = [{ title: "Weather app", desc: "Connect a friendly interface to live weather data.", progress: 42, skills: ["JavaScript", "APIs", "Git"], next: "Make your first GET request", tone: "coral" }, { title: "Study assistant", desc: "A small tool that turns notes into practice questions.", progress: 18, skills: ["Python", "AI", "UX"], next: "Sketch the conversation flow", tone: "mint" }];
  const projects = projectRecords && projectRecords.length > 0 ? projectRecords.map((project, index) => ({ title: project.title, desc: project.description || "A learner-owned project that turns practice into visible evidence.", progress: project.progress, skills: project.skills ? project.skills.split(",").map(skill => skill.trim()).filter(Boolean) : ["Practice", "Evidence"], next: project.currentCheckpoint || "Choose one small checkpoint", tone: index % 2 === 0 ? "coral" : "mint" })) : demoProjects;
  return <><PageHeader eyebrow="Proof of learning" title="Build work you can point to." description="Projects turn new concepts into visible evidence. Hana helps you choose a manageable next checkpoint and keeps the story honest." action={<Button className="rounded-full bg-[#315d58] hover:bg-[#254c48]"><Plus className="mr-2 h-4 w-4" /> New project</Button>} /><div className="mb-5 grid gap-4 md:grid-cols-3"><div className="surface-card rounded-[22px] p-5"><p className="eyebrow">In progress</p><p className="mt-3 font-display text-3xl font-semibold text-[#2d3c39]">{projects.filter(project => project.progress < 100).length}</p><p className="mt-1 text-sm text-[#8a7d70]">projects with a next step</p></div><div className="surface-card rounded-[22px] p-5"><p className="eyebrow">Evidence captured</p><p className="mt-3 font-display text-3xl font-semibold text-[#2d3c39]">{projects.reduce((total, project) => total + (project.progress > 0 ? 1 : 0), 0)}</p><p className="mt-1 text-sm text-[#8a7d70]">projects with evidence started</p></div><div className="surface-card rounded-[22px] p-5"><p className="eyebrow">Portfolio pieces</p><p className="mt-3 font-display text-3xl font-semibold text-[#2d3c39]">{projects.filter(project => project.progress >= 70).length}</p><p className="mt-1 text-sm text-[#8a7d70]">ready for your review</p></div></div><div className="grid gap-5 lg:grid-cols-2">{projects.map(project => <section key={project.title} className="surface-card rounded-[26px] p-6 md:p-7"><div className="flex items-start justify-between gap-4"><div><span className={cn("pill", project.tone === "coral" ? "pill-coral" : "pill-sage")}>{project.progress}% built</span><h2 className="mt-4 font-display text-2xl font-semibold text-[#2d3c39]">{project.title}</h2><p className="mt-2 text-sm leading-6 text-[#76695d]">{project.desc}</p></div><button className="icon-button"><MoreHorizontal className="h-4 w-4" /></button></div><div className="mt-6"><div className="mb-2 flex justify-between text-xs font-semibold text-[#a09283]"><span>Checkpoint progress</span><span>{project.progress}%</span></div><ProgressBar value={project.progress} tone={project.tone === "coral" ? "coral" : "sage"} /></div><div className="mt-6 flex flex-wrap gap-2">{project.skills.map(skill => <span key={skill} className="tag">{skill}</span>)}</div><div className="mt-6 rounded-2xl bg-[#fff7ee] p-4"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#b58d74]">Next checkpoint</p><p className="mt-2 text-sm font-semibold text-[#66594e]">{project.next}</p></div><div className="mt-6 flex flex-wrap gap-2"><Button className="rounded-full bg-[#315d58] hover:bg-[#254c48]">Continue building <ArrowRight className="ml-2 h-4 w-4" /></Button><button onClick={onChat} className="rounded-full border border-[#e7ddd2] px-4 py-2 text-sm font-semibold text-[#76695d]">Ask Hana</button></div></section>)}</div>{projectsLoading && <p className="mt-4 text-xs font-semibold text-[#a09283]">Loading your saved project checkpoints…</p>}<section className="mt-5 rounded-[26px] border border-dashed border-[#dbcfc1] bg-[#fcf8f2] p-6"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex items-start gap-4"><div className="rounded-2xl bg-[#e7f1ea] p-3 text-[#60967e]"><Sparkles className="h-5 w-5" /></div><div><p className="eyebrow">Recommended for your roadmap</p><h2 className="mt-2 font-display text-xl font-semibold text-[#2d3c39]">Build a CLI habit tracker</h2><p className="mt-1 text-sm text-[#76695d]">Practice Python, file persistence, and clean README writing.</p></div></div><button className="rounded-full border border-[#d9cdbf] px-4 py-2 text-sm font-semibold text-[#6b7a73] hover:bg-white">Preview idea <ArrowRight className="ml-1 inline h-4 w-4" /></button></div></section></>;
}

function OpportunitiesView() {
  const [saved, setSaved] = useState<string[]>([]);
  const saveOpportunity = trpc.learner.saveOpportunity.useMutation();
  const { data: opportunityRecords, isLoading: opportunitiesLoading } = trpc.opportunities.list.useQuery();
  const liveOpportunities: OpportunityCard[] = (opportunityRecords ?? []).map((item, index) => ({
    id: item.id,
    title: item.title,
    org: item.organization,
    type: item.category,
    match: index === 0 ? "Strong fit" : index === 1 ? "Good fit" : "Explore",
    deadline: item.deadline ? `${Math.max(0, Math.ceil((new Date(item.deadline).getTime() - Date.now()) / 86400000))} days` : "Open",
    tags: [item.location || "Online", item.category],
    tone: (index % 3 === 0 ? "coral" : index % 3 === 1 ? "mint" : "lilac") as OpportunityCard["tone"],
    officialUrl: item.officialUrl,
  }));
  const opportunityItems = liveOpportunities.length > 0 ? liveOpportunities : demoOpportunities;
  return <><PageHeader eyebrow="Find your next room to grow" title="Opportunities with a reason." description="A smaller, more considered set of programs and competitions matched to what you’re learning and building." action={<div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aa9d90]" /><input className="h-10 rounded-full border border-[#e7ddd2] bg-white pl-9 pr-4 text-sm outline-none focus:border-[#8db8aa]" placeholder="Search opportunities" /></div>} /><div className="mb-6 flex flex-wrap gap-2"><span className="filter-chip filter-chip-active">Recommended</span><span className="filter-chip">Hackathons</span><span className="filter-chip">Internships</span><span className="filter-chip">Open source</span><span className="filter-chip">Online only</span></div><div className="grid gap-5">{opportunityItems.map(item => <section key={item.title} className="surface-card rounded-[26px] p-6 md:p-7"><div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between"><div className="flex items-start gap-4"><div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", item.tone === "coral" ? "bg-[#fff0e9] text-[#d9856e]" : item.tone === "mint" ? "bg-[#e7f1ea] text-[#60967e]" : "bg-[#eee8f5] text-[#9887bf]")}><Trophy className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#a09283]">{item.type} · {item.org}</p><h2 className="mt-2 font-display text-2xl font-semibold text-[#2d3c39]">{item.title}</h2><div className="mt-3 flex flex-wrap gap-2">{item.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div></div></div><div className="flex items-center gap-3 md:flex-col md:items-end"><span className="rounded-full bg-[#e8f1ea] px-3 py-1.5 text-xs font-bold text-[#5d947f]">{item.match}</span><span className="flex items-center gap-1.5 text-xs font-semibold text-[#c77d68]"><Bell className="h-3.5 w-3.5" /> Closes in {item.deadline}</span></div></div><div className="mt-6 grid gap-4 rounded-2xl bg-[#fcf8f2] p-4 md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#a58d7c]">Why Hana surfaced this</p><p className="mt-2 text-sm leading-6 text-[#76695d]">It fits your current level, supports online participation, and gives you a place to use the Python and Git skills you’re actively practicing.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => { const nextSaved = !saved.includes(item.title); setSaved(current => nextSaved ? [...current, item.title] : current.filter(x => x !== item.title)); if (item.id && nextSaved) saveOpportunity.mutate({ opportunityId: item.id, status: "saved" }); }} className={cn("rounded-full border px-4 py-2 text-sm font-semibold transition", saved.includes(item.title) ? "border-[#a6c9ba] bg-[#e8f1ea] text-[#5d947f]" : "border-[#e7ddd2] text-[#76695d] hover:bg-white")} disabled={saveOpportunity.isPending}>{saved.includes(item.title) ? <><Check className="mr-1 inline h-4 w-4" /> Saved</> : <><Star className="mr-1 inline h-4 w-4" /> Save</>}</button>{"officialUrl" in item && item.officialUrl ? <a href={item.officialUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[#315d58] px-4 py-2 text-sm font-semibold text-white hover:bg-[#254c48]">Official source <ArrowRight className="ml-1 inline h-4 w-4" /></a> : <button className="rounded-full bg-[#315d58] px-4 py-2 text-sm font-semibold text-white hover:bg-[#254c48]">View details <ArrowRight className="ml-1 inline h-4 w-4" /></button>}</div></div></section>)}</div>{opportunitiesLoading && <p className="mt-4 text-xs font-semibold text-[#a09283]">Checking the latest saved opportunity sources…</p>}<section className="mt-5 surface-card rounded-[26px] p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Your application tracker</p><h2 className="mt-2 font-display text-xl font-semibold text-[#2d3c39]">Turn saved ideas into movement.</h2></div><button className="text-sm font-bold text-[#5d947f]">Open tracker <ArrowRight className="ml-1 inline h-4 w-4" /></button></div><div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">{[["Saved",saved.length || 2],["Planning",1],["Applied",0],["Outcome",0]].map(([label,value]) => <div key={label as string} className="rounded-2xl bg-[#fcf8f2] p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#a09283]">{label as string}</p><p className="mt-2 font-display text-2xl font-semibold text-[#2d3c39]">{value as number}</p></div>)}</div></section></>;
}

function ChatView() {
  const [input, setInput] = useState("");
  const [memory, setMemory] = useState(true);
  const [showMemory, setShowMemory] = useState(false);
  const [conversationId, setConversationId] = useState<number | undefined>();
  const [savedMemory, setSavedMemory] = useState(["You are working toward software engineering.", "Recursion felt difficult last week.", "You prefer examples before theory.", "Your weather app is the active project."]);
  const [messages, setMessages] = useState<HanaMessage[]>([{ role: "hana", text: "I’m here. What would feel most useful right now? We can make a concept simpler, untangle a project, plan your week, or talk through what’s feeling heavy.", actions: ["Explain REST APIs simply", "Help with my weather app", "I’m overwhelmed"] }]);
  const chatMutation = trpc.ai.chat.useMutation();
  const send = async (text: string) => {
    const clean = text.trim();
    if (!clean || chatMutation.isPending) return;
    setMessages(prev => [...prev, { role: "user", text: clean }]);
    setInput("");
    try {
      const result = await chatMutation.mutateAsync({ message: clean, conversationId, memoryEnabled: memory });
      if (result.conversationId) setConversationId(result.conversationId);
      setMessages(prev => [...prev, { role: "hana", text: result.answer, actions: ["Make that simpler", "Give me an example", "Choose a smaller next step"] }]);
    } catch {
      setMessages(prev => [...prev, { role: "hana", text: "I couldn’t reach Hana just now. Your message is still here—please try again in a moment." }]);
    }
  };
  return <><PageHeader eyebrow="Your thinking partner" title="Ask Hana anything." description="Hana keeps the thread between what you’re learning, what you’re building, and what you want next." action={<div className="pill pill-sage"><Network className="h-3.5 w-3.5" /> Context on · roadmap + projects</div>} /><div className="grid gap-5 xl:grid-cols-[1fr_300px]"><section className="surface-card flex min-h-[610px] flex-col rounded-[26px] p-5 md:p-7"><div className="flex items-center gap-3 border-b border-[#eee4d8] pb-5"><HanaAvatar small mood="listening" /><div><p className="font-semibold text-[#2d3c39]">Hana</p><p className="text-xs text-[#8e8175]">Your CS career companion · remembers only what you allow</p></div><span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-[#6ca595]"><span className={cn("h-2 w-2 rounded-full", chatMutation.isPending ? "animate-pulse bg-[#d99172]" : "bg-[#6ca595]")} /> {chatMutation.isPending ? "Thinking" : "Ready"}</span></div><div className="flex-1 space-y-5 overflow-auto py-6">{messages.map((message,index) => <div key={index} className={cn("flex gap-3", message.role === "user" && "justify-end")}><div className={cn("max-w-[85%] rounded-[20px] px-4 py-3 text-sm leading-6", message.role === "user" ? "bg-[#315d58] text-white" : "bg-[#f6f0e9] text-[#5e6d67]")}>{message.text}{message.actions && <div className="mt-4 flex flex-wrap gap-2">{message.actions.map(action => <button key={action} onClick={() => send(action)} className="rounded-full border border-[#d7cfc4] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#55766b] hover:bg-white">{action}</button>)}</div>}</div></div>)}</div><div className="rounded-[20px] border border-[#e8ded3] bg-[#fffdf9] p-2"><Textarea value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(input); } }} placeholder="Tell Hana what’s on your mind…" className="min-h-[62px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0" /><div className="flex items-center justify-between px-2 pb-1"><span className="text-xs text-[#a29589]">Enter to send · Shift + Enter for a new line</span><button onClick={() => send(input)} className="rounded-full bg-[#315d58] p-2.5 text-white hover:bg-[#254c48]" aria-label="Send message"><Send className="h-4 w-4" /></button></div></div></section><aside className="space-y-5"><section className="surface-card rounded-[24px] p-5"><div className="flex items-center justify-between"><div><p className="eyebrow">Memory controls</p><h2 className="mt-2 font-display text-xl font-semibold text-[#2d3c39]">You’re in control.</h2></div><Settings className="h-5 w-5 text-[#9f9185]" /></div><p className="mt-3 text-sm leading-6 text-[#76695d]">Hana can use helpful context, but you decide what stays remembered.</p><div className="mt-5 flex items-center justify-between rounded-2xl bg-[#f8f3ed] p-3"><span className="text-sm font-semibold text-[#5f6d67]">Use saved memory</span><button onClick={() => setMemory(!memory)} className={cn("relative h-6 w-11 rounded-full transition", memory ? "bg-[#6ca595]" : "bg-[#cfc5b9]")} aria-pressed={memory}><span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition", memory ? "right-1" : "left-1")} /></button></div><button onClick={() => setShowMemory(true)} className="mt-4 w-full rounded-full border border-[#e7ddd2] px-4 py-2.5 text-sm font-semibold text-[#76695d] hover:bg-[#fffdf9]">Inspect saved memory <ChevronRight className="ml-1 inline h-4 w-4" /></button><button onClick={() => setSavedMemory([])} className="mt-2 w-full rounded-full px-4 py-2.5 text-sm font-semibold text-[#c97867] hover:bg-[#fff3ed]">Delete all memory</button></section><section className="surface-card rounded-[24px] p-5"><p className="eyebrow">Hana knows</p><div className="mt-4 space-y-3">{[["Your goal","Software engineer"],["Current focus","REST APIs"],["Active project","Weather app"],["Learning style","Examples first"]].map(([label,value]) => <div key={label} className="flex items-center justify-between gap-4 text-sm"><span className="text-[#9a8d80]">{label}</span><span className="text-right font-semibold text-[#566760]">{value}</span></div>)}</div></section></aside></div>{showMemory && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#2d3c39]/30 p-4 backdrop-blur-sm"><div className="surface-card w-full max-w-md rounded-[26px] p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Saved memory</p><h2 className="mt-2 font-display text-2xl font-semibold text-[#2d3c39]">What Hana can remember.</h2></div><button onClick={() => setShowMemory(false)} className="icon-button"><X className="h-4 w-4" /></button></div>{savedMemory.length ? <div className="mt-5 space-y-2">{savedMemory.map(item => <div key={item} className="rounded-2xl bg-[#fcf8f2] p-3 text-sm text-[#63716b]">{item}</div>)}</div> : <div className="mt-5 rounded-2xl bg-[#eef6f0] p-4 text-sm leading-6 text-[#55766b]">Hana has no saved memories. You can keep chatting without a stored context.</div>}<button onClick={() => setShowMemory(false)} className="mt-6 w-full rounded-full bg-[#315d58] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#254c48]">Done</button></div></div>}</>;
}

function ProfileView({ onSettings }: { onSettings: () => void }) {
  return <><PageHeader eyebrow="Evidence over assumptions" title="Your career profile." description="A living snapshot of what you’ve practiced, built, and demonstrated so far—without pretending a single number can define your ability." action={<Button onClick={onSettings} className="rounded-full border border-[#e7ddd2] bg-white text-[#5d6e68] hover:bg-[#faf6f0]"><Settings className="mr-2 h-4 w-4" /> Edit profile</Button>} /><div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]"><section className="surface-card rounded-[26px] p-6 md:p-7"><div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#fff0e9] font-display text-2xl font-semibold text-[#c77865]">A</div><div><p className="eyebrow">Current goal</p><h2 className="mt-1 font-display text-2xl font-semibold text-[#2d3c39]">Software engineer</h2><p className="mt-1 text-sm text-[#8a7d70]">Beginner → building confidence</p></div></div><div className="mt-7 rounded-2xl bg-[#eff6f0] p-4"><div className="flex items-start gap-3"><Sparkles className="mt-0.5 h-4 w-4 text-[#6ca595]" /><p className="text-sm leading-6 text-[#55766b]">Your strongest evidence right now is your willingness to turn concepts into small working experiments.</p></div></div><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[#fcf8f2] p-4"><p className="eyebrow">Projects</p><p className="mt-2 font-display text-2xl font-semibold text-[#2d3c39]">2</p></div><div className="rounded-2xl bg-[#fcf8f2] p-4"><p className="eyebrow">Opportunities</p><p className="mt-2 font-display text-2xl font-semibold text-[#2d3c39]">2 saved</p></div></div></section><section className="surface-card rounded-[26px] p-6 md:p-7"><div className="flex items-center justify-between"><div><p className="eyebrow">Demonstrated skills</p><h2 className="mt-2 font-display text-2xl font-semibold text-[#2d3c39]">What your work shows.</h2></div><button className="text-sm font-bold text-[#5d947f]">View evidence <ArrowRight className="ml-1 inline h-4 w-4" /></button></div><div className="mt-6 space-y-4">{[["Python","Practiced in 3 missions","Strong foundation","sage"],["Git & GitHub","Used in your weather app","Building confidence","lilac"],["APIs","Current mission + project","Developing","coral"],["Documentation","README draft reviewed","Early evidence","sage"]].map(([skill,evidence,level,tone]) => <div key={skill} className="rounded-2xl border border-[#eee4d8] p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-[#4f605a]">{skill}</p><p className="mt-1 text-xs text-[#9a8d80]">{evidence}</p></div><span className={cn("rounded-full px-3 py-1 text-xs font-bold", tone === "sage" ? "bg-[#e8f1ea] text-[#5d947f]" : tone === "coral" ? "bg-[#fff0e9] text-[#c77865]" : "bg-[#eee8f5] text-[#9380bb]")}>{level}</span></div></div>)}</div></section></div><section className="mt-5 surface-card rounded-[26px] p-6 md:p-7"><div className="flex items-center justify-between"><div><p className="eyebrow">Meaningful achievements</p><h2 className="mt-2 font-display text-2xl font-semibold text-[#2d3c39]">Milestones worth keeping.</h2></div><Award className="h-6 w-6 text-[#d79172]" /></div><div className="mt-6 grid gap-3 md:grid-cols-3">{[["First GitHub repository","Evidence confirmed","Git & GitHub"],["First API project","In progress","APIs"],["First portfolio draft","Ready for review","Documentation"]].map(([title,status,tag]) => <div key={title} className="rounded-2xl bg-[#fcf8f2] p-4"><div className="flex items-center gap-2 text-[#6ca595]"><Trophy className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-[0.12em]">{status}</span></div><h3 className="mt-4 font-semibold text-[#4d5e59]">{title}</h3><p className="mt-2 text-xs text-[#9a8d80]">{tag}</p></div>)}</div></section></>;
}

function SettingsView() {
  const [memory, setMemory] = useState(true);
  const [notifications, setNotifications] = useState(true);
  return <><PageHeader eyebrow="Your space, your rules" title="Settings & privacy." description="Choose how Hana supports you, what she remembers, and when she checks in." /><div className="grid gap-5 lg:grid-cols-2"><section className="surface-card rounded-[26px] p-6 md:p-7"><div className="flex items-center gap-3"><div className="rounded-2xl bg-[#e8f1ea] p-3 text-[#60967e]"><UserRound className="h-5 w-5" /></div><div><p className="eyebrow">Profile</p><h2 className="mt-1 font-display text-2xl font-semibold text-[#2d3c39]">About you</h2></div></div><div className="mt-6 space-y-4"><label className="field-label">Name<input className="field-input" value="Alex Morgan" readOnly /></label><label className="field-label">Career goal<input className="field-input" value="Software engineer" readOnly /></label><label className="field-label">Daily availability<select className="field-input" defaultValue="30 minutes"><option>15 minutes</option><option>30 minutes</option><option>1 hour</option><option>2+ hours</option></select></label></div></section><section className="surface-card rounded-[26px] p-6 md:p-7"><div className="flex items-center gap-3"><div className="rounded-2xl bg-[#fff0e9] p-3 text-[#d9856e]"><Bell className="h-5 w-5" /></div><div><p className="eyebrow">Gentle nudges</p><h2 className="mt-1 font-display text-2xl font-semibold text-[#2d3c39]">Notifications</h2></div></div><div className="mt-6 space-y-4"><div className="setting-row"><div><p className="font-semibold text-[#53635d]">Helpful check-ins</p><p className="mt-1 text-xs leading-5 text-[#978a7e]">New missions, saved opportunity deadlines, and meaningful milestones.</p></div><button onClick={() => setNotifications(!notifications)} className={cn("relative h-6 w-11 shrink-0 rounded-full transition", notifications ? "bg-[#6ca595]" : "bg-[#cfc5b9]")}><span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition", notifications ? "right-1" : "left-1")} /></button></div><div className="setting-row"><div><p className="font-semibold text-[#53635d]">Opportunity deadlines</p><p className="mt-1 text-xs leading-5 text-[#978a7e]">Only for opportunities you choose to save.</p></div><span className="rounded-full bg-[#f4efe8] px-3 py-1 text-xs font-bold text-[#9c8e81]">Optional</span></div></div></section><section className="surface-card rounded-[26px] p-6 md:p-7"><div className="flex items-center gap-3"><div className="rounded-2xl bg-[#eee8f5] p-3 text-[#9785ba]"><LockKeyhole className="h-5 w-5" /></div><div><p className="eyebrow">Memory</p><h2 className="mt-1 font-display text-2xl font-semibold text-[#2d3c39]">Keep Hana contextual.</h2></div></div><p className="mt-4 text-sm leading-6 text-[#76695d]">Saved memory helps Hana revisit a struggle or connect a mission to your project. You can inspect and delete it at any time.</p><div className="mt-6 setting-row"><div><p className="font-semibold text-[#53635d]">Use saved memory</p><p className="mt-1 text-xs text-[#978a7e]">Currently using 4 learner-approved memories.</p></div><button onClick={() => setMemory(!memory)} className={cn("relative h-6 w-11 shrink-0 rounded-full transition", memory ? "bg-[#6ca595]" : "bg-[#cfc5b9]")}><span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition", memory ? "right-1" : "left-1")} /></button></div><button className="mt-5 w-full rounded-full border border-[#e7ddd2] px-4 py-2.5 text-sm font-semibold text-[#76695d] hover:bg-[#fffdf9]">Inspect saved memory</button><button className="mt-2 w-full rounded-full px-4 py-2.5 text-sm font-semibold text-[#c97867] hover:bg-[#fff3ed]">Delete all memory</button></section><section className="surface-card rounded-[26px] p-6 md:p-7"><div className="flex items-center gap-3"><div className="rounded-2xl bg-[#f5ede4] p-3 text-[#ad8d73]"><Github className="h-5 w-5" /></div><div><p className="eyebrow">Connected accounts</p><h2 className="mt-1 font-display text-2xl font-semibold text-[#2d3c39]">Bring your evidence.</h2></div></div><p className="mt-4 text-sm leading-6 text-[#76695d]">Connect GitHub when you’re ready. You remain in control of which repositories Hana can review.</p><button className="mt-6 w-full rounded-full bg-[#315d58] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#254c48]">Connect GitHub <ArrowRight className="ml-1 inline h-4 w-4" /></button></section></div></>;
}

function OnboardingView({ onComplete }: { onComplete: () => void }) {
  const saveProfile = trpc.learner.saveProfile.useMutation();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("Software engineer");
  const [time, setTime] = useState("30 minutes");
  const [experience, setExperience] = useState("Beginner");
  const [style, setStyle] = useState("Examples first");
  const [interests, setInterests] = useState("Products that help people");
  const prompts = [
    { eyebrow: "Start with direction", title: "What do you want to become?", copy: "Hana will use this to shape your first learning path.", options: ["Software engineer", "AI engineer", "Data scientist", "Something else"] },
    { eyebrow: "Make it realistic", title: "How much time can you give each day?", copy: "There is no right answer. Hana will keep missions small enough to fit your life.", options: ["15 minutes", "30 minutes", "1 hour", "2+ hours"] },
    { eyebrow: "Meet yourself where you are", title: "How much do you already know?", copy: "This changes the starting point, not your potential.", options: ["New", "Beginner", "Intermediate", "Advanced"] },
    { eyebrow: "Make it click", title: "How do you like to learn?", copy: "You can change this anytime in Settings.", options: ["Examples first", "Step by step", "Visual explanations", "Interview style"] },
    { eyebrow: "Add a little spark", title: "What are you curious about?", copy: "Hana will use your interests to make projects and examples feel more relevant.", options: ["Products that help people", "AI and creative tools", "Data and discovery", "Games and interactive worlds"] },
  ];
  const current = prompts[step];
  const selected = step === 0 ? goal : step === 1 ? time : step === 2 ? experience : step === 3 ? style : interests;
  const setSelected = (value: string) => { if (step === 0) setGoal(value); else if (step === 1) setTime(value); else if (step === 2) setExperience(value); else if (step === 3) setStyle(value); else setInterests(value); };
  const finishOnboarding = () => { const dailyMinutes = time.startsWith("15") ? 15 : time.startsWith("30") ? 30 : time.startsWith("1") ? 60 : 120; saveProfile.mutate({ careerGoal: goal, experienceLevel: experience, dailyMinutes, interests, learningStyle: style, memoryEnabled: true }); onComplete(); };
  return <div className="mx-auto max-w-4xl"><button onClick={onComplete} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#7b6d61] hover:text-[#315d58]"><ArrowRight className="h-4 w-4 rotate-180" /> Back to Hana</button><div className="surface-card overflow-hidden rounded-[30px] p-6 md:p-10"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><HanaAvatar small mood="excited" /><div><p className="font-display text-xl font-semibold text-[#315d58]">Let’s make your starting point.</p><p className="text-xs text-[#9a8d80]">Hana · a few thoughtful questions</p></div></div><span className="rounded-full bg-[#e8f1ea] px-3 py-1.5 text-xs font-bold text-[#5d947f]">{step + 1} / {prompts.length}</span></div><div className="mt-8 h-1.5 overflow-hidden rounded-full bg-[#f0e9e1]"><div className="h-full rounded-full bg-[#6ca595] transition-all" style={{ width: `${((step + 1) / prompts.length) * 100}%` }} /></div><div className="mx-auto mt-12 max-w-2xl text-center"><p className="eyebrow">{current.eyebrow}</p><h1 className="display-title mt-3">{current.title}</h1><p className="body-copy mx-auto mt-4 max-w-lg">{current.copy}</p><div className="mt-9 grid gap-3 text-left sm:grid-cols-2">{current.options.map(option => <button key={option} onClick={() => setSelected(option)} className={cn("rounded-2xl border px-5 py-4 text-sm font-semibold transition", selected === option ? "border-[#8db8aa] bg-[#eef6f0] text-[#4f806f]" : "border-[#e7ddd2] bg-[#fffdf9] text-[#65736d] hover:border-[#cfe2d8] hover:bg-[#fcf8f2]")}>{option}{selected === option && <Check className="float-right h-4 w-4" />}</button>)}</div><div className="mt-9 flex justify-center"><Button onClick={() => step < prompts.length - 1 ? setStep(step + 1) : finishOnboarding()} className="rounded-full bg-[#315d58] px-6 hover:bg-[#254c48]">{step < prompts.length - 1 ? "Continue" : "Create my roadmap"}<ArrowRight className="ml-2 h-4 w-4" /></Button></div></div></div></div>;
}

function GameEntryView({ onEnter }: { onEnter: (view: View) => void }) {
  const { theme, toggleTheme } = useTheme();
  const [selected, setSelected] = useState("start");
  const [transitioning, setTransitioning] = useState(false);
  const previewParams = new URLSearchParams(window.location.search);
  const [showMenu, setShowMenu] = useState(() => previewParams.get("menu") === "1");
  const isDark = previewParams.get("theme") === "dark" || theme === "dark";
  const openMenu = () => {
    setTransitioning(true);
    window.setTimeout(() => {
      setShowMenu(true);
      setTransitioning(false);
    }, 420);
  };
  const selectMenu = (view: View | "options") => {
    setSelected(view);
    if (view === "options") {
      toggleTheme?.();
      return;
    }
    onEnter(view);
  };

  return (
    <div className={cn("game-entry game-entry-approved", isDark ? "game-entry-dark" : "game-entry-bright", showMenu && "game-entry-menu", transitioning && "game-entry-transitioning")}>
      <div className="game-sky-glow" />
      <div className="game-constellation constellation-one" />
      <div className="game-constellation constellation-two" />
      <div className="game-mist mist-one" />
      <div className="game-mist mist-two" />
      <div className="game-particles" aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => <span key={index} className={cn("game-particle", `game-particle-${index + 1}`)}>✦</span>)}
      </div>
      <div className="game-world-art" aria-hidden="true">
        <div className="game-floating-island island-one" />
        <div className="game-floating-island island-two" />
        <div className="game-academy" />
        <div className="game-tree"><span /><span /><span /></div>
        <div className="game-path path-one" />
        <div className="game-path path-two" />
      </div>
      <div className="game-entry-vignette" />

      <div className="game-entry-copy">
        <div className="game-brand-lockup"><span className="game-brand-star">✦</span><span>HANA</span><span className="game-brand-star">✦</span></div>
        <p className="game-kicker">A personal computer science adventure</p>
      </div>

      <div className="game-companion-stage">
        <div className="game-portal" aria-hidden="true"><span /><span /><span /></div>
        <div className="game-companion-glow" aria-hidden="true" />
        <img className="game-companion" src="/manus-storage/hana-new-companion-concept_628f65ae.png" alt="Hana, your fantasy learning companion" />
        <p className="game-companion-caption">A world that meets you where you are.</p>
      </div>

      {!showMenu ? (
        <div className="game-title-block">
          <p className="game-title-eyebrow">Welcome, adventurer</p>
          <h1>HANA</h1>
          <p className="game-title-subtitle">YOUR CS ADVENTURE</p>
          <p className="game-title-description">Learn one small thing. Build something real. Find your next step.</p>
          <div className="game-entry-actions">
            <button type="button" className={cn("game-action-button game-action-primary", selected === "start" && "game-action-selected")} onClick={openMenu} onFocus={() => setSelected("start")} onMouseEnter={() => setSelected("start")}>
              <span>✦</span> START JOURNEY <span>✦</span>
            </button>
            <button type="button" className={cn("game-action-secondary", selected === "options" && "game-action-secondary-selected")} onClick={() => selectMenu("options")} onFocus={() => setSelected("options")} onMouseEnter={() => setSelected("options")}>
              <span className="game-action-orb" /> OPTIONS <span className="game-theme-note">{isDark ? "Dark realm" : "Bright realm"}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="game-menu-panel" aria-label="Hana main menu">
          <p className="game-title-eyebrow">Your next chapter</p>
          <h1>HANA</h1>
          <p className="game-title-subtitle">YOUR CS ADVENTURE</p>
          <div className="game-menu-list" role="menu">
            {[
              ["roadmap", "✦", "ROADMAP", "Your journey through Computer Science"],
              ["projects", "⚒", "PROJECTS", "Build something you can be proud of"],
              ["opportunities", "✧", "OPPORTUNITIES", "Find a quest worth pursuing"],
              ["chat", "◈", "CHAT WITH HANA", "A calm place to ask anything"],
              ["options", "⚙", "OPTIONS", `Switch to the ${isDark ? "bright" : "dark"} realm`],
            ].map(([id, icon, label, description]) => (
              <button key={id} type="button" role="menuitem" className={cn("game-menu-item", selected === id && "game-menu-item-selected")} onClick={() => selectMenu(id as View | "options")} onFocus={() => setSelected(id)} onMouseEnter={() => setSelected(id)}>
                <span className="game-menu-icon">{icon}</span>
                <span className="game-menu-label">{label}</span>
                <span className="game-menu-description">{description}</span>
                <span className="game-menu-arrow">→</span>
              </button>
            ))}
          </div>
          <button type="button" className="game-back-link" onClick={() => setShowMenu(false)}>← Return to title</button>
        </div>
      )}

      <div className="game-entry-footer"><span>HANA // YOUR CS ADVENTURE</span><span>{isDark ? "Night mode" : "Daybreak mode"}</span></div>
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [mobileNav, setMobileNav] = useState(false);
  const [entryComplete, setEntryComplete] = useState(() => window.sessionStorage.getItem("hana-entry-complete") === "true");
  const routeParam = new URLSearchParams(window.location.search).get("view");
  const path = (routeParam ?? window.location.pathname.replace("/", "")) as View;
  const knownViews: View[] = ["home", "roadmap", "mission", "projects", "opportunities", "chat", "profile", "settings", "onboarding"];
  const [activeView, setActiveView] = useState<View>(knownViews.includes(path) ? path : "home");
  const navigate = (view: View) => { setActiveView(view); setMobileNav(false); setLocation(view === "home" ? "/" : `/${view}`); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const displayName = user?.name?.split(" ")[0] || "Alex";
  const enterFromMenu = (view: View) => {
    setEntryComplete(true);
    window.sessionStorage.setItem("hana-entry-complete", "true");
    navigate(view);
  };
  if (!entryComplete && activeView === "home") {
    return <GameEntryView onEnter={enterFromMenu} />;
  }
  const renderView = () => { switch (activeView) { case "roadmap": return <RoadmapView onMission={() => navigate("mission")} />; case "mission": return <MissionView onBack={() => navigate("home")} />; case "projects": return <ProjectsView onChat={() => navigate("chat")} />; case "opportunities": return <OpportunitiesView />; case "chat": return <ChatView />; case "profile": return <ProfileView onSettings={() => navigate("settings")} />; case "settings": return <SettingsView />; case "onboarding": return <OnboardingView onComplete={() => navigate("home")} />; default: return <HomeView onNavigate={navigate} onMission={() => navigate("mission")} />; } };
  return <div className="min-h-screen bg-[#f6f1ea] text-[#2d3c39]"><div className="app-shell"><aside className={cn("app-sidebar", mobileNav ? "app-sidebar-open" : "")}><div className="flex items-center justify-between px-5 py-6"><button onClick={() => navigate("home")} className="flex items-center gap-3 text-left"><span className="brand-mark"><Sparkles className="h-4 w-4" /></span><span><span className="block font-display text-xl font-semibold tracking-[-0.05em] text-[#315d58]">hana</span><span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#a09283]">career companion</span></span></button><button onClick={() => setMobileNav(false)} className="icon-button md:hidden" aria-label="Close menu"><X className="h-4 w-4" /></button></div><div className="px-3 py-3"><p className="sidebar-label">Your workspace</p><nav className="mt-3 space-y-1">{navItems.map(item => <button key={item.id} onClick={() => navigate(item.id)} className={cn("sidebar-item", activeView === item.id && "sidebar-item-active")}><item.icon className="h-[18px] w-[18px]" />{item.label}{item.id === "chat" && <span className="ml-auto h-2 w-2 rounded-full bg-[#e9917d]" />}</button>)}</nav></div><div className="mt-5 px-3"><p className="sidebar-label">Your progress</p><div className="mt-3 rounded-2xl bg-[#eef5ef] p-4"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.1em] text-[#6d9487]">Level 7</span><span className="text-xs font-semibold text-[#7a968b]">78%</span></div><ProgressBar value={78} /><p className="mt-3 text-xs leading-5 text-[#6c847a]">You’re building a steady foundation.</p></div></div><div className="mt-auto px-3 pb-4"><button onClick={() => navigate("profile")} className={cn("sidebar-item", activeView === "profile" && "sidebar-item-active")}><UserRound className="h-[18px] w-[18px]" />Career profile</button><button onClick={() => navigate("settings")} className={cn("sidebar-item", activeView === "settings" && "sidebar-item-active")}><Settings className="h-[18px] w-[18px]" />Settings</button><div className="mt-4 flex items-center gap-3 border-t border-[#e8ded3] px-3 pt-4"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffd4c5] text-sm font-bold text-[#87564e]">{displayName.slice(0,1)}</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-[#52635c]">{user?.name || "Alex Morgan"}</p><p className="text-xs text-[#a09283]">Learning thoughtfully</p></div></div></div></aside><div className="app-main"><header className="app-header"><div className="flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="icon-button md:hidden" aria-label="Open menu"><Menu className="h-4 w-4" /></button><div className="hidden items-center gap-2 text-sm text-[#9b8e81] md:flex"><span>Tuesday</span><span className="h-1 w-1 rounded-full bg-[#cbbcaf]" /><span>October 15, 2024</span></div></div><div className="flex items-center gap-2"><button className="header-link hidden sm:inline-flex" onClick={() => navigate("chat")}><CircleHelp className="h-4 w-4" /> Need help?</button>{user ? <button className="avatar-button">{displayName.slice(0,1)}</button> : <button onClick={() => startLogin()} className="rounded-full bg-[#315d58] px-4 py-2 text-xs font-bold text-white hover:bg-[#254c48]">Sign in</button>}</div></header><main className="app-content">{renderView()}</main><footer className="app-footer"><span>Hana is here for your next step.</span><span className="hidden sm:inline">Built around learning, evidence, and care.</span></footer></div></div></div>;
}
