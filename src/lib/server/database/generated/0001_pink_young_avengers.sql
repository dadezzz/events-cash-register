PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_rateLimiterToken` (
	`bucket` text NOT NULL,
	`bucketGroup` text NOT NULL,
	`createdAt` text NOT NULL,
	PRIMARY KEY(`bucketGroup`, `bucket`, `createdAt`)
);
--> statement-breakpoint
INSERT INTO `__new_rateLimiterToken`("bucket", "bucketGroup", "createdAt") SELECT "bucket", "bucketGroup", "createdAt" FROM `rateLimiterToken`;--> statement-breakpoint
DROP TABLE `rateLimiterToken`;--> statement-breakpoint
ALTER TABLE `__new_rateLimiterToken` RENAME TO `rateLimiterToken`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`hashedSecret` text NOT NULL,
	`userId` text NOT NULL,
	`createdAt` text NOT NULL,
	`renovatedAt` text NOT NULL,
	`lastUsedAt` text NOT NULL,
	`userAgent` text NOT NULL,
	`ip` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "hashedSecret", "userId", "createdAt", "renovatedAt", "lastUsedAt", "userAgent", "ip") SELECT "id", "hashedSecret", "userId", "createdAt", "renovatedAt", "lastUsedAt", "userAgent", "ip" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
CREATE UNIQUE INDEX `session_hashedSecret_unique` ON `session` (`hashedSecret`);--> statement-breakpoint
CREATE INDEX `session_userId` ON `session` (`userId`);--> statement-breakpoint
CREATE INDEX `session_hashedSecret` ON `session` (`hashedSecret`);--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`username` text NOT NULL,
	`passwordHash` text,
	`createdAt` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "name", "username", "passwordHash", "createdAt") SELECT "id", "name", "username", "passwordHash", "createdAt" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);
