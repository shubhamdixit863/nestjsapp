/*
  Warnings:

  - You are about to drop the `_PriceToProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `Price` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PriceToProduct" DROP CONSTRAINT "_PriceToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_PriceToProduct" DROP CONSTRAINT "_PriceToProduct_B_fkey";

-- AlterTable
ALTER TABLE "Price" ADD COLUMN     "productId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_PriceToProduct";

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
