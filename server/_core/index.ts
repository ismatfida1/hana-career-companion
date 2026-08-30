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
import { ENV } from "./env";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => { const server = net.createServer(); server.listen(port, () => server.close(() => resolve(true))); server.on("error", () => resolve(false)); });
}
async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) if (await isPortAvailable(port)) return port;
  throw new Error(`No available port found starting from ${startPort}`);
}

const localHana = (message: string) => {
  const text = message.toLowerCase();
  if (text.includes("hello") || text.includes("hi") || text.includes("hey")) return "Hey! I'm Hana 🌿 What are you working on or curious about today?";
  if (text.includes("ai engineering") || text.includes("ai engineer")) return "AI engineering is about building useful software with AI models. A practical starting sequence is Python → APIs → model basics → retrieval/RAG → evaluation → AI-powered projects. If you tell me whether you're starting from zero or already coding, I can choose the single best first step.";
  if (text.includes("university") || text.includes("degree") || text.includes("college")) return "I can help compare degrees and universities based on your goals, but I'd want your target field and country before recommending specific options.";
  if (text.includes("project") || text.includes("build")) return "Let's make it concrete. Tell me what you want to build and what tools you already know; I'll suggest one project that is realistic for your current level.";
  if (text.includes("calculate") || /\d+\s*[+\-*/%]\s*\d+/.test(text)) return "I can explain the calculation step by step. If a precise computation is needed and Wolfram is configured, Hana can use that as a specialist tool.";
  if (text.includes("next") || text.includes("learn")) return "Let's keep this small: tell me the skill or field you're working on, and I'll pick one useful next action instead of giving you a giant checklist.";
  return `I understand you're asking about “${message.slice(0, 120)}”. I don't want to give you a canned answer. Tell me one detail about what you're trying to achieve, and I'll make the answer specific to you.`;
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
    const system = `You are Hana, a genuinely conversational AI career and learning companion. Answer the user's actual message first. Never reuse a canned answer merely because the topic is career-related. Adapt to the user's wording, intent, level, and previous messages. You may explain concepts, brainstorm, debug code, reason through decisions, review projects, create plans, compare options, and have normal conversation. If the user asks for current information, links, courses, universities, scholarships, opportunities, dates, news, or niche facts, research the web before answering and cite useful sources. If the user asks a simple conceptual question, answer directly without unnecessary browsing. Never claim to have searched unless you actually did. Keep answers clear and useful rather than robotic. Follow the principle 'hide the mountain, show the next step': when a plan is useful, give the structure but emphasize one immediate action. Avoid scores, guilt, countdowns, or giant checklists. The learner's selected career path is ${selectedPath || "not selected"}.`;

    if (ENV.openaiApiKey) {
      try {
        const result = await invokeOpenAIHana({
          systemPrompt: system,
          message,
          history: history.map((item: any) => ({ role: item.role === "model" ? "assistant" : item.role, content: item.text })),
          enableWebSearch: true,
          forceWebSearch: /\b(latest|current|today|recent|news|search|browse|look up|research|find|links?|sources?|courses?|youtube|universit(?:y|ies)|scholarships?|opportunit(?:y|ies)|2026)\b/i.test(message),
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
