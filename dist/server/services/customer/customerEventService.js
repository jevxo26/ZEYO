"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
    const { guests, eventDate } = data, eventFields = __rest(data, ["guests", "eventDate"]);
    return prisma_1.prisma.$transaction(async (tx) => {
        const event = await tx.customerEvent.create({
            data: Object.assign(Object.assign({}, eventFields), { customerId, eventDate: eventDate ? new Date(eventDate) : null, guests: guests && guests.length > 0 ? {
                    create: guests.map((g) => ({
                        guestType: g.guestType,
                        guestCount: g.guestCount,
                        remarks: g.remarks,
                    })),
                } : undefined }),
            include: { guests: true },
        });
        return event;
    });
});
CustomerEventService.updateEvent = (0, catchServiceAsync_1.catchServiceAsync)(async (id, customerId, data) => {
    const { guests, eventDate } = data, eventFields = __rest(data, ["guests", "eventDate"]);
    return prisma_1.prisma.$transaction(async (tx) => {
        // Confirm ownership
        const existing = await tx.customerEvent.findFirst({
            where: { id, customerId },
        });
        if (!existing)
            throw new Error('Event not found');
        // Update basic fields
        await tx.customerEvent.update({
            where: { id },
            data: Object.assign(Object.assign({}, eventFields), (eventDate ? { eventDate: new Date(eventDate) } : {})),
        });
        // Update guests if supplied (replaces old guests for simplicity)
        if (guests !== undefined) {
            await tx.customerGuest.deleteMany({
                where: { customerEventId: id },
            });
            if (guests.length > 0) {
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
