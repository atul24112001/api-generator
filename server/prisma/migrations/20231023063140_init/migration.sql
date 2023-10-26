/*
  Warnings:

  - A unique constraint covering the columns `[title,projectId]` on the table `api` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `api` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRequests` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Subscription" AS ENUM ('standard', 'premium');

-- DropIndex
DROP INDEX "api_title_userId_key";

-- AlterTable
ALTER TABLE "api" ADD COLUMN     "projectId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "totalRequests" INTEGER NOT NULL,
ADD COLUMN     "type" "Subscription" NOT NULL;

-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_id_key" ON "project"("id");

-- CreateIndex
CREATE UNIQUE INDEX "api_title_projectId_key" ON "api"("title", "projectId");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api" ADD CONSTRAINT "api_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
