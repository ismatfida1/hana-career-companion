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
    const history = Array.isArray(req.body?.history) ? req.body.history.filter((item: any) => (item?.role === "user" || item?.role === "model") && typeof item?.text === "string").slice(-8) : [];
    const system = "You are Hana, a warm, practical career companion. Give one useful next step, avoid scores and overwhelm, and keep recommendations beginner-friendly. If the learner asks for a full plan, explain the plan briefly but still highlight only the next action. Never claim live browsing unless the research endpoint supplied results.";
    try { return res.json({ answer: await generateFreeHanaReply(system, message, history), provider: "gemini-free" }); }
    catch (error) { console.warn("[Free Hana] fallback used", error); return res.json({ answer: localHana(message), provider: "local-demo" }); }
  });

  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  if (process.env.NODE_ENV === "development") await setupVite(app, server); else serveStatic(app);
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  server.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}
startServer().catch(console.error);
