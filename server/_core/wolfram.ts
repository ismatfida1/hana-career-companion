import { ENV } from "./env";

const WOLFRAM_RESULT_URL = "https://api.wolframalpha.com/v1/result";
const REQUEST_TIMEOUT_MS = 8_000;
const MAX_QUERY_LENGTH = 500;

export type WolframStatus = "ok" | "not_configured" | "empty" | "invalid_query" | "rate_limited" | "upstream_error" | "timeout";

export type WolframResult = {
  status: WolframStatus;
  query: string;
  result: string | null;
  source: "wolfram-alpha" | null;
  message: string;
};

const logWolfram = (event: "success" | "failure", details: Record<string, string | number>) => {
  // Never include the App ID or the full request URL in logs.
  console[event === "success" ? "info" : "warn"](`[Wolfram] ${event}`, details);
};

export async function queryWolframAlpha(input: string): Promise<WolframResult> {
  const query = input.trim().slice(0, MAX_QUERY_LENGTH);
  if (!query) {
    return { status: "invalid_query", query: "", result: null, source: null, message: "The computational question was empty." };
  }
  if (!ENV.wolframAppId) {
    logWolfram("failure", { reason: "not_configured" });
    return { status: "not_configured", query, result: null, source: null, message: "Wolfram|Alpha is not configured yet." };
  }

  const url = new URL(WOLFRAM_RESULT_URL);
  url.searchParams.set("appid", ENV.wolframAppId);
  url.searchParams.set("i", query);
  url.searchParams.set("timeout", "5");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const startedAt = Date.now();
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { accept: "text/plain" } });
    const text = (await response.text()).trim();
    const elapsedMs = Date.now() - startedAt;
    if (response.status === 429) {
      logWolfram("failure", { reason: "rate_limited", status: response.status, elapsedMs });
      return { status: "rate_limited", query, result: null, source: null, message: "Wolfram|Alpha is temporarily rate-limited." };
    }
    if (response.status === 400 || response.status === 501) {
      logWolfram("failure", { reason: "invalid_or_uninterpretable_query", status: response.status, elapsedMs });
      return { status: "invalid_query", query, result: null, source: null, message: "Wolfram|Alpha could not interpret that computational question." };
    }
    if (!response.ok) {
      logWolfram("failure", { reason: "upstream_error", status: response.status, elapsedMs });
      return { status: "upstream_error", query, result: null, source: null, message: "Wolfram|Alpha could not complete the calculation right now." };
    }
    if (!text || /^WolframAlpha error/i.test(text)) {
      logWolfram("failure", { reason: "empty_result", status: response.status, elapsedMs });
      return { status: "empty", query, result: null, source: null, message: "Wolfram|Alpha returned no concise result for that question." };
    }
    logWolfram("success", { status: response.status, elapsedMs, resultLength: text.length });
    return { status: "ok", query, result: text, source: "wolfram-alpha", message: "Computed successfully." };
  } catch (error) {
    const elapsedMs = Date.now() - startedAt;
    const timedOut = error instanceof Error && error.name === "AbortError";
    logWolfram("failure", { reason: timedOut ? "timeout" : "network_error", elapsedMs });
    return { status: timedOut ? "timeout" : "upstream_error", query, result: null, source: null, message: timedOut ? "Wolfram|Alpha took too long to respond." : "Wolfram|Alpha is temporarily unavailable." };
  } finally {
    clearTimeout(timer);
  }
}
