import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const learnerProfiles = mysqlTable("learner_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  careerGoal: varchar("careerGoal", { length: 160 }).notNull().default("Software engineer"),
  careerPath: varchar("careerPath", { length: 64 }).notNull().default("computer-science"),
  experienceLevel: varchar("experienceLevel", { length: 64 }).notNull().default("Beginner"),
  dailyMinutes: int("dailyMinutes").notNull().default(30),
  interests: text("interests"),
  learningStyle: varchar("learningStyle", { length: 64 }).notNull().default("Examples first"),
  memoryEnabled: boolean("memoryEnabled").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LearnerProfile = typeof learnerProfiles.$inferSelect;
export type InsertLearnerProfile = typeof learnerProfiles.$inferInsert;

export const learningMissions = mysqlTable("learning_missions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  state: mysqlEnum("state", ["not-started", "in-progress", "completed"]).default("not-started").notNull(),
  currentStep: varchar("currentStep", { length: 64 }).default("Concept").notNull(),
  progress: int("progress").default(0).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const learnerProjects = mysqlTable("learner_projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description"),
  difficulty: varchar("difficulty", { length: 32 }).default("Beginner").notNull(),
  progress: int("progress").default(0).notNull(),
  currentCheckpoint: varchar("currentCheckpoint", { length: 160 }),
  skills: text("skills"),
  status: mysqlEnum("status", ["active", "completed", "archived"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const memoryItems = mysqlTable("memory_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  source: varchar("source", { length: 64 }).default("conversation").notNull(),
  isDeleted: boolean("isDeleted").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  deletedAt: timestamp("deletedAt"),
});

export const opportunities = mysqlTable("opportunities", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  organization: varchar("organization", { length: 160 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  officialUrl: text("officialUrl").notNull(),
  deadline: timestamp("deadline"),
  location: varchar("location", { length: 120 }),
  sourceVerifiedAt: timestamp("sourceVerifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const savedOpportunities = mysqlTable("saved_opportunities", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  opportunityId: int("opportunityId").notNull(),
  status: mysqlEnum("status", ["saved", "planning", "applied", "accepted", "rejected"]).default("saved").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LearningMission = typeof learningMissions.$inferSelect;
export type LearnerProject = typeof learnerProjects.$inferSelect;
export type MemoryItem = typeof memoryItems.$inferSelect;
export type Opportunity = typeof opportunities.$inferSelect;
export type SavedOpportunity = typeof savedOpportunities.$inferSelect;

export const roadmapStates = mysqlTable("roadmap_states", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  nodeKey: varchar("nodeKey", { length: 120 }).notNull(),
  status: mysqlEnum("status", ["locked", "available", "in-progress", "completed"]).default("available").notNull(),
  progress: int("progress").default(0).notNull(),
  adaptationReason: text("adaptationReason"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const chatConversations = mysqlTable("chat_conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 160 }),
  contextSnapshot: text("contextSnapshot"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  conversationId: int("conversationId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const learnerAchievements = mysqlTable("learner_achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementKey: varchar("achievementKey", { length: 100 }).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  evidence: text("evidence"),
  unlockedAt: timestamp("unlockedAt"),
});

export const learnerSettings = mysqlTable("learner_settings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  hanaPersonality: varchar("hanaPersonality", { length: 64 }).default("encouraging").notNull(),
  preferredExplanationStyle: varchar("preferredExplanationStyle", { length: 64 }).default("Examples first").notNull(),
  notificationsEnabled: boolean("notificationsEnabled").default(true).notNull(),
  voiceEnabled: boolean("voiceEnabled").default(false).notNull(),
  memoryEnabled: boolean("memoryEnabled").default(true).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const portfolioDrafts = mysqlTable("portfolio_drafts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectId: int("projectId"),
  kind: mysqlEnum("kind", ["readme", "portfolio", "resume"]).notNull(),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["draft", "reviewed", "published"]).default("draft").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});