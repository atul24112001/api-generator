/*
  Warnings:

  - A unique constraint covering the columns `[apiId]` on the table `api_model` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "api_model_apiId_key" ON "api_model"("apiId");
