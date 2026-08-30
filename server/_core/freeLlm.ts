import { ENV } from "./env";

export async function generateFreeHanaReply(system: string, message: string, history: Array<{ role: "user" | "model"; text: string }> = []) {
  if (!ENV.geminiApiKey) throw new Error("GEMINI_API_KEY is not configured");
  const contents = [...history.slice(-8), { role: "user" as const, text: message }].map(item => ({ role: item.role, parts: [{ text: item.text }] }));
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${ENV.geminiModel}:generateContent?key=${encodeURIComponent(ENV.geminiApiKey)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig: { temperature: 0.7, maxOutputTokens: 700 } }),
  });
  if (!response.ok) throw new Error(`Gemini request failed: ${response.status}`);
  const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const answer = data.candidates?.[0]?.content?.parts?.map(part => part.text ?? "").join("").trim();
  if (!answer) throw new Error("Gemini returned no text");
  return answer;
}
