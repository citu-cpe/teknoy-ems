/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Venues` will be added. If there are existing duplicate values, this will fail.

*/
-- Delete duplicate names
DELETE FROM "Venues" v1 USING (
      SELECT MIN(ctid) as ctid, name
        FROM "Venues" 
        GROUP BY name HAVING COUNT(*) > 1
      ) v2
      WHERE v1.name = v2.name 
      AND v1.ctid != v2.ctid;

-- AlterTable
ALTER TABLE "Venues" ALTER COLUMN "notes" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Venues_name_key" ON "Venues"("name");
