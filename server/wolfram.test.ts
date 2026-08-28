import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

describe("Wolfram|Alpha service", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("WOLFRAM_APP_ID", "test-app-id");
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it.each([
    ["What is 25% of 80000?", "20000"],
    ["Convert 5 kilometers to miles.", "3.10686 miles"],
    ["Solve x^2 + 5x + 6 = 0.", "x = -3, -2"],
  ])("normalizes a successful computation for %s", async (query, result) => {
    fetchMock.mockResolvedValue(new Response(result, { status: 200 }));
    const { queryWolframAlpha } = await import("./_core/wolfram");
    const response = await queryWolframAlpha(query);
    expect(response).toMatchObject({ status: "ok", query, result, source: "wolfram-alpha" });
    const requestUrl = String(fetchMock.mock.calls[0]?.[0]);
    expect(new URL(requestUrl).searchParams.get("i")).toBe(query);
    expect(new URL(requestUrl).searchParams.get("appid")).toBe("test-app-id");
  });

  it("handles empty results", async () => {
    fetchMock.mockResolvedValue(new Response("", { status: 200 }));
    const { queryWolframAlpha } = await import("./_core/wolfram");
    await expect(queryWolframAlpha("unknown computation")).resolves.toMatchObject({ status: "empty", result: null });
  });

  it("handles rate limiting without leaking credentials", async () => {
    fetchMock.mockResolvedValue(new Response("rate limited", { status: 429 }));
    const { queryWolframAlpha } = await import("./_core/wolfram");
    const response = await queryWolframAlpha("25% of 80000");
    expect(response).toMatchObject({ status: "rate_limited", result: null });
    expect(response.message).not.toContain("test-app-id");
  });

  it("reports missing configuration without making a request", async () => {
    vi.stubEnv("WOLFRAM_APP_ID", "");
    const { queryWolframAlpha } = await import("./_core/wolfram");
    await expect(queryWolframAlpha("25% of 80000")).resolves.toMatchObject({ status: "not_configured", result: null });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
