-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('PUBLIC', 'PRIVATE', 'IMPORTANT');

-- CreateEnum
CREATE TYPE "Action" AS ENUM ('ADDED', 'EDITED', 'DELETED', 'RESERVED', 'REGISTERED');

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "action" "Action" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "entityName" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "priority" "Priority" NOT NULL,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);
