PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_productOption` (
	`id` text PRIMARY KEY NOT NULL,
	`productId` text NOT NULL,
	`name` text NOT NULL,
	`data` text NOT NULL,
	`deletedAt` text,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_productOption`("id", "productId", "name", "data", "deletedAt", "createdAt") SELECT "id", "productId", "name", "data", "deletedAt", "createdAt" FROM `productOption`;--> statement-breakpoint
DROP TABLE `productOption`;--> statement-breakpoint
ALTER TABLE `__new_productOption` RENAME TO `productOption`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `productOption_productId` ON `productOption` (`productId`);