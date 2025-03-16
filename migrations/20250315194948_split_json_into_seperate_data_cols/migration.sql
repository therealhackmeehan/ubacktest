/*
  Warnings:

  - You are about to drop the column `data` on the `Result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "data",
ADD COLUMN     "cash" DOUBLE PRECISION[],
ADD COLUMN     "cashWithCosts" DOUBLE PRECISION[],
ADD COLUMN     "close" DOUBLE PRECISION[],
ADD COLUMN     "equity" DOUBLE PRECISION[],
ADD COLUMN     "equityWithCosts" DOUBLE PRECISION[],
ADD COLUMN     "high" DOUBLE PRECISION[],
ADD COLUMN     "low" DOUBLE PRECISION[],
ADD COLUMN     "open" DOUBLE PRECISION[],
ADD COLUMN     "portfolio" DOUBLE PRECISION[],
ADD COLUMN     "portfolioWithCosts" DOUBLE PRECISION[],
ADD COLUMN     "returns" DOUBLE PRECISION[],
ADD COLUMN     "signal" DOUBLE PRECISION[],
ADD COLUMN     "sp" DOUBLE PRECISION[],
ADD COLUMN     "timestamp" DOUBLE PRECISION[],
ADD COLUMN     "userDefinedData" JSONB,
ADD COLUMN     "volume" DOUBLE PRECISION[];
