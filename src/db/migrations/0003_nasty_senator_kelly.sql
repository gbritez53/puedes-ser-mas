CREATE TABLE `diagnosticos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`track` text NOT NULL,
	`score_a` integer NOT NULL,
	`score_b` integer NOT NULL,
	`score_c` integer NOT NULL,
	`score_d` integer NOT NULL,
	`closing_text` text NOT NULL,
	`aspirations` text NOT NULL,
	`answers` text NOT NULL,
	`ip_hash` text,
	`user_agent` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
