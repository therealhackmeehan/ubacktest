/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Strategy` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Strategy_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Strategy_userId_name_key" ON "Strategy"("userId", "name");
