CREATE TABLE `printerReceiptTemplate` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`printerId` text NOT NULL,
	`blocks` text NOT NULL,
	FOREIGN KEY (`printerId`) REFERENCES `printer`(`id`) ON UPDATE cascade ON DELETE cascade
);
