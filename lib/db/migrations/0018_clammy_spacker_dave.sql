CREATE TYPE "public"."punch_card_theme" AS ENUM('age12', 'age2');--> statement-breakpoint
ALTER TABLE "punch_card" ADD COLUMN "theme" "punch_card_theme" DEFAULT 'age12' NOT NULL;