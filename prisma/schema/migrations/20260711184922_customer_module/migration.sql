-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "customerCode" TEXT NOT NULL,
    "membershipLevel" TEXT NOT NULL DEFAULT 'regular',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerProfile" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "profileImage" TEXT,
    "occupation" TEXT,
    "companyName" TEXT,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'bn',
    "preferredCurrency" TEXT NOT NULL DEFAULT 'BDT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerPreference" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "preferredZoneId" INTEGER,
    "preferredEventTypeId" INTEGER,
    "preferredBudget" DOUBLE PRECISION,
    "preferredGuestRange" TEXT,
    "preferredContactMethod" TEXT,
    "preferredCommunicationTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerEvent" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "eventTypeId" INTEGER,
    "eventTitle" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3),
    "guestCount" INTEGER,
    "zoneId" INTEGER,
    "estimatedBudget" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerGuest" (
    "id" SERIAL NOT NULL,
    "customerEventId" INTEGER NOT NULL,
    "guestType" TEXT NOT NULL,
    "guestCount" INTEGER NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerGuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerAddress" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "label" TEXT,
    "receiverName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "countryId" INTEGER NOT NULL,
    "divisionId" INTEGER,
    "districtId" INTEGER,
    "cityId" INTEGER,
    "areaId" INTEGER,
    "zoneId" INTEGER,
    "address" TEXT NOT NULL,
    "landmark" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerFavoritePackage" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "packageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerFavoritePackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerSavedCalculation" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "calculatorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "estimatedPrice" DOUBLE PRECISION,
    "selectedServices" JSONB,
    "status" TEXT NOT NULL DEFAULT 'saved',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerSavedCalculation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerQuotation" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "quotationNumber" TEXT NOT NULL,
    "calculatorId" INTEGER,
    "bookingId" INTEGER,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalAmount" DOUBLE PRECISION NOT NULL,
    "validUntil" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerQuotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerBookingHistory" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "eventTypeId" INTEGER,
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "bookingStatus" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerBookingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerPaymentMethod" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "paymentType" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "provider" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerPaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerWallet" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rewardBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerTransaction" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "walletId" INTEGER NOT NULL,
    "bookingId" INTEGER,
    "transactionType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reference" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerNotification" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerSupport" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'low',
    "status" TEXT NOT NULL DEFAULT 'open',
    "assignedAdminId" INTEGER,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerSupport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerActivity" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "activityType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ipAddress" TEXT,
    "deviceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerReferral" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "referralCode" TEXT NOT NULL,
    "referredCustomerId" INTEGER NOT NULL,
    "rewardAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerReferral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerReward" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "rewardType" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "description" TEXT,
    "expiryDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerReview" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "review" TEXT,
    "serviceQuality" INTEGER,
    "supportExperience" INTEGER,
    "bookingExperience" INTEGER,
    "overallExperience" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerSetting" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'bn',
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "emailNotification" BOOLEAN NOT NULL DEFAULT true,
    "pushNotification" BOOLEAN NOT NULL DEFAULT true,
    "smsNotification" BOOLEAN NOT NULL DEFAULT true,
    "marketingNotification" BOOLEAN NOT NULL DEFAULT false,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_key" ON "Customer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerCode_key" ON "Customer"("customerCode");

-- CreateIndex
CREATE INDEX "Customer_deletedAt_idx" ON "Customer"("deletedAt");

-- CreateIndex
CREATE INDEX "Customer_status_idx" ON "Customer"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_customerId_key" ON "CustomerProfile"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerPreference_customerId_key" ON "CustomerPreference"("customerId");

-- CreateIndex
CREATE INDEX "CustomerEvent_customerId_idx" ON "CustomerEvent"("customerId");

-- CreateIndex
CREATE INDEX "CustomerGuest_customerEventId_idx" ON "CustomerGuest"("customerEventId");

-- CreateIndex
CREATE INDEX "CustomerAddress_customerId_idx" ON "CustomerAddress"("customerId");

-- CreateIndex
CREATE INDEX "CustomerFavoritePackage_customerId_idx" ON "CustomerFavoritePackage"("customerId");

-- CreateIndex
CREATE INDEX "CustomerSavedCalculation_customerId_idx" ON "CustomerSavedCalculation"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerQuotation_quotationNumber_key" ON "CustomerQuotation"("quotationNumber");

-- CreateIndex
CREATE INDEX "CustomerQuotation_customerId_idx" ON "CustomerQuotation"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerBookingHistory_bookingId_key" ON "CustomerBookingHistory"("bookingId");

-- CreateIndex
CREATE INDEX "CustomerBookingHistory_customerId_idx" ON "CustomerBookingHistory"("customerId");

-- CreateIndex
CREATE INDEX "CustomerPaymentMethod_customerId_idx" ON "CustomerPaymentMethod"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerWallet_customerId_key" ON "CustomerWallet"("customerId");

-- CreateIndex
CREATE INDEX "CustomerTransaction_customerId_idx" ON "CustomerTransaction"("customerId");

-- CreateIndex
CREATE INDEX "CustomerTransaction_walletId_idx" ON "CustomerTransaction"("walletId");

-- CreateIndex
CREATE INDEX "CustomerNotification_customerId_idx" ON "CustomerNotification"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerSupport_ticketNumber_key" ON "CustomerSupport"("ticketNumber");

-- CreateIndex
CREATE INDEX "CustomerSupport_customerId_idx" ON "CustomerSupport"("customerId");

-- CreateIndex
CREATE INDEX "CustomerSupport_assignedAdminId_idx" ON "CustomerSupport"("assignedAdminId");

-- CreateIndex
CREATE INDEX "CustomerActivity_customerId_idx" ON "CustomerActivity"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerReferral_referredCustomerId_key" ON "CustomerReferral"("referredCustomerId");

-- CreateIndex
CREATE INDEX "CustomerReferral_customerId_idx" ON "CustomerReferral"("customerId");

-- CreateIndex
CREATE INDEX "CustomerReward_customerId_idx" ON "CustomerReward"("customerId");

-- CreateIndex
CREATE INDEX "CustomerReview_customerId_idx" ON "CustomerReview"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerSetting_customerId_key" ON "CustomerSetting"("customerId");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerPreference" ADD CONSTRAINT "CustomerPreference_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerEvent" ADD CONSTRAINT "CustomerEvent_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerGuest" ADD CONSTRAINT "CustomerGuest_customerEventId_fkey" FOREIGN KEY ("customerEventId") REFERENCES "CustomerEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerFavoritePackage" ADD CONSTRAINT "CustomerFavoritePackage_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSavedCalculation" ADD CONSTRAINT "CustomerSavedCalculation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerQuotation" ADD CONSTRAINT "CustomerQuotation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerBookingHistory" ADD CONSTRAINT "CustomerBookingHistory_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerPaymentMethod" ADD CONSTRAINT "CustomerPaymentMethod_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerWallet" ADD CONSTRAINT "CustomerWallet_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerTransaction" ADD CONSTRAINT "CustomerTransaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerTransaction" ADD CONSTRAINT "CustomerTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "CustomerWallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerNotification" ADD CONSTRAINT "CustomerNotification_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSupport" ADD CONSTRAINT "CustomerSupport_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSupport" ADD CONSTRAINT "CustomerSupport_assignedAdminId_fkey" FOREIGN KEY ("assignedAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerActivity" ADD CONSTRAINT "CustomerActivity_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReferral" ADD CONSTRAINT "CustomerReferral_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReferral" ADD CONSTRAINT "CustomerReferral_referredCustomerId_fkey" FOREIGN KEY ("referredCustomerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReward" ADD CONSTRAINT "CustomerReward_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReview" ADD CONSTRAINT "CustomerReview_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSetting" ADD CONSTRAINT "CustomerSetting_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
