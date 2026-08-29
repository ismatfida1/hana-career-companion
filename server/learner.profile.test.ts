import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createUnauthenticatedContext(): TrpcContext {
  return { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

function createAuthenticatedContext(userId: number): TrpcContext {
  return {
    user: { id: userId, openId: `test-${userId}`, email: `test-${userId}@example.com`, name: "Test Learner", loginMethod: "test", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("learner journey procedures", () => {
  it("rejects profile and summary reads/writes when unauthenticated", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    await expect(caller.learner.profile()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.learner.summary()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.learner.saveProfile({ careerGoal: "Software engineer", experienceLevel: "Beginner", dailyMinutes: 30, interests: "Products", learningStyle: "Examples first", memoryEnabled: true })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("protects every learner-owned collection and mutation", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    await expect(caller.learner.projects()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.learner.missions()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.learner.savedOpportunities()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.learner.memory()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.learner.deleteMemory()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.learner.updateMission({ missionId: 1, progress: 10, currentStep: "Concept", state: "in-progress" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.learner.saveOpportunity({ opportunityId: 1, status: "saved" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.learner.updateSettings({ memoryEnabled: false })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.learner.updateProjectCheckpoint({ projectId: 1, progress: 10, currentCheckpoint: "First checkpoint", status: "active" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.learner.savePortfolioDraft({ projectId: 1, kind: "portfolio", content: "Draft" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.ai.compute({ query: "25% of 80000" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
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

  it("rejects invalid learner-owned write payloads before persistence", async () => {
    const caller = appRouter.createCaller(createAuthenticatedContext(999992));
    await expect(caller.learner.updateProjectCheckpoint({ projectId: 1, progress: 101, currentCheckpoint: "Invalid", status: "active" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.learner.savePortfolioDraft({ projectId: 1, kind: "portfolio", content: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("returns empty persisted summary for a new authenticated learner when no database is configured", async () => {
    const caller = appRouter.createCaller(createAuthenticatedContext(999990));
    const summary = await caller.learner.summary();
    expect(summary.projects.total).toBe(0);
    expect(summary.missions.completed).toBe(0);
    expect(summary.roadmap.completed).toBe(0);
    expect(summary.opportunities.applied).toBe(0);
    expect(summary.achievements).toBe(0);
    expect(summary.portfolioDrafts).toBe(0);
  });

  it("allows authenticated learners to read only their scoped profile and collections", async () => {
    const caller = appRouter.createCaller(createAuthenticatedContext(999991));
    await expect(caller.learner.profile()).resolves.toBeUndefined();
    await expect(caller.learner.projects()).resolves.toEqual([]);
    await expect(caller.learner.missions()).resolves.toEqual([]);
    await expect(caller.learner.memory()).resolves.toEqual([]);
  });
});
