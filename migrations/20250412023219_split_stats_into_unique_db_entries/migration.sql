/*
  Warnings:

  - You are about to drop the column `profitLoss` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `profitLossAnnualized` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `timepoints` on the `Result` table. All the data in the column will be lost.
  - Added the required column `length` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numProfTrades` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numTrades` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "profitLoss",
DROP COLUMN "profitLossAnnualized",
DROP COLUMN "timepoints",
ADD COLUMN     "cagr" DOUBLE PRECISION,
ADD COLUMN     "length" INTEGER NOT NULL,
ADD COLUMN     "maxDrawdown" DOUBLE PRECISION,
ADD COLUMN     "maxGain" DOUBLE PRECISION,
ADD COLUMN     "maxReturn" DOUBLE PRECISION,
ADD COLUMN     "meanReturn" DOUBLE PRECISION,
ADD COLUMN     "minReturn" DOUBLE PRECISION,
ADD COLUMN     "numProfTrades" INTEGER NOT NULL,
ADD COLUMN     "numTrades" INTEGER NOT NULL,
ADD COLUMN     "percTradesProf" DOUBLE PRECISION,
ADD COLUMN     "pl" DOUBLE PRECISION,
ADD COLUMN     "plWCosts" DOUBLE PRECISION,
ADD COLUMN     "sharpeRatio" DOUBLE PRECISION,
ADD COLUMN     "sortinoRatio" DOUBLE PRECISION,
ADD COLUMN     "stddevReturn" DOUBLE PRECISION;
