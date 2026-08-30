import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { invokeLLM } from "./_core/llm";
import { invokeOpenAIHana } from "./_core/openai";
import { generateFreeHanaReply } from "./_core/freeLlm";
import { queryWolframAlpha } from "./_core/wolfram";
import { ENV } from "./_core/env";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
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
    compute: publicProcedure.input(z.object({ query: z.string().trim().min(1).max(500) })).query(({ input }) => queryWolframAlpha(input.query)),
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
          if (likelyComputational) {
            try {
              const computation = await queryWolframAlpha(input.message);
              if (computation.status === "ok") enrichedPrompt += `\n\nVerified Wolfram|Alpha computation:\n${computation.result}`;
            } catch (error) { console.warn("[Wolfram] optional computation failed", error); }
          }
          const response = await invokeOpenAIHana({
            systemPrompt: enrichedPrompt,
            history: history.map(item => ({ role: item.role === "model" ? "assistant" as const : "user" as const, content: item.text })),
            message: input.message,
            enableWebSearch: true,
          });
          answer = response.answer;
          sources = response.sources;
          provider = "openai";
          if (sources.length > 0) answer += `\n\n**Sources**\n${sources.slice(0, 5).map(source => `- [${source.title}](${source.url})`).join("\n")}`;
        } else if (ENV.forgeApiKey) {
          const response = await invokeLLM({ model: "gpt-5-mini", maxTokens: 900, reasoning: { effort: "low" }, messages: [{ role: "system", content: systemPrompt }, ...history.map(item => ({ role: item.role === "model" ? "assistant" as const : "user" as const, content: item.text })), { role: "user", content: input.message }] });
          const raw = response.choices[0]?.message?.content ?? "";
          answer = Array.isArray(raw) ? raw.filter(part => part.type === "text").map(part => part.text).join("\n") : raw;
          provider = "forge";
        } else if (ENV.geminiApiKey) {
          answer = await generateFreeHanaReply(systemPrompt, input.message, history);
          provider = "gemini";
        } else {
          answer = buildLocalHanaReply(input.message, profile?.careerPath ?? "computer-science");
        }
        const savedConversationId = userId ? (input.conversationId ?? await createChatConversation(userId, input.message.slice(0, 120))) : null;
        if (userId && savedConversationId) { await createChatMessage(userId, savedConversationId, "user", input.message); await createChatMessage(userId, savedConversationId, "assistant", answer); }
        return { answer, conversationId: savedConversationId, provider, sources };
      } catch (error) {
        console.error("[Hana AI] primary provider failed; trying fallbacks", error);
        try {
          if (ENV.geminiApiKey) {
            const answer = await generateFreeHanaReply(systemPrompt, input.message, history);
            return { answer, conversationId: null, provider: "gemini" as const, sources: [] };
          }
        } catch (fallbackError) { console.error("[Hana AI] Gemini fallback failed", fallbackError); }
        try {
          if (ENV.forgeApiKey) {
            const response = await invokeLLM({ model: "gpt-5-mini", maxTokens: 900, messages: [{ role: "system", content: systemPrompt }, ...history.map(item => ({ role: item.role === "model" ? "assistant" as const : "user" as const, content: item.text })), { role: "user", content: input.message }] });
            const raw = response.choices[0]?.message?.content ?? "";
            const answer = Array.isArray(raw) ? raw.filter(part => part.type === "text").map(part => part.text).join("\n") : raw;
            if (answer) return { answer, conversationId: null, provider: "forge" as const, sources: [] };
          }
        } catch (fallbackError) { console.error("[Hana AI] Forge fallback failed", fallbackError); }
        return { answer: buildLocalHanaReply(input.message, profile?.careerPath ?? "computer-science"), conversationId: null, provider: "local" as const, sources: [] };
      }
    }),
  }),
  learner: router({
    profile: protectedProcedure.query(({ ctx }) => getLearnerProfile(ctx.user.id)), summary: protectedProcedure.query(({ ctx }) => getLearnerSummary(ctx.user.id)), missions: protectedProcedure.query(({ ctx }) => listLearnerMissions(ctx.user.id)), projects: protectedProcedure.query(({ ctx }) => listLearnerProjects(ctx.user.id)), savedOpportunities: protectedProcedure.query(({ ctx }) => listSavedOpportunities(ctx.user.id)), memory: protectedProcedure.query(({ ctx }) => listMemoryItems(ctx.user.id)), roadmap: protectedProcedure.query(({ ctx }) => listRoadmapStates(ctx.user.id)), conversations: protectedProcedure.query(({ ctx }) => listChatConversations(ctx.user.id)), messages: protectedProcedure.query(({ ctx }) => listChatMessages(ctx.user.id)), achievements: protectedProcedure.query(({ ctx }) => listAchievements(ctx.user.id)), settings: protectedProcedure.query(({ ctx }) => getLearnerSettings(ctx.user.id)), portfolioDrafts: protectedProcedure.query(({ ctx }) => listPortfolioDrafts(ctx.user.id)), deleteMemory: protectedProcedure.mutation(({ ctx }) => deleteMemoryItems(ctx.user.id)),
    updateMission: protectedProcedure.input(z.object({ missionId: z.number().int().positive(), progress: z.number().int().min(0).max(100), currentStep: z.string().min(1).max(64), state: z.enum(["not-started", "in-progress", "completed"]) })).mutation(({ ctx, input }) => updateMissionProgress(ctx.user.id, input.missionId, input.progress, input.currentStep, input.state)),
    saveOpportunity: protectedProcedure.input(z.object({ opportunityId: z.number().int().positive(), status: z.enum(["saved", "planning", "applied", "accepted", "rejected"]) })).mutation(({ ctx, input }) => upsertSavedOpportunity(ctx.user.id, input.opportunityId, input.status)),
    updateProjectCheckpoint: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), progress: z.number().int().min(0).max(100), currentCheckpoint: z.string().min(1).max(160), status: z.enum(["active", "completed", "archived"]).default("active") })).mutation(({ ctx, input }) => updateProjectCheckpoint(ctx.user.id, input.projectId, input.projectId, input.progress, input.currentCheckpoint, input.status)),
    savePortfolioDraft: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), kind: z.enum(["readme", "portfolio", "resume"]), content: z.string().min(1).max(10000) })).mutation(({ ctx, input }) => createPortfolioDraft(ctx.user.id, input.projectId, input.kind, input.content)),
    updateSettings: protectedProcedure.input(z.object({ hanaPersonality: z.string().max(64).optional(), preferredExplanationStyle: z.string().max(64).optional(), notificationsEnabled: z.boolean().optional(), voiceEnabled: z.boolean().optional(), memoryEnabled: z.boolean().optional() })).mutation(({ ctx, input }) => updateLearnerSettings(ctx.user.id, input)),
    saveProfile: protectedProcedure.input(z.object({ careerGoal: z.string().min(1).max(160), careerPath: careerPathSchema.default("computer-science"), experienceLevel: z.string().min(1).max(64), dailyMinutes: z.number().int().min(15).max(240), interests: z.string().max(1000).optional(), learningStyle: z.string().min(1).max(64), memoryEnabled: z.boolean().default(true) })).mutation(({ ctx, input }) => upsertLearnerProfile(ctx.user.id, input)),
  }),
});

function buildLocalHanaReply(message: string, careerPath: string) {
  const lower = message.toLowerCase();
  if (lower.includes("plan") || lower.includes("roadmap") || lower.includes("start")) return `Absolutely. For ${careerPath}, let's keep it simple: first choose one foundation skill, spend 20–30 minutes learning it, then build one tiny thing with it. Tell me what you already know and I'll help you choose the next step.`;
  if (lower.includes("stuck") || lower.includes("confused") || lower.includes("don't know")) return "You're not behind. Let's shrink the problem. Tell me the exact concept or task that feels confusing, and I'll break it into one small step.";
  if (lower.includes("project")) return "Let's make the next step practical. Pick a tiny project that uses the skill you're learning, and we'll turn it into 2–4 small checkpoints rather than one huge assignment.";
  return "I'm Hana. I can help you choose your next learning step, explain a concept, plan a small project, or explore a career direction. What are you working on right now?";
}
