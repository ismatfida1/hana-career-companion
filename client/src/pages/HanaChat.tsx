import { Bot, Calculator, ExternalLink, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import HanaGameFrame from "@/components/HanaGameFrame";
import { useHanaChat } from "@/hooks/useHanaChat";

type DisplayMessage = { role: "user" | "assistant"; content: string; sources?: { title: string; url: string }[] };
const initialMessage: DisplayMessage = { role: "assistant", content: "Hi, I'm Hana 🌿 What's on your mind? I can explain a concept, help with a project, plan your next step, or explore a career direction." };

export default function HanaChat() {
  const [params] = useSearchParams();
  const initialPrompt = params.get("prompt");
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading, memoryEnabled, setMemoryEnabled } = useHanaChat([initialMessage]);
  const promptIdeas = useMemo(() => ["What should I learn next?", "Explain APIs simply", "Help me with a project", "Which CS path fits me?"], []);

  useEffect(() => { if (initialPrompt) void sendMessage(initialPrompt).catch(() => undefined); }, [initialPrompt]);

  const send = async (text: string) => { const value = text.trim(); if (!value || isLoading) return; setInput(""); try { await sendMessage(value); } catch { /* hook adds a safe error message */ } };
  const clear = () => window.location.reload();

  return <HanaGameFrame title="Hana · Your AI companion">
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3"><div className="rounded-2xl bg-[#f1c77b] p-3 text-[#172630]"><Bot className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-white/40">Origin Village · Hana</p><h2 className="font-display text-3xl font-semibold">Ask Hana anything.</h2><p className="mt-1 text-xs text-white/35">Connected through the app's tRPC AI service.</p></div></div>
        <div className="flex items-center gap-2"><button onClick={() => setMemoryEnabled(!memoryEnabled)} className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/55">Memory {memoryEnabled ? "on" : "off"}</button><button onClick={clear} className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/55">Clear chat</button></div>
      </div>
      <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[.055] shadow-2xl backdrop-blur">
        <div className="min-h-[520px] max-h-[62vh] space-y-4 overflow-y-auto p-5 md:p-7">
          {messages.map((message, index) => <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[88%] rounded-[22px] px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-[#f1c77b] text-[#172630]" : "bg-[#132434] text-white/80"}`}><div className="whitespace-pre-wrap">{message.content}</div>{(message as DisplayMessage).sources?.length ? <div className="mt-3 border-t border-white/10 pt-2">{(message as DisplayMessage).sources!.slice(0,4).map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="mb-1 flex items-center gap-1 text-xs font-semibold text-[#f1c77b] underline"><ExternalLink className="h-3 w-3" />{source.title}</a>)}</div> : null}</div></div>)}
          {isLoading && <div className="flex items-center gap-2 text-sm text-white/45"><Sparkles className="h-4 w-4 animate-pulse text-[#f1c77b]" />Hana is thinking…</div>}
        </div>
        <div className="border-t border-white/10 bg-[#0d1925]/90 p-4">
          <div className="mb-3 flex flex-wrap gap-2">{promptIdeas.map(prompt => <button key={prompt} onClick={() => void send(prompt)} disabled={isLoading} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10 disabled:opacity-50">{prompt}</button>)}</div>
          <div className="flex items-end gap-3"><Textarea value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(input); } }} placeholder="Message Hana…" rows={2} className="resize-none rounded-2xl border-white/10 bg-white text-[#172630]" /><Button onClick={() => void send(input)} disabled={!input.trim() || isLoading} className="h-11 w-11 shrink-0 rounded-2xl bg-[#f1c77b] p-0 text-[#172630] hover:bg-[#f1c77b]">{isLoading ? <Sparkles className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}</Button></div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/35"><Calculator className="h-3.5 w-3.5" />Hana uses the connected AI provider when configured.<Link href="/research" className="font-semibold text-[#f1c77b] underline">Research a field</Link></div>
        </div>
      </section>
    </div>
  </HanaGameFrame>;
}
