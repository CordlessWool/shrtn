DROP INDEX IF EXISTS `expires_idx`;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `link_expires_idx` ON `link` (`expires_at`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `magic_expires_idx` ON `magic_link` (`expires_at`);
