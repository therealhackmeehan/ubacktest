/*
  Warnings:

  - Added the required column `profitLoss` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profitLossAnnualized` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timepoints` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "profitLoss" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "profitLossAnnualized" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "timepoints" INTEGER NOT NULL;
