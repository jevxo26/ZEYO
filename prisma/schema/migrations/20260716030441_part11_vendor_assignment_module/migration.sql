/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `BookingCancellation` table. All the data in the column will be lost.
  - The `oldValue` column on the `BookingHistory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `newValue` column on the `BookingHistory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `cancelledBy` on table `BookingCancellation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BookingCancellation" DROP CONSTRAINT "BookingCancellation_cancelledBy_fkey";

-- DropIndex
DROP INDEX "Booking_calculatorId_idx";

-- DropIndex
DROP INDEX "Booking_eventId_idx";

-- DropIndex
DROP INDEX "Booking_packageId_idx";

-- DropIndex
DROP INDEX "Booking_zoneId_idx";

-- DropIndex
DROP INDEX "BookingDiscount_couponId_idx";

-- DropIndex
DROP INDEX "BookingTimeline_createdBy_idx";

-- AlterTable
ALTER TABLE "BookingAttachment" ALTER COLUMN "fileType" SET DEFAULT 'image';

-- AlterTable
ALTER TABLE "BookingCancellation" DROP COLUMN "updatedAt",
ALTER COLUMN "cancelledBy" SET NOT NULL,
ALTER COLUMN "cancelledBy" SET DEFAULT 'customer',
ALTER COLUMN "cancelledBy" SET DATA TYPE TEXT,
ALTER COLUMN "reason" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'requested';

-- AlterTable
ALTER TABLE "BookingHistory" DROP COLUMN "oldValue",
ADD COLUMN     "oldValue" JSONB,
DROP COLUMN "newValue",
ADD COLUMN     "newValue" JSONB;

-- AlterTable
ALTER TABLE "BookingLog" ALTER COLUMN "logType" SET DEFAULT 'view',
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BookingReschedule" ALTER COLUMN "oldEventDate" DROP NOT NULL,
ALTER COLUMN "newEventDate" DROP NOT NULL,
ALTER COLUMN "reason" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "BookingSchedule" ALTER COLUMN "startDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BookingStatus" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "BookingVenue" ALTER COLUMN "venueName" DROP NOT NULL;

-- CreateTable
CREATE TABLE "AssignedVendor" (
    "id" SERIAL NOT NULL,
    "assignmentItemId" INTEGER NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "vendorServiceId" INTEGER,
    "assignedPrice" DECIMAL(12,2),
    "status" TEXT NOT NULL DEFAULT 'assigned',
    "assignedBy" INTEGER,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignedVendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentAttachment" (
    "id" SERIAL NOT NULL,
    "assignmentItemId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentCancellation" (
    "id" SERIAL NOT NULL,
    "assignmentItemId" INTEGER NOT NULL,
    "reason" TEXT,
    "cancelledBy" INTEGER,
    "cancelledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentCancellation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentHistory" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "performedBy" INTEGER,
    "oldValue" JSONB,
    "newValue" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentItem" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "bookingItemId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "serviceName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignmentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentLog" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "logType" TEXT NOT NULL DEFAULT 'update',
    "description" TEXT,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentNote" (
    "id" SERIAL NOT NULL,
    "assignmentItemId" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "noteType" TEXT NOT NULL DEFAULT 'internal',
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentSchedule" (
    "id" SERIAL NOT NULL,
    "assignmentItemId" INTEGER NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "reportingTime" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignmentSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentService" (
    "id" SERIAL NOT NULL,
    "assignmentItemId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "coverage" TEXT,
    "duration" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignmentService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentSetting" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "autoAssignment" BOOLEAN NOT NULL DEFAULT false,
    "allowVendorReplacement" BOOLEAN NOT NULL DEFAULT true,
    "allowVendorCancellation" BOOLEAN NOT NULL DEFAULT true,
    "allowMultipleVendor" BOOLEAN NOT NULL DEFAULT true,
    "requireCompletionReport" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignmentSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentStatus" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "currentStatus" TEXT NOT NULL,
    "remarks" TEXT,
    "updatedBy" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentTimeline" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletionReport" (
    "id" SERIAL NOT NULL,
    "assignmentItemId" INTEGER NOT NULL,
    "report" TEXT NOT NULL,
    "completedBy" INTEGER,
    "completionTime" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompletionReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deliverable" (
    "id" SERIAL NOT NULL,
    "assignmentItemId" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL DEFAULT 'document',
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedBy" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deliverable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorAcceptance" (
    "id" SERIAL NOT NULL,
    "assignmentItemId" INTEGER NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "responseMessage" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorAcceptance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorAssignment" (
    "id" SERIAL NOT NULL,
    "assignmentNumber" TEXT NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "zoneId" INTEGER,
    "eventId" INTEGER,
    "assignmentStatus" TEXT NOT NULL DEFAULT 'draft',
    "assignedBy" INTEGER,
    "assignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorCommission" (
    "id" SERIAL NOT NULL,
    "assignmentItemId" INTEGER NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "bookingAmount" DECIMAL(12,2) NOT NULL,
    "vendorAmount" DECIMAL(12,2) NOT NULL,
    "platformCommission" DECIMAL(12,2) NOT NULL,
    "commissionPercentage" DECIMAL(5,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorCommission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorPerformance" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "completedJobs" INTEGER NOT NULL DEFAULT 0,
    "cancelledJobs" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DECIMAL(3,2),
    "completionRate" DECIMAL(5,2),
    "responseTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorReplacement" (
    "id" SERIAL NOT NULL,
    "assignmentItemId" INTEGER NOT NULL,
    "oldVendorId" INTEGER NOT NULL,
    "newVendorId" INTEGER NOT NULL,
    "reason" TEXT,
    "approvedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorReplacement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorWorkProgress" (
    "id" SERIAL NOT NULL,
    "assignmentItemId" INTEGER NOT NULL,
    "progressTitle" TEXT NOT NULL,
    "progressDescription" TEXT,
    "progressPercentage" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorWorkProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkChecklist" (
    "id" SERIAL NOT NULL,
    "assignmentItemId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AssignedVendor_assignmentItemId_idx" ON "AssignedVendor"("assignmentItemId");

-- CreateIndex
CREATE INDEX "AssignedVendor_vendorId_idx" ON "AssignedVendor"("vendorId");

-- CreateIndex
CREATE INDEX "AssignedVendor_status_idx" ON "AssignedVendor"("status");

-- CreateIndex
CREATE INDEX "AssignmentAttachment_assignmentItemId_idx" ON "AssignmentAttachment"("assignmentItemId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentCancellation_assignmentItemId_key" ON "AssignmentCancellation"("assignmentItemId");

-- CreateIndex
CREATE INDEX "AssignmentCancellation_cancelledBy_idx" ON "AssignmentCancellation"("cancelledBy");

-- CreateIndex
CREATE INDEX "AssignmentHistory_assignmentId_idx" ON "AssignmentHistory"("assignmentId");

-- CreateIndex
CREATE INDEX "AssignmentHistory_performedBy_idx" ON "AssignmentHistory"("performedBy");

-- CreateIndex
CREATE INDEX "AssignmentItem_assignmentId_idx" ON "AssignmentItem"("assignmentId");

-- CreateIndex
CREATE INDEX "AssignmentItem_bookingItemId_idx" ON "AssignmentItem"("bookingItemId");

-- CreateIndex
CREATE INDEX "AssignmentItem_serviceId_idx" ON "AssignmentItem"("serviceId");

-- CreateIndex
CREATE INDEX "AssignmentItem_status_idx" ON "AssignmentItem"("status");

-- CreateIndex
CREATE INDEX "AssignmentLog_assignmentId_idx" ON "AssignmentLog"("assignmentId");

-- CreateIndex
CREATE INDEX "AssignmentLog_logType_idx" ON "AssignmentLog"("logType");

-- CreateIndex
CREATE INDEX "AssignmentNote_assignmentItemId_idx" ON "AssignmentNote"("assignmentItemId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentSchedule_assignmentItemId_key" ON "AssignmentSchedule"("assignmentItemId");

-- CreateIndex
CREATE INDEX "AssignmentSchedule_eventDate_idx" ON "AssignmentSchedule"("eventDate");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentService_assignmentItemId_key" ON "AssignmentService"("assignmentItemId");

-- CreateIndex
CREATE INDEX "AssignmentService_serviceId_idx" ON "AssignmentService"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentSetting_assignmentId_key" ON "AssignmentSetting"("assignmentId");

-- CreateIndex
CREATE INDEX "AssignmentStatus_assignmentId_idx" ON "AssignmentStatus"("assignmentId");

-- CreateIndex
CREATE INDEX "AssignmentStatus_currentStatus_idx" ON "AssignmentStatus"("currentStatus");

-- CreateIndex
CREATE INDEX "AssignmentTimeline_assignmentId_idx" ON "AssignmentTimeline"("assignmentId");

-- CreateIndex
CREATE UNIQUE INDEX "CompletionReport_assignmentItemId_key" ON "CompletionReport"("assignmentItemId");

-- CreateIndex
CREATE INDEX "CompletionReport_completedBy_idx" ON "CompletionReport"("completedBy");

-- CreateIndex
CREATE INDEX "Deliverable_assignmentItemId_idx" ON "Deliverable"("assignmentItemId");

-- CreateIndex
CREATE INDEX "Deliverable_uploadedBy_idx" ON "Deliverable"("uploadedBy");

-- CreateIndex
CREATE INDEX "VendorAcceptance_assignmentItemId_idx" ON "VendorAcceptance"("assignmentItemId");

-- CreateIndex
CREATE INDEX "VendorAcceptance_vendorId_idx" ON "VendorAcceptance"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorAssignment_assignmentNumber_key" ON "VendorAssignment"("assignmentNumber");

-- CreateIndex
CREATE INDEX "VendorAssignment_bookingId_idx" ON "VendorAssignment"("bookingId");

-- CreateIndex
CREATE INDEX "VendorAssignment_customerId_idx" ON "VendorAssignment"("customerId");

-- CreateIndex
CREATE INDEX "VendorAssignment_assignmentStatus_idx" ON "VendorAssignment"("assignmentStatus");

-- CreateIndex
CREATE INDEX "VendorAssignment_assignmentNumber_idx" ON "VendorAssignment"("assignmentNumber");

-- CreateIndex
CREATE INDEX "VendorCommission_assignmentItemId_idx" ON "VendorCommission"("assignmentItemId");

-- CreateIndex
CREATE INDEX "VendorCommission_vendorId_idx" ON "VendorCommission"("vendorId");

-- CreateIndex
CREATE INDEX "VendorCommission_status_idx" ON "VendorCommission"("status");

-- CreateIndex
CREATE UNIQUE INDEX "VendorPerformance_vendorId_key" ON "VendorPerformance"("vendorId");

-- CreateIndex
CREATE INDEX "VendorPerformance_vendorId_idx" ON "VendorPerformance"("vendorId");

-- CreateIndex
CREATE INDEX "VendorReplacement_assignmentItemId_idx" ON "VendorReplacement"("assignmentItemId");

-- CreateIndex
CREATE INDEX "VendorReplacement_oldVendorId_idx" ON "VendorReplacement"("oldVendorId");

-- CreateIndex
CREATE INDEX "VendorReplacement_newVendorId_idx" ON "VendorReplacement"("newVendorId");

-- CreateIndex
CREATE INDEX "VendorWorkProgress_assignmentItemId_idx" ON "VendorWorkProgress"("assignmentItemId");

-- CreateIndex
CREATE INDEX "WorkChecklist_assignmentItemId_idx" ON "WorkChecklist"("assignmentItemId");

-- CreateIndex
CREATE INDEX "BookingAttachment_uploadedBy_idx" ON "BookingAttachment"("uploadedBy");

-- CreateIndex
CREATE INDEX "BookingHistory_performedBy_idx" ON "BookingHistory"("performedBy");

-- CreateIndex
CREATE INDEX "BookingLog_logType_idx" ON "BookingLog"("logType");

-- CreateIndex
CREATE INDEX "BookingNote_noteType_idx" ON "BookingNote"("noteType");

-- AddForeignKey
ALTER TABLE "AssignedVendor" ADD CONSTRAINT "AssignedVendor_assignmentItemId_fkey" FOREIGN KEY ("assignmentItemId") REFERENCES "AssignmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedVendor" ADD CONSTRAINT "AssignedVendor_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedVendor" ADD CONSTRAINT "AssignedVendor_vendorServiceId_fkey" FOREIGN KEY ("vendorServiceId") REFERENCES "VendorService"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedVendor" ADD CONSTRAINT "AssignedVendor_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentAttachment" ADD CONSTRAINT "AssignmentAttachment_assignmentItemId_fkey" FOREIGN KEY ("assignmentItemId") REFERENCES "AssignmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentAttachment" ADD CONSTRAINT "AssignmentAttachment_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentCancellation" ADD CONSTRAINT "AssignmentCancellation_assignmentItemId_fkey" FOREIGN KEY ("assignmentItemId") REFERENCES "AssignmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentCancellation" ADD CONSTRAINT "AssignmentCancellation_cancelledBy_fkey" FOREIGN KEY ("cancelledBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentHistory" ADD CONSTRAINT "AssignmentHistory_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "VendorAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentHistory" ADD CONSTRAINT "AssignmentHistory_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentItem" ADD CONSTRAINT "AssignmentItem_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "VendorAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentItem" ADD CONSTRAINT "AssignmentItem_bookingItemId_fkey" FOREIGN KEY ("bookingItemId") REFERENCES "BookingItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentItem" ADD CONSTRAINT "AssignmentItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentLog" ADD CONSTRAINT "AssignmentLog_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "VendorAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentNote" ADD CONSTRAINT "AssignmentNote_assignmentItemId_fkey" FOREIGN KEY ("assignmentItemId") REFERENCES "AssignmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentNote" ADD CONSTRAINT "AssignmentNote_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSchedule" ADD CONSTRAINT "AssignmentSchedule_assignmentItemId_fkey" FOREIGN KEY ("assignmentItemId") REFERENCES "AssignmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentService" ADD CONSTRAINT "AssignmentService_assignmentItemId_fkey" FOREIGN KEY ("assignmentItemId") REFERENCES "AssignmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentService" ADD CONSTRAINT "AssignmentService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSetting" ADD CONSTRAINT "AssignmentSetting_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "VendorAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentStatus" ADD CONSTRAINT "AssignmentStatus_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "VendorAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentStatus" ADD CONSTRAINT "AssignmentStatus_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentTimeline" ADD CONSTRAINT "AssignmentTimeline_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "VendorAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentTimeline" ADD CONSTRAINT "AssignmentTimeline_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletionReport" ADD CONSTRAINT "CompletionReport_assignmentItemId_fkey" FOREIGN KEY ("assignmentItemId") REFERENCES "AssignmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletionReport" ADD CONSTRAINT "CompletionReport_completedBy_fkey" FOREIGN KEY ("completedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_assignmentItemId_fkey" FOREIGN KEY ("assignmentItemId") REFERENCES "AssignmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAcceptance" ADD CONSTRAINT "VendorAcceptance_assignmentItemId_fkey" FOREIGN KEY ("assignmentItemId") REFERENCES "AssignmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAcceptance" ADD CONSTRAINT "VendorAcceptance_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAssignment" ADD CONSTRAINT "VendorAssignment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAssignment" ADD CONSTRAINT "VendorAssignment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAssignment" ADD CONSTRAINT "VendorAssignment_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAssignment" ADD CONSTRAINT "VendorAssignment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAssignment" ADD CONSTRAINT "VendorAssignment_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorCommission" ADD CONSTRAINT "VendorCommission_assignmentItemId_fkey" FOREIGN KEY ("assignmentItemId") REFERENCES "AssignmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorCommission" ADD CONSTRAINT "VendorCommission_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorPerformance" ADD CONSTRAINT "VendorPerformance_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorReplacement" ADD CONSTRAINT "VendorReplacement_assignmentItemId_fkey" FOREIGN KEY ("assignmentItemId") REFERENCES "AssignmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorReplacement" ADD CONSTRAINT "VendorReplacement_oldVendorId_fkey" FOREIGN KEY ("oldVendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorReplacement" ADD CONSTRAINT "VendorReplacement_newVendorId_fkey" FOREIGN KEY ("newVendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorReplacement" ADD CONSTRAINT "VendorReplacement_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorWorkProgress" ADD CONSTRAINT "VendorWorkProgress_assignmentItemId_fkey" FOREIGN KEY ("assignmentItemId") REFERENCES "AssignmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkChecklist" ADD CONSTRAINT "WorkChecklist_assignmentItemId_fkey" FOREIGN KEY ("assignmentItemId") REFERENCES "AssignmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
