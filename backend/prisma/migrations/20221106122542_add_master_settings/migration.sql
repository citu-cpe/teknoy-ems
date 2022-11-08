-- CreateTable
CREATE TABLE "MasterSettings" (
    "id" TEXT NOT NULL,
    "allowOrganizersCRUD" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MasterSettings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "MasterSettings" ("id", "allowOrganizersCRUD") VALUES
(uuid_generate_v4(), false);
