import { ArrowLeft, Bot, Calculator, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getCareerPath } from "@/data/careerCatalog";

type Message = { role: "user" | "assistant"; content: string };

function localHanaAnswer(message: string, selectedPath: string | null) {
  const path = selectedPath ? getCareerPath(selectedPath as Parameters<typeof getCareerPath>[0]) : null;
  const text = message.toLowerCase();
  if (text.includes("ai engineering") || text.includes("ai engineer")) return "Let's make AI engineering concrete. Your next step is Python + ML foundations. Start with one short lesson, then build a tiny model or API example. After that, move into LLM APIs, RAG, evaluation, and AI product engineering. You do not need the whole mountain today.";
  if (text.includes("calculate") || /\d+\s*[+\-*/%]\s*\d+/.test(text)) return "For a verified calculation, use the Wolfram computation option when its App ID is configured. I can still explain the method step by step.";
  if (text.includes("next") || text.includes("learn")) return path ? `For ${path.title}, start with ${path.stages[0]?.title}. Focus on ${path.stages[0]?.skills.join(", ")}. Spend 20–30 minutes on one resource, then make a tiny example.` : "Choose a direction first. Then I'll narrow the journey to one useful next step.";
  return path ? `You're exploring ${path.title}. Tell me what you're learning or building and I'll help you choose one manageable next step.` : "I'm Hana 🌿 Tell me what you're learning, which field interests you, or where you're stuck. I'll help you choose one clear next step.";
}

export default function HanaChat() {
  const [params] = useSearchParams();
  const initialPrompt = params.get("prompt");
  const selectedPath = typeof window !== "undefined" ? window.localStorage.getItem("hana-career-path") : null;
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Hi, I'm Hana 🌿 Tell me what you're learning, what you're building, or where you're stuck. I'll help you take one useful next step." }]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const promptIdeas = useMemo(() => ["What should I learn next?", "Explain APIs simply", "Make me a beginner AI engineering plan", "Calculate 18% of 240"], []);

  const send = async (text: string) => {
    const value = text.trim();
    if (!value || pending) return;
    const nextMessages = [...messages, { role: "user" as const, content: value }];
    setMessages(nextMessages); setInput(""); setPending(true);
    try {
      const history = messages.slice(-8).map(message => ({ role: message.role === "assistant" ? "model" : "user", text: message.content }));
      const response = await fetch("/api/free-chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: value, history }) });
      const data = await response.json() as { answer?: string };
      if (!response.ok || !data.answer) throw new Error("chat unavailable");
      setMessages(prev => [...prev, { role: "assistant", content: data.answer! }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: localHanaAnswer(value, selectedPath) }]);
    } finally { setPending(false); }
  };

  useEffect(() => { if (initialPrompt) void send(initialPrompt); }, []);

  return <main className="min-h-screen bg-[#FBF7F1] text-[#2d3c39]"><header className="sticky top-0 z-40 border-b border-[#eadfd3] bg-[#FBF7F1]/90 backdrop-blur-xl"><div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 md:px-8"><Link href="/" className="inline-flex items-center gap-2 rounded-full border border-[#dfd3c7] bg-white px-3 py-2 text-sm font-semibold"><ArrowLeft className="h-4 w-4"/>Back</Link><span className="font-display text-lg font-bold">HANA</span><span className="rounded-full bg-[#edf5f0] px-3 py-1.5 text-xs font-semibold text-[#4f806f]">{selectedPath ? "Your path" : "Demo mode"}</span></div></header><div className="mx-auto max-w-5xl px-5 py-8 md:px-8"><div className="mb-5 flex items-center gap-3"><div className="rounded-2xl bg-[#315d58] p-3 text-white"><Bot className="h-5 w-5"/></div><div><p className="eyebrow">Hana chat</p><h1 className="display-title mt-1">Ask Hana. Take one useful step.</h1></div></div><section className="overflow-hidden rounded-[28px] border border-[#e7ddd2] bg-white shadow-sm"><div className="min-h-[520px] space-y-4 overflow-y-auto p-5 md:p-7">{messages.map((message,index)=><div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] whitespace-pre-wrap rounded-[22px] px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-[#315d58] text-white" : "bg-[#f5f0e9] text-[#514b45]"}`}>{message.content}</div></div>)}{pending && <div className="flex items-center gap-2 text-sm text-[#8e8175]"><Sparkles className="h-4 w-4 animate-pulse"/>Hana is thinking…</div>}</div><div className="border-t border-[#eee5da] bg-[#fffaf4] p-4"><div className="mb-3 flex flex-wrap gap-2">{promptIdeas.map(prompt=><button key={prompt} onClick={()=>void send(prompt)} disabled={pending} className="rounded-full border border-[#e3d8cc] bg-white px-3 py-1.5 text-xs font-semibold hover:bg-[#edf5f0] disabled:opacity-50">{prompt}</button>)}</div><div className="flex items-end gap-3"><Textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();void send(input);}}} placeholder="Message Hana…" rows={2} className="resize-none rounded-2xl bg-white"/><Button onClick={()=>void send(input)} disabled={!input.trim()||pending} className="h-11 w-11 shrink-0 rounded-2xl bg-[#315d58] p-0"><Send className="h-4 w-4"/></Button></div><div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#8f8175]"><Calculator className="h-3.5 w-3.5"/>Wolfram remains available for verified computation when configured.<Link href="/research" className="font-semibold text-[#4f806f] underline">Research a field</Link></div></div></section></div></main>;
}
