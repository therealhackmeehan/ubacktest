-- CreateTable
CREATE TABLE "PackageInfo" (
    "info" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "PackageInfo_date_key" ON "PackageInfo"("date");
