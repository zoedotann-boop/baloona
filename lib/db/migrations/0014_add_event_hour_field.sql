-- Add the "event hour" select field to existing birthday forms.
-- The time-slot field ships in seed data (see `birthdayFormFieldRows`) right
-- after the event date, but branches provisioned before it existed have no
-- `eventHour` row, so their public form would not ask for a time slot. Make
-- room after the date field (sort_order 0) and insert the field for every
-- location that has a birthday form but not yet this field.
UPDATE "birthday_form_field" f
SET "sort_order" = f."sort_order" + 1
WHERE f."sort_order" >= 1
  AND NOT EXISTS (
    SELECT 1 FROM "birthday_form_field" e
    WHERE e."location_id" = f."location_id" AND e."key" = 'eventHour'
  );--> statement-breakpoint
INSERT INTO "birthday_form_field"
  ("location_id", "key", "label", "type", "options", "is_required", "is_visible", "sort_order")
SELECT
  bc."location_id",
  'eventHour',
  '{"he":"שעת האירוע","en":"Event time"}'::jsonb,
  'select',
  '[{"value":"17:00-19:00","label":{"he":"ימים א׳–ה׳: 17:00–19:00","en":"Sun–Thu: 17:00–19:00"}},{"value":"13:00-15:00","label":{"he":"יום ו׳: 13:00–15:00","en":"Fri: 13:00–15:00"}},{"value":"16:00-18:00","label":{"he":"יום ו׳: 16:00–18:00","en":"Fri: 16:00–18:00"}}]'::jsonb,
  true,
  true,
  1
FROM "birthday_content" bc
WHERE NOT EXISTS (
  SELECT 1 FROM "birthday_form_field" f
  WHERE f."location_id" = bc."location_id" AND f."key" = 'eventHour'
);
