ALTER TABLE `printerReceiptTemplate` RENAME TO `receiptTemplate`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_receiptTemplate` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`printerId` text NOT NULL,
	`blocks` text NOT NULL,
	FOREIGN KEY (`printerId`) REFERENCES `printer`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_receiptTemplate`("id", "name", "printerId", "blocks") SELECT "id", "name", "printerId", "blocks" FROM `receiptTemplate`;--> statement-breakpoint
DROP TABLE `receiptTemplate`;--> statement-breakpoint
ALTER TABLE `__new_receiptTemplate` RENAME TO `receiptTemplate`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_printerSettingSelected` (
	`receiptTemplateId` text NOT NULL,
	`name` text NOT NULL,
	`value` text NOT NULL,
	PRIMARY KEY(`receiptTemplateId`, `name`),
	FOREIGN KEY (`receiptTemplateId`) REFERENCES `receiptTemplate`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `printerSettingSelected`;--> statement-breakpoint
ALTER TABLE `__new_printerSettingSelected` RENAME TO `printerSettingSelected`;--> statement-breakpoint
CREATE INDEX `printerSettingSelected_receiptTemplateId` ON `printerSettingSelected` (`receiptTemplateId`);