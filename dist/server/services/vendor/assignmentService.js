"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
async function generateAssignmentNumber() {
    const count = await prisma_1.prisma.vendorAssignment.count();
    const year = new Date().getFullYear();
    return `ASN-${year}-${String(count + 1).padStart(5, '0')}`;
}
exports.AssignmentService = {
    // ── VendorAssignment CRUD ─────────────────────────────────────────────────
    create: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        const assignmentNumber = await generateAssignmentNumber();
        return prisma_1.prisma.vendorAssignment.create({ data: Object.assign({ assignmentNumber }, data) });
    }),
    getAll: (0, catchServiceAsync_1.catchServiceAsync)(async (filters = {}) => {
        const { assignmentStatus, page = 1, limit = 20 } = filters;
        const where = {};
        if (assignmentStatus)
            where.assignmentStatus = assignmentStatus;
        const [data, total] = await Promise.all([
            prisma_1.prisma.vendorAssignment.findMany({
                where, skip: (page - 1) * limit, take: limit,
                orderBy: { createdAt: 'desc' },
                include: { items: { include: { assignedVendors: true } }, statuses: { orderBy: { createdAt: 'desc' }, take: 1 } },
            }),
            prisma_1.prisma.vendorAssignment.count({ where }),
        ]);
        return { data, total, page, limit };
    }),
    getById: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.vendorAssignment.findUnique({
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
    updateStatus: (0, catchServiceAsync_1.catchServiceAsync)(async (assignmentId, currentStatus, updatedBy, remarks) => Promise.all([
        prisma_1.prisma.vendorAssignment.update({ where: { id: assignmentId }, data: { assignmentStatus: currentStatus } }),
        prisma_1.prisma.assignmentStatus.create({ data: { assignmentId, currentStatus, updatedBy, remarks } }),
    ])),
    // ── AssignmentItem ─────────────────────────────────────────────────────────
    addItem: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.assignmentItem.create({ data })),
    // ── AssignedVendor ─────────────────────────────────────────────────────────
    assignVendor: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.assignedVendor.create({ data })),
    // ── AssignmentService ──────────────────────────────────────────────────────
    setService: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.assignmentService.upsert({
        where: { assignmentItemId: data.assignmentItemId },
        create: data, update: data,
    })),
    // ── AssignmentSchedule ─────────────────────────────────────────────────────
    setSchedule: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.assignmentSchedule.upsert({
        where: { assignmentItemId: data.assignmentItemId },
        create: data, update: data,
    })),
    // ── VendorAcceptance ───────────────────────────────────────────────────────
    recordAcceptance: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.vendorAcceptance.create({ data })),
    // ── VendorWorkProgress ─────────────────────────────────────────────────────
    addProgress: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.vendorWorkProgress.create({ data })),
    // ── WorkChecklist ──────────────────────────────────────────────────────────
    addChecklist: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.workChecklist.create({ data })),
    completeChecklist: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.workChecklist.update({ where: { id }, data: { isCompleted: true, completedAt: new Date() } })),
    // ── Deliverable ────────────────────────────────────────────────────────────
    addDeliverable: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.deliverable.create({ data })),
    // ── CompletionReport ───────────────────────────────────────────────────────
    submitCompletionReport: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.completionReport.create({ data })),
    // ── AssignmentTimeline ─────────────────────────────────────────────────────
    addTimeline: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.assignmentTimeline.create({ data })),
    // ── AssignmentNote ─────────────────────────────────────────────────────────
    addNote: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.assignmentNote.create({ data })),
    // ── AssignmentAttachment ───────────────────────────────────────────────────
    addAttachment: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.assignmentAttachment.create({ data })),
    // ── VendorReplacement ──────────────────────────────────────────────────────
    replaceVendor: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.vendorReplacement.create({ data })),
    // ── AssignmentCancellation ─────────────────────────────────────────────────
    cancelItem: (0, catchServiceAsync_1.catchServiceAsync)(async (assignmentItemId, reason, cancelledBy) => Promise.all([
        prisma_1.prisma.assignmentItem.update({ where: { id: assignmentItemId }, data: { status: 'cancelled' } }),
        prisma_1.prisma.assignmentCancellation.create({ data: { assignmentItemId, reason, cancelledBy } }),
    ])),
    // ── AssignmentHistory ──────────────────────────────────────────────────────
    addHistory: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.assignmentHistory.create({ data })),
    // ── VendorPerformance ──────────────────────────────────────────────────────
    upsertPerformance: (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId, data) => prisma_1.prisma.vendorPerformance.upsert({
        where: { vendorId }, create: Object.assign({ vendorId }, data), update: data,
    })),
    getPerformance: (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId) => prisma_1.prisma.vendorPerformance.findUnique({ where: { vendorId } })),
    // ── VendorCommission ───────────────────────────────────────────────────────
    addCommission: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.vendorCommission.create({ data })),
    settleCommission: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.vendorCommission.update({ where: { id }, data: { status: 'settled' } })),
    // ── AssignmentSetting ──────────────────────────────────────────────────────
    upsertSetting: (0, catchServiceAsync_1.catchServiceAsync)(async (assignmentId, data) => prisma_1.prisma.assignmentSetting.upsert({
        where: { assignmentId }, create: Object.assign({ assignmentId }, data), update: data,
    })),
    // ── Stats ─────────────────────────────────────────────────────────────────
    getStats: (0, catchServiceAsync_1.catchServiceAsync)(async () => {
        const [total, draft, active, completed, cancelled] = await Promise.all([
            prisma_1.prisma.vendorAssignment.count(),
            prisma_1.prisma.vendorAssignment.count({ where: { assignmentStatus: 'draft' } }),
            prisma_1.prisma.vendorAssignment.count({ where: { assignmentStatus: 'active' } }),
            prisma_1.prisma.vendorAssignment.count({ where: { assignmentStatus: 'completed' } }),
            prisma_1.prisma.vendorAssignment.count({ where: { assignmentStatus: 'cancelled' } }),
        ]);
        return { total, draft, active, completed, cancelled };
    }),
};
