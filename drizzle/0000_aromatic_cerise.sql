CREATE TABLE `development_news_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` bigint NOT NULL,
	`title` text NOT NULL,
	`short_description` text NOT NULL,
	`content` text NOT NULL,
	`status` text NOT NULL DEFAULT 'unpublished',
	`created_on` timestamp NOT NULL,
	`updated_on` timestamp NOT NULL,
	CONSTRAINT `development_news_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_id_index` ON `development_news_posts` (`user_id`);--> statement-breakpoint
CREATE INDEX `status_index` ON `development_news_posts` (`status`);--> statement-breakpoint
CREATE INDEX `updated_on_index` ON `development_news_posts` (`updated_on`);