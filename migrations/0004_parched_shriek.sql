ALTER TABLE `printerSetting` ADD `availableValues` text NOT NULL;--> statement-breakpoint
ALTER TABLE `printerSetting` ADD `selectedValue` text NOT NULL;--> statement-breakpoint
ALTER TABLE `printerSetting` DROP COLUMN `data`;