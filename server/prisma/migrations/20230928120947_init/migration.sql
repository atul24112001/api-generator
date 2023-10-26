/*
  Warnings:

  - You are about to drop the `api_modle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "api_modle" DROP CONSTRAINT "api_modle_apiId_fkey";

-- DropTable
DROP TABLE "api_modle";

-- CreateTable
CREATE TABLE "api_model" (
    "id" SERIAL NOT NULL,
    "apiId" INTEGER NOT NULL,
    "model" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_model_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_model_id_key" ON "api_model"("id");

-- AddForeignKey
ALTER TABLE "api_model" ADD CONSTRAINT "api_model_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
