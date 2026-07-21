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
exports.VendorEmployeeService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
class VendorEmployeeService {
}
exports.VendorEmployeeService = VendorEmployeeService;
_a = VendorEmployeeService;
VendorEmployeeService.addEmployee = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId, data) => {
    return prisma_1.prisma.vendorEmployee.create({
        data: {
            vendorId,
            employeeName: data.employeeName,
            phone: data.phone,
            email: data.email || null,
            designation: data.designation,
            status: data.status || 'active',
            joinedAt: data.joinedAt ? new Date(data.joinedAt) : null,
        },
    });
});
VendorEmployeeService.getEmployees = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId) => {
    return prisma_1.prisma.vendorEmployee.findMany({
        where: { vendorId },
    });
});
VendorEmployeeService.updateEmployee = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    const { joinedAt } = data, rest = __rest(data, ["joinedAt"]);
    return prisma_1.prisma.vendorEmployee.update({
        where: { id },
        data: Object.assign(Object.assign({}, rest), (joinedAt ? { joinedAt: new Date(joinedAt) } : {})),
    });
});
VendorEmployeeService.deleteEmployee = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.vendorEmployee.delete({
        where: { id },
    });
});
