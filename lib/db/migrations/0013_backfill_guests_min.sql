-- Backfill: the guest-count field carries a hard minimum of 25 in seed data
-- (see `birthdayFormFieldRows`), but branches provisioned before that value
-- existed — or edited in the admin before it was set — kept `min_value` NULL,
-- so the form and server accepted any count >= 0. Set the floor to 25 for every
-- guest-count field that still has no minimum.
UPDATE "birthday_form_field"
SET "min_value" = 25
WHERE "key" = 'guestsCount' AND "min_value" IS NULL;
