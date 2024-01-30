-- CreateTable
CREATE TABLE "UserSubscriptions" (
    "id" SERIAL NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "subscriptionId" TEXT NOT NULL,
    "customerPortalLink" TEXT NOT NULL DEFAULT 'https://billing.stripe.com/p/login/14k3fWdCP31T3oQ000',
    "productId" TEXT NOT NULL DEFAULT '',
    "priceId" TEXT NOT NULL DEFAULT '',
    "invoiceUrl" TEXT NOT NULL DEFAULT '',
    "customerId" TEXT NOT NULL DEFAULT '',
    "subscriptionStartTime" INTEGER NOT NULL,
    "subscriptionEndTime" INTEGER NOT NULL,
    "productMetaData" TEXT NOT NULL DEFAULT '',
    "paymentMethodsData" TEXT NOT NULL DEFAULT '',
    "amount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSubscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPayments" (
    "id" SERIAL NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "uniquePaymentId" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "productId" TEXT NOT NULL DEFAULT '',
    "priceId" TEXT NOT NULL DEFAULT '',
    "invoiceUrl" TEXT NOT NULL DEFAULT '',
    "customerId" TEXT NOT NULL DEFAULT '',
    "productMetaData" TEXT NOT NULL DEFAULT '',
    "amount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPayments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tenure" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL,
    "productImage" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "tax_no" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL DEFAULT '',
    "avtarUrl" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "areaCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "permission" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleToUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPayments_uniquePaymentId_key" ON "UserPayments"("uniquePaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_productId_key" ON "Product"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_uniqueId_key" ON "Users"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUsers_AB_unique" ON "_RoleToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUsers_B_index" ON "_RoleToUsers"("B");

-- AddForeignKey
ALTER TABLE "_RoleToUsers" ADD CONSTRAINT "_RoleToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUsers" ADD CONSTRAINT "_RoleToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
