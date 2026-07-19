CREATE TABLE `orderCounter` (
	`event` text PRIMARY KEY NOT NULL,
	`value` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
DROP TABLE `ordersState`;--> statement-breakpoint
ALTER TABLE `order` ADD `finalPrice` real NOT NULL;--> statement-breakpoint
ALTER TABLE `order` DROP COLUMN `discount`;