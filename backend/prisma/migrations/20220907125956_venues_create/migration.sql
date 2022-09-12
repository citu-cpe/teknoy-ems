-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "venuesId" TEXT;

-- CreateTable
CREATE TABLE "Venues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "Venues_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_venuesId_fkey" FOREIGN KEY ("venuesId") REFERENCES "Venues"("id") ON DELETE SET NULL ON UPDATE CASCADE;
