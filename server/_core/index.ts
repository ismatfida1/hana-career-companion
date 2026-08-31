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

function isPortAvailable(port: number): Promise<boolean> { return new Promise(resolve => { const server = net.createServer(); server.listen(port, () => server.close(() => resolve(true))); server.on("error", () => resolve(false)); }); }
async function findAvailablePort(startPort: number = 3000): Promise<number> { for (let port = startPort; port < startPort + 20; port++) if (await isPortAvailable(port)) return port; throw new Error(`No available port found starting from ${startPort}`); }

const localHana = (message: string) => {
  const text = message.toLowerCase();
  if (/\b(hello|hi|hey|good morning|good evening)\b/.test(text)) return "Hey! I'm Hana 🌿 What are you working on or curious about today?";
  if (/\b(stuck|confused|don't understand|dont understand)\b/.test(text)) return "You're not stuck forever — let's shrink the problem. Tell me the exact step, error, or concept that is blocking you and I'll work through it with you one piece at a time.";
  if (/\b(api|http|rest|endpoint)\b/.test(text)) return "Think of an API as a contract between programs: the client sends a request, the server validates it and performs work, then returns a response. For a practical quest, build one small GET endpoint, test it, then add validation and error handling.";
  if (/\b(git|github|commit|repository)\b/.test(text)) return "For Git, learn the loop: status → add → commit → pull/push. Then practice branches and pull requests. A good first quest is to make one small change in a branch, review the diff, and merge it safely.";
  if (/\b(web|html|css|javascript|typescript|react)\b/.test(text)) return "Build the smallest useful page first. Start with semantic HTML, add CSS layout, then JavaScript/TypeScript behavior. If React is involved, turn one working interaction into a component only after the plain behavior makes sense.";
  if (/\b(database|sql|mongodb|redis)\b/.test(text)) return "Start with the data model before the UI: identify entities, relationships, constraints, and the queries the feature needs. Then build one read path and one write path, test them, and add indexes only when you understand the access pattern.";
  if (/\b(ai|machine learning|llm|agent|prompt)\b/.test(text)) return "AI engineering is about building useful software around models. A practical sequence is Python → APIs → model basics → prompting → retrieval/evaluation → one real project. Tell me your current level and I'll choose the next step.";
  if (/\b(cyber|security)\b/.test(text)) return "For cybersecurity, start defensively: networking, operating-system basics, authentication, common web vulnerabilities, secure coding, and logging. Build only in legal practice environments and focus on understanding how to prevent and detect problems.";
  if (/\b(university|degree|college|curriculum)\b/.test(text)) return "I can compare a university curriculum with your Hana roadmap. If the official curriculum is accessible, I'll use it as the source; if not, paste or upload the curriculum and I'll compare it without changing your roadmap automatically.";
  if (/\b(project|build)\b/.test(text)) return "Let's make it concrete. Tell me the skill and your current level. I'll help you choose a Small Quest, a Grand Quest, or a deeper Build With Hana path, with checkpoints and debugging help.";
  if (/\b(calculate|math)\b/.test(text)) return "I can explain the reasoning step by step. For precise computation, use a configured computation provider; otherwise give me the expression and I'll explain the method rather than pretending an external calculator ran.";
  if (/\b(next|learn|study)\b/.test(text)) return "Let's keep this small: choose one skill, one free learning resource, and one short quest. Finish that before adding another layer.";
  return `I understand you're asking about “${message.slice(0, 120)}”. I don't want to give you a canned answer. Tell me what you're trying to achieve and what you've tried so far, and I'll make the next step specific.`;
};

const freeOpportunityHosts = ["devpost.com", "mlh.io", "developers.google.com", "github.com", "summerofcode.withgoogle.com", "research.google", "student.google.com", "hackclub.com", "nasa.gov", "microsoft.com", "developer.microsoft.com", "aws.amazon.com", "ibm.com", "un.org", "kaggle.com"];
function isTrustedFreeOpportunity(url: string, text = "") { try { const u = new URL(url); if (u.protocol !== "https:") return false; const host = u.hostname.replace(/^www\./, ""); if (!freeOpportunityHosts.some(domain => host === domain || host.endsWith(`.${domain}`))) return false; return !/\b(entry|registration|application)\s*(fee|cost)|paid\s*entry|pay\s*to\s*enter/i.test(text); } catch { return false; } }

async function startServer() {
  const app = express(); const server = createServer(app); app.use(express.json({ limit: "50mb" })); app.use(express.urlencoded({ limit: "50mb", extended: true })); registerStorageProxy(app); registerOAuthRoutes(app);
  app.get("/api/research", async (req, res) => { const query = typeof req.query.q === "string" ? req.query.q.trim() : ""; if (!query) return res.status(400).json({ error: "Missing q" }); try { res.json({ query, results: await searchField(query.slice(0, 120)) }); } catch (error) { console.error("[Research] search failed", error); res.status(502).json({ error: "Research search is temporarily unavailable", results: [] }); } });
  app.get("/api/opportunities", async (req, res) => {
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "latest free-entry computer science student hackathons developer programs competitions scholarships";
    const prompt = `Find the latest relevant opportunities for a CS learner. Search the web now and prioritize official sources. Return 5-8 opportunities matching this request: ${query.slice(0, 220)}. Include current deadline/date when available, eligibility, online/location status, and a short reason it fits. Do not invent details. Only return genuinely free-entry opportunities; exclude any result with a required entry, registration, or application fee. Return the official organizer URL.`;
    try {
      let candidates: any[] = [];
      if (ENV.openaiApiKey) { const result = await invokeOpenAIHana({ systemPrompt: "You are Hana's live opportunity scout. Use web search for current opportunities and verify changing details from official organizer sources. Never invent a deadline, eligibility, or fee. Exclude paid-entry opportunities. Return official URLs only.", history: [], message: prompt, enableWebSearch: true, forceWebSearch: true }); candidates = (result.sources ?? []).map((source: any) => ({ title: source.title ?? "Current opportunity", description: source.snippet ?? "Current opportunity found by Hana's web search.", url: source.url, why: "Matches the learner's current search; verify eligibility and deadline on the official source.", source: source.title ?? "Official web source", free: true })); }
      else { const results = await searchField(query.slice(0, 180)); candidates = results.map(item => ({ title: item.title, description: item.snippet, url: item.url, why: "Found through a current web search; verify details on the official page.", source: "Official web source", free: true })); }
      const verified = candidates.filter(item => isTrustedFreeOpportunity(item.url, `${item.title} ${item.description} ${item.why}`)).slice(0, 8);
      const withAlternatives = verified.map((item, index) => ({ ...item, alternative: verified[(index + 1) % verified.length] && verified.length > 1 ? { title: verified[(index + 1) % verified.length].title, url: verified[(index + 1) % verified.length].url } : undefined }));
      return res.json({ query, opportunities: withAlternatives });
    } catch (error) { console.error("[Opportunities] search failed", error); return res.status(502).json({ error: "Live opportunity search is temporarily unavailable", opportunities: [] }); }
  });
  app.post("/api/curriculum-check", async (req, res) => {
    const careerPath = typeof req.body?.careerPath === "string" ? req.body.careerPath.trim() : ""; const stage = typeof req.body?.stage === "string" ? req.body.stage.trim() : ""; const university = typeof req.body?.university === "string" ? req.body.university.trim() : ""; const curriculumUrl = typeof req.body?.curriculumUrl === "string" ? req.body.curriculumUrl.trim() : ""; const manualCurriculum = typeof req.body?.manualCurriculum === "string" ? req.body.manualCurriculum.trim().slice(0, 30000) : ""; const skills = Array.isArray(req.body?.skills) ? req.body.skills.filter((item: unknown): item is string => typeof item === "string").slice(0, 12) : [];
    if (!careerPath || !stage || !university) return res.status(400).json({ error: "Missing curriculum comparison details" });
    const curriculumSource = manualCurriculum ? `MANUALLY PROVIDED CURRICULUM:\n${manualCurriculum}` : curriculumUrl ? `OFFICIAL CURRICULUM URL: ${curriculumUrl}` : "NO CURRICULUM SOURCE WAS ACCESSIBLE";
    const prompt = `Compare this Hana learning roadmap stage with the university curriculum below. This is research only: DO NOT modify the roadmap. Identify 2-4 meaningful overlaps and important gaps, then finish by asking the learner whether they want Hana to adjust the roadmap. If the source is a URL, only claim you checked it if web search actually retrieved it. If access fails, explicitly say so and recommend manual paste/upload.\n\nCareer path: ${careerPath}\nStage: ${stage}\nStage skills: ${skills.join(", ") || "not specified"}\nUniversity: ${university}\n${curriculumSource}`;
    try {
      if (ENV.openaiApiKey) { const result = await invokeOpenAIHana({ systemPrompt: "You are Hana's curriculum-matching researcher. Use the official university curriculum as the primary source. Never make changes automatically. If access fails, request manual curriculum text/upload.", history: [], message: prompt, enableWebSearch: Boolean(curriculumUrl), forceWebSearch: Boolean(curriculumUrl) }); return res.json({ answer: result.answer, sources: result.sources, provider: "openai", model: result.model, accessFailed: !manualCurriculum && !(result.sources?.length) }); }
      if (manualCurriculum) return res.json({ answer: `I have the curriculum you provided. The AI comparison provider is not configured right now, so I will not pretend I compared it automatically. Connect an AI provider and ask Hana again.`, sources: [], provider: "manual" });
      const results = await searchField(`${university} ${stage} official curriculum ${careerPath}`); return res.json({ answer: results.length ? `I found curriculum-related sources, but I could not reliably complete an AI comparison. Would you like to provide the curriculum manually so Hana can compare it precisely?` : `I couldn't reliably access the curriculum. Please paste the curriculum text or upload it for a precise comparison.`, sources: results.slice(0, 4), provider: "research", accessFailed: !results.length });
    } catch (error) { console.error("[Curriculum] check failed", error); return res.status(502).json({ error: "Hana could not complete the live curriculum check. Please paste or upload the curriculum and try again." }); }
  });
  app.post("/api/free-chat", async (req, res) => {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : ""; if (!message) return res.status(400).json({ error: "Missing message" }); const rawHistory = Array.isArray(req.body?.history) ? req.body.history : []; const history = rawHistory.filter((item: any) => (item?.role === "user" || item?.role === "model" || item?.role === "assistant") && typeof item?.text === "string").slice(-10); const selectedPath = typeof req.body?.selectedPath === "string" ? req.body.selectedPath : ""; const memory = typeof req.body?.memory === "string" ? req.body.memory.slice(0, 4000) : "";
    const system = `You are Hana, a genuinely conversational AI career and learning companion. Answer the user's actual message first. Adapt to wording, intent, level, previous messages, selected career, and recent memory. You may explain, brainstorm, debug, compare options, review projects, create plans, and have normal conversation. For current information, links, universities, opportunities, dates, or niche facts, research the web before answering. Never claim to have searched unless you actually did. Hide the mountain, show the next step. Selected career: ${selectedPath || "not selected"}. Recent memory: ${memory || "none"}.`;
    if (ENV.openaiApiKey) { try { const result = await invokeOpenAIHana({ systemPrompt: system, message, history: history.map((item: any) => ({ role: item.role === "model" ? "assistant" : item.role, content: item.text })), enableWebSearch: true, forceWebSearch: /\b(latest|current|today|recent|news|search|browse|look up|research|find|links?|sources?|courses?|youtube|universit(?:y|ies)|scholarships?|opportunit(?:y|ies)|2026)\b/i.test(message) }); return res.json({ answer: result.answer, sources: result.sources, provider: "openai", model: result.model }); } catch (error) { console.warn("[OpenAI Hana] failed; trying Gemini", error instanceof Error ? error.message : error); } }
    if (ENV.geminiApiKey) { try { const answer = await generateFreeHanaReply(system, message, history.filter((item: any) => item.role === "user" || item.role === "model")); return res.json({ answer, sources: [], provider: "gemini" }); } catch (error) { console.warn("[Gemini Hana] failed; using local fallback", error instanceof Error ? error.message : error); } }
    return res.json({ answer: localHana(message), sources: [], provider: "local-demo" });
  });
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext })); if (process.env.NODE_ENV === "development") await setupVite(app, server); else serveStatic(app); const preferredPort = parseInt(process.env.PORT || "3000"); const port = await findAvailablePort(preferredPort); if (port !== preferredPort) console.log(`Port ${preferredPort} is busy, using port ${port} instead`); server.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}
startServer().catch(console.error);
