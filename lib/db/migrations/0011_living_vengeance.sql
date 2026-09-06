CREATE TABLE "review_photo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"location_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt" jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "review_photo" ADD CONSTRAINT "review_photo_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
-- Backfill: the "הורים מספרים" masonry used to borrow gallery images from the
-- 4th onward (`galleryImages.slice(3)`). Seed each existing branch's review
-- photos from exactly those rows so the section looks unchanged after deploy.
INSERT INTO "review_photo" ("location_id", "url", "alt", "sort_order")
SELECT
	"location_id",
	"url",
	"alt",
	(ROW_NUMBER() OVER (PARTITION BY "location_id" ORDER BY "sort_order", "created_at") - 1)::integer
FROM "gallery_image"
WHERE "sort_order" >= 3;