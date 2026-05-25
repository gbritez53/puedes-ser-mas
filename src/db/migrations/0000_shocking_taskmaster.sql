CREATE TABLE `admissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`phone` text NOT NULL,
	`profession` text NOT NULL,
	`motivation` text NOT NULL,
	`cohort` text NOT NULL,
	`ip_hash` text,
	`user_agent` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
