import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { deleteMemoryItems, getLearnerProfile, getLearnerSettings, listAchievements, listChatConversations, listChatMessages, listLearnerMissions, listLearnerProjects, listMemoryItems, listOpportunities, listPortfolioDrafts, listRoadmapStates, listSavedOpportunities, upsertLearnerProfile } from "./db";
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
