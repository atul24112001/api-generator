/*
  Warnings:

  - Added the required column `init_orderId` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_detailsId` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('success', 'failure');

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "init_orderId" INTEGER NOT NULL,
ADD COLUMN     "payment_detailsId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "init_order" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "init_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_details" (
    "id" SERIAL NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "payment_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "init_order_id_key" ON "init_order"("id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_details_id_key" ON "payment_details"("id");

-- AddForeignKey
ALTER TABLE "init_order" ADD CONSTRAINT "init_order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_details" ADD CONSTRAINT "payment_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_init_orderId_fkey" FOREIGN KEY ("init_orderId") REFERENCES "init_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_payment_detailsId_fkey" FOREIGN KEY ("payment_detailsId") REFERENCES "payment_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
