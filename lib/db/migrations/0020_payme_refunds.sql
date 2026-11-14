ALTER TYPE "public"."punch_card_status" ADD VALUE 'cancelled';--> statement-breakpoint
ALTER TYPE "public"."shop_order_status" ADD VALUE 'expired';--> statement-breakpoint
ALTER TYPE "public"."shop_order_status" ADD VALUE 'refunded';--> statement-breakpoint
ALTER TABLE "punch_card_order" ADD COLUMN "refunded_at" timestamp with time zone;