CREATE TABLE `printerSettingAvailable` (
	`printerId` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`constraints` text NOT NULL,
	`default` text NOT NULL,
	PRIMARY KEY(`printerId`, `name`),
	FOREIGN KEY (`printerId`) REFERENCES `printer`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `printerSettingAvailable_printerId` ON `printerSettingAvailable` (`printerId`);--> statement-breakpoint
CREATE TABLE `printerSettingSelected` (
	`printerId` text NOT NULL,
	`name` text NOT NULL,
	`value` text NOT NULL,
	PRIMARY KEY(`printerId`, `name`),
	FOREIGN KEY (`printerId`) REFERENCES `printer`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `printerSettingSelected_printerId` ON `printerSettingSelected` (`printerId`);--> statement-breakpoint
DROP TABLE `printerSetting`;