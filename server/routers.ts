import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { invokeLLM } from "./_core/llm";
import { invokeOpenAIHana } from "./_core/openai";
import { generateFreeHanaReply } from "./_core/freeLlm";
import { queryWolframAlpha } from "./_core/wolfram";
import { ENV } from "./_core/env";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { createChatConversation, createChatMessage, deleteMemoryItems, getLearnerProfile, getLearnerSettings, getLearnerSummary, listAchievements, listChatConversations, listChatMessages, listLearnerMissions, listLearnerProjects, listMemoryItems, listOpportunities, listPortfolioDrafts, listRoadmapStates, listSavedOpportunities, createPortfolioDraft, updateLearnerSettings, updateMissionProgress, updateProjectCheckpoint, upsertLearnerProfile, upsertSavedOpportunity } from "./db";
import { z } from "zod";

const careerPathSchema = z.enum(["computer-science", "software-engineering", "ai-ml", "data-science", "cybersecurity", "web-fullstack", "mobile", "cloud-devops", "systems-embedded", "game-development", "ui-ux-product", "qa-testing"]);
const chatHistorySchema = z.array(z.object({ role: z.enum(["user", "model"]), text: z.string().max(4000) })).max(12).default([]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  opportunities: router({ list: publicProcedure.query(() => listOpportunities()) }),
  ai: router({
    compute: protectedProcedure.input(z.object({ query: z.string().trim().min(1).max(500) })).query(async ({ input }) => {
      const result = await queryWolframAlpha(input.query);
      if (result.status !== "ok") throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: result.message });
      return result;
    }),
    chat: publicProcedure.input(z.object({ message: z.string().trim().min(1).max(4000), conversationId: z.number().int().positive().optional(), memoryEnabled: z.boolean().default(true), history: chatHistorySchema })).mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      const [profile, memoryItems, projects, missions] = userId ? await Promise.all([getLearnerProfile(userId), input.memoryEnabled ? listMemoryItems(userId) : Promise.resolve([]), listLearnerProjects(userId), listLearnerMissions(userId)]) : [null, [], [], []];
      const allowedMemory = memoryItems.filter(item => !item.isDeleted).slice(-12);
      const context = [`Learner profile: ${JSON.stringify(profile ?? { careerGoal: "Software engineer", careerPath: "computer-science", experienceLevel: "Beginner", learningStyle: "Examples first" })}`, `Active projects: ${JSON.stringify(projects.slice(-6))}`, `Learning missions: ${JSON.stringify(missions.slice(-6))}`, input.memoryEnabled ? `Allowed saved memory: ${JSON.stringify(allowedMemory)}` : "Saved memory is disabled; do not infer or retain personal context."].join("\n");
      const systemPrompt = `You are Hana, a warm and practical career companion for a CS learner. Give one clear next step, explain concepts in plain language, and avoid arbitrary scores. Never claim to have done work the learner has not confirmed. Respect privacy controls. Keep recommendations aligned with the learner's selected career path unless they explicitly ask to explore another path. You can browse the web when current or niche information is needed. When you browse, prefer primary/official sources, verify dates and distinguish current facts from advice, and include useful source links. When recommending learning resources, prefer one high-fit interactive or university resource rather than a list. If a computational result is supplied, explain it clearly and distinguish the verified result from your explanation. Keep answers concise but useful, like a strong ChatGPT tutor.\n\n${context}`;
      const history = input.history.slice(-10);
      try {
        let answer: string;
        let provider: "openai" | "forge" | "gemini" | "local" = "local";
        let sources: Array<{ title: string; url: string }> = [];
        if (ENV.openaiApiKey) {
          let enrichedPrompt = systemPrompt;
          const lower = input.message.toLowerCase();
          const likelyComputational = /\b(calculate|solve|convert|equation|percentage|percent|average|mean|median|probability|integral|derivative|factorial|square root|sqrt|kg|km|miles|celsius|fahrenheit)\b/.test(lower);
          if (likelyComputational) { try { const computation = await queryWolframAlpha(input.message); if (computation.status === "ok") enrichedPrompt += `\n\nVerified Wolfram|Alpha computation:\n${computation.result}`; } catch (error) { console.warn("[Wolfram] optional computation failed", error); } }
          const response = await invokeOpenAIHana({ systemPrompt: enrichedPrompt, history: history.map(item => ({ role: item.role === "model" ? "assistant" as const : "user" as const, content: item.text })), message: input.message, enableWebSearch: true });
          answer = response.answer; sources = response.sources; provider = "openai";
          if (sources.length > 0) answer += `\n\n**Sources**\n${sources.slice(0, 5).map(source => `- [${source.title}](${source.url})`).join("\n")}`;
        } else if (ENV.forgeApiKey) {
          const response = await invokeLLM({ model: "gpt-5-mini", maxTokens: 900, reasoning: { effort: "low" }, messages: [{ role: "system", content: systemPrompt }, ...history.map(item => ({ role: item.role === "model" ? "assistant" as const : "user" as const, content: item.text })), { role: "user", content: input.message }] });
          const raw = response.choices[0]?.message?.content ?? ""; answer = Array.isArray(raw) ? raw.filter(part => part.type === "text").map(part => part.text).join("\n") : raw; provider = "forge";
        } else if (ENV.geminiApiKey) { answer = await generateFreeHanaReply(systemPrompt, input.message, history); provider = "gemini"; }
        else { answer = buildLocalHanaReply(input.message, profile?.careerPath ?? "computer-science", history); }
        const savedConversationId = userId ? (input.conversationId ?? await createChatConversation(userId, input.message.slice(0, 120))) : null;
        if (userId && savedConversationId) { await createChatMessage(userId, savedConversationId, "user", input.message); await createChatMessage(userId, savedConversationId, "assistant", answer); }
        return { answer, conversationId: savedConversationId, provider, sources };
      } catch (error) {
        console.error("[Hana AI] primary provider failed; trying fallbacks", error);
        try { if (ENV.geminiApiKey) return { answer: await generateFreeHanaReply(systemPrompt, input.message, history), conversationId: null, provider: "gemini" as const, sources: [] }; } catch (fallbackError) { console.error("[Hana AI] Gemini fallback failed", fallbackError); }
        try { if (ENV.forgeApiKey) { const response = await invokeLLM({ model: "gpt-5-mini", maxTokens: 900, messages: [{ role: "system", content: systemPrompt }, ...history.map(item => ({ role: item.role === "model" ? "assistant" as const : "user" as const, content: item.text })), { role: "user", content: input.message }] }); const raw = response.choices[0]?.message?.content ?? ""; const answer = Array.isArray(raw) ? raw.filter(part => part.type === "text").map(part => part.text).join("\n") : raw; if (answer) return { answer, conversationId: null, provider: "forge" as const, sources: [] }; } } catch (fallbackError) { console.error("[Hana AI] Forge fallback failed", fallbackError); }
        return { answer: buildLocalHanaReply(input.message, profile?.careerPath ?? "computer-science", history), conversationId: null, provider: "local" as const, sources: [] };
      }
    }),
  }),
  learner: router({
    profile: protectedProcedure.query(({ ctx }) => getLearnerProfile(ctx.user.id)), summary: protectedProcedure.query(({ ctx }) => getLearnerSummary(ctx.user.id)), missions: protectedProcedure.query(({ ctx }) => listLearnerMissions(ctx.user.id)), projects: protectedProcedure.query(({ ctx }) => listLearnerProjects(ctx.user.id)), savedOpportunities: protectedProcedure.query(({ ctx }) => listSavedOpportunities(ctx.user.id)), memory: protectedProcedure.query(({ ctx }) => listMemoryItems(ctx.user.id)), roadmap: protectedProcedure.query(({ ctx }) => listRoadmapStates(ctx.user.id)), conversations: protectedProcedure.query(({ ctx }) => listChatConversations(ctx.user.id)), messages: protectedProcedure.query(({ ctx }) => listChatMessages(ctx.user.id)), achievements: protectedProcedure.query(({ ctx }) => listAchievements(ctx.user.id)), settings: protectedProcedure.query(({ ctx }) => getLearnerSettings(ctx.user.id)), portfolioDrafts: protectedProcedure.query(({ ctx }) => listPortfolioDrafts(ctx.user.id)), deleteMemory: protectedProcedure.mutation(({ ctx }) => deleteMemoryItems(ctx.user.id)),
    updateMission: protectedProcedure.input(z.object({ missionId: z.number().int().positive(), progress: z.number().int().min(0).max(100), currentStep: z.string().min(1).max(64), state: z.enum(["not-started", "in-progress", "completed"]) })).mutation(({ ctx, input }) => updateMissionProgress(ctx.user.id, input.missionId, input.progress, input.currentStep, input.state)),
    saveOpportunity: protectedProcedure.input(z.object({ opportunityId: z.number().int().positive(), status: z.enum(["saved", "planning", "applied", "accepted", "rejected"]) })).mutation(({ ctx, input }) => upsertSavedOpportunity(ctx.user.id, input.opportunityId, input.status)),
    updateProjectCheckpoint: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), progress: z.number().int().min(0).max(100), currentCheckpoint: z.string().min(1).max(160), status: z.enum(["active", "completed", "archived"]).default("active") })).mutation(({ ctx, input }) => updateProjectCheckpoint(ctx.user.id, input.projectId, input.progress, input.currentCheckpoint, input.status)),
    savePortfolioDraft: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), kind: z.enum(["readme", "portfolio", "resume"]), content: z.string().min(1).max(10000) })).mutation(({ ctx, input }) => createPortfolioDraft(ctx.user.id, input.projectId, input.kind, input.content)),
    updateSettings: protectedProcedure.input(z.object({ hanaPersonality: z.string().max(64).optional(), preferredExplanationStyle: z.string().max(64).optional(), notificationsEnabled: z.boolean().optional(), voiceEnabled: z.boolean().optional(), memoryEnabled: z.boolean().optional() })).mutation(({ ctx, input }) => updateLearnerSettings(ctx.user.id, input)),
    saveProfile: protectedProcedure.input(z.object({ careerGoal: z.string().min(1).max(160), careerPath: careerPathSchema.default("computer-science"), experienceLevel: z.string().min(1).max(64), dailyMinutes: z.number().int().min(15).max(240), interests: z.string().max(1000).optional(), learningStyle: z.string().min(1).max(64), memoryEnabled: z.boolean().default(true) })).mutation(({ ctx, input }) => upsertLearnerProfile(ctx.user.id, input)),
  }),
});

export type AppRouter = typeof appRouter;

type HanaHistory = Array<{ role: "user" | "model"; text: string }>;

function buildLocalHanaReply(message: string, careerPath: string, history: HanaHistory = []) {
  const lower = message.toLowerCase();
  const previous = history.filter(item => item.role === "user").slice(-2).map(item => item.text).join(" ");
  if (/^(hi|hello|hey|assalam|salam)\b/.test(lower)) return `Hey! I'm Hana 🌿. I'm here with you. You're currently exploring ${careerPath.replace(/-/g, " ")}. What do you want to work on today—learning, a project, your roadmap, or university/career planning?`;
  if (lower.includes("who are you") || lower.includes("what can you do")) return "I'm Hana, your CS career companion. I can explain concepts, help you plan what to learn next, break projects into small steps, discuss university and career choices, and help you get unstuck.";
  if (lower.includes("plan") || lower.includes("roadmap") || lower.includes("start")) return `Absolutely. For ${careerPath.replace(/-/g, " ")}, let's take one step at a time. Start with one foundation skill, learn it for 20–30 minutes, then build a tiny example. If you tell me your current level, I'll help you choose the next step.`;
  if (lower.includes("stuck") || lower.includes("confused") || lower.includes("don't know") || lower.includes("dont know")) return "That's okay—let's make the problem smaller. Tell me the exact concept, error, assignment, or decision you're stuck on. I'll help you work through it step by step.";
  if (lower.includes("project")) return "Let's turn learning into something you can show. Tell me the skill or topic you want the project to use, and I'll suggest a small project with clear checkpoints.";
  if (lower.includes("python")) return "Python is a great foundation. If you're starting out, I'd focus on variables, conditionals, loops, functions, lists/dictionaries, then a small project. Want me to give you a first 30-minute Python mission?";
  if (lower.includes("api")) return "For APIs, think of them as a contract between programs: a client sends a request and a server returns a response. A good first mission is to inspect one JSON API response and identify its endpoint, method, status code, and data.";
  if (lower.includes("github") || lower.includes("git ")) return "For GitHub, focus first on the simple flow: change files → git add → git commit → git push. Then make your repository useful to another person with a clear README.";
  if (lower.includes("career") || lower.includes("job") || lower.includes("internship")) return `For a ${careerPath.replace(/-/g, " ")} path, build evidence alongside your learning: projects, GitHub work, problem-solving practice, and eventually internships or competitions. We can make a realistic plan from where you are now.`;
  if (previous) return `I remember the direction of our conversation. You were talking about “${previous.slice(-120)}”. Tell me what you want to do with that next, and I'll help you turn it into a concrete step.`;
  return "I'm Hana 🌿. Tell me what you're trying to learn, build, or decide, and we'll work through it together one step at a time.";
}
