CREATE TABLE `cart` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_order` (
	`cartId` text NOT NULL,
	`counter` integer NOT NULL,
	`discount` numeric NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`cartId`) REFERENCES `cart`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_order`("cartId", "counter", "discount", "createdAt") SELECT "cartId", "counter", "discount", "createdAt" FROM `order`;--> statement-breakpoint
DROP TABLE `order`;--> statement-breakpoint
ALTER TABLE `__new_order` RENAME TO `order`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_cartItem` (
	`id` text PRIMARY KEY NOT NULL,
	`productId` text NOT NULL,
	`cartId` text NOT NULL,
	FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`cartId`) REFERENCES `cart`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_cartItem`("id", "productId", "cartId") SELECT "id", "productId", "cartId" FROM `cartItem`;--> statement-breakpoint
DROP TABLE `cartItem`;--> statement-breakpoint
ALTER TABLE `__new_cartItem` RENAME TO `cartItem`;--> statement-breakpoint
CREATE INDEX `cartItem_cartId` ON `cartItem` (`cartId`);