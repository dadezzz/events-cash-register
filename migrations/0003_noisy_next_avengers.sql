CREATE TABLE `printer` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `printer_name` ON `printer` (`name`);--> statement-breakpoint
CREATE TABLE `printerSetting` (
	`printerId` text NOT NULL,
	`name` text NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`printerId`, `name`),
	FOREIGN KEY (`printerId`) REFERENCES `printer`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `printerSetting_printerName` ON `printerSetting` (`printerId`);