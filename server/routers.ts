import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { invokeLLM } from "./_core/llm";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createChatConversation, createChatMessage, deleteMemoryItems, getLearnerProfile, getLearnerSettings, listAchievements, listChatConversations, listChatMessages, listLearnerMissions, listLearnerProjects, listMemoryItems, listOpportunities, listPortfolioDrafts, listRoadmapStates, listSavedOpportunities, updateLearnerSettings, updateMissionProgress, upsertLearnerProfile, upsertSavedOpportunity } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  opportunities: router({
    list: publicProcedure.query(() => listOpportunities()),
  }),

  ai: router({
    chat: protectedProcedure
      .input(z.object({
        message: z.string().trim().min(1).max(4000),
        conversationId: z.number().int().positive().optional(),
        memoryEnabled: z.boolean().default(true),
      }))
      .mutation(async ({ ctx, input }) => {
        const [profile, memoryItems, projects, missions] = await Promise.all([
          getLearnerProfile(ctx.user.id),
          input.memoryEnabled ? listMemoryItems(ctx.user.id) : Promise.resolve([]),
          listLearnerProjects(ctx.user.id),
          listLearnerMissions(ctx.user.id),
        ]);
        const allowedMemory = memoryItems.filter(item => !item.isDeleted).slice(-12);
        const context = [
          `Learner profile: ${JSON.stringify(profile ?? { careerGoal: "Software engineer", experienceLevel: "Beginner", learningStyle: "Examples first" })}`,
          `Active projects: ${JSON.stringify(projects.slice(-6))}`,
          `Learning missions: ${JSON.stringify(missions.slice(-6))}`,
          input.memoryEnabled ? `Allowed saved memory: ${JSON.stringify(allowedMemory)}` : "Saved memory is disabled; do not infer or retain personal context.",
        ].join("\\n");
        const response = await invokeLLM({
          model: "gpt-5-mini",
          maxTokens: 900,
          reasoning: { effort: "low" },
          messages: [
            { role: "system", content: `You are Hana, a warm and practical career companion for a learner. Give one clear next step, explain concepts in plain language, avoid arbitrary scores, and never claim to have done work the learner has not confirmed. Respect privacy controls.\\n\\n${context}` },
            { role: "user", content: input.message },
          ],
        });
        const rawContent = response.choices[0]?.message?.content ?? "I’m here with you. Let’s choose one small next step together.";
        const answer = Array.isArray(rawContent) ? rawContent.filter(part => part.type === "text").map(part => part.text).join("\\n") : rawContent;
        const conversationId = input.conversationId ?? await createChatConversation(ctx.user.id, input.message.slice(0, 120));
        if (conversationId) {
          await createChatMessage(ctx.user.id, conversationId, "user", input.message);
          await createChatMessage(ctx.user.id, conversationId, "assistant", answer);
        }
        return { answer, conversationId: conversationId ?? null };
      }),
  }),

  learner: router({
    profile: protectedProcedure.query(({ ctx }) => getLearnerProfile(ctx.user.id)),
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
    updateMission: protectedProcedure
      .input(z.object({ missionId: z.number().int().positive(), progress: z.number().int().min(0).max(100), currentStep: z.string().min(1).max(64), state: z.enum(["not-started", "in-progress", "completed"]) }))
      .mutation(({ ctx, input }) => updateMissionProgress(ctx.user.id, input.missionId, input.progress, input.currentStep, input.state)),
    saveOpportunity: protectedProcedure
      .input(z.object({ opportunityId: z.number().int().positive(), status: z.enum(["saved", "planning", "applied", "accepted", "rejected"]) }))
      .mutation(({ ctx, input }) => upsertSavedOpportunity(ctx.user.id, input.opportunityId, input.status)),
    updateSettings: protectedProcedure
      .input(z.object({ hanaPersonality: z.string().max(64).optional(), preferredExplanationStyle: z.string().max(64).optional(), notificationsEnabled: z.boolean().optional(), voiceEnabled: z.boolean().optional(), memoryEnabled: z.boolean().optional() }))
      .mutation(({ ctx, input }) => updateLearnerSettings(ctx.user.id, input)),
    saveProfile: protectedProcedure
      .input(z.object({
        careerGoal: z.string().min(1).max(160),
        experienceLevel: z.string().min(1).max(64),
        dailyMinutes: z.number().int().min(15).max(240),
        interests: z.string().max(1000).optional(),
        learningStyle: z.string().min(1).max(64),
        memoryEnabled: z.boolean().default(true),
      }))
      .mutation(({ ctx, input }) => upsertLearnerProfile(ctx.user.id, input)),
  }),
});

export type AppRouter = typeof appRouter;
