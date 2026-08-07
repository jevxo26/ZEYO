-- ─────────────────────────────────────────────────────────────────────────────
-- Part 9: Smart Event Calculator Module
-- Creates all 20 calculator-related tables
-- ─────────────────────────────────────────────────────────────────────────────

-- SmartEventCalculator
CREATE TABLE "SmartEventCalculator" (
    "id"          SERIAL NOT NULL,
    "customerId"  INTEGER,
    "zoneId"      INTEGER,
    "eventId"     INTEGER,
    "sessionId"   TEXT NOT NULL,
    "status"      TEXT NOT NULL DEFAULT 'in_progress',
    "startedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SmartEventCalculator_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SmartEventCalculator_sessionId_key" ON "SmartEventCalculator"("sessionId");
CREATE INDEX "SmartEventCalculator_customerId_idx" ON "SmartEventCalculator"("customerId");
CREATE INDEX "SmartEventCalculator_zoneId_idx"     ON "SmartEventCalculator"("zoneId");
CREATE INDEX "SmartEventCalculator_eventId_idx"    ON "SmartEventCalculator"("eventId");
CREATE INDEX "SmartEventCalculator_sessionId_idx"  ON "SmartEventCalculator"("sessionId");
CREATE INDEX "SmartEventCalculator_status_idx"     ON "SmartEventCalculator"("status");

-- CalculatorSession
CREATE TABLE "CalculatorSession" (
    "id"           SERIAL NOT NULL,
    "calculatorId" INTEGER NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "deviceId"     TEXT,
    "ipAddress"    TEXT,
    "startedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt"      TIMESTAMP(3),
    "status"       TEXT NOT NULL DEFAULT 'active',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CalculatorSession_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CalculatorSession_sessionToken_key" ON "CalculatorSession"("sessionToken");
CREATE INDEX "CalculatorSession_calculatorId_idx" ON "CalculatorSession"("calculatorId");
CREATE INDEX "CalculatorSession_sessionToken_idx" ON "CalculatorSession"("sessionToken");
CREATE INDEX "CalculatorSession_status_idx"       ON "CalculatorSession"("status");

-- CalculatorStep
CREATE TABLE "CalculatorStep" (
    "id"           SERIAL NOT NULL,
    "calculatorId" INTEGER NOT NULL,
    "stepNumber"   INTEGER NOT NULL,
    "stepName"     TEXT NOT NULL,
    "isCompleted"  BOOLEAN NOT NULL DEFAULT false,
    "completedAt"  TIMESTAMP(3),
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CalculatorStep_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CalculatorStep_calculatorId_stepNumber_key" ON "CalculatorStep"("calculatorId","stepNumber");
CREATE INDEX "CalculatorStep_calculatorId_idx" ON "CalculatorStep"("calculatorId");

-- CalculatorSection
CREATE TABLE "CalculatorSection" (
    "id"           SERIAL NOT NULL,
    "calculatorId" INTEGER NOT NULL,
    "sectionName"  TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status"       TEXT NOT NULL DEFAULT 'active',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CalculatorSection_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CalculatorSection_calculatorId_idx" ON "CalculatorSection"("calculatorId");
CREATE INDEX "CalculatorSection_displayOrder_idx" ON "CalculatorSection"("displayOrder");

-- SelectedEvent
CREATE TABLE "SelectedEvent" (
    "id"           SERIAL NOT NULL,
    "calculatorId" INTEGER NOT NULL,
    "eventId"      INTEGER NOT NULL,
    "zoneId"       INTEGER NOT NULL,
    "guestCount"   INTEGER,
    "eventDate"    TIMESTAMP(3),
    "eventTime"    TEXT,
    "venueType"    TEXT DEFAULT 'indoor',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SelectedEvent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SelectedEvent_calculatorId_key" ON "SelectedEvent"("calculatorId");
CREATE INDEX "SelectedEvent_calculatorId_idx" ON "SelectedEvent"("calculatorId");
CREATE INDEX "SelectedEvent_eventId_idx"      ON "SelectedEvent"("eventId");
CREATE INDEX "SelectedEvent_zoneId_idx"       ON "SelectedEvent"("zoneId");

-- SelectedService
CREATE TABLE "SelectedService" (
    "id"           SERIAL NOT NULL,
    "calculatorId" INTEGER NOT NULL,
    "serviceId"    INTEGER NOT NULL,
    "isSelected"   BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SelectedService_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SelectedService_calculatorId_serviceId_key" ON "SelectedService"("calculatorId","serviceId");
CREATE INDEX "SelectedService_calculatorId_idx" ON "SelectedService"("calculatorId");
CREATE INDEX "SelectedService_serviceId_idx"    ON "SelectedService"("serviceId");

-- SelectedServiceConfiguration
CREATE TABLE "SelectedServiceConfiguration" (
    "id"                 SERIAL NOT NULL,
    "selectedServiceId"  INTEGER NOT NULL,
    "configurationId"    INTEGER NOT NULL,
    "configurationValue" TEXT NOT NULL,
    "additionalPrice"    DECIMAL(12,2),
    "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SelectedServiceConfiguration_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SelectedServiceConfiguration_selectedServiceId_configurationId_key" ON "SelectedServiceConfiguration"("selectedServiceId","configurationId");
CREATE INDEX "SelectedServiceConfiguration_selectedServiceId_idx" ON "SelectedServiceConfiguration"("selectedServiceId");
CREATE INDEX "SelectedServiceConfiguration_configurationId_idx"   ON "SelectedServiceConfiguration"("configurationId");

-- SelectedServiceOption
CREATE TABLE "SelectedServiceOption" (
    "id"                SERIAL NOT NULL,
    "selectedServiceId" INTEGER NOT NULL,
    "optionId"          INTEGER NOT NULL,
    "optionValue"       TEXT,
    "price"             DECIMAL(12,2),
    "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SelectedServiceOption_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SelectedServiceOption_selectedServiceId_optionId_key" ON "SelectedServiceOption"("selectedServiceId","optionId");
CREATE INDEX "SelectedServiceOption_selectedServiceId_idx" ON "SelectedServiceOption"("selectedServiceId");
CREATE INDEX "SelectedServiceOption_optionId_idx"          ON "SelectedServiceOption"("optionId");

-- SelectedAddon
CREATE TABLE "SelectedAddon" (
    "id"                SERIAL NOT NULL,
    "selectedServiceId" INTEGER NOT NULL,
    "addonId"           INTEGER NOT NULL,
    "quantity"          INTEGER NOT NULL DEFAULT 1,
    "unitPrice"         DECIMAL(12,2) NOT NULL,
    "totalPrice"        DECIMAL(12,2) NOT NULL,
    "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SelectedAddon_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SelectedAddon_selectedServiceId_idx" ON "SelectedAddon"("selectedServiceId");
CREATE INDEX "SelectedAddon_addonId_idx"           ON "SelectedAddon"("addonId");

-- GuestInformation
CREATE TABLE "GuestInformation" (
    "id"           SERIAL NOT NULL,
    "calculatorId" INTEGER NOT NULL,
    "adultGuest"   INTEGER NOT NULL DEFAULT 0,
    "childGuest"   INTEGER NOT NULL DEFAULT 0,
    "vipGuest"     INTEGER NOT NULL DEFAULT 0,
    "totalGuest"   INTEGER NOT NULL DEFAULT 0,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GuestInformation_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "GuestInformation_calculatorId_key" ON "GuestInformation"("calculatorId");
CREATE INDEX "GuestInformation_calculatorId_idx" ON "GuestInformation"("calculatorId");

-- BudgetCalculation
CREATE TABLE "BudgetCalculation" (
    "id"            SERIAL NOT NULL,
    "calculatorId"  INTEGER NOT NULL,
    "subtotal"      DECIMAL(14,2) NOT NULL DEFAULT 0,
    "serviceCharge" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tax"           DECIMAL(14,2) NOT NULL DEFAULT 0,
    "discount"      DECIMAL(14,2) NOT NULL DEFAULT 0,
    "grandTotal"    DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency"      TEXT NOT NULL DEFAULT 'BDT',
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BudgetCalculation_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "BudgetCalculation_calculatorId_key" ON "BudgetCalculation"("calculatorId");
CREATE INDEX "BudgetCalculation_calculatorId_idx" ON "BudgetCalculation"("calculatorId");

-- PricingRule
CREATE TABLE "PricingRule" (
    "id"           SERIAL NOT NULL,
    "calculatorId" INTEGER NOT NULL,
    "ruleName"     TEXT NOT NULL,
    "ruleType"     TEXT NOT NULL DEFAULT 'zone',
    "ruleValue"    DECIMAL(10,4) NOT NULL,
    "description"  TEXT,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PricingRule_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PricingRule_calculatorId_idx" ON "PricingRule"("calculatorId");
CREATE INDEX "PricingRule_ruleType_idx"     ON "PricingRule"("ruleType");

-- AppliedDiscount
CREATE TABLE "AppliedDiscount" (
    "id"             SERIAL NOT NULL,
    "calculatorId"   INTEGER NOT NULL,
    "discountName"   TEXT NOT NULL,
    "discountType"   TEXT NOT NULL DEFAULT 'percentage',
    "discountValue"  DECIMAL(10,4) NOT NULL,
    "discountAmount" DECIMAL(14,2) NOT NULL,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AppliedDiscount_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AppliedDiscount_calculatorId_idx" ON "AppliedDiscount"("calculatorId");

-- AppliedTax
CREATE TABLE "AppliedTax" (
    "id"           SERIAL NOT NULL,
    "calculatorId" INTEGER NOT NULL,
    "taxName"      TEXT NOT NULL,
    "taxRate"      DECIMAL(6,4) NOT NULL,
    "taxAmount"    DECIMAL(14,2) NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AppliedTax_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AppliedTax_calculatorId_idx" ON "AppliedTax"("calculatorId");

-- EstimateSummary
CREATE TABLE "EstimateSummary" (
    "id"              SERIAL NOT NULL,
    "calculatorId"    INTEGER NOT NULL,
    "totalServices"   INTEGER NOT NULL DEFAULT 0,
    "estimatedBudget" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "totalAddonCost"  DECIMAL(14,2) NOT NULL DEFAULT 0,
    "totalTax"        DECIMAL(14,2) NOT NULL DEFAULT 0,
    "totalDiscount"   DECIMAL(14,2) NOT NULL DEFAULT 0,
    "finalAmount"     DECIMAL(14,2) NOT NULL DEFAULT 0,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EstimateSummary_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EstimateSummary_calculatorId_key" ON "EstimateSummary"("calculatorId");
CREATE INDEX "EstimateSummary_calculatorId_idx" ON "EstimateSummary"("calculatorId");

-- SavedEstimate
CREATE TABLE "SavedEstimate" (
    "id"           SERIAL NOT NULL,
    "customerId"   INTEGER NOT NULL,
    "calculatorId" INTEGER NOT NULL,
    "estimateName" TEXT NOT NULL,
    "status"       TEXT NOT NULL DEFAULT 'saved',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SavedEstimate_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SavedEstimate_customerId_idx"   ON "SavedEstimate"("customerId");
CREATE INDEX "SavedEstimate_calculatorId_idx" ON "SavedEstimate"("calculatorId");
CREATE INDEX "SavedEstimate_status_idx"       ON "SavedEstimate"("status");

-- Quotation
CREATE TABLE "Quotation" (
    "id"              SERIAL NOT NULL,
    "calculatorId"    INTEGER NOT NULL,
    "quotationNumber" TEXT NOT NULL,
    "validUntil"      TIMESTAMP(3),
    "subtotal"        DECIMAL(14,2) NOT NULL,
    "discount"        DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tax"             DECIMAL(14,2) NOT NULL DEFAULT 0,
    "grandTotal"      DECIMAL(14,2) NOT NULL,
    "status"          TEXT NOT NULL DEFAULT 'draft',
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Quotation_calculatorId_key"    ON "Quotation"("calculatorId");
CREATE UNIQUE INDEX "Quotation_quotationNumber_key" ON "Quotation"("quotationNumber");
CREATE INDEX "Quotation_calculatorId_idx"    ON "Quotation"("calculatorId");
CREATE INDEX "Quotation_quotationNumber_idx" ON "Quotation"("quotationNumber");
CREATE INDEX "Quotation_status_idx"          ON "Quotation"("status");

-- Comparison
CREATE TABLE "Comparison" (
    "id"               SERIAL NOT NULL,
    "customerId"       INTEGER NOT NULL,
    "estimateOneId"    INTEGER NOT NULL,
    "estimateTwoId"    INTEGER NOT NULL,
    "comparisonResult" JSONB,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Comparison_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Comparison_customerId_idx"    ON "Comparison"("customerId");
CREATE INDEX "Comparison_estimateOneId_idx" ON "Comparison"("estimateOneId");
CREATE INDEX "Comparison_estimateTwoId_idx" ON "Comparison"("estimateTwoId");

-- EstimateHistory
CREATE TABLE "EstimateHistory" (
    "id"           SERIAL NOT NULL,
    "calculatorId" INTEGER NOT NULL,
    "version"      INTEGER NOT NULL,
    "totalAmount"  DECIMAL(14,2) NOT NULL,
    "changes"      JSONB,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EstimateHistory_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EstimateHistory_calculatorId_idx" ON "EstimateHistory"("calculatorId");
CREATE INDEX "EstimateHistory_version_idx"      ON "EstimateHistory"("version");

-- CalculatorSetting
CREATE TABLE "CalculatorSetting" (
    "id"                     SERIAL NOT NULL,
    "allowSaveEstimate"      BOOLEAN NOT NULL DEFAULT true,
    "allowQuotation"         BOOLEAN NOT NULL DEFAULT true,
    "allowComparison"        BOOLEAN NOT NULL DEFAULT true,
    "allowInstantBooking"    BOOLEAN NOT NULL DEFAULT false,
    "allowPackageConversion" BOOLEAN NOT NULL DEFAULT true,
    "status"                 TEXT NOT NULL DEFAULT 'active',
    "createdAt"              TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"              TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CalculatorSetting_pkey" PRIMARY KEY ("id")
);

-- ─── Foreign Keys ──────────────────────────────────────────────────────────────
ALTER TABLE "SmartEventCalculator"          ADD CONSTRAINT "SmartEventCalculator_customerId_fkey"   FOREIGN KEY ("customerId")      REFERENCES "Customer"("id")              ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SmartEventCalculator"          ADD CONSTRAINT "SmartEventCalculator_zoneId_fkey"       FOREIGN KEY ("zoneId")          REFERENCES "Zone"("id")                  ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SmartEventCalculator"          ADD CONSTRAINT "SmartEventCalculator_eventId_fkey"      FOREIGN KEY ("eventId")         REFERENCES "Event"("id")                 ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CalculatorSession"             ADD CONSTRAINT "CalculatorSession_calculatorId_fkey"    FOREIGN KEY ("calculatorId")    REFERENCES "SmartEventCalculator"("id")  ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "CalculatorStep"                ADD CONSTRAINT "CalculatorStep_calculatorId_fkey"       FOREIGN KEY ("calculatorId")    REFERENCES "SmartEventCalculator"("id")  ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "CalculatorSection"             ADD CONSTRAINT "CalculatorSection_calculatorId_fkey"    FOREIGN KEY ("calculatorId")    REFERENCES "SmartEventCalculator"("id")  ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "SelectedEvent"                 ADD CONSTRAINT "SelectedEvent_calculatorId_fkey"        FOREIGN KEY ("calculatorId")    REFERENCES "SmartEventCalculator"("id")  ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "SelectedEvent"                 ADD CONSTRAINT "SelectedEvent_eventId_fkey"             FOREIGN KEY ("eventId")         REFERENCES "Event"("id")                 ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SelectedEvent"                 ADD CONSTRAINT "SelectedEvent_zoneId_fkey"              FOREIGN KEY ("zoneId")          REFERENCES "Zone"("id")                  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SelectedService"               ADD CONSTRAINT "SelectedService_calculatorId_fkey"      FOREIGN KEY ("calculatorId")    REFERENCES "SmartEventCalculator"("id")  ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "SelectedService"               ADD CONSTRAINT "SelectedService_serviceId_fkey"         FOREIGN KEY ("serviceId")       REFERENCES "Service"("id")               ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SelectedServiceConfiguration"  ADD CONSTRAINT "SelectedServiceConfiguration_selectedServiceId_fkey" FOREIGN KEY ("selectedServiceId") REFERENCES "SelectedService"("id")        ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "SelectedServiceConfiguration"  ADD CONSTRAINT "SelectedServiceConfiguration_configurationId_fkey"   FOREIGN KEY ("configurationId")   REFERENCES "ServiceConfiguration"("id")  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SelectedServiceOption"         ADD CONSTRAINT "SelectedServiceOption_selectedServiceId_fkey" FOREIGN KEY ("selectedServiceId") REFERENCES "SelectedService"("id")  ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "SelectedServiceOption"         ADD CONSTRAINT "SelectedServiceOption_optionId_fkey"          FOREIGN KEY ("optionId")          REFERENCES "ServiceOption"("id")   ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SelectedAddon"                 ADD CONSTRAINT "SelectedAddon_selectedServiceId_fkey"   FOREIGN KEY ("selectedServiceId") REFERENCES "SelectedService"("id")     ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "SelectedAddon"                 ADD CONSTRAINT "SelectedAddon_addonId_fkey"             FOREIGN KEY ("addonId")           REFERENCES "ServiceAddon"("id")        ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "GuestInformation"              ADD CONSTRAINT "GuestInformation_calculatorId_fkey"     FOREIGN KEY ("calculatorId")    REFERENCES "SmartEventCalculator"("id")  ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "BudgetCalculation"             ADD CONSTRAINT "BudgetCalculation_calculatorId_fkey"    FOREIGN KEY ("calculatorId")    REFERENCES "SmartEventCalculator"("id")  ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "PricingRule"                   ADD CONSTRAINT "PricingRule_calculatorId_fkey"          FOREIGN KEY ("calculatorId")    REFERENCES "SmartEventCalculator"("id")  ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "AppliedDiscount"               ADD CONSTRAINT "AppliedDiscount_calculatorId_fkey"      FOREIGN KEY ("calculatorId")    REFERENCES "SmartEventCalculator"("id")  ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "AppliedTax"                    ADD CONSTRAINT "AppliedTax_calculatorId_fkey"           FOREIGN KEY ("calculatorId")    REFERENCES "SmartEventCalculator"("id")  ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "EstimateSummary"               ADD CONSTRAINT "EstimateSummary_calculatorId_fkey"      FOREIGN KEY ("calculatorId")    REFERENCES "SmartEventCalculator"("id")  ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "SavedEstimate"                 ADD CONSTRAINT "SavedEstimate_customerId_fkey"          FOREIGN KEY ("customerId")      REFERENCES "Customer"("id")              ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "SavedEstimate"                 ADD CONSTRAINT "SavedEstimate_calculatorId_fkey"        FOREIGN KEY ("calculatorId")    REFERENCES "SmartEventCalculator"("id")  ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "Quotation"                     ADD CONSTRAINT "Quotation_calculatorId_fkey"            FOREIGN KEY ("calculatorId")    REFERENCES "SmartEventCalculator"("id")  ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "Comparison"                    ADD CONSTRAINT "Comparison_customerId_fkey"             FOREIGN KEY ("customerId")      REFERENCES "Customer"("id")              ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "Comparison"                    ADD CONSTRAINT "Comparison_estimateOneId_fkey"          FOREIGN KEY ("estimateOneId")   REFERENCES "SavedEstimate"("id")         ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Comparison"                    ADD CONSTRAINT "Comparison_estimateTwoId_fkey"          FOREIGN KEY ("estimateTwoId")   REFERENCES "SavedEstimate"("id")         ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EstimateHistory"               ADD CONSTRAINT "EstimateHistory_calculatorId_fkey"      FOREIGN KEY ("calculatorId")    REFERENCES "SmartEventCalculator"("id")  ON DELETE CASCADE  ON UPDATE CASCADE;
