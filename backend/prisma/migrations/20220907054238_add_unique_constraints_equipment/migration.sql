/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Equipment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serial]` on the table `Equipment` will be added. If there are existing duplicate values, this will fail.

*/

DELETE FROM "Equipment" e1 USING (
      SELECT MIN(ctid) as ctid, name
        FROM "Equipment" 
        GROUP BY name HAVING COUNT(*) > 1
      ) e2
      WHERE e1.name = e2.name 
      AND e1.ctid != e2.ctid;

DELETE FROM "Equipment" e1 USING (
      SELECT MIN(ctid) as ctid, serial
        FROM "Equipment" 
        GROUP BY serial HAVING COUNT(*) > 1
      ) e2
      WHERE e1.serial = e2.serial 
      AND e1.ctid != e2.ctid;

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_name_key" ON "Equipment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_serial_key" ON "Equipment"("serial");
