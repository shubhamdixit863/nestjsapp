/*
  Warnings:

  - A unique constraint covering the columns `[subscriptionId]` on the table `UserSubscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserSubscriptions_subscriptionId_key" ON "UserSubscriptions"("subscriptionId");
