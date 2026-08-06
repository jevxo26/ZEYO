-- ─────────────────────────────────────────────────────────────────────────────
-- Part 8: Service Module Migration
-- Creates all 20 Service-related tables
-- ─────────────────────────────────────────────────────────────────────────────

-- ServiceCategory
CREATE TABLE "ServiceCategory" (
    "id"           SERIAL NOT NULL,
    "name"         TEXT NOT NULL,
    "slug"         TEXT NOT NULL,
    "description"  TEXT,
    "icon"         TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status"       TEXT NOT NULL DEFAULT 'active',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ServiceCategory_name_key" ON "ServiceCategory"("name");
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "ServiceCategory"("slug");
CREATE INDEX "ServiceCategory_slug_idx" ON "ServiceCategory"("slug");
CREATE INDEX "ServiceCategory_status_idx" ON "ServiceCategory"("status");
CREATE INDEX "ServiceCategory_displayOrder_idx" ON "ServiceCategory"("displayOrder");

-- ServiceSubCategory
CREATE TABLE "ServiceSubCategory" (
    "id"                SERIAL NOT NULL,
    "serviceCategoryId" INTEGER NOT NULL,
    "name"              TEXT NOT NULL,
    "description"       TEXT,
    "displayOrder"      INTEGER NOT NULL DEFAULT 0,
    "status"            TEXT NOT NULL DEFAULT 'active',
    "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceSubCategory_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ServiceSubCategory_serviceCategoryId_idx" ON "ServiceSubCategory"("serviceCategoryId");
CREATE INDEX "ServiceSubCategory_status_idx" ON "ServiceSubCategory"("status");
CREATE INDEX "ServiceSubCategory_displayOrder_idx" ON "ServiceSubCategory"("displayOrder");

-- Service
CREATE TABLE "Service" (
    "id"               SERIAL NOT NULL,
    "categoryId"       INTEGER NOT NULL,
    "name"             TEXT NOT NULL,
    "slug"             TEXT NOT NULL,
    "code"             TEXT,
    "description"      TEXT,
    "shortDescription" TEXT,
    "icon"             TEXT,
    "thumbnail"        TEXT,
    "banner"           TEXT,
    "startingPrice"    DECIMAL(12,2),
    "status"           TEXT NOT NULL DEFAULT 'active',
    "displayOrder"     INTEGER NOT NULL DEFAULT 0,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3) NOT NULL,
    "deletedAt"        TIMESTAMP(3),
    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Service_name_key"  ON "Service"("name");
CREATE UNIQUE INDEX "Service_slug_key"  ON "Service"("slug");
CREATE UNIQUE INDEX "Service_code_key"  ON "Service"("code");
CREATE INDEX "Service_categoryId_idx"   ON "Service"("categoryId");
CREATE INDEX "Service_slug_idx"         ON "Service"("slug");
CREATE INDEX "Service_status_idx"       ON "Service"("status");
CREATE INDEX "Service_displayOrder_idx" ON "Service"("displayOrder");
CREATE INDEX "Service_deletedAt_idx"    ON "Service"("deletedAt");

-- ServiceType
CREATE TABLE "ServiceType" (
    "id"           SERIAL NOT NULL,
    "serviceId"    INTEGER NOT NULL,
    "name"         TEXT NOT NULL,
    "description"  TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status"       TEXT NOT NULL DEFAULT 'active',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceType_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ServiceType_serviceId_idx" ON "ServiceType"("serviceId");
CREATE INDEX "ServiceType_status_idx"    ON "ServiceType"("status");

-- ServiceOption
CREATE TABLE "ServiceOption" (
    "id"           SERIAL NOT NULL,
    "serviceId"    INTEGER NOT NULL,
    "name"         TEXT NOT NULL,
    "description"  TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status"       TEXT NOT NULL DEFAULT 'active',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceOption_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ServiceOption_serviceId_idx" ON "ServiceOption"("serviceId");
CREATE INDEX "ServiceOption_status_idx"    ON "ServiceOption"("status");

-- ServiceConfiguration
CREATE TABLE "ServiceConfiguration" (
    "id"                SERIAL NOT NULL,
    "serviceId"         INTEGER NOT NULL,
    "configurationName" TEXT NOT NULL,
    "fieldType"         TEXT NOT NULL DEFAULT 'select',
    "isRequired"        BOOLEAN NOT NULL DEFAULT false,
    "displayOrder"      INTEGER NOT NULL DEFAULT 0,
    "defaultValue"      TEXT,
    "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceConfiguration_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ServiceConfiguration_serviceId_idx"    ON "ServiceConfiguration"("serviceId");
CREATE INDEX "ServiceConfiguration_displayOrder_idx" ON "ServiceConfiguration"("displayOrder");

-- ServiceVariant
CREATE TABLE "ServiceVariant" (
    "id"                     SERIAL NOT NULL,
    "serviceConfigurationId" INTEGER NOT NULL,
    "name"                   TEXT NOT NULL,
    "description"            TEXT,
    "additionalPrice"        DECIMAL(12,2),
    "status"                 TEXT NOT NULL DEFAULT 'active',
    "createdAt"              TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"              TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceVariant_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ServiceVariant_serviceConfigurationId_idx" ON "ServiceVariant"("serviceConfigurationId");
CREATE INDEX "ServiceVariant_status_idx" ON "ServiceVariant"("status");

-- ServiceCoverage
CREATE TABLE "ServiceCoverage" (
    "id"           SERIAL NOT NULL,
    "serviceId"    INTEGER NOT NULL,
    "coverageName" TEXT NOT NULL,
    "duration"     INTEGER NOT NULL,
    "unit"         TEXT NOT NULL DEFAULT 'hours',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceCoverage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ServiceCoverage_serviceId_idx" ON "ServiceCoverage"("serviceId");

-- ServicePricing
CREATE TABLE "ServicePricing" (
    "id"           SERIAL NOT NULL,
    "serviceId"    INTEGER NOT NULL,
    "basePrice"    DECIMAL(12,2) NOT NULL,
    "minimumPrice" DECIMAL(12,2),
    "maximumPrice" DECIMAL(12,2),
    "pricingType"  TEXT NOT NULL DEFAULT 'fixed',
    "currency"     TEXT NOT NULL DEFAULT 'BDT',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServicePricing_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ServicePricing_serviceId_key" ON "ServicePricing"("serviceId");
CREATE INDEX "ServicePricing_serviceId_idx" ON "ServicePricing"("serviceId");

-- ServiceZonePricing
CREATE TABLE "ServiceZonePricing" (
    "id"            SERIAL NOT NULL,
    "serviceId"     INTEGER NOT NULL,
    "zoneId"        INTEGER NOT NULL,
    "price"         DECIMAL(12,2) NOT NULL,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo"   TIMESTAMP(3),
    "status"        TEXT NOT NULL DEFAULT 'active',
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceZonePricing_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ServiceZonePricing_serviceId_zoneId_key" ON "ServiceZonePricing"("serviceId","zoneId");
CREATE INDEX "ServiceZonePricing_serviceId_idx" ON "ServiceZonePricing"("serviceId");
CREATE INDEX "ServiceZonePricing_zoneId_idx"    ON "ServiceZonePricing"("zoneId");
CREATE INDEX "ServiceZonePricing_status_idx"    ON "ServiceZonePricing"("status");

-- ServiceAddon
CREATE TABLE "ServiceAddon" (
    "id"          SERIAL NOT NULL,
    "serviceId"   INTEGER NOT NULL,
    "name"        TEXT NOT NULL,
    "description" TEXT,
    "price"       DECIMAL(12,2),
    "pricingType" TEXT NOT NULL DEFAULT 'fixed',
    "status"      TEXT NOT NULL DEFAULT 'active',
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceAddon_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ServiceAddon_serviceId_idx" ON "ServiceAddon"("serviceId");
CREATE INDEX "ServiceAddon_status_idx"    ON "ServiceAddon"("status");

-- ServiceAttribute
CREATE TABLE "ServiceAttribute" (
    "id"             SERIAL NOT NULL,
    "serviceId"      INTEGER NOT NULL,
    "attributeName"  TEXT NOT NULL,
    "attributeValue" TEXT NOT NULL,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceAttribute_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ServiceAttribute_serviceId_idx" ON "ServiceAttribute"("serviceId");

-- ServiceRequirement
CREATE TABLE "ServiceRequirement" (
    "id"              SERIAL NOT NULL,
    "serviceId"       INTEGER NOT NULL,
    "eventId"         INTEGER NOT NULL,
    "isMandatory"     BOOLEAN NOT NULL DEFAULT false,
    "minimumQuantity" INTEGER,
    "maximumQuantity" INTEGER,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceRequirement_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ServiceRequirement_serviceId_eventId_key" ON "ServiceRequirement"("serviceId","eventId");
CREATE INDEX "ServiceRequirement_serviceId_idx" ON "ServiceRequirement"("serviceId");
CREATE INDEX "ServiceRequirement_eventId_idx"   ON "ServiceRequirement"("eventId");

-- ServiceAvailability
CREATE TABLE "ServiceAvailability" (
    "id"            SERIAL NOT NULL,
    "serviceId"     INTEGER NOT NULL,
    "zoneId"        INTEGER NOT NULL,
    "availableFrom" TIMESTAMP(3),
    "availableTo"   TIMESTAMP(3),
    "status"        TEXT NOT NULL DEFAULT 'active',
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceAvailability_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ServiceAvailability_serviceId_idx" ON "ServiceAvailability"("serviceId");
CREATE INDEX "ServiceAvailability_zoneId_idx"    ON "ServiceAvailability"("zoneId");
CREATE INDEX "ServiceAvailability_status_idx"    ON "ServiceAvailability"("status");

-- ServiceGallery
CREATE TABLE "ServiceGallery" (
    "id"           SERIAL NOT NULL,
    "serviceId"    INTEGER NOT NULL,
    "image"        TEXT,
    "video"        TEXT,
    "thumbnail"    TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceGallery_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ServiceGallery_serviceId_idx"    ON "ServiceGallery"("serviceId");
CREATE INDEX "ServiceGallery_displayOrder_idx" ON "ServiceGallery"("displayOrder");

-- ServiceFAQ
CREATE TABLE "ServiceFAQ" (
    "id"           SERIAL NOT NULL,
    "serviceId"    INTEGER NOT NULL,
    "question"     TEXT NOT NULL,
    "answer"       TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceFAQ_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ServiceFAQ_serviceId_idx"    ON "ServiceFAQ"("serviceId");
CREATE INDEX "ServiceFAQ_displayOrder_idx" ON "ServiceFAQ"("displayOrder");

-- ServicePolicy
CREATE TABLE "ServicePolicy" (
    "id"                SERIAL NOT NULL,
    "serviceId"         INTEGER NOT NULL,
    "policyTitle"       TEXT NOT NULL,
    "policyDescription" TEXT NOT NULL,
    "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServicePolicy_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ServicePolicy_serviceId_idx" ON "ServicePolicy"("serviceId");

-- ServiceAnalytics
CREATE TABLE "ServiceAnalytics" (
    "id"             SERIAL NOT NULL,
    "serviceId"      INTEGER NOT NULL,
    "totalBookings"  INTEGER NOT NULL DEFAULT 0,
    "totalRevenue"   DECIMAL(14,2) NOT NULL DEFAULT 0,
    "averageRating"  DECIMAL(3,2) NOT NULL DEFAULT 0,
    "conversionRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceAnalytics_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ServiceAnalytics_serviceId_key" ON "ServiceAnalytics"("serviceId");
CREATE INDEX "ServiceAnalytics_serviceId_idx" ON "ServiceAnalytics"("serviceId");

-- ServiceTag
CREATE TABLE "ServiceTag" (
    "id"        SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "tag"       TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceTag_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ServiceTag_serviceId_tag_key" ON "ServiceTag"("serviceId","tag");
CREATE INDEX "ServiceTag_serviceId_idx" ON "ServiceTag"("serviceId");
CREATE INDEX "ServiceTag_tag_idx"       ON "ServiceTag"("tag");

-- ServiceSetting
CREATE TABLE "ServiceSetting" (
    "id"                     SERIAL NOT NULL,
    "serviceId"              INTEGER NOT NULL,
    "allowCustomization"     BOOLEAN NOT NULL DEFAULT true,
    "allowAddon"             BOOLEAN NOT NULL DEFAULT true,
    "allowMultipleSelection" BOOLEAN NOT NULL DEFAULT false,
    "allowQuantity"          BOOLEAN NOT NULL DEFAULT false,
    "allowDuration"          BOOLEAN NOT NULL DEFAULT true,
    "isActive"               BOOLEAN NOT NULL DEFAULT true,
    "createdAt"              TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"              TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceSetting_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ServiceSetting_serviceId_key" ON "ServiceSetting"("serviceId");
CREATE INDEX "ServiceSetting_serviceId_idx" ON "ServiceSetting"("serviceId");

-- ─── Foreign Keys ─────────────────────────────────────────────────────────────
ALTER TABLE "ServiceSubCategory"  ADD CONSTRAINT "ServiceSubCategory_serviceCategoryId_fkey"    FOREIGN KEY ("serviceCategoryId")      REFERENCES "ServiceCategory"("id")      ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Service"             ADD CONSTRAINT "Service_categoryId_fkey"                      FOREIGN KEY ("categoryId")             REFERENCES "ServiceCategory"("id")      ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ServiceType"         ADD CONSTRAINT "ServiceType_serviceId_fkey"                   FOREIGN KEY ("serviceId")              REFERENCES "Service"("id")              ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceOption"       ADD CONSTRAINT "ServiceOption_serviceId_fkey"                 FOREIGN KEY ("serviceId")              REFERENCES "Service"("id")              ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceConfiguration" ADD CONSTRAINT "ServiceConfiguration_serviceId_fkey"         FOREIGN KEY ("serviceId")              REFERENCES "Service"("id")              ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceVariant"      ADD CONSTRAINT "ServiceVariant_serviceConfigurationId_fkey"   FOREIGN KEY ("serviceConfigurationId") REFERENCES "ServiceConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceCoverage"     ADD CONSTRAINT "ServiceCoverage_serviceId_fkey"               FOREIGN KEY ("serviceId")              REFERENCES "Service"("id")              ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServicePricing"      ADD CONSTRAINT "ServicePricing_serviceId_fkey"                FOREIGN KEY ("serviceId")              REFERENCES "Service"("id")              ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceZonePricing"  ADD CONSTRAINT "ServiceZonePricing_serviceId_fkey"            FOREIGN KEY ("serviceId")              REFERENCES "Service"("id")              ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceZonePricing"  ADD CONSTRAINT "ServiceZonePricing_zoneId_fkey"               FOREIGN KEY ("zoneId")                 REFERENCES "Zone"("id")                 ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceAddon"        ADD CONSTRAINT "ServiceAddon_serviceId_fkey"                  FOREIGN KEY ("serviceId")              REFERENCES "Service"("id")              ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceAttribute"    ADD CONSTRAINT "ServiceAttribute_serviceId_fkey"              FOREIGN KEY ("serviceId")              REFERENCES "Service"("id")              ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceRequirement"  ADD CONSTRAINT "ServiceRequirement_serviceId_fkey"            FOREIGN KEY ("serviceId")              REFERENCES "Service"("id")              ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceRequirement"  ADD CONSTRAINT "ServiceRequirement_eventId_fkey"              FOREIGN KEY ("eventId")                REFERENCES "Event"("id")                ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceAvailability" ADD CONSTRAINT "ServiceAvailability_serviceId_fkey"           FOREIGN KEY ("serviceId")              REFERENCES "Service"("id")              ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceAvailability" ADD CONSTRAINT "ServiceAvailability_zoneId_fkey"              FOREIGN KEY ("zoneId")                 REFERENCES "Zone"("id")                 ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceGallery"      ADD CONSTRAINT "ServiceGallery_serviceId_fkey"                FOREIGN KEY ("serviceId")              REFERENCES "Service"("id")              ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceFAQ"          ADD CONSTRAINT "ServiceFAQ_serviceId_fkey"                   FOREIGN KEY ("serviceId")              REFERENCES "Service"("id")              ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServicePolicy"       ADD CONSTRAINT "ServicePolicy_serviceId_fkey"                 FOREIGN KEY ("serviceId")              REFERENCES "Service"("id")              ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceAnalytics"    ADD CONSTRAINT "ServiceAnalytics_serviceId_fkey"              FOREIGN KEY ("serviceId")              REFERENCES "Service"("id")              ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceTag"          ADD CONSTRAINT "ServiceTag_serviceId_fkey"                    FOREIGN KEY ("serviceId")              REFERENCES "Service"("id")              ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceSetting"      ADD CONSTRAINT "ServiceSetting_serviceId_fkey"                FOREIGN KEY ("serviceId")              REFERENCES "Service"("id")              ON DELETE CASCADE ON UPDATE CASCADE;
