-- CreateTable
CREATE TABLE "Package" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "packageCategoryId" INTEGER,
    "packageSubCategoryId" INTEGER,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "banner" TEXT,
    "startingPrice" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageAddon" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "pricingType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageAnalytics" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "totalBookings" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageAvailability" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "availableFrom" TIMESTAMP(3),
    "availableTo" TIMESTAMP(3),
    "bookingLimit" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageCoverage" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "coverageType" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageCoverage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageDiscount" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "minimumAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageDiscount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageFAQ" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageFAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageFeature" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageGallery" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "image" TEXT,
    "video" TEXT,
    "thumbnail" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageGuestRange" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "minimumGuest" INTEGER NOT NULL,
    "maximumGuest" INTEGER NOT NULL,
    "recommendedGuest" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageGuestRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackagePolicy" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackagePolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackagePricing" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "discountType" TEXT NOT NULL DEFAULT 'percentage',
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackagePricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageReview" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageService" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageServiceItem" (
    "id" SERIAL NOT NULL,
    "packageServiceId" INTEGER NOT NULL,
    "serviceOptionId" INTEGER NOT NULL,
    "coverageId" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "duration" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageServiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageSetting" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "allowCustomization" BOOLEAN NOT NULL DEFAULT true,
    "allowAddon" BOOLEAN NOT NULL DEFAULT true,
    "allowReschedule" BOOLEAN NOT NULL DEFAULT true,
    "allowCancellation" BOOLEAN NOT NULL DEFAULT true,
    "showOnHomepage" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageSubCategory" (
    "id" SERIAL NOT NULL,
    "packageCategoryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageTerms" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageTerms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageType" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageZonePricing" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageZonePricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Package_slug_key" ON "Package"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Package_code_key" ON "Package"("code");

-- CreateIndex
CREATE INDEX "Package_eventId_idx" ON "Package"("eventId");

-- CreateIndex
CREATE INDEX "Package_packageCategoryId_idx" ON "Package"("packageCategoryId");

-- CreateIndex
CREATE INDEX "Package_packageSubCategoryId_idx" ON "Package"("packageSubCategoryId");

-- CreateIndex
CREATE INDEX "Package_status_idx" ON "Package"("status");

-- CreateIndex
CREATE INDEX "Package_displayOrder_idx" ON "Package"("displayOrder");

-- CreateIndex
CREATE INDEX "Package_deletedAt_idx" ON "Package"("deletedAt");

-- CreateIndex
CREATE INDEX "PackageAddon_packageId_idx" ON "PackageAddon"("packageId");

-- CreateIndex
CREATE INDEX "PackageAddon_status_idx" ON "PackageAddon"("status");

-- CreateIndex
CREATE INDEX "PackageAnalytics_packageId_idx" ON "PackageAnalytics"("packageId");

-- CreateIndex
CREATE INDEX "PackageAvailability_packageId_idx" ON "PackageAvailability"("packageId");

-- CreateIndex
CREATE INDEX "PackageAvailability_zoneId_idx" ON "PackageAvailability"("zoneId");

-- CreateIndex
CREATE INDEX "PackageAvailability_status_idx" ON "PackageAvailability"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PackageCategory_slug_key" ON "PackageCategory"("slug");

-- CreateIndex
CREATE INDEX "PackageCategory_slug_idx" ON "PackageCategory"("slug");

-- CreateIndex
CREATE INDEX "PackageCategory_status_idx" ON "PackageCategory"("status");

-- CreateIndex
CREATE INDEX "PackageCoverage_packageId_idx" ON "PackageCoverage"("packageId");

-- CreateIndex
CREATE INDEX "PackageDiscount_packageId_idx" ON "PackageDiscount"("packageId");

-- CreateIndex
CREATE INDEX "PackageDiscount_status_idx" ON "PackageDiscount"("status");

-- CreateIndex
CREATE INDEX "PackageFAQ_packageId_idx" ON "PackageFAQ"("packageId");

-- CreateIndex
CREATE INDEX "PackageFAQ_displayOrder_idx" ON "PackageFAQ"("displayOrder");

-- CreateIndex
CREATE INDEX "PackageFeature_packageId_idx" ON "PackageFeature"("packageId");

-- CreateIndex
CREATE INDEX "PackageFeature_displayOrder_idx" ON "PackageFeature"("displayOrder");

-- CreateIndex
CREATE INDEX "PackageGallery_packageId_idx" ON "PackageGallery"("packageId");

-- CreateIndex
CREATE INDEX "PackageGallery_displayOrder_idx" ON "PackageGallery"("displayOrder");

-- CreateIndex
CREATE INDEX "PackageGuestRange_packageId_idx" ON "PackageGuestRange"("packageId");

-- CreateIndex
CREATE INDEX "PackagePolicy_packageId_idx" ON "PackagePolicy"("packageId");

-- CreateIndex
CREATE INDEX "PackagePricing_packageId_idx" ON "PackagePricing"("packageId");

-- CreateIndex
CREATE INDEX "PackageReview_packageId_idx" ON "PackageReview"("packageId");

-- CreateIndex
CREATE INDEX "PackageReview_customerId_idx" ON "PackageReview"("customerId");

-- CreateIndex
CREATE INDEX "PackageService_packageId_idx" ON "PackageService"("packageId");

-- CreateIndex
CREATE INDEX "PackageServiceItem_packageServiceId_idx" ON "PackageServiceItem"("packageServiceId");

-- CreateIndex
CREATE UNIQUE INDEX "PackageSetting_packageId_key" ON "PackageSetting"("packageId");

-- CreateIndex
CREATE INDEX "PackageSetting_packageId_idx" ON "PackageSetting"("packageId");

-- CreateIndex
CREATE INDEX "PackageSetting_status_idx" ON "PackageSetting"("status");

-- CreateIndex
CREATE INDEX "PackageSubCategory_packageCategoryId_idx" ON "PackageSubCategory"("packageCategoryId");

-- CreateIndex
CREATE INDEX "PackageSubCategory_status_idx" ON "PackageSubCategory"("status");

-- CreateIndex
CREATE INDEX "PackageTerms_packageId_idx" ON "PackageTerms"("packageId");

-- CreateIndex
CREATE INDEX "PackageType_packageId_idx" ON "PackageType"("packageId");

-- CreateIndex
CREATE INDEX "PackageType_status_idx" ON "PackageType"("status");

-- CreateIndex
CREATE INDEX "PackageZonePricing_packageId_idx" ON "PackageZonePricing"("packageId");

-- CreateIndex
CREATE INDEX "PackageZonePricing_zoneId_idx" ON "PackageZonePricing"("zoneId");

-- CreateIndex
CREATE INDEX "PackageZonePricing_status_idx" ON "PackageZonePricing"("status");

-- AddForeignKey
ALTER TABLE "CustomerFavoritePackage" ADD CONSTRAINT "CustomerFavoritePackage_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_packageCategoryId_fkey" FOREIGN KEY ("packageCategoryId") REFERENCES "PackageCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_packageSubCategoryId_fkey" FOREIGN KEY ("packageSubCategoryId") REFERENCES "PackageSubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageAddon" ADD CONSTRAINT "PackageAddon_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageAnalytics" ADD CONSTRAINT "PackageAnalytics_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageAvailability" ADD CONSTRAINT "PackageAvailability_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageAvailability" ADD CONSTRAINT "PackageAvailability_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageCoverage" ADD CONSTRAINT "PackageCoverage_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageDiscount" ADD CONSTRAINT "PackageDiscount_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageFAQ" ADD CONSTRAINT "PackageFAQ_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageFeature" ADD CONSTRAINT "PackageFeature_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageGallery" ADD CONSTRAINT "PackageGallery_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageGuestRange" ADD CONSTRAINT "PackageGuestRange_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackagePolicy" ADD CONSTRAINT "PackagePolicy_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackagePricing" ADD CONSTRAINT "PackagePricing_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageReview" ADD CONSTRAINT "PackageReview_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageReview" ADD CONSTRAINT "PackageReview_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageService" ADD CONSTRAINT "PackageService_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageServiceItem" ADD CONSTRAINT "PackageServiceItem_packageServiceId_fkey" FOREIGN KEY ("packageServiceId") REFERENCES "PackageService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageSetting" ADD CONSTRAINT "PackageSetting_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageSubCategory" ADD CONSTRAINT "PackageSubCategory_packageCategoryId_fkey" FOREIGN KEY ("packageCategoryId") REFERENCES "PackageCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageTerms" ADD CONSTRAINT "PackageTerms_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageType" ADD CONSTRAINT "PackageType_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageZonePricing" ADD CONSTRAINT "PackageZonePricing_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageZonePricing" ADD CONSTRAINT "PackageZonePricing_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
