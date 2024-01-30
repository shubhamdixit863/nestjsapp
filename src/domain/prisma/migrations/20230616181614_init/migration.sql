/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `priceId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `tenure` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
DROP COLUMN "priceId",
DROP COLUMN "tenure";
