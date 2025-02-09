-- CreateTable
CREATE TABLE "Share" (
    "id" TEXT NOT NULL,
    "sharedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT NOT NULL,
    "receiverID" TEXT NOT NULL,
    "resultID" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Share_resultID_receiverID_key" ON "Share"("resultID", "receiverID");

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_receiverID_fkey" FOREIGN KEY ("receiverID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_resultID_fkey" FOREIGN KEY ("resultID") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;
