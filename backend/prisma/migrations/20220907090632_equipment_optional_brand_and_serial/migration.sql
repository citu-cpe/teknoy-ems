/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Equipment` will be added. If there are existing duplicate values, this will fail.

*/

-- Delete duplicate names
DELETE FROM "Equipment" e1 USING (
      SELECT MIN(ctid) as ctid, name
        FROM "Equipment" 
        GROUP BY name HAVING COUNT(*) > 1
      ) e2
      WHERE e1.name = e2.name 
      AND e1.ctid != e2.ctid;

-- AlterTable
ALTER TABLE "Equipment" ALTER COLUMN "brand" DROP NOT NULL,
ALTER COLUMN "serial" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_name_key" ON "Equipment"("name");
