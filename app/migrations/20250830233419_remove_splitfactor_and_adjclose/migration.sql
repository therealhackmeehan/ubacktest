/*
  Warnings:

  - You are about to drop the column `adjClose` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `splitFactor` on the `Result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "adjClose",
DROP COLUMN "splitFactor";
