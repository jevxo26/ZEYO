"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentService = void 0;
// ─────────────────────────────────────────────────────────────────────────────
// AssignmentService — Core service for Part 11: Vendor Assignment & Operations
// ─────────────────────────────────────────────────────────────────────────────
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
async function generateAssignmentNumber() {
    const count = await prisma.vendorAssignment.count();
    const year = new Date().getFullYear();
    return `ASN-${year}-${String(count + 1).padStart(5, '0')}`;
}
exports.AssignmentService = {
    // ── VendorAssignment CRUD ─────────────────────────────────────────────────
    create: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        const assignmentNumber = await generateAssignmentNumber();
        return prisma.vendorAssignment.create({ data: Object.assign({ assignmentNumber }, data) });
    }),
    getAll: (0, catchServiceAsync_1.catchServiceAsync)(async (filters = {}) => {
        const { assignmentStatus, page = 1, limit = 20 } = filters;
        const where = {};
        if (assignmentStatus)
            where.assignmentStatus = assignmentStatus;
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
    getById: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.vendorAssignment.findUnique({
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
        prisma.vendorAssignment.update({ where: { id: assignmentId }, data: { assignmentStatus: currentStatus } }),
        prisma.assignmentStatus.create({ data: { assignmentId, currentStatus, updatedBy, remarks } }),
    ])),
    // ── AssignmentItem ─────────────────────────────────────────────────────────
    addItem: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.assignmentItem.create({ data })),
    // ── AssignedVendor ─────────────────────────────────────────────────────────
    assignVendor: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.assignedVendor.create({ data })),
    // ── AssignmentService ──────────────────────────────────────────────────────
    setService: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.assignmentService.upsert({
        where: { assignmentItemId: data.assignmentItemId },
        create: data, update: data,
    })),
    // ── AssignmentSchedule ─────────────────────────────────────────────────────
    setSchedule: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.assignmentSchedule.upsert({
        where: { assignmentItemId: data.assignmentItemId },
        create: data, update: data,
    })),
    // ── VendorAcceptance ───────────────────────────────────────────────────────
    recordAcceptance: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.vendorAcceptance.create({ data })),
    // ── VendorWorkProgress ─────────────────────────────────────────────────────
    addProgress: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.vendorWorkProgress.create({ data })),
    // ── WorkChecklist ──────────────────────────────────────────────────────────
    addChecklist: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.workChecklist.create({ data })),
    completeChecklist: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.workChecklist.update({ where: { id }, data: { isCompleted: true, completedAt: new Date() } })),
    // ── Deliverable ────────────────────────────────────────────────────────────
    addDeliverable: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.deliverable.create({ data })),
    // ── CompletionReport ───────────────────────────────────────────────────────
    submitCompletionReport: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.completionReport.create({ data })),
    // ── AssignmentTimeline ─────────────────────────────────────────────────────
    addTimeline: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.assignmentTimeline.create({ data })),
    // ── AssignmentNote ─────────────────────────────────────────────────────────
    addNote: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.assignmentNote.create({ data })),
    // ── AssignmentAttachment ───────────────────────────────────────────────────
    addAttachment: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.assignmentAttachment.create({ data })),
    // ── VendorReplacement ──────────────────────────────────────────────────────
    replaceVendor: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.vendorReplacement.create({ data })),
    // ── AssignmentCancellation ─────────────────────────────────────────────────
    cancelItem: (0, catchServiceAsync_1.catchServiceAsync)(async (assignmentItemId, reason, cancelledBy) => Promise.all([
        prisma.assignmentItem.update({ where: { id: assignmentItemId }, data: { status: 'cancelled' } }),
        prisma.assignmentCancellation.create({ data: { assignmentItemId, reason, cancelledBy } }),
    ])),
    // ── AssignmentHistory ──────────────────────────────────────────────────────
    addHistory: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.assignmentHistory.create({ data })),
    // ── VendorPerformance ──────────────────────────────────────────────────────
    upsertPerformance: (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId, data) => prisma.vendorPerformance.upsert({
        where: { vendorId }, create: Object.assign({ vendorId }, data), update: data,
    })),
    getPerformance: (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId) => prisma.vendorPerformance.findUnique({ where: { vendorId } })),
    // ── VendorCommission ───────────────────────────────────────────────────────
    addCommission: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.vendorCommission.create({ data })),
    settleCommission: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.vendorCommission.update({ where: { id }, data: { status: 'settled' } })),
    // ── AssignmentSetting ──────────────────────────────────────────────────────
    upsertSetting: (0, catchServiceAsync_1.catchServiceAsync)(async (assignmentId, data) => prisma.assignmentSetting.upsert({
        where: { assignmentId }, create: Object.assign({ assignmentId }, data), update: data,
    })),
    // ── Stats ─────────────────────────────────────────────────────────────────
    getStats: (0, catchServiceAsync_1.catchServiceAsync)(async () => {
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
