-- ─────────────────────────────────────────────────────────────────────────────
-- Part 5: Event Module Migration
-- Creates all 20 Event-related tables
-- ─────────────────────────────────────────────────────────────────────────────

-- CreateTable: Event
CREATE TABLE "Event" (
    "id"           SERIAL NOT NULL,
    "name"         TEXT NOT NULL,
    "slug"         TEXT NOT NULL,
    "description"  TEXT,
    "icon"         TEXT,
    "banner"       TEXT,
    "status"       TEXT NOT NULL DEFAULT 'active',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    "deletedAt"    TIMESTAMP(3),
    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Event_name_key" ON "Event"("name");
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
CREATE INDEX "Event_slug_idx" ON "Event"("slug");
CREATE INDEX "Event_status_idx" ON "Event"("status");
CREATE INDEX "Event_displayOrder_idx" ON "Event"("displayOrder");
CREATE INDEX "Event_deletedAt_idx" ON "Event"("deletedAt");

-- CreateTable: EventCategory
CREATE TABLE "EventCategory" (
    "id"           SERIAL NOT NULL,
    "eventId"      INTEGER NOT NULL,
    "name"         TEXT NOT NULL,
    "slug"         TEXT NOT NULL,
    "description"  TEXT,
    "icon"         TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status"       TEXT NOT NULL DEFAULT 'active',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventCategory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EventCategory_slug_key" ON "EventCategory"("slug");
CREATE INDEX "EventCategory_eventId_idx" ON "EventCategory"("eventId");
CREATE INDEX "EventCategory_slug_idx" ON "EventCategory"("slug");
CREATE INDEX "EventCategory_status_idx" ON "EventCategory"("status");
CREATE INDEX "EventCategory_displayOrder_idx" ON "EventCategory"("displayOrder");

-- CreateTable: EventSubCategory
CREATE TABLE "EventSubCategory" (
    "id"           SERIAL NOT NULL,
    "categoryId"   INTEGER NOT NULL,
    "name"         TEXT NOT NULL,
    "description"  TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status"       TEXT NOT NULL DEFAULT 'active',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventSubCategory_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EventSubCategory_categoryId_idx" ON "EventSubCategory"("categoryId");
CREATE INDEX "EventSubCategory_status_idx" ON "EventSubCategory"("status");
CREATE INDEX "EventSubCategory_displayOrder_idx" ON "EventSubCategory"("displayOrder");

-- CreateTable: EventType
CREATE TABLE "EventType" (
    "id"           SERIAL NOT NULL,
    "eventId"      INTEGER NOT NULL,
    "type"         TEXT NOT NULL,
    "description"  TEXT,
    "minimumGuest" INTEGER,
    "maximumGuest" INTEGER,
    "status"       TEXT NOT NULL DEFAULT 'active',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventType_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EventType_eventId_idx" ON "EventType"("eventId");
CREATE INDEX "EventType_status_idx" ON "EventType"("status");

-- CreateTable: EventTheme
CREATE TABLE "EventTheme" (
    "id"          SERIAL NOT NULL,
    "eventId"     INTEGER NOT NULL,
    "themeName"   TEXT NOT NULL,
    "description" TEXT,
    "thumbnail"   TEXT,
    "coverImage"  TEXT,
    "status"      TEXT NOT NULL DEFAULT 'active',
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventTheme_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EventTheme_eventId_idx" ON "EventTheme"("eventId");
CREATE INDEX "EventTheme_status_idx" ON "EventTheme"("status");

-- CreateTable: EventPackageType
CREATE TABLE "EventPackageType" (
    "id"           SERIAL NOT NULL,
    "eventId"      INTEGER NOT NULL,
    "packageType"  TEXT NOT NULL,
    "description"  TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "status"       TEXT NOT NULL DEFAULT 'active',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventPackageType_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EventPackageType_eventId_idx" ON "EventPackageType"("eventId");
CREATE INDEX "EventPackageType_status_idx" ON "EventPackageType"("status");
CREATE INDEX "EventPackageType_displayOrder_idx" ON "EventPackageType"("displayOrder");

-- CreateTable: EventTimeline
CREATE TABLE "EventTimeline" (
    "id"           SERIAL NOT NULL,
    "eventId"      INTEGER NOT NULL,
    "title"        TEXT NOT NULL,
    "description"  TEXT,
    "startTime"    TEXT,
    "endTime"      TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventTimeline_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EventTimeline_eventId_idx" ON "EventTimeline"("eventId");
CREATE INDEX "EventTimeline_displayOrder_idx" ON "EventTimeline"("displayOrder");

-- CreateTable: EventSchedule
CREATE TABLE "EventSchedule" (
    "id"          SERIAL NOT NULL,
    "eventId"     INTEGER NOT NULL,
    "dayNumber"   INTEGER NOT NULL,
    "title"       TEXT NOT NULL,
    "startTime"   TEXT,
    "endTime"     TEXT,
    "description" TEXT,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventSchedule_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EventSchedule_eventId_idx" ON "EventSchedule"("eventId");
CREATE INDEX "EventSchedule_dayNumber_idx" ON "EventSchedule"("dayNumber");

-- CreateTable: EventRequirement
CREATE TABLE "EventRequirement" (
    "id"              SERIAL NOT NULL,
    "eventId"         INTEGER NOT NULL,
    "serviceId"       INTEGER NOT NULL,
    "isRequired"      BOOLEAN NOT NULL DEFAULT false,
    "isOptional"      BOOLEAN NOT NULL DEFAULT true,
    "minimumQuantity" INTEGER,
    "maximumQuantity" INTEGER,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventRequirement_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EventRequirement_eventId_idx" ON "EventRequirement"("eventId");
CREATE INDEX "EventRequirement_serviceId_idx" ON "EventRequirement"("serviceId");
CREATE INDEX "EventRequirement_isRequired_idx" ON "EventRequirement"("isRequired");

-- CreateTable: EventGuest
CREATE TABLE "EventGuest" (
    "id"               SERIAL NOT NULL,
    "eventId"          INTEGER NOT NULL,
    "minimumGuest"     INTEGER,
    "maximumGuest"     INTEGER,
    "recommendedGuest" INTEGER,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventGuest_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EventGuest_eventId_idx" ON "EventGuest"("eventId");

-- CreateTable: EventVenue
CREATE TABLE "EventVenue" (
    "id"              SERIAL NOT NULL,
    "eventId"         INTEGER NOT NULL,
    "venueType"       TEXT NOT NULL,
    "indoorOutdoor"   TEXT NOT NULL DEFAULT 'indoor',
    "minimumCapacity" INTEGER,
    "maximumCapacity" INTEGER,
    "description"     TEXT,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventVenue_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EventVenue_eventId_idx" ON "EventVenue"("eventId");
CREATE INDEX "EventVenue_venueType_idx" ON "EventVenue"("venueType");
CREATE INDEX "EventVenue_indoorOutdoor_idx" ON "EventVenue"("indoorOutdoor");

-- CreateTable: EventChecklist
CREATE TABLE "EventChecklist" (
    "id"           SERIAL NOT NULL,
    "eventId"      INTEGER NOT NULL,
    "title"        TEXT NOT NULL,
    "description"  TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isRequired"   BOOLEAN NOT NULL DEFAULT false,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventChecklist_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EventChecklist_eventId_idx" ON "EventChecklist"("eventId");
CREATE INDEX "EventChecklist_displayOrder_idx" ON "EventChecklist"("displayOrder");
CREATE INDEX "EventChecklist_isRequired_idx" ON "EventChecklist"("isRequired");

-- CreateTable: EventMilestone
CREATE TABLE "EventMilestone" (
    "id"           SERIAL NOT NULL,
    "eventId"      INTEGER NOT NULL,
    "title"        TEXT NOT NULL,
    "description"  TEXT,
    "dayOffset"    INTEGER NOT NULL DEFAULT 0,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventMilestone_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EventMilestone_eventId_idx" ON "EventMilestone"("eventId");
CREATE INDEX "EventMilestone_displayOrder_idx" ON "EventMilestone"("displayOrder");

-- CreateTable: EventPolicy
CREATE TABLE "EventPolicy" (
    "id"                SERIAL NOT NULL,
    "eventId"           INTEGER NOT NULL,
    "policyTitle"       TEXT NOT NULL,
    "policyDescription" TEXT NOT NULL,
    "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventPolicy_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EventPolicy_eventId_idx" ON "EventPolicy"("eventId");

-- CreateTable: EventTerms
CREATE TABLE "EventTerms" (
    "id"            SERIAL NOT NULL,
    "eventId"       INTEGER NOT NULL,
    "title"         TEXT NOT NULL,
    "description"   TEXT NOT NULL,
    "version"       TEXT NOT NULL DEFAULT '1.0',
    "effectiveDate" TIMESTAMP(3),
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventTerms_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EventTerms_eventId_idx" ON "EventTerms"("eventId");
CREATE INDEX "EventTerms_version_idx" ON "EventTerms"("version");

-- CreateTable: EventFAQ
CREATE TABLE "EventFAQ" (
    "id"           SERIAL NOT NULL,
    "eventId"      INTEGER NOT NULL,
    "question"     TEXT NOT NULL,
    "answer"       TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventFAQ_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EventFAQ_eventId_idx" ON "EventFAQ"("eventId");
CREATE INDEX "EventFAQ_displayOrder_idx" ON "EventFAQ"("displayOrder");

-- CreateTable: EventGallery
CREATE TABLE "EventGallery" (
    "id"           SERIAL NOT NULL,
    "eventId"      INTEGER NOT NULL,
    "image"        TEXT,
    "video"        TEXT,
    "thumbnail"    TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventGallery_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EventGallery_eventId_idx" ON "EventGallery"("eventId");
CREATE INDEX "EventGallery_displayOrder_idx" ON "EventGallery"("displayOrder");

-- CreateTable: EventTag
CREATE TABLE "EventTag" (
    "id"        SERIAL NOT NULL,
    "eventId"   INTEGER NOT NULL,
    "tag"       TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventTag_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EventTag_eventId_tag_key" ON "EventTag"("eventId", "tag");
CREATE INDEX "EventTag_eventId_idx" ON "EventTag"("eventId");
CREATE INDEX "EventTag_tag_idx" ON "EventTag"("tag");

-- CreateTable: EventFeature
CREATE TABLE "EventFeature" (
    "id"           SERIAL NOT NULL,
    "eventId"      INTEGER NOT NULL,
    "featureTitle" TEXT NOT NULL,
    "description"  TEXT,
    "icon"         TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventFeature_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EventFeature_eventId_idx" ON "EventFeature"("eventId");
CREATE INDEX "EventFeature_displayOrder_idx" ON "EventFeature"("displayOrder");

-- CreateTable: EventSetting
CREATE TABLE "EventSetting" (
    "id"                    SERIAL NOT NULL,
    "eventId"               INTEGER NOT NULL,
    "allowPackageBooking"   BOOLEAN NOT NULL DEFAULT true,
    "allowCalculator"       BOOLEAN NOT NULL DEFAULT true,
    "allowCustomization"    BOOLEAN NOT NULL DEFAULT false,
    "allowVendorAssignment" BOOLEAN NOT NULL DEFAULT true,
    "allowReschedule"       BOOLEAN NOT NULL DEFAULT true,
    "allowCancellation"     BOOLEAN NOT NULL DEFAULT true,
    "status"                TEXT NOT NULL DEFAULT 'active',
    "createdAt"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"             TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventSetting_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EventSetting_eventId_key" ON "EventSetting"("eventId");
CREATE INDEX "EventSetting_eventId_idx" ON "EventSetting"("eventId");
CREATE INDEX "EventSetting_status_idx" ON "EventSetting"("status");

-- ─────────────────────────────────────────────────────────────────────────────
-- Foreign Keys
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "EventCategory"    ADD CONSTRAINT "EventCategory_eventId_fkey"    FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventSubCategory" ADD CONSTRAINT "EventSubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EventCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventType"        ADD CONSTRAINT "EventType_eventId_fkey"        FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventTheme"       ADD CONSTRAINT "EventTheme_eventId_fkey"       FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventPackageType" ADD CONSTRAINT "EventPackageType_eventId_fkey" FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventTimeline"    ADD CONSTRAINT "EventTimeline_eventId_fkey"    FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventSchedule"    ADD CONSTRAINT "EventSchedule_eventId_fkey"    FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventRequirement" ADD CONSTRAINT "EventRequirement_eventId_fkey" FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventGuest"       ADD CONSTRAINT "EventGuest_eventId_fkey"       FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventVenue"       ADD CONSTRAINT "EventVenue_eventId_fkey"       FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventChecklist"   ADD CONSTRAINT "EventChecklist_eventId_fkey"   FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventMilestone"   ADD CONSTRAINT "EventMilestone_eventId_fkey"   FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventPolicy"      ADD CONSTRAINT "EventPolicy_eventId_fkey"      FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventTerms"       ADD CONSTRAINT "EventTerms_eventId_fkey"       FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventFAQ"         ADD CONSTRAINT "EventFAQ_eventId_fkey"         FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventGallery"     ADD CONSTRAINT "EventGallery_eventId_fkey"     FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventTag"         ADD CONSTRAINT "EventTag_eventId_fkey"         FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventFeature"     ADD CONSTRAINT "EventFeature_eventId_fkey"     FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventSetting"     ADD CONSTRAINT "EventSetting_eventId_fkey"     FOREIGN KEY ("eventId")    REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
