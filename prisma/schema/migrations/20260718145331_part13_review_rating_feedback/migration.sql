-- CreateTable
CREATE TABLE "BookingReview" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "eventExperience" TEXT,
    "recommendation" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerFeedback" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "bookingId" INTEGER,
    "feedbackType" TEXT NOT NULL DEFAULT 'suggestion',
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerTestimonial" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "title" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerTestimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NPSScore" (
    "id" SERIAL NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'passive',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NPSScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewPackageFeedback" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "packageId" INTEGER,
    "rating" DECIMAL(3,2) NOT NULL,
    "reviewText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewPackageFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "overallRating" DECIMAL(3,2) NOT NULL,
    "title" TEXT,
    "review" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewAnalytics" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewCriteria" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "criteriaName" TEXT NOT NULL,
    "rating" DECIMAL(3,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewHistory" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "performedBy" INTEGER,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewLog" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "logType" TEXT NOT NULL DEFAULT 'created',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewMedia" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL DEFAULT 'image',
    "fileUrl" TEXT NOT NULL,
    "thumbnail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewModeration" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "moderatedBy" INTEGER,
    "action" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewModeration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewRating" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "averageRating" DECIMAL(3,2) NOT NULL,
    "totalRating" INTEGER NOT NULL DEFAULT 0,
    "ratingScale" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewReaction" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "reactionType" TEXT NOT NULL DEFAULT 'helpful',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewReply" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,
    "reply" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewReport" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "reportedBy" INTEGER,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewSetting" (
    "id" SERIAL NOT NULL,
    "allowReview" BOOLEAN NOT NULL DEFAULT true,
    "allowPhotoUpload" BOOLEAN NOT NULL DEFAULT true,
    "allowVideoUpload" BOOLEAN NOT NULL DEFAULT true,
    "allowReply" BOOLEAN NOT NULL DEFAULT true,
    "allowEdit" BOOLEAN NOT NULL DEFAULT false,
    "requireBookingVerification" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewVerification" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "isVerifiedBooking" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" INTEGER,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SatisfactionSurvey" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "overallExperience" INTEGER NOT NULL,
    "serviceQuality" INTEGER NOT NULL,
    "supportExperience" INTEGER NOT NULL,
    "wouldRecommend" TEXT NOT NULL DEFAULT 'yes',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SatisfactionSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceReview" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "serviceId" INTEGER,
    "rating" DECIMAL(3,2) NOT NULL,
    "reviewText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookingReview_reviewId_key" ON "BookingReview"("reviewId");

-- CreateIndex
CREATE INDEX "BookingReview_bookingId_idx" ON "BookingReview"("bookingId");

-- CreateIndex
CREATE INDEX "CustomerFeedback_customerId_idx" ON "CustomerFeedback"("customerId");

-- CreateIndex
CREATE INDEX "CustomerFeedback_bookingId_idx" ON "CustomerFeedback"("bookingId");

-- CreateIndex
CREATE INDEX "CustomerFeedback_feedbackType_idx" ON "CustomerFeedback"("feedbackType");

-- CreateIndex
CREATE INDEX "CustomerFeedback_status_idx" ON "CustomerFeedback"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerTestimonial_reviewId_key" ON "CustomerTestimonial"("reviewId");

-- CreateIndex
CREATE INDEX "CustomerTestimonial_isFeatured_idx" ON "CustomerTestimonial"("isFeatured");

-- CreateIndex
CREATE INDEX "CustomerTestimonial_displayOrder_idx" ON "CustomerTestimonial"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "NPSScore_surveyId_key" ON "NPSScore"("surveyId");

-- CreateIndex
CREATE INDEX "NPSScore_category_idx" ON "NPSScore"("category");

-- CreateIndex
CREATE INDEX "NPSScore_score_idx" ON "NPSScore"("score");

-- CreateIndex
CREATE INDEX "ReviewPackageFeedback_reviewId_idx" ON "ReviewPackageFeedback"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewPackageFeedback_packageId_idx" ON "ReviewPackageFeedback"("packageId");

-- CreateIndex
CREATE INDEX "Review_bookingId_idx" ON "Review"("bookingId");

-- CreateIndex
CREATE INDEX "Review_customerId_idx" ON "Review"("customerId");

-- CreateIndex
CREATE INDEX "Review_status_idx" ON "Review"("status");

-- CreateIndex
CREATE INDEX "Review_isPublished_idx" ON "Review"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewAnalytics_reviewId_key" ON "ReviewAnalytics"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewCriteria_reviewId_idx" ON "ReviewCriteria"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewHistory_reviewId_idx" ON "ReviewHistory"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewLog_reviewId_idx" ON "ReviewLog"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewLog_logType_idx" ON "ReviewLog"("logType");

-- CreateIndex
CREATE INDEX "ReviewMedia_reviewId_idx" ON "ReviewMedia"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewModeration_reviewId_idx" ON "ReviewModeration"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewModeration_action_idx" ON "ReviewModeration"("action");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewRating_reviewId_key" ON "ReviewRating"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewReaction_reviewId_idx" ON "ReviewReaction"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewReaction_customerId_idx" ON "ReviewReaction"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewReaction_reviewId_customerId_reactionType_key" ON "ReviewReaction"("reviewId", "customerId", "reactionType");

-- CreateIndex
CREATE INDEX "ReviewReply_reviewId_idx" ON "ReviewReply"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewReply_adminId_idx" ON "ReviewReply"("adminId");

-- CreateIndex
CREATE INDEX "ReviewReport_reviewId_idx" ON "ReviewReport"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewReport_status_idx" ON "ReviewReport"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewVerification_reviewId_key" ON "ReviewVerification"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewVerification_isVerifiedBooking_idx" ON "ReviewVerification"("isVerifiedBooking");

-- CreateIndex
CREATE INDEX "SatisfactionSurvey_bookingId_idx" ON "SatisfactionSurvey"("bookingId");

-- CreateIndex
CREATE INDEX "SatisfactionSurvey_customerId_idx" ON "SatisfactionSurvey"("customerId");

-- CreateIndex
CREATE INDEX "ServiceReview_reviewId_idx" ON "ServiceReview"("reviewId");

-- CreateIndex
CREATE INDEX "ServiceReview_serviceId_idx" ON "ServiceReview"("serviceId");

-- AddForeignKey
ALTER TABLE "BookingReview" ADD CONSTRAINT "BookingReview_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingReview" ADD CONSTRAINT "BookingReview_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerFeedback" ADD CONSTRAINT "CustomerFeedback_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerFeedback" ADD CONSTRAINT "CustomerFeedback_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerTestimonial" ADD CONSTRAINT "CustomerTestimonial_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NPSScore" ADD CONSTRAINT "NPSScore_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "SatisfactionSurvey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewPackageFeedback" ADD CONSTRAINT "ReviewPackageFeedback_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewPackageFeedback" ADD CONSTRAINT "ReviewPackageFeedback_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewAnalytics" ADD CONSTRAINT "ReviewAnalytics_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewCriteria" ADD CONSTRAINT "ReviewCriteria_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewHistory" ADD CONSTRAINT "ReviewHistory_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewHistory" ADD CONSTRAINT "ReviewHistory_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewLog" ADD CONSTRAINT "ReviewLog_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewMedia" ADD CONSTRAINT "ReviewMedia_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewModeration" ADD CONSTRAINT "ReviewModeration_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewModeration" ADD CONSTRAINT "ReviewModeration_moderatedBy_fkey" FOREIGN KEY ("moderatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewRating" ADD CONSTRAINT "ReviewRating_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReaction" ADD CONSTRAINT "ReviewReaction_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReaction" ADD CONSTRAINT "ReviewReaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReply" ADD CONSTRAINT "ReviewReply_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReply" ADD CONSTRAINT "ReviewReply_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReport" ADD CONSTRAINT "ReviewReport_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReport" ADD CONSTRAINT "ReviewReport_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewVerification" ADD CONSTRAINT "ReviewVerification_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewVerification" ADD CONSTRAINT "ReviewVerification_verifiedBy_fkey" FOREIGN KEY ("verifiedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SatisfactionSurvey" ADD CONSTRAINT "SatisfactionSurvey_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SatisfactionSurvey" ADD CONSTRAINT "SatisfactionSurvey_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceReview" ADD CONSTRAINT "ServiceReview_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceReview" ADD CONSTRAINT "ServiceReview_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
