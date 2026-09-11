CREATE TYPE "public"."avatar_theme" AS ENUM('orange', 'gold', 'rose', 'violet', 'blue', 'mint');--> statement-breakpoint
CREATE TYPE "public"."content_category" AS ENUM('gaming', 'music', 'creative', 'chatting', 'sports', 'irl');--> statement-breakpoint
ALTER TABLE "channel" ADD COLUMN "avatar_theme" "avatar_theme" DEFAULT 'orange' NOT NULL;--> statement-breakpoint
ALTER TABLE "channel" ADD COLUMN "topics" "content_category"[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "interests" "content_category"[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "onboarding_completed" boolean DEFAULT false NOT NULL;