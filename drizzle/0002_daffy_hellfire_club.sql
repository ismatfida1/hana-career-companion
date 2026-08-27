CREATE TABLE `learner_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`difficulty` varchar(32) NOT NULL DEFAULT 'Beginner',
	`progress` int NOT NULL DEFAULT 0,
	`currentCheckpoint` varchar(160),
	`skills` text,
	`status` enum('active','completed','archived') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learner_projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learning_missions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`state` enum('not-started','in-progress','completed') NOT NULL DEFAULT 'not-started',
	`currentStep` varchar(64) NOT NULL DEFAULT 'Concept',
	`progress` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learning_missions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `memory_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`source` varchar(64) NOT NULL DEFAULT 'conversation',
	`isDeleted` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`deletedAt` timestamp,
	CONSTRAINT `memory_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `opportunities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(180) NOT NULL,
	`organization` varchar(160) NOT NULL,
	`category` varchar(64) NOT NULL,
	`officialUrl` text NOT NULL,
	`deadline` timestamp,
	`location` varchar(120),
	`sourceVerifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `opportunities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saved_opportunities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`opportunityId` int NOT NULL,
	`status` enum('saved','planning','applied','accepted','rejected') NOT NULL DEFAULT 'saved',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `saved_opportunities_id` PRIMARY KEY(`id`)
);
