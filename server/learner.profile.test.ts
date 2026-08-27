import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createUnauthenticatedContext(): TrpcContext {
  return {
    user: null,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("learner profile procedures", () => {
  it("rejects profile writes when the learner is not authenticated", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    await expect(
      caller.learner.saveProfile({
        careerGoal: "Software engineer",
        experienceLevel: "Beginner",
        dailyMinutes: 30,
        interests: "Products that help people",
        learningStyle: "Examples first",
        memoryEnabled: true,
      }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

it("protects every learner-owned collection behind authentication", async () => {
  const caller = appRouter.createCaller(createUnauthenticatedContext());

  await expect(caller.learner.projects()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  await expect(caller.learner.missions()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  await expect(caller.learner.savedOpportunities()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  await expect(caller.learner.memory()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  await expect(caller.learner.deleteMemory()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
});

it("protects roadmap, conversation, achievement, settings, and portfolio records", async () => {
  const caller = appRouter.createCaller(createUnauthenticatedContext());

  await expect(caller.learner.roadmap()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  await expect(caller.learner.conversations()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  await expect(caller.learner.messages()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  await expect(caller.learner.achievements()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  await expect(caller.learner.settings()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  await expect(caller.learner.portfolioDrafts()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
});

function createAuthenticatedContext(userId: number): TrpcContext {
  return {
    user: {
      id: userId,
      openId: `test-${userId}`,
      email: `test-${userId}@example.com`,
      name: "Test Learner",
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

it("allows an authenticated learner to read only their scoped profile and collections", async () => {
  const caller = appRouter.createCaller(createAuthenticatedContext(999991));

  await expect(caller.learner.profile()).resolves.toBeUndefined();
  await expect(caller.learner.projects()).resolves.toEqual([]);
  await expect(caller.learner.missions()).resolves.toEqual([]);
  await expect(caller.learner.memory()).resolves.toEqual([]);
});
