CREATE TABLE `chat_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(160),
	`contextSnapshot` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`conversationId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learner_achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementKey` varchar(100) NOT NULL,
	`title` varchar(160) NOT NULL,
	`evidence` text,
	`unlockedAt` timestamp,
	CONSTRAINT `learner_achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learner_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`hanaPersonality` varchar(64) NOT NULL DEFAULT 'encouraging',
	`preferredExplanationStyle` varchar(64) NOT NULL DEFAULT 'Examples first',
	`notificationsEnabled` boolean NOT NULL DEFAULT true,
	`voiceEnabled` boolean NOT NULL DEFAULT false,
	`memoryEnabled` boolean NOT NULL DEFAULT true,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learner_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `learner_settings_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_drafts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectId` int,
	`kind` enum('readme','portfolio','resume') NOT NULL,
	`content` text NOT NULL,
	`status` enum('draft','reviewed','published') NOT NULL DEFAULT 'draft',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolio_drafts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roadmap_states` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`nodeKey` varchar(120) NOT NULL,
	`status` enum('locked','available','in-progress','completed') NOT NULL DEFAULT 'available',
	`progress` int NOT NULL DEFAULT 0,
	`adaptationReason` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `roadmap_states_id` PRIMARY KEY(`id`)
);
