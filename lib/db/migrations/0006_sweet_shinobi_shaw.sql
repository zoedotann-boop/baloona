-- Reviews stop being translatable: a review is its author's own words, so it is
-- stored once, in whatever language it was written, and shown as-is.
--
-- The generated statement was a bare `SET DATA TYPE text`, which would have cast
-- the whole jsonb object and left every existing review reading
-- `{"he":"…","en":"…"}`. `USING` keeps the Hebrew source instead, falling back to
-- English for any row that only had that, and to an empty string so the NOT NULL
-- holds.
ALTER TABLE "review" ALTER COLUMN "text" SET DATA TYPE text
  USING coalesce("text"->>'he', "text"->>'en', '');
