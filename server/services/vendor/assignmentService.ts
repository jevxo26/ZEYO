import { prisma } from '../../config/prisma';
// ─────────────────────────────────────────────────────────────────────────────
// AssignmentService — Core service for Part 11: Vendor Assignment & Operations
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



async function generateAssignmentNumber(): Promise<string> {
  const count = await prisma.vendorAssignment.count();
  const year  = new Date().getFullYear();
  return `ASN-${year}-${String(count + 1).padStart(5, '0')}`;
}

export const AssignmentService = {

  // ── VendorAssignment CRUD ─────────────────────────────────────────────────
  create: catchServiceAsync(async (data: {
    bookingId: number; customerId: number; zoneId?: number; eventId?: number; assignedBy?: number;
  }) => {
    const assignmentNumber = await generateAssignmentNumber();
    return prisma.vendorAssignment.create({ data: { assignmentNumber, ...data } });
  }),

  getAll: catchServiceAsync(async (filters: {
    assignmentStatus?: string; page?: number; limit?: number;
  } = {}) => {
    const { assignmentStatus, page = 1, limit = 20 } = filters;
    const where: Record<string, unknown> = {};
    if (assignmentStatus) where.assignmentStatus = assignmentStatus;
    const [data, total] = await Promise.all([
      prisma.vendorAssignment.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { assignedVendors: true } }, statuses: { orderBy: { createdAt: 'desc' }, take: 1 } },
      }),
      prisma.vendorAssignment.count({ where }),
    ]);
    return { data, total, page, limit };
  }),

  getById: catchServiceAsync(async (id: number) =>
    prisma.vendorAssignment.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            assignedVendors: { include: { vendor: true } },
            assignmentService: true,
            schedule: true,
            acceptances: true,
            workProgress: { orderBy: { createdAt: 'asc' } },
            checklist: true,
            deliverables: true,
            completionReport: true,
            notes: { orderBy: { createdAt: 'desc' } },
            attachments: true,
            replacements: true,
            cancellation: true,
            commissions: true,
          },
        },
        statuses: { orderBy: { createdAt: 'desc' } },
        timeline: { orderBy: { createdAt: 'asc' } },
        history: { orderBy: { createdAt: 'desc' } },
        setting: true,
      },
    })),

  updateStatus: catchServiceAsync(async (assignmentId: number, currentStatus: string, updatedBy?: number, remarks?: string) =>
    Promise.all([
      prisma.vendorAssignment.update({ where: { id: assignmentId }, data: { assignmentStatus: currentStatus } }),
      prisma.assignmentStatus.create({ data: { assignmentId, currentStatus, updatedBy, remarks } }),
    ])),

  // ── AssignmentItem ─────────────────────────────────────────────────────────
  addItem: catchServiceAsync(async (data: {
    assignmentId: number; bookingItemId: number; serviceId: number; serviceName: string; quantity?: number;
  }) => prisma.assignmentItem.create({ data })),

  // ── AssignedVendor ─────────────────────────────────────────────────────────
  assignVendor: catchServiceAsync(async (data: {
    assignmentItemId: number; vendorId: number; vendorServiceId?: number;
    assignedPrice?: number; assignedBy?: number;
  }) => prisma.assignedVendor.create({ data })),

  // ── AssignmentService ──────────────────────────────────────────────────────
  setService: catchServiceAsync(async (data: {
    assignmentItemId: number; serviceId: number; coverage?: string;
    duration?: string; quantity?: number; remarks?: string;
  }) => prisma.assignmentService.upsert({
    where: { assignmentItemId: data.assignmentItemId },
    create: data, update: data,
  })),

  // ── AssignmentSchedule ─────────────────────────────────────────────────────
  setSchedule: catchServiceAsync(async (data: {
    assignmentItemId: number; eventDate: Date; startTime?: string;
    endTime?: string; reportingTime?: string; location?: string;
  }) => prisma.assignmentSchedule.upsert({
    where: { assignmentItemId: data.assignmentItemId },
    create: data, update: data,
  })),

  // ── VendorAcceptance ───────────────────────────────────────────────────────
  recordAcceptance: catchServiceAsync(async (data: {
    assignmentItemId: number; vendorId: number; accepted: boolean;
    responseMessage?: string; acceptedAt?: Date;
  }) => prisma.vendorAcceptance.create({ data })),

  // ── VendorWorkProgress ─────────────────────────────────────────────────────
  addProgress: catchServiceAsync(async (data: {
    assignmentItemId: number; progressTitle: string;
    progressDescription?: string; progressPercentage?: number;
  }) => prisma.vendorWorkProgress.create({ data })),

  // ── WorkChecklist ──────────────────────────────────────────────────────────
  addChecklist: catchServiceAsync(async (data: {
    assignmentItemId: number; title: string;
  }) => prisma.workChecklist.create({ data })),

  completeChecklist: catchServiceAsync(async (id: number) =>
    prisma.workChecklist.update({ where: { id }, data: { isCompleted: true, completedAt: new Date() } })),

  // ── Deliverable ────────────────────────────────────────────────────────────
  addDeliverable: catchServiceAsync(async (data: {
    assignmentItemId: number; fileType?: string; fileName: string;
    fileUrl: string; uploadedBy?: number;
  }) => prisma.deliverable.create({ data })),

  // ── CompletionReport ───────────────────────────────────────────────────────
  submitCompletionReport: catchServiceAsync(async (data: {
    assignmentItemId: number; report: string; completedBy?: number;
    completionTime?: Date; remarks?: string;
  }) => prisma.completionReport.create({ data })),

  // ── AssignmentTimeline ─────────────────────────────────────────────────────
  addTimeline: catchServiceAsync(async (data: {
    assignmentId: number; title: string; description?: string; status?: string; createdBy?: number;
  }) => prisma.assignmentTimeline.create({ data })),

  // ── AssignmentNote ─────────────────────────────────────────────────────────
  addNote: catchServiceAsync(async (data: {
    assignmentItemId: number; note: string; noteType?: string; createdBy?: number;
  }) => prisma.assignmentNote.create({ data })),

  // ── AssignmentAttachment ───────────────────────────────────────────────────
  addAttachment: catchServiceAsync(async (data: {
    assignmentItemId: number; fileName: string; fileUrl: string; uploadedBy?: number;
  }) => prisma.assignmentAttachment.create({ data })),

  // ── VendorReplacement ──────────────────────────────────────────────────────
  replaceVendor: catchServiceAsync(async (data: {
    assignmentItemId: number; oldVendorId: number; newVendorId: number;
    reason?: string; approvedBy?: number;
  }) => prisma.vendorReplacement.create({ data })),

  // ── AssignmentCancellation ─────────────────────────────────────────────────
  cancelItem: catchServiceAsync(async (assignmentItemId: number, reason?: string, cancelledBy?: number) =>
    Promise.all([
      prisma.assignmentItem.update({ where: { id: assignmentItemId }, data: { status: 'cancelled' } }),
      prisma.assignmentCancellation.create({ data: { assignmentItemId, reason, cancelledBy } }),
    ])),

  // ── AssignmentHistory ──────────────────────────────────────────────────────
  addHistory: catchServiceAsync(async (data: {
    assignmentId: number; action: string; performedBy?: number;
    oldValue?: object; newValue?: object;
  }) => prisma.assignmentHistory.create({ data })),

  // ── VendorPerformance ──────────────────────────────────────────────────────
  upsertPerformance: catchServiceAsync(async (vendorId: number, data: {
    completedJobs?: number; cancelledJobs?: number;
    averageRating?: number; completionRate?: number; responseTime?: string;
  }) => prisma.vendorPerformance.upsert({
    where: { vendorId }, create: { vendorId, ...data }, update: data,
  })),

  getPerformance: catchServiceAsync(async (vendorId: number) =>
    prisma.vendorPerformance.findUnique({ where: { vendorId } })),

  // ── VendorCommission ───────────────────────────────────────────────────────
  addCommission: catchServiceAsync(async (data: {
    assignmentItemId: number; vendorId: number; bookingAmount: number;
    vendorAmount: number; platformCommission: number; commissionPercentage: number;
  }) => prisma.vendorCommission.create({ data })),

  settleCommission: catchServiceAsync(async (id: number) =>
    prisma.vendorCommission.update({ where: { id }, data: { status: 'settled' } })),

  // ── AssignmentSetting ──────────────────────────────────────────────────────
  upsertSetting: catchServiceAsync(async (assignmentId: number, data: Partial<{
    autoAssignment: boolean; allowVendorReplacement: boolean;
    allowVendorCancellation: boolean; allowMultipleVendor: boolean;
    requireCompletionReport: boolean; status: string;
  }>) => prisma.assignmentSetting.upsert({
    where: { assignmentId }, create: { assignmentId, ...data }, update: data,
  })),

  // ── Stats ─────────────────────────────────────────────────────────────────
  getStats: catchServiceAsync(async () => {
    const [total, draft, active, completed, cancelled] = await Promise.all([
      prisma.vendorAssignment.count(),
      prisma.vendorAssignment.count({ where: { assignmentStatus: 'draft' } }),
      prisma.vendorAssignment.count({ where: { assignmentStatus: 'active' } }),
      prisma.vendorAssignment.count({ where: { assignmentStatus: 'completed' } }),
      prisma.vendorAssignment.count({ where: { assignmentStatus: 'cancelled' } }),
    ]);
    return { total, draft, active, completed, cancelled };
  }),
};
