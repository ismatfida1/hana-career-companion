import { ArrowLeft, Bot, Calculator, MessageCircle, Send, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function HanaChat() {
  const [params] = useSearchParams();
  const initialPrompt = params.get("prompt");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hi, I'm Hana 🌿 Tell me what you're learning, what career you're exploring, or where you're stuck. I'll help you choose one clear next step." },
  ]);
  const [input, setInput] = useState(initialPrompt ? decodeURIComponent(initialPrompt) : "");
  const chat = trpc.ai.chat.useMutation({
    onSuccess: (data, variables) => {
      setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    },
    onError: () => setMessages(prev => [...prev, { role: "assistant", content: "I can't reach the AI service right now. You can still use the roadmap, projects, and research tools while the service is unavailable." }]),
  });

  const selectedPath = typeof window !== "undefined" ? window.localStorage.getItem("hana-career-path") : null;
  const promptIdeas = useMemo(() => [
    "What should I learn next?",
    "Explain APIs simply",
    "Make me a beginner AI engineering plan",
    "Calculate 18% of 240",
  ], []);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || chat.isPending) return;
    setMessages(prev => [...prev, { role: "user", content: value }]);
    setInput("");
    chat.mutate({ message: value, memoryEnabled: true });
  };

  return <main className="min-h-screen bg-[#FBF7F1] text-[#2d3c39]"><header className="sticky top-0 z-40 border-b border-[#eadfd3] bg-[#FBF7F1]/90 backdrop-blur-xl"><div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 md:px-8"><Link href="/journey" className="inline-flex items-center gap-2 rounded-full border border-[#dfd3c7] bg-white px-3 py-2 text-sm font-semibold"><ArrowLeft className="h-4 w-4"/> Back to adventure</Link><span className="font-display text-lg font-bold">HANA</span><span className="rounded-full bg-[#edf5f0] px-3 py-1.5 text-xs font-semibold text-[#4f806f]">{selectedPath ? "Personalized" : "Demo mode"}</span></div></header>
    <div className="mx-auto max-w-5xl px-5 py-8 md:px-8"><div className="mb-5 flex items-center gap-3"><div className="rounded-2xl bg-[#315d58] p-3 text-white"><Bot className="h-5 w-5"/></div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#9b8e80]">Hana chat</p><h1 className="font-display text-3xl font-semibold">Ask anything. Take one useful step.</h1></div></div>
      <section className="overflow-hidden rounded-[28px] border border-[#e7ddd2] bg-white shadow-sm"><div className="min-h-[520px] space-y-4 overflow-y-auto p-5 md:p-7">{messages.map((message,index)=><div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-[22px] px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-[#315d58] text-white" : "bg-[#f5f0e9] text-[#514b45]"}`}>{message.content}</div></div>)}{chat.isPending && <div className="flex items-center gap-2 text-sm text-[#8e8175]"><Sparkles className="h-4 w-4 animate-pulse"/> Hana is thinking…</div>}</div>
        <div className="border-t border-[#eee5da] bg-[#fffaf4] p-4"><div className="mb-3 flex flex-wrap gap-2">{promptIdeas.map(prompt => <button key={prompt} onClick={() => setInput(prompt)} className="rounded-full border border-[#e3d8cc] bg-white px-3 py-1.5 text-xs font-semibold hover:bg-[#edf5f0]">{prompt}</button>)}</div><div className="flex items-end gap-3"><Textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key === "Enter" && !e.shiftKey){ e.preventDefault(); send(input); } }} placeholder="Message Hana…" rows={2} className="resize-none rounded-2xl bg-white"/><Button onClick={()=>send(input)} disabled={!input.trim() || chat.isPending} className="h-11 w-11 shrink-0 rounded-2xl bg-[#315d58] p-0"><Send className="h-4 w-4"/></Button></div><div className="mt-3 flex items-center gap-2 text-xs text-[#8f8175]"><Calculator className="h-3.5 w-3.5"/> Ask a calculation and Hana can use Wolfram|Alpha when configured.</div></div></section></div></main>;
}
