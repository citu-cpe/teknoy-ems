/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_username_key";

ALTER TABLE "User"
ADD COLUMN "name" TEXT;

UPDATE "User"
SET "name" = "User"."username";

ALTER TABLE "User"
ALTER COLUMN "name" SET NOT NULL;

-- Drop username
ALTER TABLE "User" DROP COLUMN "username";
