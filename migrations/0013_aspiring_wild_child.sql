PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_order` (
	`cartId` text PRIMARY KEY NOT NULL,
	`counter` integer NOT NULL,
	`finalPrice` real NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`cartId`) REFERENCES `cart`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_order`("cartId", "counter", "finalPrice", "createdAt") SELECT "cartId", "counter", "finalPrice", "createdAt" FROM `order`;--> statement-breakpoint
DROP TABLE `order`;--> statement-breakpoint
ALTER TABLE `__new_order` RENAME TO `order`;--> statement-breakpoint
PRAGMA foreign_keys=ON;