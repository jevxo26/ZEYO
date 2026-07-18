import { prisma } from '../../config/prisma';
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export class UserRoleService {

  // ── Get all roles assigned to a user ──────────────────────────────────────
  static getByUser = catchServiceAsync(async (userId: number) => {
    return prisma.userRole.findMany({
      where:   { userId, status: 'active' },
      include: {
        role: {
          select: { id: true, name: true, code: true, roleType: true, priority: true },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });
  });

  // ── Assign a role to a user ───────────────────────────────────────────────
  static assign = catchServiceAsync(async (data: {
    userId:      number;
    roleId:      number;
    assignedBy?: number;
    expiresAt?:  Date;
  }) => {
    // Revoke any existing active assignment for the same role
    await prisma.userRole.updateMany({
      where:  { userId: data.userId, roleId: data.roleId, status: 'active' },
      data:   { status: 'revoked' },
    });

    return prisma.userRole.create({
      data: {
        userId:     data.userId,
        roleId:     data.roleId,
        assignedBy: data.assignedBy,
        assignedAt: new Date(),
        expiresAt:  data.expiresAt,
        status:     'active',
      },
      include: {
        role: { select: { id: true, name: true, code: true } },
      },
    });
  });

  // ── Revoke a role from a user ─────────────────────────────────────────────
  static revoke = catchServiceAsync(async (userId: number, roleId: number) => {
    return prisma.userRole.updateMany({
      where: { userId, roleId, status: 'active' },
      data:  { status: 'revoked' },
    });
  });

  // ── Get all users with a specific role ────────────────────────────────────
  static getUsersByRole = catchServiceAsync(async (roleId: number) => {
    return prisma.userRole.findMany({
      where:   { roleId, status: 'active' },
      select: {
        id:         true,
        userId:     true,
        assignedBy: true,
        assignedAt: true,
        expiresAt:  true,
        status:     true,
      },
      orderBy: { assignedAt: 'desc' },
    });
  });
}
