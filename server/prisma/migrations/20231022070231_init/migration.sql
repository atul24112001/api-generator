/*
  Warnings:

  - Added the required column `apiId` to the `data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "data" ADD COLUMN     "apiId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "data" ADD CONSTRAINT "data_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
