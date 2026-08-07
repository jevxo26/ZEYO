import { prisma } from '../../config/prisma';
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export class RolePermissionService {

  // ── Get all permissions assigned to a role ────────────────────────────────
  static getByRole = catchServiceAsync(async (roleId: number) => {
    return prisma.rolePermission.findMany({
      where:   { roleId },
      include: {
        permission: {
          select: {
            id: true, name: true, code: true, action: true,
            module: { select: { id: true, name: true, code: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  });

  // ── Assign a permission to a role (upsert) ────────────────────────────────
  static assign = catchServiceAsync(async (data: {
    roleId:       number;
    permissionId: number;
    canCreate?:   boolean;
    canRead?:     boolean;
    canUpdate?:   boolean;
    canDelete?:   boolean;
    canApprove?:  boolean;
    canAssign?:   boolean;
    canExport?:   boolean;
    canImport?:   boolean;
    canManage?:   boolean;
  }) => {
    const flags = {
      canCreate:  data.canCreate  ?? false,
      canRead:    data.canRead    ?? false,
      canUpdate:  data.canUpdate  ?? false,
      canDelete:  data.canDelete  ?? false,
      canApprove: data.canApprove ?? false,
      canAssign:  data.canAssign  ?? false,
      canExport:  data.canExport  ?? false,
      canImport:  data.canImport  ?? false,
      canManage:  data.canManage  ?? false,
    };

    return prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: data.roleId, permissionId: data.permissionId },
      },
      update: flags,
      create: {
        roleId:       data.roleId,
        permissionId: data.permissionId,
        ...flags,
      },
    });
  });

  // ── Bulk assign permissions to a role ─────────────────────────────────────
  static bulkAssign = catchServiceAsync(async (roleId: number, permissionIds: number[]) => {
    const ops = permissionIds.map((permissionId) =>
      prisma.rolePermission.upsert({
        where:  { roleId_permissionId: { roleId, permissionId } },
        update: { canRead: true },
        create: { roleId, permissionId, canRead: true },
      })
    );
    return Promise.all(ops);
  });

  // ── Revoke a permission from a role ───────────────────────────────────────
  static revoke = catchServiceAsync(async (roleId: number, permissionId: number) => {
    return prisma.rolePermission.delete({
      where: { roleId_permissionId: { roleId, permissionId } },
    });
  });

  // ── Revoke all permissions from a role ────────────────────────────────────
  static revokeAll = catchServiceAsync(async (roleId: number) => {
    return prisma.rolePermission.deleteMany({ where: { roleId } });
  });
}
