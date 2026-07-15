PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_order` (
	`cartId` text PRIMARY KEY NOT NULL,
	`counter` integer NOT NULL,
	`discount` real NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`cartId`) REFERENCES `cart`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_order`("cartId", "counter", "discount", "createdAt") SELECT "cartId", "counter", "discount", "createdAt" FROM `order`;--> statement-breakpoint
DROP TABLE `order`;--> statement-breakpoint
ALTER TABLE `__new_order` RENAME TO `order`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_product` (
	`id` text PRIMARY KEY NOT NULL,
	`categoryId` text NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`available` int NOT NULL,
	`deletedAt` text,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`categoryId`) REFERENCES `productCategory`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_product`("id", "categoryId", "name", "price", "available", "deletedAt", "createdAt") SELECT "id", "categoryId", "name", "price", "available", "deletedAt", "createdAt" FROM `product`;--> statement-breakpoint
DROP TABLE `product`;--> statement-breakpoint
ALTER TABLE `__new_product` RENAME TO `product`;--> statement-breakpoint
CREATE INDEX `product_categoryId` ON `product` (`categoryId`);