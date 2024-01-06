CREATE TABLE `todo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`task` text,
	`done` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
