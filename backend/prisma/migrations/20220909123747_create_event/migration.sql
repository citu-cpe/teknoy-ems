-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ONGOING', 'RESERVED', 'DONE', 'CANCELED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CORPORATE', 'ACADEMIC', 'SEMINAR', 'CONFERENCE', 'CAMPUS_WIDE', 'VIRTUAL', 'SPORTS', 'OTHERS');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "approvedBy" TEXT NOT NULL,
    "viewAccess" "ViewAccess" NOT NULL,
    "type" "EventType" NOT NULL,
    "additionalNotes" TEXT,
    "organizerId" TEXT NOT NULL,
    "encodedById" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenuesOnEvents" (
    "eventId" TEXT NOT NULL,
    "venuesId" TEXT NOT NULL,

    CONSTRAINT "VenuesOnEvents_pkey" PRIMARY KEY ("eventId","venuesId")
);

-- CreateTable
CREATE TABLE "EquipmentsOnEvents" (
    "eventId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,

    CONSTRAINT "EquipmentsOnEvents_pkey" PRIMARY KEY ("eventId","equipmentId")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_encodedById_fkey" FOREIGN KEY ("encodedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenuesOnEvents" ADD CONSTRAINT "VenuesOnEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenuesOnEvents" ADD CONSTRAINT "VenuesOnEvents_venuesId_fkey" FOREIGN KEY ("venuesId") REFERENCES "Venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentsOnEvents" ADD CONSTRAINT "EquipmentsOnEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentsOnEvents" ADD CONSTRAINT "EquipmentsOnEvents_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
