import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertLearnerProfile, InsertUser, learnerProfiles, users, learningMissions, learnerProjects, memoryItems, opportunities, savedOpportunities, roadmapStates, chatConversations, chatMessages, learnerAchievements, learnerSettings, portfolioDrafts } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getLearnerProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(learnerProfiles).where(eq(learnerProfiles.userId, userId)).limit(1);
  return result[0];
}

export async function listLearnerProjects(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(learnerProjects).where(eq(learnerProjects.userId, userId));
}

export async function updateProjectCheckpoint(userId: number, projectId: number, progress: number, currentCheckpoint: string, status: "active" | "completed" | "archived" = "active") {
  const db = await getDb();
  if (!db) return undefined;
  
  // Get the current project before updating
  const currentProject = await db.select().from(learnerProjects).where(and(eq(learnerProjects.id, projectId), eq(learnerProjects.userId, userId))).limit(1);
  const oldProgress = currentProject[0]?.progress ?? 0;
  
  // Update the project
  await db.update(learnerProjects).set({ progress, currentCheckpoint, status, updatedAt: new Date() }).where(and(eq(learnerProjects.id, projectId), eq(learnerProjects.userId, userId)));
  
  // Automatically create portfolio evidence when project reaches 70% or higher
  // and wasn't previously at that threshold
  if (progress >= 70 && oldProgress < 70 && status === "active") {
    const project = currentProject[0];
    if (project) {
      const portfolioContent = `# ${project.title}\n\nProject Progress: ${progress}%\n\nCurrent Checkpoint: ${currentCheckpoint}\n\nSkills Developed: ${project.skills || "Various programming concepts"}\n\nDescription: ${project.description || "A learner-built project demonstrating practical application of CS concepts."}\n\nEvidence: This project checkpoint demonstrates progress in building real solutions.`;
      await createPortfolioDraft(userId, projectId, "portfolio", portfolioContent);
    }
  }
  
  const result = await db.select().from(learnerProjects).where(and(eq(learnerProjects.id, projectId), eq(learnerProjects.userId, userId))).limit(1);
  return result[0];
}

export async function listLearnerMissions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(learningMissions).where(eq(learningMissions.userId, userId));
}

export async function listMemoryItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(memoryItems).where(eq(memoryItems.userId, userId));
}

export async function createChatConversation(userId: number, title: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(chatConversations).values({ userId, title });
  const conversationId = Number((result as { insertId?: number }).insertId);
  if (!Number.isFinite(conversationId) || conversationId <= 0) return undefined;
  return conversationId;
}

export async function createChatMessage(userId: number, conversationId: number, role: "user" | "assistant", content: string) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(chatMessages).values({ userId, conversationId, role, content });
  return { conversationId, role, content };
}

export async function deleteMemoryItems(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(memoryItems).set({ isDeleted: true, deletedAt: new Date() }).where(eq(memoryItems.userId, userId));
}

export async function updateMissionProgress(userId: number, missionId: number, progress: number, currentStep: string, state: "not-started" | "in-progress" | "completed") {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(learningMissions).set({ progress, currentStep, state, completedAt: state === "completed" ? new Date() : null, updatedAt: new Date() }).where(and(eq(learningMissions.id, missionId), eq(learningMissions.userId, userId)));
  const result = await db.select().from(learningMissions).where(and(eq(learningMissions.id, missionId), eq(learningMissions.userId, userId))).limit(1);
  return result[0];
}

export async function upsertSavedOpportunity(userId: number, opportunityId: number, status: "saved" | "planning" | "applied" | "accepted" | "rejected") {
  const db = await getDb();
  if (!db) return undefined;
  const existing = await db.select().from(savedOpportunities).where(and(eq(savedOpportunities.userId, userId), eq(savedOpportunities.opportunityId, opportunityId))).limit(1);
  if (existing[0]) {
    await db.update(savedOpportunities).set({ status, updatedAt: new Date() }).where(and(eq(savedOpportunities.id, existing[0].id), eq(savedOpportunities.userId, userId)));
    return { ...existing[0], status };
  }
  await db.insert(savedOpportunities).values({ userId, opportunityId, status });
  return { userId, opportunityId, status };
}

export async function updateLearnerSettings(userId: number, settings: { hanaPersonality?: string; preferredExplanationStyle?: string; notificationsEnabled?: boolean; voiceEnabled?: boolean; memoryEnabled?: boolean }) {
  const db = await getDb();
  if (!db) return undefined;
  const existing = await getLearnerSettings(userId);
  if (existing) {
    await db.update(learnerSettings).set({ ...settings, updatedAt: new Date() }).where(eq(learnerSettings.userId, userId));
  } else {
    await db.insert(learnerSettings).values({ userId, ...settings });
  }
  return getLearnerSettings(userId);
}

export async function listOpportunities() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(opportunities);
}

export async function listSavedOpportunities(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(savedOpportunities).where(eq(savedOpportunities.userId, userId));
}

export async function listRoadmapStates(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(roadmapStates).where(eq(roadmapStates.userId, userId));
}

export async function listChatConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatConversations).where(eq(chatConversations.userId, userId));
}

export async function listChatMessages(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatMessages).where(eq(chatMessages.userId, userId));
}

export async function listAchievements(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(learnerAchievements).where(eq(learnerAchievements.userId, userId));
}

export async function getLearnerSettings(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(learnerSettings).where(eq(learnerSettings.userId, userId)).limit(1);
  return result[0];
}

export async function listPortfolioDrafts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioDrafts).where(eq(portfolioDrafts.userId, userId));
}

export async function createPortfolioDraft(userId: number, projectId: number | undefined, kind: "readme" | "portfolio" | "resume", content: string) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(portfolioDrafts).values({ userId, projectId, kind, content, status: "draft" });
  return { userId, projectId, kind, content, status: "draft" as const };
}

export async function upsertLearnerProfile(userId: number, profile: Omit<InsertLearnerProfile, "userId">) {
  const db = await getDb();
  if (!db) return undefined;
  const values: InsertLearnerProfile = { userId, ...profile };
  await db.insert(learnerProfiles).values(values).onDuplicateKeyUpdate({
    set: {
      careerGoal: profile.careerGoal,
      experienceLevel: profile.experienceLevel,
      dailyMinutes: profile.dailyMinutes,
      interests: profile.interests,
      learningStyle: profile.learningStyle,
      memoryEnabled: profile.memoryEnabled,
      updatedAt: new Date(),
    },
  });
  return getLearnerProfile(userId);
}
