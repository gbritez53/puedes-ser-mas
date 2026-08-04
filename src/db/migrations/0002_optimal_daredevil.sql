ALTER TABLE `admissions` ALTER COLUMN "email" TO "email" text;--> statement-breakpoint
ALTER TABLE `admissions` ALTER COLUMN "diplomado" TO "diplomado" text NOT NULL;--> statement-breakpoint
ALTER TABLE `admissions` ADD `desafio_principal` text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `admissions` ADD `por_que_ser_seleccionado` text NOT NULL DEFAULT '';
