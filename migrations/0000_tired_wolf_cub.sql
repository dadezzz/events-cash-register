CREATE TABLE `product` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`available` int NOT NULL,
	`deletedAt` text,
	`createdAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `productOption` (
	`id` text PRIMARY KEY NOT NULL,
	`productId` text NOT NULL,
	`name` text NOT NULL,
	`data` blob NOT NULL,
	`deletedAt` text,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `rateLimiterToken` (
	`bucket` text NOT NULL,
	`bucketGroup` text NOT NULL,
	`createdAt` text NOT NULL,
	PRIMARY KEY(`bucketGroup`, `bucket`, `createdAt`)
);
--> statement-breakpoint
CREATE TABLE `session` (
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
CREATE UNIQUE INDEX `session_hashedSecret_unique` ON `session` (`hashedSecret`);--> statement-breakpoint
CREATE INDEX `session_userId` ON `session` (`userId`);--> statement-breakpoint
CREATE INDEX `session_hashedSecret` ON `session` (`hashedSecret`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`username` text NOT NULL,
	`passwordHash` text NOT NULL,
	`deletedAt` text,
	`createdAt` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE TABLE `userPrivilege` (
	`privilege` text NOT NULL,
	`userId` text NOT NULL,
	PRIMARY KEY(`privilege`, `userId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `userPrivilege_userId` ON `userPrivilege` (`userId`);