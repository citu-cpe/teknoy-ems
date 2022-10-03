/*
  Warnings:

  - You are about to drop the column `username` on the `ActivityLog` table. All the data in the column will be lost.
  - Made the column `entityId` on table `ActivityLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `ActivityLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "username",
ALTER COLUMN "entityId" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;
