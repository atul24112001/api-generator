/*
  Warnings:

  - A unique constraint covering the columns `[title,userId]` on the table `api` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "api_title_userId_key" ON "api"("title", "userId");
