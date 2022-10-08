ALTER TABLE "Event"
  ADD COLUMN "contact" TEXT NOT NULL DEFAULT '';

UPDATE "Event"
  SET "contact" = "Event"."contactNumber";

ALTER TABLE "Event"
  DROP COLUMN "contactNumber";
