CREATE TYPE "public"."punch_card_status" AS ENUM('active', 'completed');--> statement-breakpoint
CREATE TABLE "customer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text DEFAULT '' NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customer_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "punch_card" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"customer_id" uuid NOT NULL,
	"total_punches" integer NOT NULL,
	"used_punches" integer DEFAULT 0 NOT NULL,
	"status" "punch_card_status" DEFAULT 'active' NOT NULL,
	"issued_by_location_id" uuid,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "punch_card_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "punch_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"location_id" uuid,
	"admin_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "punch_card" ADD CONSTRAINT "punch_card_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "punch_card" ADD CONSTRAINT "punch_card_issued_by_location_id_location_id_fk" FOREIGN KEY ("issued_by_location_id") REFERENCES "public"."location"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "punch_event" ADD CONSTRAINT "punch_event_card_id_punch_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."punch_card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "punch_event" ADD CONSTRAINT "punch_event_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "punch_event" ADD CONSTRAINT "punch_event_admin_user_id_user_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "customer_email" ON "customer" USING btree ("email");--> statement-breakpoint
CREATE INDEX "punch_card_customer" ON "punch_card" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "punch_event_card_created_at" ON "punch_event" USING btree ("card_id","created_at");