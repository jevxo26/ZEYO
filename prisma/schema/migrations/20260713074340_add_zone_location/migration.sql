-- CreateTable
CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "cityId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "districtId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isoCode" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "phoneCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" SERIAL NOT NULL,
    "divisionId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Division" (
    "id" SERIAL NOT NULL,
    "countryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeoFence" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeoFence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeoLocation" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeoLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceZone" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" SERIAL NOT NULL,
    "countryId" INTEGER NOT NULL,
    "divisionId" INTEGER,
    "districtId" INTEGER,
    "cityId" INTEGER,
    "areaId" INTEGER,
    "name" TEXT NOT NULL,
    "zoneCode" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "zoneGroupId" INTEGER,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoneAnalytics" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "totalBookings" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalCustomers" INTEGER NOT NULL DEFAULT 0,
    "totalVendors" INTEGER NOT NULL DEFAULT 0,
    "averageBookingValue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoneAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoneCoverage" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "coverageType" TEXT NOT NULL,
    "minimumDistance" DOUBLE PRECISION,
    "maximumDistance" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoneCoverage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoneDeliveryCharge" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "chargeType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoneDeliveryCharge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoneGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoneGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoneHoliday" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "holidayName" TEXT NOT NULL,
    "holidayDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoneHoliday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZonePackage" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "packageId" INTEGER NOT NULL,
    "packagePrice" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZonePackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZonePolygon" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "polygonData" JSONB NOT NULL,
    "centerLatitude" DOUBLE PRECISION,
    "centerLongitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZonePolygon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZonePricing" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "packageId" INTEGER,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "minimumPrice" DOUBLE PRECISION,
    "maximumPrice" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZonePricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoneService" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoneService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoneSetting" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "allowBooking" BOOLEAN NOT NULL DEFAULT true,
    "allowCalculator" BOOLEAN NOT NULL DEFAULT true,
    "allowPackage" BOOLEAN NOT NULL DEFAULT true,
    "allowVendorAssignment" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoneSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoneTax" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "taxName" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "taxValue" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoneTax_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Area_cityId_idx" ON "Area"("cityId");

-- CreateIndex
CREATE INDEX "City_districtId_idx" ON "City"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "Country_isoCode_key" ON "Country"("isoCode");

-- CreateIndex
CREATE INDEX "District_divisionId_idx" ON "District"("divisionId");

-- CreateIndex
CREATE INDEX "Division_countryId_idx" ON "Division"("countryId");

-- CreateIndex
CREATE INDEX "GeoFence_zoneId_idx" ON "GeoFence"("zoneId");

-- CreateIndex
CREATE INDEX "GeoLocation_zoneId_idx" ON "GeoLocation"("zoneId");

-- CreateIndex
CREATE INDEX "ServiceZone_zoneId_idx" ON "ServiceZone"("zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceZone_serviceId_zoneId_key" ON "ServiceZone"("serviceId", "zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "Zone_zoneCode_key" ON "Zone"("zoneCode");

-- CreateIndex
CREATE INDEX "Zone_countryId_idx" ON "Zone"("countryId");

-- CreateIndex
CREATE INDEX "Zone_divisionId_idx" ON "Zone"("divisionId");

-- CreateIndex
CREATE INDEX "Zone_districtId_idx" ON "Zone"("districtId");

-- CreateIndex
CREATE INDEX "Zone_cityId_idx" ON "Zone"("cityId");

-- CreateIndex
CREATE INDEX "Zone_areaId_idx" ON "Zone"("areaId");

-- CreateIndex
CREATE INDEX "ZoneAnalytics_zoneId_idx" ON "ZoneAnalytics"("zoneId");

-- CreateIndex
CREATE INDEX "ZoneCoverage_zoneId_idx" ON "ZoneCoverage"("zoneId");

-- CreateIndex
CREATE INDEX "ZoneDeliveryCharge_zoneId_idx" ON "ZoneDeliveryCharge"("zoneId");

-- CreateIndex
CREATE INDEX "ZoneHoliday_zoneId_idx" ON "ZoneHoliday"("zoneId");

-- CreateIndex
CREATE INDEX "ZonePackage_zoneId_idx" ON "ZonePackage"("zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "ZonePackage_zoneId_packageId_key" ON "ZonePackage"("zoneId", "packageId");

-- CreateIndex
CREATE INDEX "ZonePolygon_zoneId_idx" ON "ZonePolygon"("zoneId");

-- CreateIndex
CREATE INDEX "ZonePricing_zoneId_idx" ON "ZonePricing"("zoneId");

-- CreateIndex
CREATE INDEX "ZoneService_zoneId_idx" ON "ZoneService"("zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "ZoneService_zoneId_serviceId_key" ON "ZoneService"("zoneId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "ZoneSetting_zoneId_key" ON "ZoneSetting"("zoneId");

-- CreateIndex
CREATE INDEX "ZoneSetting_zoneId_idx" ON "ZoneSetting"("zoneId");

-- CreateIndex
CREATE INDEX "ZoneTax_zoneId_idx" ON "ZoneTax"("zoneId");

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteZone" ADD CONSTRAINT "UserFavoriteZone_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_preferredZoneId_fkey" FOREIGN KEY ("preferredZoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerEvent" ADD CONSTRAINT "CustomerEvent_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerPreference" ADD CONSTRAINT "CustomerPreference_preferredZoneId_fkey" FOREIGN KEY ("preferredZoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Division" ADD CONSTRAINT "Division_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeoFence" ADD CONSTRAINT "GeoFence_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeoLocation" ADD CONSTRAINT "GeoLocation_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceZone" ADD CONSTRAINT "ServiceZone_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_zoneGroupId_fkey" FOREIGN KEY ("zoneGroupId") REFERENCES "ZoneGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneAnalytics" ADD CONSTRAINT "ZoneAnalytics_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneCoverage" ADD CONSTRAINT "ZoneCoverage_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneDeliveryCharge" ADD CONSTRAINT "ZoneDeliveryCharge_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneHoliday" ADD CONSTRAINT "ZoneHoliday_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZonePackage" ADD CONSTRAINT "ZonePackage_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZonePolygon" ADD CONSTRAINT "ZonePolygon_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZonePricing" ADD CONSTRAINT "ZonePricing_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneService" ADD CONSTRAINT "ZoneService_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneSetting" ADD CONSTRAINT "ZoneSetting_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneTax" ADD CONSTRAINT "ZoneTax_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorPricing" ADD CONSTRAINT "VendorPricing_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorServiceZone" ADD CONSTRAINT "VendorServiceZone_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
