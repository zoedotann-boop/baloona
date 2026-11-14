CREATE TABLE "shop_setting" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"is_open" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "theme" "punch_card_theme" DEFAULT 'age12' NOT NULL;--> statement-breakpoint
ALTER TABLE "punch_card_order" ADD COLUMN "theme" "punch_card_theme" DEFAULT 'age12' NOT NULL;