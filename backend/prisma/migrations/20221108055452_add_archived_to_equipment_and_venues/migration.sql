-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Venues" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;
