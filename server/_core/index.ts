import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { searchField } from "./research";
import { generateFreeHanaReply } from "./freeLlm";
import { invokeOpenAIHana } from "./openai";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => { const server = net.createServer(); server.listen(port, () => server.close(() => resolve(true))); server.on("error", () => resolve(false)); });
}
async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) if (await isPortAvailable(port)) return port;
  throw new Error(`No available port found starting from ${startPort}`);
}

const localHana = (message: string) => {
  const text = message.toLowerCase();
  if (text.includes("ai engineering") || text.includes("ai engineer")) return "Let's make AI engineering concrete. Your next step is Python + ML foundations. Start with one short lesson, then build a tiny model or API example. After that, Hana can guide you into LLM APIs, RAG, evaluation, and AI product engineering. You do not need the whole roadmap today.";
  if (text.includes("calculate") || /\d+\s*[+\-*/%]\s*\d+/.test(text)) return "I can help explain the calculation step by step. For a verified computation, use the Wolfram option when its App ID is configured.";
  if (text.includes("next") || text.includes("learn")) return "Your next step should be small: choose one concept, spend about 20–30 minutes learning it, then make a tiny example. Ask me what concept to pick and I'll narrow it down.";
  return "I'm Hana. Tell me what you're exploring or building and I'll turn it into one clear next step—not a giant checklist.";
};

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.get("/api/research", async (req, res) => {
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (!query) return res.status(400).json({ error: "Missing q" });
    try { res.json({ query, results: await searchField(query.slice(0, 120)) }); }
    catch (error) { console.error("[Research] search failed", error); res.status(502).json({ error: "Research search is temporarily unavailable", results: [] }); }
  });

  app.post("/api/free-chat", async (req, res) => {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!message) return res.status(400).json({ error: "Missing message" });
    const rawHistory = Array.isArray(req.body?.history) ? req.body.history : [];
    const history = rawHistory.filter((item: any) => (item?.role === "user" || item?.role === "model" || item?.role === "assistant") && typeof item?.text === "string").slice(-10);
    const selectedPath = typeof req.body?.selectedPath === "string" ? req.body.selectedPath : "";
    const system = `You are Hana, a warm, intelligent career companion. Answer the user's actual question naturally and specifically. Do not repeat canned career advice when the question changes. You can explain concepts, brainstorm, debug code, compare choices, discuss university and career decisions, create learning plans, review projects, and help with practical problems. When current information, links, courses, universities, scholarships, opportunities, dates, news, or niche facts are requested, use web search and cite sources. Never pretend you searched when you did not. Keep the learner experience calm: avoid scores, guilt, countdowns, and giant checklists. If a full plan is requested, give the useful structure but clearly highlight only one next action. The learner's selected path is ${selectedPath || "not selected"}.`;

    if (ENV.openaiApiKey) {
      try {
        const result = await invokeOpenAIHana({
          systemPrompt: system,
          message,
          history: history.map((item: any) => ({ role: item.role === "model" ? "assistant" : item.role, content: item.text })),
          enableWebSearch: true,
        });
        return res.json({ answer: result.answer, sources: result.sources, provider: "openai", model: result.model });
      } catch (error) {
        console.warn("[OpenAI Hana] failed; trying Gemini", error instanceof Error ? error.message : error);
      }
    }

    if (ENV.geminiApiKey) {
      try {
        const answer = await generateFreeHanaReply(system, message, history.filter((item: any) => item.role === "user" || item.role === "model"));
        return res.json({ answer, sources: [], provider: "gemini" });
      } catch (error) {
        console.warn("[Gemini Hana] failed; using local fallback", error instanceof Error ? error.message : error);
      }
    }

    return res.json({ answer: localHana(message), sources: [], provider: "local-demo" });
  });

  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  if (process.env.NODE_ENV === "development") await setupVite(app, server); else serveStatic(app);
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  server.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}
startServer().catch(console.error);
