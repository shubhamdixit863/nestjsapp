/*
  Warnings:

  - You are about to drop the column `name` on the `Price` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Price" DROP COLUMN "name",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "features" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "planType" TEXT NOT NULL DEFAULT '';
