CREATE TYPE "public"."shop_order_status" AS ENUM('pending', 'paid', 'failed');--> statement-breakpoint
CREATE TABLE "punch_card_order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"full_name" text DEFAULT '' NOT NULL,
	"phone" text NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"from_location_id" uuid,
	"entries" integer NOT NULL,
	"amount" integer NOT NULL,
	"status" "shop_order_status" DEFAULT 'pending' NOT NULL,
	"payme_sale_id" text,
	"card_id" uuid,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lead" ADD COLUMN "deposit_sale_id" text;--> statement-breakpoint
ALTER TABLE "lead" ADD COLUMN "deposit_paid_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "punch_card_order" ADD CONSTRAINT "punch_card_order_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "punch_card_order" ADD CONSTRAINT "punch_card_order_from_location_id_location_id_fk" FOREIGN KEY ("from_location_id") REFERENCES "public"."location"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "punch_card_order" ADD CONSTRAINT "punch_card_order_card_id_punch_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."punch_card"("id") ON DELETE set null ON UPDATE no action;