import { BookOpen, ExternalLink, GraduationCap, Play, ScrollText, Sparkles } from "lucide-react";

type Resource = { title: string; url: string; type: "interactive" | "university" | "youtube" | "book" | "docs" | "online"; alternative?: { title: string; url: string } };

const resourceMap: Record<string, Resource[]> = {
  Programming: [
    { title: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/", type: "interactive", alternative: { title: "Exercism", url: "https://exercism.org/" } },
    { title: "Harvard CS50x", url: "https://cs50.harvard.edu/x/", type: "university", alternative: { title: "MIT Introduction to CS", url: "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/" } },
    { title: "Python programming spark", url: "https://www.youtube.com/results?search_query=python+programming+beginner+tutorial", type: "youtube", alternative: { title: "JavaScript beginner tutorial", url: "https://www.youtube.com/results?search_query=javascript+beginner+tutorial" } },
    { title: "Automate the Boring Stuff", url: "https://automatetheboringstuff.com/", type: "book", alternative: { title: "Python Crash Course", url: "https://nostarch.com/python-crash-course-3rd-edition" } },
    { title: "Official Python Tutorial", url: "https://docs.python.org/3/tutorial/", type: "docs", alternative: { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" } },
    { title: "Kaggle Learn", url: "https://www.kaggle.com/learn", type: "online", alternative: { title: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/" } },
  ],
  "Data Structures & Algorithms": [
    { title: "VisuAlgo", url: "https://visualgo.net/en", type: "interactive", alternative: { title: "HackerRank", url: "https://www.hackerrank.com/" } },
    { title: "MIT 6.006 Algorithms", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/", type: "university", alternative: { title: "Harvard CS50", url: "https://cs50.harvard.edu/" } },
    { title: "DSA visual explanations", url: "https://www.youtube.com/results?search_query=data+structures+algorithms+beginner", type: "youtube", alternative: { title: "William Fiset", url: "https://www.youtube.com/results?search_query=william+fiset+data+structures" } },
    { title: "Grokking Algorithms", url: "https://www.manning.com/books/grokking-algorithms", type: "book", alternative: { title: "The Algorithm Design Manual", url: "https://www.algorist.com/" } },
    { title: "CP-Algorithms", url: "https://cp-algorithms.com/", type: "docs", alternative: { title: "MDN algorithm resources", url: "https://developer.mozilla.org/" } },
    { title: "HackerRank practice", url: "https://www.hackerrank.com/domains/algorithms", type: "online", alternative: { title: "LeetCode", url: "https://leetcode.com/" } },
  ],
  "LLM Engineering": [
    { title: "OpenAI Developers", url: "https://developers.openai.com/", type: "interactive", alternative: { title: "Hugging Face Learn", url: "https://huggingface.co/learn" } },
    { title: "MIT 6.S191", url: "https://introtodeeplearning.com/", type: "university", alternative: { title: "Stanford CS25", url: "https://web.stanford.edu/class/cs25/" } },
    { title: "LLM engineering explained", url: "https://www.youtube.com/results?search_query=LLM+engineering+tutorial", type: "youtube", alternative: { title: "RAG tutorial", url: "https://www.youtube.com/results?search_query=RAG+tutorial" } },
    { title: "Designing Machine Learning Systems", url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/", type: "book", alternative: { title: "Hands-On Machine Learning", url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/" } },
    { title: "OpenAI API docs", url: "https://platform.openai.com/docs/", type: "docs", alternative: { title: "Anthropic docs", url: "https://docs.anthropic.com/" } },
    { title: "Hugging Face Learn", url: "https://huggingface.co/learn", type: "online", alternative: { title: "Kaggle Learn", url: "https://www.kaggle.com/learn" } },
  ],
};

const fallback = (skill: string): Resource[] => [
  { title: `${skill} · free learning`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " beginner tutorial")}`, type: "youtube", alternative: { title: `${skill} · documentation search`, url: `https://www.google.com/search?q=${encodeURIComponent(skill + " official documentation")}` } },
];

const labels = { interactive: "Interactive", university: "University", youtube: "YouTube", book: "Book", docs: "Documentation", online: "Online" } as const;
const icons = { interactive: Sparkles, university: GraduationCap, youtube: Play, book: BookOpen, docs: ScrollText, online: ExternalLink } as const;

export default function LearningResources({ skill }: { skill: string }) {
  const resources = resourceMap[skill] ?? fallback(skill);
  return <div className="rounded-[28px] border border-white/10 bg-white/[.055] p-5 shadow-xl backdrop-blur sm:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-white/40">Learning kit</p><h3 className="mt-1 font-display text-2xl font-semibold">Everything for this step</h3><p className="mt-1 text-sm text-white/50">One clear path, with alternatives ready when needed.</p></div><Sparkles className="h-5 w-5 text-[#f1c77b]"/></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{resources.map(resource => { const Icon = icons[resource.type]; return <div key={`${resource.type}-${resource.title}`} className="rounded-2xl border border-white/10 bg-[#132434]/70 p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#f1c77b]"><Icon className="h-4 w-4"/>{labels[resource.type]}</div><p className="mt-3 min-h-10 text-sm font-semibold text-white">{resource.title}</p><a href={resource.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#f1c77b] px-3 py-2 text-xs font-bold text-[#172630]">Open <ExternalLink className="h-3.5 w-3.5"/></a>{resource.alternative&&<a href={resource.alternative.url} target="_blank" rel="noreferrer" className="mt-2 block text-xs font-semibold text-white/50 underline">Alternative: {resource.alternative.title}</a>}</div>; })}</div></div>;
}
