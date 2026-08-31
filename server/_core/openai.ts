import { ENV } from "./env";

type HanaMessage = { role: "user" | "assistant"; content: string };

type OpenAIResponse = {
  id?: string;
  model?: string;
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
      annotations?: Array<{
        type?: string;
        url?: string;
        title?: string;
      }>;
    }>;
  }>;
};

const OPENAI_URL = "https://api.openai.com/v1/responses";
const WEB_INTENT = /\b(search|browse|web|latest|current|today|recent|news|find|look up|research|sources?|links?|resource|resources|course|courses|youtube|university|universities|scholarship|opportunit(?:y|ies)|compare|best|2026)\b/i;

async function requestOpenAI(body: Record<string, unknown>) {
  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.openaiApiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${text}`);
  }

  return (await response.json()) as OpenAIResponse;
}

function parseResponse(data: OpenAIResponse) {
  const annotations = (data.output ?? [])
    .flatMap(item => item.content ?? [])
    .flatMap(item => item.annotations ?? [])
    .filter(item => item.type === "url_citation" && item.url)
    .map(item => ({ title: item.title ?? item.url!, url: item.url! }));

  return {
    answer: data.output_text?.trim() || "I couldn't produce an answer this time. Try asking me again.",
    sources: annotations.filter((source, index, all) => all.findIndex(item => item.url === source.url) === index),
    model: data.model ?? ENV.openaiModel,
  };
}

export async function invokeOpenAIHana(params: {
  systemPrompt: string;
  history: HanaMessage[];
  message: string;
  enableWebSearch?: boolean;
  forceWebSearch?: boolean;
  model?: string;
}) {
  if (!ENV.openaiApiKey) throw new Error("OPENAI_API_KEY is not configured");

  const shouldUseWebSearch = params.enableWebSearch !== false;
  const shouldForceWebSearch = params.forceWebSearch ?? WEB_INTENT.test(params.message);
  const baseBody: Record<string, unknown> = {
    model: params.model ?? ENV.openaiModel,
    instructions: `${params.systemPrompt}\n\nWhen web research is requested or clearly useful, actually use web search before answering. Do not substitute a generic roadmap from memory. For web-researched answers, cite the sources you used and provide direct links where appropriate.`,
    input: [
      ...params.history.slice(-10).map(item => ({ role: item.role, content: item.content })),
      { role: "user", content: params.message },
    ],
    max_output_tokens: 1600,
  };

  if (shouldUseWebSearch) {
    try {
      const webBody = { ...baseBody, tools: [{ type: "web_search" }] } as Record<string, unknown>;
      // Let the model decide when web search is useful. This is more compatible across
      // Responses API model versions than forcing a tool call for every matching prompt.
      if (shouldForceWebSearch) webBody.tool_choice = "auto";
      return parseResponse(await requestOpenAI(webBody));
    } catch (error) {
      // Chat must remain usable even if web search is temporarily unavailable,
      // unsupported by the configured model, or blocked by the deployment.
      console.warn("[Hana AI] Web search request failed; retrying without web search", error);
    }
  }

  return parseResponse(await requestOpenAI(baseBody));
}
