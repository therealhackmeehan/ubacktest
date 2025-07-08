-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "username" TEXT,
    "lastActiveTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "paymentProcessorUserId" TEXT,
    "checkoutSessionId" TEXT,
    "subscriptionStatus" TEXT,
    "subscriptionPlan" TEXT,
    "sendNewsletter" BOOLEAN NOT NULL DEFAULT false,
    "datePaid" TIMESTAMP(3),
    "credits" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Strategy" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,

    CONSTRAINT "Strategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT true,
    "fromStrategyID" TEXT,
    "length" INTEGER NOT NULL,
    "pl" DOUBLE PRECISION,
    "plWCosts" DOUBLE PRECISION,
    "cagr" DOUBLE PRECISION,
    "numTrades" INTEGER NOT NULL,
    "numProfTrades" INTEGER NOT NULL,
    "percTradesProf" DOUBLE PRECISION,
    "sharpeRatio" DOUBLE PRECISION,
    "sortinoRatio" DOUBLE PRECISION,
    "maxDrawdown" DOUBLE PRECISION,
    "maxGain" DOUBLE PRECISION,
    "meanReturn" DOUBLE PRECISION,
    "stddevReturn" DOUBLE PRECISION,
    "maxReturn" DOUBLE PRECISION,
    "minReturn" DOUBLE PRECISION,
    "timestamp" DOUBLE PRECISION[],
    "open" DOUBLE PRECISION[],
    "close" DOUBLE PRECISION[],
    "high" DOUBLE PRECISION[],
    "low" DOUBLE PRECISION[],
    "volume" DOUBLE PRECISION[],
    "signal" DOUBLE PRECISION[],
    "returns" DOUBLE PRECISION[],
    "sp" DOUBLE PRECISION[],
    "portfolio" DOUBLE PRECISION[],
    "portfolioWithCosts" DOUBLE PRECISION[],
    "cash" DOUBLE PRECISION[],
    "equity" DOUBLE PRECISION[],
    "cashWithCosts" DOUBLE PRECISION[],
    "equityWithCosts" DOUBLE PRECISION[],
    "userDefinedData" JSONB,
    "formInputs" JSONB NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Share" (
    "id" TEXT NOT NULL,
    "sharedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT NOT NULL,
    "receiverID" TEXT NOT NULL,
    "resultID" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyStats" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "prevDayViewsChangePercent" TEXT NOT NULL DEFAULT '0',
    "userCount" INTEGER NOT NULL DEFAULT 0,
    "paidUserCount" INTEGER NOT NULL DEFAULT 0,
    "userDelta" INTEGER NOT NULL DEFAULT 0,
    "paidUserDelta" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "DailyStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageViewSource" (
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dailyStatsId" INTEGER,
    "visitors" INTEGER NOT NULL,

    CONSTRAINT "PageViewSource_pkey" PRIMARY KEY ("date","name")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthIdentity" (
    "providerName" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "providerData" TEXT NOT NULL DEFAULT '{}',
    "authId" TEXT NOT NULL,

    CONSTRAINT "AuthIdentity_pkey" PRIMARY KEY ("providerName","providerUserId")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_paymentProcessorUserId_key" ON "User"("paymentProcessorUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Strategy_userId_name_key" ON "Strategy"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Result_userId_name_key" ON "Result"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Share_resultID_receiverID_key" ON "Share"("resultID", "receiverID");

-- CreateIndex
CREATE UNIQUE INDEX "DailyStats_date_key" ON "DailyStats"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userId_key" ON "Auth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- AddForeignKey
ALTER TABLE "Strategy" ADD CONSTRAINT "Strategy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_fromStrategyID_fkey" FOREIGN KEY ("fromStrategyID") REFERENCES "Strategy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_receiverID_fkey" FOREIGN KEY ("receiverID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_resultID_fkey" FOREIGN KEY ("resultID") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageViewSource" ADD CONSTRAINT "PageViewSource_dailyStatsId_fkey" FOREIGN KEY ("dailyStatsId") REFERENCES "DailyStats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthIdentity" ADD CONSTRAINT "AuthIdentity_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;
