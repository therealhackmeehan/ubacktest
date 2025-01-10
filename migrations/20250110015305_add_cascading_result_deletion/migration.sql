-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_fromStrategyID_fkey";

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_fromStrategyID_fkey" FOREIGN KEY ("fromStrategyID") REFERENCES "Strategy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
