-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isFirstLogin" BOOLEAN NOT NULL DEFAULT true;

UPDATE "User"
SET "isFirstLogin" = false;