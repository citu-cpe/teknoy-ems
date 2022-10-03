-- AlterTable
ALTER TABLE "ActivityLog" ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "userId" TEXT;


UPDATE "ActivityLog" SET "entityId" = 'f3666617-01ec-4f7f-8bd9-6d337268c30a', "userId" ='2cf38670-0a8a-41e9-9018-e8b8a9b36486';


-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
