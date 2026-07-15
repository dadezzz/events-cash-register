CREATE TABLE `order` (
	`cartId` text NOT NULL,
	`counter` integer NOT NULL,
	`discount` numeric NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`cartId`) REFERENCES `order`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `cartItem` (
	`id` text PRIMARY KEY NOT NULL,
	`productId` text NOT NULL,
	`cartId` text NOT NULL,
	FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`cartId`) REFERENCES `order`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `cartItem_cartId` ON `cartItem` (`cartId`);--> statement-breakpoint
CREATE TABLE `cartItemValue` (
	`id` text PRIMARY KEY NOT NULL,
	`productOptionId` text NOT NULL,
	`cartItemId` text NOT NULL,
	`value` text NOT NULL,
	FOREIGN KEY (`productOptionId`) REFERENCES `product`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`cartItemId`) REFERENCES `cartItem`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `cartItemValue_cartItemId` ON `cartItemValue` (`cartItemId`);--> statement-breakpoint
CREATE TABLE `ordersState` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
