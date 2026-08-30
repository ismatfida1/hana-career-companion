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

export async function invokeOpenAIHana(params: {
  systemPrompt: string;
  history: HanaMessage[];
  message: string;
  enableWebSearch?: boolean;
  model?: string;
}) {
  if (!ENV.openaiApiKey) throw new Error("OPENAI_API_KEY is not configured");

  const body: Record<string, unknown> = {
    model: params.model ?? ENV.openaiModel,
    instructions: params.systemPrompt,
    input: [
      ...params.history.slice(-10).map(item => ({ role: item.role, content: item.content })),
      { role: "user", content: params.message },
    ],
    max_output_tokens: 1200,
  };

  if (params.enableWebSearch !== false) {
    body.tools = [{ type: "web_search" }];
  }

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

  const data = (await response.json()) as OpenAIResponse;
  const annotations = (data.output ?? [])
    .flatMap(item => item.content ?? [])
    .flatMap(item => item.annotations ?? [])
    .filter(item => item.type === "url_citation" && item.url)
    .map(item => ({ title: item.title ?? item.url!, url: item.url! }));

  return {
    answer: data.output_text?.trim() || "I couldn't produce an answer this time. Try asking me again.",
    sources: annotations.filter((source, index, all) => all.findIndex(item => item.url === source.url) === index),
    model: data.model ?? params.model ?? ENV.openaiModel,
  };
}
