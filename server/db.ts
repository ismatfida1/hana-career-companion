import { eq } from "drizzle-orm";
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

export async function deleteMemoryItems(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(memoryItems).set({ isDeleted: true, deletedAt: new Date() }).where(eq(memoryItems.userId, userId));
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
