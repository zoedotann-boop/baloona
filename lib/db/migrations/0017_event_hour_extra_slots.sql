-- Add extra event-hour slots: Sun–Thu gains 16:30–18:30, and Friday gains
-- 13:30–15:30 and 15:30–17:30. Slots stay tagged with the weekdays they are
-- offered on so the form shows only the ones that apply to the chosen date.
-- Idempotent: sets the full option list.
UPDATE "birthday_form_field"
SET "options" = '[{"value":"16:30-18:30","label":{"he":"16:30–18:30","en":"16:30–18:30"},"days":[0,1,2,3,4]},{"value":"17:00-19:00","label":{"he":"17:00–19:00","en":"17:00–19:00"},"days":[0,1,2,3,4]},{"value":"13:00-15:00","label":{"he":"13:00–15:00","en":"13:00–15:00"},"days":[5]},{"value":"13:30-15:30","label":{"he":"13:30–15:30","en":"13:30–15:30"},"days":[5]},{"value":"15:30-17:30","label":{"he":"15:30–17:30","en":"15:30–17:30"},"days":[5]},{"value":"16:00-18:00","label":{"he":"16:00–18:00","en":"16:00–18:00"},"days":[5]}]'::jsonb
WHERE "key" = 'eventHour';
