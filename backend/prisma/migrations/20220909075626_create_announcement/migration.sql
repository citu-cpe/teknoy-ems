-- CreateEnum
CREATE TYPE "ViewAccess" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "viewAccess" "ViewAccess" NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);
 