/*
  Warnings:

  - The values [CORPORATE,ACADEMIC,SEMINAR,CONFERENCE,CAMPUS_WIDE,VIRTUAL,SPORTS] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `type` on the `Equipment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
ALTER TABLE "Event"
  ALTER COLUMN "type" DROP NOT NULL;
UPDATE "Event"
  SET "type" = NULL;

CREATE TYPE "EventType_new" AS ENUM ('PHOTO_DOCUMENTATION', 'VIDEO_DOCUMENTATION', 'PHOTO_AND_VIDEO_DOCUMENTATION', 'LIVE_STREAMING', 'MUSIC_BAND', 'OTHERS');
ALTER TABLE "Event" ALTER COLUMN "type" TYPE "EventType_new" USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";

UPDATE "Event"
  SET "type" = 'OTHERS';
COMMIT;

ALTER TABLE "Equipment"
  ALTER COLUMN "type" TYPE TEXT USING "type"::TEXT;

-- DropEnum
DROP TYPE "EquipmentType";
