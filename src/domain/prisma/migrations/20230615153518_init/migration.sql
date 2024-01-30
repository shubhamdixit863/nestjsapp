-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "priceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tenure" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PriceToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PriceToProduct_AB_unique" ON "_PriceToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_PriceToProduct_B_index" ON "_PriceToProduct"("B");

-- AddForeignKey
ALTER TABLE "_PriceToProduct" ADD CONSTRAINT "_PriceToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Price"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PriceToProduct" ADD CONSTRAINT "_PriceToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
