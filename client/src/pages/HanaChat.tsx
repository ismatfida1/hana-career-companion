import { ArrowLeft, Bot, Calculator, Send, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getCareerPath } from "@/data/careerCatalog";

function localHanaAnswer(message: string, selectedPath: string | null) {
  const path = selectedPath ? getCareerPath(selectedPath as Parameters<typeof getCareerPath>[0]) : null;
  const text = message.toLowerCase();
  if (text.includes("calculate") || /\d+\s*[+\-*/%]\s*\d+/.test(text)) return "I can help with the setup even when the external computation service is unavailable. For a verified calculation, use the Wolfram option when the server has WOLFRAM_APP_ID configured. For now, send me the exact expression and I can explain the steps.";
  if (text.includes("ai engineering") || text.includes("ai engineer")) return "For AI engineering, start small: 1) Python + statistics, 2) machine learning fundamentals, 3) deep learning, 4) LLM APIs and evaluation, 5) build one useful AI product. Your first project could be a small document Q&A app. Ask me for resources or open Research to search the live web and YouTube.";
  if (text.includes("next") || text.includes("learn")) return path ? `For ${path.title}, your next useful step is: ${path.stages[0]?.title}. Focus on ${path.stages[0]?.skills.join(", ")}. Pick one resource, spend 20–30 minutes on it, then build a tiny example. You don't need to finish the whole roadmap today.` : "Choose a direction first. Then I'll help you turn it into one small next step rather than a huge checklist.";
  return path ? `I'm here in demo mode. You're exploring ${path.title}. Tell me what you're trying to learn or build and I'll break it into one manageable next step. You can also open Research for live web, YouTube, and university searches.` : "I'm here in demo mode. Tell me what you're trying to learn, which field interests you, or where you're stuck. I'll help you choose one clear next step.";
}

export default function HanaChat() {
  const [params] = useSearchParams();
  const initialPrompt = params.get("prompt");
  const selectedPath = typeof window !== "undefined" ? window.localStorage.getItem("hana-career-path") : null;
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([{ role: "assistant", content: "Hi, I'm Hana 🌿 Tell me what you're learning, what career you're exploring, or where you're stuck. I'll help you choose one clear next step." }]);
  const [input, setInput] = useState(initialPrompt ?? "");
  const chat = trpc.ai.chat.useMutation({
    onSuccess: data => setMessages(prev => [...prev, { role: "assistant", content: data.answer }]),
    onError: error => {
      console.warn("[Hana] API unavailable; using local demo coach", error);
      setMessages(prev => [...prev, { role: "assistant", content: localHanaAnswer(input, selectedPath) }]);
    },
  });
  const promptIdeas = useMemo(() => ["What should I learn next?", "Explain APIs simply", "Make me a beginner AI engineering plan", "Calculate 18% of 240"], []);
  const send = (text: string) => { const value = text.trim(); if (!value || chat.isPending) return; setMessages(prev => [...prev, { role: "user", content: value }]); setInput(""); chat.mutate({ message: value, memoryEnabled: true }); };
  return <main className="min-h-screen bg-[#FBF7F1] text-[#2d3c39]"><header className="sticky top-0 z-40 border-b border-[#eadfd3] bg-[#FBF7F1]/90 backdrop-blur-xl"><div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 md:px-8"><Link href="/" className="inline-flex items-center gap-2 rounded-full border border-[#dfd3c7] bg-white px-3 py-2 text-sm font-semibold"><ArrowLeft className="h-4 w-4"/> Back</Link><span className="font-display text-lg font-bold">HANA</span><span className="rounded-full bg-[#edf5f0] px-3 py-1.5 text-xs font-semibold text-[#4f806f]">{selectedPath ? "Personalized" : "Demo mode"}</span></div></header><div className="mx-auto max-w-5xl px-5 py-8 md:px-8"><div className="mb-5 flex items-center gap-3"><div className="rounded-2xl bg-[#315d58] p-3 text-white"><Bot className="h-5 w-5"/></div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#9b8e80]">Hana chat</p><h1 className="font-display text-3xl font-semibold">Ask anything. Take one useful step.</h1></div></div><section className="overflow-hidden rounded-[28px] border border-[#e7ddd2] bg-white shadow-sm"><div className="min-h-[520px] space-y-4 overflow-y-auto p-5 md:p-7">{messages.map((message,index)=><div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] whitespace-pre-wrap rounded-[22px] px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-[#315d58] text-white" : "bg-[#f5f0e9] text-[#514b45]"}`}>{message.content}</div></div>)}{chat.isPending && <div className="flex items-center gap-2 text-sm text-[#8e8175]"><Sparkles className="h-4 w-4 animate-pulse"/> Hana is thinking…</div>}</div><div className="border-t border-[#eee5da] bg-[#fffaf4] p-4"><div className="mb-3 flex flex-wrap gap-2">{promptIdeas.map(prompt=><button key={prompt} onClick={()=>setInput(prompt)} className="rounded-full border border-[#e3d8cc] bg-white px-3 py-1.5 text-xs font-semibold hover:bg-[#edf5f0]">{prompt}</button>)}</div><div className="flex items-end gap-3"><Textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send(input);}}} placeholder="Message Hana…" rows={2} className="resize-none rounded-2xl bg-white"/><Button onClick={()=>send(input)} disabled={!input.trim()||chat.isPending} className="h-11 w-11 shrink-0 rounded-2xl bg-[#315d58] p-0"><Send className="h-4 w-4"/></Button></div><div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#8f8175]"><Calculator className="h-3.5 w-3.5"/> Wolfram is used for computation when configured.<Link href="/research" className="font-semibold text-[#4f806f] underline">Research a field</Link></div></div></section></div></main>;
}
