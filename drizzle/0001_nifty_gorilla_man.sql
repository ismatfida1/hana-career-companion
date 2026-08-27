CREATE TABLE `learner_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`careerGoal` varchar(160) NOT NULL DEFAULT 'Software engineer',
	`experienceLevel` varchar(64) NOT NULL DEFAULT 'Beginner',
	`dailyMinutes` int NOT NULL DEFAULT 30,
	`interests` text,
	`learningStyle` varchar(64) NOT NULL DEFAULT 'Examples first',
	`memoryEnabled` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learner_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `learner_profiles_userId_unique` UNIQUE(`userId`)
);
