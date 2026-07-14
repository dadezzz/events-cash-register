CREATE TABLE `productCategory` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`deletedAt` text,
	`createdAt` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `product` ADD `categoryId` text NOT NULL REFERENCES productCategory(id);--> statement-breakpoint
CREATE INDEX `product_categoryId` ON `product` (`categoryId`);