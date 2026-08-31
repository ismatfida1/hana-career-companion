import { env } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { searchField } from "../server/_core/research";
import { generateFreeHanaReply } from "../server/_core/freeLlm";
import { invokeOpenAIHana } from "../server/_core/openai";
import { ENV } from "../server/_core/env";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Same-origin requests normally do not need CORS. These headers also make the
// API safe to call from a configured frontend origin if Cloudflare is proxied.
app.use("/api", (req, res, next) => {
  const origin = req.headers.origin;
  const allowed = origin && /^https:\/\/(.+\.)?hana-career-companion\.(com|pages\.dev|workers\.dev)$/i.test(origin)
    ? origin
    : undefined;
  if (allowed) {
    res.setHeader("Access-Control-Allow-Origin", allowed);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "hana-api", runtime: "cloudflare-workers" }));

app.get("/api/research", async (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (!query) return res.status(400).json({ error: "Missing q" });
  try { res.json({ query, results: await searchField(query.slice(0, 120)) }); }
  catch (error) { console.error("[Research]", error); res.status(502).json({ error: "Research temporarily unavailable", results: [] }); }
});

app.post("/api/free-chat", async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) return res.status(400).json({ error: "Missing message" });
  const history = Array.isArray(req.body?.history)
    ? req.body.history.filter((item: any) => ["user", "model", "assistant"].includes(item?.role) && typeof item?.text === "string").slice(-10)
    : [];
  const memory = typeof req.body?.memory === "string" ? req.body.memory.slice(0, 4000) : "";
  const system = `You are Hana, a conversational AI career and learning companion. Answer the user's actual message first. Adapt to their level and previous messages. For current information, links, universities, opportunities, dates, or niche facts, research before answering and never invent having searched. Recent memory: ${memory || "none"}.`;

  try {
    if (ENV.openaiApiKey) {
      const result = await invokeOpenAIHana({ systemPrompt: system, message, history: history.map((item: any) => ({ role: item.role === "model" ? "assistant" : item.role, content: item.text })), enableWebSearch: true });
      return res.json({ answer: result.answer, sources: result.sources, provider: "openai", model: result.model });
    }
    if (ENV.geminiApiKey) {
      const answer = await generateFreeHanaReply(system, message, history.filter((item: any) => item.role === "user" || item.role === "model"));
      return res.json({ answer, sources: [], provider: "gemini" });
    }
    return res.json({ answer: `I understand you're asking about “${message.slice(0, 120)}”. Hana's AI key is not configured on this deployment yet.`, sources: [], provider: "configuration-fallback" });
  } catch (error) {
    console.error("[Hana chat]", error);
    return res.status(502).json({ error: "Hana AI is temporarily unavailable" });
  }
});

app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));

// Cloudflare's Node compatibility layer adapts Express to the Workers fetch runtime.
app.listen(3000);
export default httpServerHandler({ port: 3000 });
