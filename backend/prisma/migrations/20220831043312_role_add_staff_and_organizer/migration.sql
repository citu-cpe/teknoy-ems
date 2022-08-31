/*
  Warnings:

  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/

UPDATE "User"
SET "roles" = NULL
WHERE "roles" = ARRAY['USER']::"Role"[];

UPDATE "User"
SET "roles" = ARRAY['ADMIN']::"Role"[]
WHERE "roles" = ARRAY['USER', 'ADMIN']::"Role"[];

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('STAFF', 'ADMIN', 'ORGANIZER');
ALTER TABLE "User" ALTER COLUMN "roles" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "roles" TYPE "Role_new"[] USING ("roles"::text::"Role_new"[]);
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "roles" DROP DEFAULT;

UPDATE "User"
SET "roles" = ARRAY['STAFF']::"Role"[]
WHERE "roles" IS NULL;
