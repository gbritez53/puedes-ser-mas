DROP TABLE `diagnosticos`;
--> statement-breakpoint
CREATE TABLE `diagnosticos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`pain_sentence` text,
	`category` text,
	`level` text,
	`level_inferred` integer,
	`answers` text,
	`completed` integer DEFAULT false NOT NULL,
	`ip_hash` text,
	`user_agent` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
