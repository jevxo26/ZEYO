"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorScheduleService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class VendorScheduleService {
}
exports.VendorScheduleService = VendorScheduleService;
_a = VendorScheduleService;
// ─── Vendor Availability ──────────────────────────────────────────────────
VendorScheduleService.setAvailability = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId, data) => {
    return prisma.vendorAvailability.create({
        data: {
            vendorId,
            availableFrom: new Date(data.availableFrom),
            availableTo: new Date(data.availableTo),
            status: data.status || 'available',
            remarks: data.remarks || null,
        },
    });
});
VendorScheduleService.getAvailability = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId) => {
    return prisma.vendorAvailability.findMany({
        where: { vendorId },
        orderBy: { availableFrom: 'asc' },
    });
});
VendorScheduleService.deleteAvailability = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.vendorAvailability.delete({
        where: { id },
    });
});
// ─── Vendor Calendar ─────────────────────────────────────────────────────
VendorScheduleService.addCalendarBlock = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId, data) => {
    return prisma.vendorCalendar.create({
        data: {
            vendorId,
            bookingDate: new Date(data.bookingDate),
            startTime: data.startTime ? new Date(data.startTime) : null,
            endTime: data.endTime ? new Date(data.endTime) : null,
            availabilityStatus: data.availabilityStatus || 'busy',
            bookingId: data.bookingId || null,
        },
    });
});
VendorScheduleService.getCalendar = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId) => {
    return prisma.vendorCalendar.findMany({
        where: { vendorId },
        orderBy: { bookingDate: 'asc' },
    });
});
VendorScheduleService.removeCalendarBlock = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.vendorCalendar.delete({
        where: { id },
    });
});
