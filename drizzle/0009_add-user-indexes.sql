CREATE INDEX `link_user_idx` ON `link` (`user_id`);--> statement-breakpoint
CREATE INDEX `magic_user_idx` ON `magic_link` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_expires_idx` ON `session` (`expires_at`);--> statement-breakpoint
CREATE INDEX `session_user_idx` ON `session` (`user_id`);