type ResearchResult = { title: string; url: string; snippet: string };

export async function searchField(query: string): Promise<ResearchResult[]> {
  const clean = query.trim();
  if (!clean) return [];
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(clean)}&format=json&no_html=1&skip_disambig=1`;
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`Research search failed: ${response.status}`);
  const data = (await response.json()) as {
    AbstractText?: string;
    AbstractURL?: string;
    AbstractSource?: string;
    RelatedTopics?: Array<{ Text?: string; FirstURL?: string; Topics?: Array<{ Text?: string; FirstURL?: string }> }>;
  };
  const results: ResearchResult[] = [];
  if (data.AbstractText && data.AbstractURL) {
    results.push({ title: data.AbstractSource || clean, url: data.AbstractURL, snippet: data.AbstractText });
  }
  for (const item of data.RelatedTopics ?? []) {
    const nested = item.Topics ?? [item];
    for (const topic of nested) {
      if (topic.Text && topic.FirstURL) results.push({ title: topic.Text.split(" - ")[0].slice(0, 100), url: topic.FirstURL, snippet: topic.Text });
      if (results.length >= 8) break;
    }
    if (results.length >= 8) break;
  }
  return results;
}
