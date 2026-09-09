-- Drop the day-name prefix from the event-hour option labels: the form already
-- shows only the slots offered on the chosen date, so "יום ו׳:" / "ימים א׳–ה׳:"
-- was redundant. Labels become just the time range. Idempotent: sets the list.
UPDATE "birthday_form_field"
SET "options" = '[{"value":"17:00-19:00","label":{"he":"17:00–19:00","en":"17:00–19:00"},"days":[0,1,2,3,4]},{"value":"13:00-15:00","label":{"he":"13:00–15:00","en":"13:00–15:00"},"days":[5]},{"value":"16:00-18:00","label":{"he":"16:00–18:00","en":"16:00–18:00"},"days":[5]}]'::jsonb
WHERE "key" = 'eventHour';
