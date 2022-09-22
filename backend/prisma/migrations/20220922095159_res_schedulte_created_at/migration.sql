/*
  Warnings:

  - Made the column `createdAt` on table `Schedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Schedule` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Schedule" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;
