import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { invokeLLM } from "./_core/llm";
import { generateFreeHanaReply } from "./_core/freeLlm";
import { queryWolframAlpha } from "./_core/wolfram";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createChatConversation, createChatMessage, deleteMemoryItems, getLearnerProfile, getLearnerSettings, getLearnerSummary, listAchievements, listChatConversations, listChatMessages, listLearnerMissions, listLearnerProjects, listMemoryItems, listOpportunities, listPortfolioDrafts, listRoadmapStates, listSavedOpportunities, createPortfolioDraft, updateLearnerSettings, updateMissionProgress, updateProjectCheckpoint, upsertLearnerProfile, upsertSavedOpportunity } from "./db";
import { z } from "zod";

const careerPathSchema = z.enum(["computer-science", "software-engineering", "ai-ml", "data-science", "cybersecurity", "web-fullstack", "mobile", "cloud-devops", "systems-embedded", "game-development", "ui-ux-product", "qa-testing"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  opportunities: router({ list: publicProcedure.query(() => listOpportunities()) }),
  ai: router({
    compute: publicProcedure.input(z.object({ query: z.string().trim().min(1).max(500) })).query(({ input }) => queryWolframAlpha(input.query)),
    chat: publicProcedure.input(z.object({ message: z.string().trim().min(1).max(4000), conversationId: z.number().int().positive().optional(), memoryEnabled: z.boolean().default(true) })).mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      const [profile, memoryItems, projects, missions] = userId
        ? await Promise.all([getLearnerProfile(userId), input.memoryEnabled ? listMemoryItems(userId) : Promise.resolve([]), listLearnerProjects(userId), listLearnerMissions(userId)])
        : [null, [], [], []];
      const allowedMemory = memoryItems.filter(item => !item.isDeleted).slice(-12);
      const context = [
        `Learner profile: ${JSON.stringify(profile ?? { careerGoal: "Software engineer", careerPath: "computer-science", experienceLevel: "Beginner", learningStyle: "Examples first" })}`,
        `Active projects: ${JSON.stringify(projects.slice(-6))}`,
        `Learning missions: ${JSON.stringify(missions.slice(-6))}`,
        input.memoryEnabled ? `Allowed saved memory: ${JSON.stringify(allowedMemory)}` : "Saved memory is disabled; do not infer or retain personal context.",
      ].join("\n");
      const systemPrompt = `You are Hana, a warm and practical career companion for a CS learner. Give one clear next step, explain concepts in plain language, and avoid arbitrary scores. Never claim to have done work the learner has not confirmed. Respect privacy controls. Keep recommendations aligned with the learner's selected career path unless they explicitly ask to explore another path. If a computational result is supplied, explain it clearly and distinguish the verified result from your explanation. Keep answers concise but useful, like a strong ChatGPT tutor.\n\n${context}`;
      const wolframTool = { type: "function" as const, function: { name: "wolfram_alpha", description: "Use Wolfram|Alpha only for calculations, mathematics, unit conversions, statistics, or computational knowledge that benefits from a verified computation.", parameters: { type: "object", properties: { query: { type: "string", description: "A concise natural-language computational query." } }, required: ["query"], additionalProperties: false } } };
      try {
        let answer: string;
        if (process.env.BUILT_IN_FORGE_API_KEY) {
          const response = await invokeLLM({ model: "gpt-5-mini", maxTokens: 900, reasoning: { effort: "low" }, tools: [wolframTool], toolChoice: "auto", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: input.message }] });
          const toolCall = response.choices[0]?.message?.tool_calls?.find(call => call.function.name === "wolfram_alpha");
          let rawContent = response.choices[0]?.message?.content ?? "I’m here with you. Let’s choose one small next step together.";
          if (toolCall) {
            let toolQuery = input.message;
            try { const parsed = JSON.parse(toolCall.function.arguments) as { query?: unknown }; if (typeof parsed.query === "string" && parsed.query.trim()) toolQuery = parsed.query; } catch { console.warn("[Wolfram] Hana returned invalid tool arguments"); }
            const computation = await queryWolframAlpha(toolQuery);
            const computationSummary = computation.status === "ok" ? `Wolfram|Alpha result for ${computation.query}: ${computation.result}` : `Wolfram|Alpha could not compute this request. Status: ${computation.status}. Message: ${computation.message}`;
            const followUp = await invokeLLM({ model: "gpt-5-mini", maxTokens: 900, reasoning: { effort: "low" }, messages: [{ role: "system", content: `${systemPrompt}\n\n${computationSummary}` }, { role: "user", content: input.message }] });
            rawContent = followUp.choices[0]?.message?.content ?? computation.result ?? computation.message;
          }
          answer = Array.isArray(rawContent) ? rawContent.filter(part => part.type === "text").map(part => part.text).join("\n") : rawContent;
        } else if (process.env.GEMINI_API_KEY) {
          answer = await generateFreeHanaReply(systemPrompt, input.message);
        } else {
          throw new Error("No Hana AI provider configured. Set GEMINI_API_KEY or BUILT_IN_FORGE_API_KEY.");
        }
        const conversationId = userId ? (input.conversationId ?? await createChatConversation(userId, input.message.slice(0, 120))) : null;
        if (userId && conversationId) { await createChatMessage(userId, conversationId, "user", input.message); await createChatMessage(userId, conversationId, "assistant", answer); }
        return { answer, conversationId };
      } catch (error) {
        console.error("[Hana AI] chat failed", error);
        return { answer: "Hana's AI connection isn't configured yet. Add a Gemini API key (free tier) or the existing Forge key, then restart Hana. Your roadmap and learning features can still be used meanwhile.", conversationId: null };
      }
    }),
  }),
  learner: router({
    profile: protectedProcedure.query(({ ctx }) => getLearnerProfile(ctx.user.id)),
    summary: protectedProcedure.query(({ ctx }) => getLearnerSummary(ctx.user.id)),
    missions: protectedProcedure.query(({ ctx }) => listLearnerMissions(ctx.user.id)),
    projects: protectedProcedure.query(({ ctx }) => listLearnerProjects(ctx.user.id)),
    savedOpportunities: protectedProcedure.query(({ ctx }) => listSavedOpportunities(ctx.user.id)),
    memory: protectedProcedure.query(({ ctx }) => listMemoryItems(ctx.user.id)),
    roadmap: protectedProcedure.query(({ ctx }) => listRoadmapStates(ctx.user.id)),
    conversations: protectedProcedure.query(({ ctx }) => listChatConversations(ctx.user.id)),
    messages: protectedProcedure.query(({ ctx }) => listChatMessages(ctx.user.id)),
    achievements: protectedProcedure.query(({ ctx }) => listAchievements(ctx.user.id)),
    settings: protectedProcedure.query(({ ctx }) => getLearnerSettings(ctx.user.id)),
    portfolioDrafts: protectedProcedure.query(({ ctx }) => listPortfolioDrafts(ctx.user.id)),
    deleteMemory: protectedProcedure.mutation(({ ctx }) => deleteMemoryItems(ctx.user.id)),
    updateMission: protectedProcedure.input(z.object({ missionId: z.number().int().positive(), progress: z.number().int().min(0).max(100), currentStep: z.string().min(1).max(64), state: z.enum(["not-started", "in-progress", "completed"]) })).mutation(({ ctx, input }) => updateMissionProgress(ctx.user.id, input.missionId, input.progress, input.currentStep, input.state)),
    saveOpportunity: protectedProcedure.input(z.object({ opportunityId: z.number().int().positive(), status: z.enum(["saved", "planning", "applied", "accepted", "rejected"]) })).mutation(({ ctx, input }) => upsertSavedOpportunity(ctx.user.id, input.opportunityId, input.status)),
    updateProjectCheckpoint: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), progress: z.number().int().min(0).max(100), currentCheckpoint: z.string().min(1).max(160), status: z.enum(["active", "completed", "archived"]).default("active") })).mutation(({ ctx, input }) => updateProjectCheckpoint(ctx.user.id, input.projectId, input.progress, input.currentCheckpoint, input.status)),
    savePortfolioDraft: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), kind: z.enum(["readme", "portfolio", "resume"]), content: z.string().min(1).max(10000) })).mutation(({ ctx, input }) => createPortfolioDraft(ctx.user.id, input.projectId, input.kind, input.content)),
    updateSettings: protectedProcedure.input(z.object({ hanaPersonality: z.string().max(64).optional(), preferredExplanationStyle: z.string().max(64).optional(), notificationsEnabled: z.boolean().optional(), voiceEnabled: z.boolean().optional(), memoryEnabled: z.boolean().optional() })).mutation(({ ctx, input }) => updateLearnerSettings(ctx.user.id, input)),
    saveProfile: protectedProcedure.input(z.object({ careerGoal: z.string().min(1).max(160), careerPath: careerPathSchema.default("computer-science"), experienceLevel: z.string().min(1).max(64), dailyMinutes: z.number().int().min(15).max(240), interests: z.string().max(1000).optional(), learningStyle: z.string().min(1).max(64), memoryEnabled: z.boolean().default(true) })).mutation(({ ctx, input }) => upsertLearnerProfile(ctx.user.id, input)),
  }),
});

export type AppRouter = typeof appRouter;
