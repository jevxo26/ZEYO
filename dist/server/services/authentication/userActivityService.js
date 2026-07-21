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
exports.UserActivityService = void 0;
const prisma_1 = require("../../config/prisma");
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
class UserActivityService {
}
exports.UserActivityService = UserActivityService;
_a = UserActivityService;
UserActivityService.getActivity = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, limit = 30, skip = 0) => {
    const [total, records] = await Promise.all([
        prisma_1.prisma.userActivity.count({ where: { userId } }),
        prisma_1.prisma.userActivity.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
        }),
    ]);
    return { total, records };
});
UserActivityService.log = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    const { metadata } = data, rest = __rest(data, ["metadata"]);
    return prisma_1.prisma.userActivity.create({
        data: Object.assign(Object.assign({}, rest), { metadata: (metadata !== null && metadata !== void 0 ? metadata : client_1.Prisma.JsonNull) }),
    });
});
