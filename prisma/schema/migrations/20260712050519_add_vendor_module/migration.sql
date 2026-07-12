-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "vendorCode" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "logo" TEXT,
    "coverImage" TEXT,
    "description" TEXT,
    "businessType" TEXT NOT NULL,
    "tradeLicenseNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorAvailability" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "availableFrom" TIMESTAMP(3) NOT NULL,
    "availableTo" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorBankAccount" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "bankName" TEXT,
    "branchName" TEXT,
    "accountName" TEXT,
    "accountNumber" TEXT,
    "routingNumber" TEXT,
    "mobileBankingProvider" TEXT,
    "mobileBankingNumber" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorBusiness" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "businessType" TEXT,
    "businessCategory" TEXT,
    "tradeLicense" TEXT,
    "tinNumber" TEXT,
    "binNumber" TEXT,
    "companyRegistration" TEXT,
    "businessAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorBusiness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorCalendar" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "availabilityStatus" TEXT NOT NULL DEFAULT 'busy',
    "bookingId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorCategory" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "subcategoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorDocument" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "verificationStatus" TEXT NOT NULL DEFAULT 'pending',
    "verifiedBy" INTEGER,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorEmployee" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "employeeName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "designation" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "joinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorGallery" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "portfolioId" INTEGER,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorOwner" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nidNumber" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorPayout" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "walletId" INTEGER NOT NULL,
    "requestedAmount" DOUBLE PRECISION NOT NULL,
    "approvedAmount" DOUBLE PRECISION,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "processedBy" INTEGER,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorPayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorPortfolio" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorPortfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorPricing" (
    "id" SERIAL NOT NULL,
    "vendorServiceId" INTEGER NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "minimumPrice" DOUBLE PRECISION,
    "maximumPrice" DOUBLE PRECISION,
    "priceType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorPricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorProfile" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "about" TEXT,
    "experience" TEXT,
    "establishedYear" INTEGER,
    "website" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "linkedin" TEXT,
    "officeAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorService" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "serviceName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorServiceZone" (
    "id" SERIAL NOT NULL,
    "vendorServiceId" INTEGER NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorServiceZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorSetting" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "autoAcceptAssignment" BOOLEAN NOT NULL DEFAULT false,
    "notificationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailNotification" BOOLEAN NOT NULL DEFAULT true,
    "smsNotification" BOOLEAN NOT NULL DEFAULT true,
    "pushNotification" BOOLEAN NOT NULL DEFAULT true,
    "workingHours" TEXT,
    "holidayMode" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorTransaction" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "walletId" INTEGER NOT NULL,
    "bookingId" INTEGER,
    "transactionType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reference" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorVerification" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "verificationType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "remarks" TEXT,
    "verifiedBy" INTEGER,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorWallet" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "pendingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "withdrawableAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_vendorCode_key" ON "Vendor"("vendorCode");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_email_key" ON "Vendor"("email");

-- CreateIndex
CREATE INDEX "Vendor_status_idx" ON "Vendor"("status");

-- CreateIndex
CREATE INDEX "Vendor_deletedAt_idx" ON "Vendor"("deletedAt");

-- CreateIndex
CREATE INDEX "VendorAvailability_vendorId_idx" ON "VendorAvailability"("vendorId");

-- CreateIndex
CREATE INDEX "VendorBankAccount_vendorId_idx" ON "VendorBankAccount"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorBusiness_vendorId_key" ON "VendorBusiness"("vendorId");

-- CreateIndex
CREATE INDEX "VendorCalendar_vendorId_idx" ON "VendorCalendar"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorCategory_vendorId_categoryId_subcategoryId_key" ON "VendorCategory"("vendorId", "categoryId", "subcategoryId");

-- CreateIndex
CREATE INDEX "VendorDocument_vendorId_idx" ON "VendorDocument"("vendorId");

-- CreateIndex
CREATE INDEX "VendorEmployee_vendorId_idx" ON "VendorEmployee"("vendorId");

-- CreateIndex
CREATE INDEX "VendorGallery_vendorId_idx" ON "VendorGallery"("vendorId");

-- CreateIndex
CREATE INDEX "VendorGallery_portfolioId_idx" ON "VendorGallery"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorOwner_vendorId_key" ON "VendorOwner"("vendorId");

-- CreateIndex
CREATE INDEX "VendorPayout_vendorId_idx" ON "VendorPayout"("vendorId");

-- CreateIndex
CREATE INDEX "VendorPayout_walletId_idx" ON "VendorPayout"("walletId");

-- CreateIndex
CREATE INDEX "VendorPortfolio_vendorId_idx" ON "VendorPortfolio"("vendorId");

-- CreateIndex
CREATE INDEX "VendorPricing_vendorServiceId_idx" ON "VendorPricing"("vendorServiceId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorProfile_vendorId_key" ON "VendorProfile"("vendorId");

-- CreateIndex
CREATE INDEX "VendorService_vendorId_idx" ON "VendorService"("vendorId");

-- CreateIndex
CREATE INDEX "VendorServiceZone_vendorServiceId_idx" ON "VendorServiceZone"("vendorServiceId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorSetting_vendorId_key" ON "VendorSetting"("vendorId");

-- CreateIndex
CREATE INDEX "VendorTransaction_vendorId_idx" ON "VendorTransaction"("vendorId");

-- CreateIndex
CREATE INDEX "VendorTransaction_walletId_idx" ON "VendorTransaction"("walletId");

-- CreateIndex
CREATE INDEX "VendorVerification_vendorId_idx" ON "VendorVerification"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorWallet_vendorId_key" ON "VendorWallet"("vendorId");

-- AddForeignKey
ALTER TABLE "VendorRole" ADD CONSTRAINT "VendorRole_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAvailability" ADD CONSTRAINT "VendorAvailability_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorBankAccount" ADD CONSTRAINT "VendorBankAccount_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorBusiness" ADD CONSTRAINT "VendorBusiness_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorCalendar" ADD CONSTRAINT "VendorCalendar_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorCategory" ADD CONSTRAINT "VendorCategory_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorDocument" ADD CONSTRAINT "VendorDocument_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorEmployee" ADD CONSTRAINT "VendorEmployee_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorGallery" ADD CONSTRAINT "VendorGallery_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorGallery" ADD CONSTRAINT "VendorGallery_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "VendorPortfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorOwner" ADD CONSTRAINT "VendorOwner_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorPayout" ADD CONSTRAINT "VendorPayout_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorPayout" ADD CONSTRAINT "VendorPayout_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "VendorWallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorPortfolio" ADD CONSTRAINT "VendorPortfolio_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorPricing" ADD CONSTRAINT "VendorPricing_vendorServiceId_fkey" FOREIGN KEY ("vendorServiceId") REFERENCES "VendorService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorProfile" ADD CONSTRAINT "VendorProfile_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorService" ADD CONSTRAINT "VendorService_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorServiceZone" ADD CONSTRAINT "VendorServiceZone_vendorServiceId_fkey" FOREIGN KEY ("vendorServiceId") REFERENCES "VendorService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorSetting" ADD CONSTRAINT "VendorSetting_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTransaction" ADD CONSTRAINT "VendorTransaction_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTransaction" ADD CONSTRAINT "VendorTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "VendorWallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorVerification" ADD CONSTRAINT "VendorVerification_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorWallet" ADD CONSTRAINT "VendorWallet_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
