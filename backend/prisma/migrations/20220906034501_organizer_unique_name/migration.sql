/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Organizer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Organizer_name_key" ON "Organizer"("name");
