DROP INDEX `printer_name`;--> statement-breakpoint
ALTER TABLE `printer` ADD `available` int DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `printer_name_unique` ON `printer` (`name`);