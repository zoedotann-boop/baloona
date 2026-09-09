-- Tag the event-hour slots with the weekdays they are offered on, so the form
-- can show only the slots that apply to the chosen date (Sun–Thu vs Friday).
-- Branches that received the field from 0014 have options without `days`;
-- rewrite them to the day-aware shape. Idempotent: sets the full option list.
UPDATE "birthday_form_field"
SET "options" = '[{"value":"17:00-19:00","label":{"he":"ימים א׳–ה׳: 17:00–19:00","en":"Sun–Thu: 17:00–19:00"},"days":[0,1,2,3,4]},{"value":"13:00-15:00","label":{"he":"יום ו׳: 13:00–15:00","en":"Fri: 13:00–15:00"},"days":[5]},{"value":"16:00-18:00","label":{"he":"יום ו׳: 16:00–18:00","en":"Fri: 16:00–18:00"},"days":[5]}]'::jsonb
WHERE "key" = 'eventHour';
