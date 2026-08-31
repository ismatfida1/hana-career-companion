export type QuestObjective = { id: string; label: string; type: "lesson" | "practice" | "build" | "prove" };

export type Quest = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  description: string;
  deadline?: string;
  eligibility: string;
  sourceUrl: string;
  objectives: QuestObjective[];
};

export const questCatalog: Quest[] = [
  {
    id: "api-foundations",
    title: "API Foundations",
    subtitle: "Learn how software talks to software",
    tags: ["APIs", "Web", "Beginner"],
    description: "Understand requests, responses, endpoints, JSON, status codes, and authentication by building a tiny API client.",
    eligibility: "Open to Hana learners",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Introduction",
    objectives: [
      { id: "api-lesson", label: "Learn requests, responses and endpoints", type: "lesson" },
      { id: "api-practice", label: "Practice reading a JSON response", type: "practice" },
      { id: "api-build", label: "Build a small API-powered feature", type: "build" },
      { id: "api-prove", label: "Write a short README explaining what you built", type: "prove" },
    ],
  },
  {
    id: "github-proof",
    title: "GitHub Proof Quest",
    subtitle: "Turn learning into visible evidence",
    tags: ["Git", "GitHub", "Portfolio"],
    description: "Create a clean repository, make meaningful commits, and document one project so another person can understand it.",
    eligibility: "Open to Hana learners",
    sourceUrl: "https://docs.github.com/en/get-started/start-your-journey",
    objectives: [
      { id: "git-lesson", label: "Learn the Git add → commit → push flow", type: "lesson" },
      { id: "git-practice", label: "Make three meaningful local commits", type: "practice" },
      { id: "git-build", label: "Create or improve one project repository", type: "build" },
      { id: "git-prove", label: "Add a useful README and project evidence", type: "prove" },
    ],
  },
  {
    id: "ai-first-project",
    title: "AI Builder Quest",
    subtitle: "Ship a small AI feature instead of only studying it",
    tags: ["AI", "Product", "Build"],
    description: "Plan a small AI feature, connect it to a real interface, test failure cases, and document what you learned.",
    eligibility: "Open to Hana learners",
    sourceUrl: "https://platform.openai.com/docs/overview",
    objectives: [
      { id: "ai-lesson", label: "Learn the basic model → prompt → response loop", type: "lesson" },
      { id: "ai-practice", label: "Design three test prompts and expected outcomes", type: "practice" },
      { id: "ai-build", label: "Build one small AI-powered feature", type: "build" },
      { id: "ai-prove", label: "Document limitations and next improvements", type: "prove" },
    ],
  },
];

export const getQuest = (id: string | null | undefined) => questCatalog.find(quest => quest.id === id) ?? questCatalog[0];
