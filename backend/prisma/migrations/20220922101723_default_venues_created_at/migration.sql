/*
  Warnings:

  - Made the column `createdAt` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Equipment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Equipment" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;
