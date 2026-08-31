import { env } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";
import express from "express";

const app = express();
app.use(express.json({ limit: "2mb" }));

app.use("/api", (req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, service: "hana-api", runtime: "cloudflare-workers" })
);

app.post("/api/free-chat", async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) return res.status(400).json({ error: "Missing message" });

  const history = Array.isArray(req.body?.history)
    ? req.body.history
        .filter((item: any) => ["user", "model", "assistant"].includes(item?.role) && typeof item?.text === "string")
        .slice(-10)
    : [];
  const memory = typeof req.body?.memory === "string" ? req.body.memory.slice(0, 4000) : "";

  const apiKey = (env as any).OPENAI_API_KEY as string | undefined;
  const model = ((env as any).OPENAI_MODEL as string | undefined) || "gpt-5-mini";

  if (!apiKey) {
    return res.status(503).json({ error: "OPENAI_API_KEY is not configured on the Cloudflare Worker", provider: "cloudflare" });
  }

  const input = [
    ...history.map((item: any) => ({ role: item.role === "model" ? "assistant" : item.role, content: item.text })),
    { role: "user", content: message },
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        instructions: `You are Hana, a warm but practical AI career and learning companion. Answer the user's actual message first. Adapt to their level and conversation history. For current information, links, universities, opportunities, dates, or niche facts, use web search when available. Never claim to have searched if you did not. Recent memory: ${memory || "none"}.`,
        input,
        tools: [{ type: "web_search" }],
        max_output_tokens: 1600,
      }),
    });

    if (!response.ok) {
      console.error("[Cloudflare Hana/OpenAI]", response.status, await response.text());
      return res.status(502).json({ error: "Hana AI request failed", provider: "openai" });
    }

    const data: any = await response.json();
    const answer = typeof data.output_text === "string" ? data.output_text.trim() : "";
    const sources = (data.output ?? [])
      .flatMap((item: any) => item.content ?? [])
      .flatMap((item: any) => item.annotations ?? [])
      .filter((item: any) => item.type === "url_citation" && item.url)
      .map((item: any) => ({ title: item.title || item.url, url: item.url }));

    return res.json({ answer: answer || "I couldn't produce an answer this time. Please try again.", sources, provider: "openai", model: data.model || model });
  } catch (error) {
    console.error("[Cloudflare Hana]", error);
    return res.status(502).json({ error: "Hana AI is temporarily unavailable" });
  }
});

// This Worker owns the Cloudflare-compatible API path. The existing Express/tRPC
// server remains untouched for Node/Vercel deployments.
app.listen(3000);
export default httpServerHandler({ port: 3000 });
