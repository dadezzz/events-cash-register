PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_cartItemValue` (
	`productOptionId` text NOT NULL,
	`cartItemId` text NOT NULL,
	`value` text NOT NULL,
	PRIMARY KEY(`cartItemId`, `productOptionId`),
	FOREIGN KEY (`productOptionId`) REFERENCES `productOption`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`cartItemId`) REFERENCES `cartItem`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_cartItemValue`("productOptionId", "cartItemId", "value") SELECT "productOptionId", "cartItemId", "value" FROM `cartItemValue`;--> statement-breakpoint
DROP TABLE `cartItemValue`;--> statement-breakpoint
ALTER TABLE `__new_cartItemValue` RENAME TO `cartItemValue`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `cartItemValue_cartItemId` ON `cartItemValue` (`cartItemId`);--> statement-breakpoint
CREATE TABLE `__new_order` (
	`cartId` text PRIMARY KEY NOT NULL,
	`counter` integer NOT NULL,
	`discount` numeric NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`cartId`) REFERENCES `cart`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_order`("cartId", "counter", "discount", "createdAt") SELECT "cartId", "counter", "discount", "createdAt" FROM `order`;--> statement-breakpoint
DROP TABLE `order`;--> statement-breakpoint
ALTER TABLE `__new_order` RENAME TO `order`;