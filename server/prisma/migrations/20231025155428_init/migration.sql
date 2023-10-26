/*
  Warnings:

  - Added the required column `subscriptionType` to the `init_order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "init_order" ADD COLUMN     "subscriptionType" "Subscription" NOT NULL;
