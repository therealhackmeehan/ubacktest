-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_fromStrategyID_fkey";

-- AlterTable
ALTER TABLE "Result" ALTER COLUMN "fromStrategyID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_fromStrategyID_fkey" FOREIGN KEY ("fromStrategyID") REFERENCES "Strategy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
