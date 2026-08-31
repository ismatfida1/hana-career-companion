interface Env {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

type ChatMessage = { role: "user" | "assistant" | "model"; text: string };

const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
  "Vary": "Origin",
});

const json = (body: unknown, status = 200, origin: string | null = null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...cors(origin) },
  });

export default {
  async fetch(request: Request, workerEnv: Env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({ ok: true, service: "hana-api", runtime: "cloudflare-workers", aiConfigured: Boolean(workerEnv.OPENAI_API_KEY) }, 200, origin);
    }

    if (url.pathname !== "/api/free-chat" || request.method !== "POST") {
      return new Response("Not Found", { status: 404, headers: cors(origin) });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400, origin);
    }

    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!message) return json({ error: "Missing message" }, 400, origin);

    const history: ChatMessage[] = Array.isArray(body?.history)
      ? body.history
          .filter((item: any) => ["user", "model", "assistant"].includes(item?.role) && typeof item?.text === "string")
          .slice(-10)
      : [];
    const memory = typeof body?.memory === "string" ? body.memory.slice(0, 4000) : "";

    const apiKey = workerEnv.OPENAI_API_KEY;
    const model = workerEnv.OPENAI_MODEL || "gpt-5.6-luna";
    if (!apiKey) return json({ error: "OPENAI_API_KEY is not configured on the Cloudflare Worker" }, 503, origin);

    const input = [
      ...history.map(item => ({ role: item.role === "model" ? "assistant" : item.role, content: item.text })),
      { role: "user", content: message },
    ];

    const makeRequest = async (withSearch: boolean) => fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        instructions: `You are Hana, a warm but practical AI career and learning companion. Answer the user's actual message first. Adapt to their level and conversation history. For current information, links, universities, opportunities, dates, or niche facts, use web search when available. Never claim to have searched if you did not. Recent memory: ${memory || "none"}.`,
        input,
        ...(withSearch ? { tools: [{ type: "web_search" }] } : {}),
        max_output_tokens: 1600,
      }),
    });

    try {
      let response = await makeRequest(true);
      if (!response.ok) {
        const firstDetail = await response.text();
        console.error("[Cloudflare Hana/OpenAI search request]", response.status, firstDetail);
        // Retry without web search so a tool/model compatibility issue cannot break normal chat.
        response = await makeRequest(false);
      }

      if (!response.ok) {
        const detail = await response.text();
        console.error("[Cloudflare Hana/OpenAI fallback request]", response.status, detail);
        return json({ error: "Hana AI request failed", provider: "openai", status: response.status }, 502, origin);
      }

      const data: any = await response.json();
      const answer = typeof data.output_text === "string" ? data.output_text.trim() : "";
      const sources = (data.output ?? [])
        .flatMap((item: any) => item.content ?? [])
        .flatMap((item: any) => item.annotations ?? [])
        .filter((item: any) => item.type === "url_citation" && item.url)
        .map((item: any) => ({ title: item.title || item.url, url: item.url }));

      return json({ answer: answer || "I couldn't produce an answer this time. Please try again.", sources, provider: "openai", model: data.model || model }, 200, origin);
    } catch (error) {
      console.error("[Cloudflare Hana]", error);
      return json({ error: "Hana AI is temporarily unavailable" }, 502, origin);
    }
  },
};
