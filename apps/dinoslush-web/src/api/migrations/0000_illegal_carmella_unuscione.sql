CREATE TABLE `bonus_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rule_key` text NOT NULL,
	`rule_name` text NOT NULL,
	`value` real NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`description` text,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bonus_rules_rule_key_unique` ON `bonus_rules` (`rule_key`);--> statement-breakpoint
CREATE TABLE `bonus_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`amount` integer NOT NULL,
	`type` text NOT NULL,
	`reason` text NOT NULL,
	`order_id` integer,
	`admin_id` integer,
	`balance_after` integer NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`product_name` text NOT NULL,
	`product_slug` text NOT NULL,
	`volume` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price` real NOT NULL,
	`total_price` real NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_number` text NOT NULL,
	`user_id` integer,
	`status` text DEFAULT 'pending' NOT NULL,
	`subtotal` real NOT NULL,
	`discount` real DEFAULT 0 NOT NULL,
	`total` real NOT NULL,
	`promo_code` text,
	`promo_code_id` integer,
	`bonus_points_used` integer DEFAULT 0 NOT NULL,
	`bonus_points_earned` integer DEFAULT 0 NOT NULL,
	`delivery_method` text,
	`delivery_address` text,
	`delivery_city` text,
	`delivery_warehouse` text,
	`nova_poshta_ttn` text,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`payment_id` text,
	`payment_method` text,
	`customer_name` text,
	`customer_email` text,
	`customer_phone` text,
	`notes` text,
	`processed_at` text,
	`paid_at` text,
	`shipped_at` text,
	`delivered_at` text,
	`cancelled_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`promo_code_id`) REFERENCES `promo_codes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_number_unique` ON `orders` (`order_number`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name_uk` text NOT NULL,
	`name_en` text,
	`name_es` text,
	`description_uk` text NOT NULL,
	`description_en` text,
	`description_es` text,
	`category` text DEFAULT 'concentrate' NOT NULL,
	`price_1l` real NOT NULL,
	`price_025l` real,
	`image` text,
	`effects_uk` text,
	`effects_en` text,
	`effects_es` text,
	`brewing_time` integer,
	`temperature` integer,
	`origin` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE TABLE `promo_code_usage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`promo_code_id` integer NOT NULL,
	`user_id` integer,
	`order_id` integer NOT NULL,
	`discount_amount` real NOT NULL,
	`used_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`promo_code_id`) REFERENCES `promo_codes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `promo_codes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`discount_type` text NOT NULL,
	`discount_value` real NOT NULL,
	`free_product_id` integer,
	`min_order` real,
	`max_uses` integer,
	`max_uses_per_user` integer,
	`used_count` integer DEFAULT 0 NOT NULL,
	`starts_at` text,
	`expires_at` text,
	`is_active` integer DEFAULT true NOT NULL,
	`description` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`free_product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `promo_codes_code_unique` ON `promo_codes` (`code`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`user_id` integer,
	`rating` integer NOT NULL,
	`title` text,
	`text` text,
	`reviewer_name` text,
	`is_approved` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `user_addresses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`label` text,
	`recipient_name` text NOT NULL,
	`phone` text NOT NULL,
	`city` text NOT NULL,
	`address` text NOT NULL,
	`warehouse` text,
	`is_default` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`bonus_points` integer DEFAULT 0 NOT NULL,
	`referral_code` text,
	`referred_by` integer,
	`is_admin` integer DEFAULT false NOT NULL,
	`tags` text,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`last_order_at` text,
	FOREIGN KEY (`referred_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_referral_code_unique` ON `users` (`referral_code`);