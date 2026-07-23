"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerEventService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
class CustomerEventService {
}
exports.CustomerEventService = CustomerEventService;
_a = CustomerEventService;
CustomerEventService.getEvents = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => {
    return prisma_1.prisma.customerEvent.findMany({
        where: { customerId },
        include: { guests: true },
        orderBy: { createdAt: 'desc' },
    });
});
CustomerEventService.getEventById = (0, catchServiceAsync_1.catchServiceAsync)(async (id, customerId) => {
    return prisma_1.prisma.customerEvent.findFirst({
        where: { id, customerId },
        include: { guests: true },
    });
});
CustomerEventService.createEvent = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId, data) => {
    var _b;
    const { guests, eventDate, budgetAmount, budget, estimatedBudget: estBud, location, notes: reqNotes } = data;
    const estimatedBudget = (_b = estBud !== null && estBud !== void 0 ? estBud : budgetAmount) !== null && _b !== void 0 ? _b : budget;
    const notes = reqNotes !== null && reqNotes !== void 0 ? reqNotes : location;
    return prisma_1.prisma.$transaction(async (tx) => {
        const event = await tx.customerEvent.create({
            data: {
                customerId,
                eventTitle: String(data.eventTitle || 'Untitled Event'),
                eventDate: eventDate ? new Date(eventDate) : null,
                estimatedBudget: estimatedBudget != null ? Number(estimatedBudget) : null,
                status: data.status || 'draft',
                eventTypeId: data.eventTypeId ? Number(data.eventTypeId) : null,
                guestCount: data.guestCount ? Number(data.guestCount) : null,
                zoneId: data.zoneId ? Number(data.zoneId) : null,
                guests: guests && Array.isArray(guests) && guests.length > 0 ? {
                    create: guests.map((g) => ({
                        guestType: g.guestType,
                        guestCount: g.guestCount,
                        remarks: g.remarks,
                    })),
                } : undefined,
            },
            include: { guests: true },
        });
        return event;
    });
});
CustomerEventService.updateEvent = (0, catchServiceAsync_1.catchServiceAsync)(async (id, customerId, data) => {
    var _b;
    const { guests, eventDate, budgetAmount, budget, estimatedBudget: estBud, location, notes: reqNotes } = data;
    const estimatedBudget = (_b = estBud !== null && estBud !== void 0 ? estBud : budgetAmount) !== null && _b !== void 0 ? _b : budget;
    const notes = reqNotes !== null && reqNotes !== void 0 ? reqNotes : location;
    return prisma_1.prisma.$transaction(async (tx) => {
        // Confirm ownership
        const existing = await tx.customerEvent.findFirst({
            where: { id, customerId },
        });
        if (!existing)
            throw new Error('Event not found');
        // Update basic fields - explicitly map only valid Prisma fields
        await tx.customerEvent.update({
            where: { id },
            data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (data.eventTitle ? { eventTitle: String(data.eventTitle) } : {})), (eventDate ? { eventDate: new Date(eventDate) } : {})), (estimatedBudget != null ? { estimatedBudget: Number(estimatedBudget) } : {})), (data.status ? { status: data.status } : {})), (data.eventTypeId ? { eventTypeId: Number(data.eventTypeId) } : {})), (data.guestCount ? { guestCount: Number(data.guestCount) } : {})), (data.zoneId ? { zoneId: Number(data.zoneId) } : {})),
        });
        // Update guests if supplied (replaces old guests for simplicity)
        if (guests !== undefined) {
            await tx.customerGuest.deleteMany({
                where: { customerEventId: id },
            });
            if (Array.isArray(guests) && guests.length > 0) {
                await tx.customerGuest.createMany({
                    data: guests.map((g) => ({
                        customerEventId: id,
                        guestType: g.guestType,
                        guestCount: g.guestCount,
                        remarks: g.remarks,
                    })),
                });
            }
        }
        return tx.customerEvent.findUnique({
            where: { id },
            include: { guests: true },
        });
    });
});
CustomerEventService.deleteEvent = (0, catchServiceAsync_1.catchServiceAsync)(async (id, customerId) => {
    // Confirm ownership and delete event (cascade deletion will delete the guests because of onDelete: Cascade in prisma schema)
    const existing = await prisma_1.prisma.customerEvent.findFirst({
        where: { id, customerId },
    });
    if (!existing)
        throw new Error('Event not found');
    await prisma_1.prisma.customerEvent.delete({
        where: { id },
    });
    return true;
});
// ─── Guest List Dedicated Actions ─────────────────────────────────────────
CustomerEventService.getGuests = (0, catchServiceAsync_1.catchServiceAsync)(async (eventId, customerId) => {
    const event = await prisma_1.prisma.customerEvent.findFirst({
        where: { id: eventId, customerId },
    });
    if (!event)
        throw new Error('Event not found or access denied');
    return prisma_1.prisma.customerGuest.findMany({
        where: { customerEventId: eventId },
    });
});
CustomerEventService.addGuest = (0, catchServiceAsync_1.catchServiceAsync)(async (eventId, customerId, data) => {
    const event = await prisma_1.prisma.customerEvent.findFirst({
        where: { id: eventId, customerId },
    });
    if (!event)
        throw new Error('Event not found or access denied');
    return prisma_1.prisma.customerGuest.create({
        data: {
            customerEventId: eventId,
            guestType: data.guestType,
            guestCount: data.guestCount,
            remarks: data.remarks,
        },
    });
});
CustomerEventService.updateGuest = (0, catchServiceAsync_1.catchServiceAsync)(async (guestId, eventId, customerId, data) => {
    const event = await prisma_1.prisma.customerEvent.findFirst({
        where: { id: eventId, customerId },
    });
    if (!event)
        throw new Error('Event not found or access denied');
    return prisma_1.prisma.customerGuest.update({
        where: { id: guestId, customerEventId: eventId },
        data,
    });
});
CustomerEventService.deleteGuest = (0, catchServiceAsync_1.catchServiceAsync)(async (guestId, eventId, customerId) => {
    const event = await prisma_1.prisma.customerEvent.findFirst({
        where: { id: eventId, customerId },
    });
    if (!event)
        throw new Error('Event not found or access denied');
    await prisma_1.prisma.customerGuest.delete({
        where: { id: guestId, customerEventId: eventId },
    });
    return true;
});
