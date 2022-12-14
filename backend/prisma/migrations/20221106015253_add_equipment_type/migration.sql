-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('PHOTO_DOCUMENTATION', 'VIDEO_DOCUMENTATION', 'PHOTO_AND_VIDEO_DOCUMENTATION', 'LIVE_STREAMING', 'MUSIC_BAND', 'OTHERS');

UPDATE "Equipment"
  SET "type" = 'OTHERS';

ALTER TABLE "Equipment"
  ALTER COLUMN "type" TYPE "EquipmentType" USING "type"::"EquipmentType";
