/*
  Warnings:

  - A unique constraint covering the columns `[title,userId]` on the table `project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "project_title_userId_key" ON "project"("title", "userId");
