ALTER TABLE `admissions` ADD COLUMN `diplomado` text NOT NULL DEFAULT 'liderazgo';
ALTER TABLE `admissions` DROP COLUMN `profession`;
ALTER TABLE `admissions` DROP COLUMN `motivation`;
ALTER TABLE `admissions` DROP COLUMN `cohort`;