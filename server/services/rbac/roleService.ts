import { prisma } from '../../config/prisma';
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



// ─────────────────────────────────────────────────────────────────────────────
// Safe select — fields returned in list / detail responses
// ─────────────────────────────────────────────────────────────────────────────
const roleSelect = {
  id:          true,
  name:        true,
  code:        true,
  description: true,
  roleType:    true,
  priority:    true,
  isSystem:    true,
  status:      true,
  createdBy:   true,
  updatedBy:   true,
  createdAt:   true,
  updatedAt:   true,
} as const;

export class RbacRoleService {

  // ── List ──────────────────────────────────────────────────────────────────
  static getAll = catchServiceAsync(async (filters?: { status?: string; roleType?: string }) => {
    return prisma.role.findMany({
      where: {
        deletedAt: null,
        ...(filters?.status   ? { status:   filters.status }   : {}),
        ...(filters?.roleType ? { roleType: filters.roleType } : {}),
      },
      select:  roleSelect,
      orderBy: { priority: 'desc' },
    });
  });

  // ── Detail ────────────────────────────────────────────────────────────────
  static getById = catchServiceAsync(async (id: number) => {
    return prisma.role.findFirst({
      where:  { id, deletedAt: null },
      select: roleSelect,
    });
  });

  static getByCode = catchServiceAsync(async (code: string) => {
    return prisma.role.findFirst({
      where:  { code, deletedAt: null },
      select: roleSelect,
    });
  });

  // ── Create ────────────────────────────────────────────────────────────────
  static create = catchServiceAsync(async (data: {
    name:        string;
    code:        string;
    description?: string;
    roleType?:   string;
    priority?:   number;
    createdBy?:  number;
  }) => {
    return prisma.role.create({
      data: {
        name:        data.name,
        code:        data.code.toUpperCase(),
        description: data.description,
        roleType:    data.roleType ?? 'custom',
        priority:    data.priority ?? 0,
        isSystem:    false,
        status:      'active',
        createdBy:   data.createdBy,
      },
      select: roleSelect,
    });
  });

  // ── Update ────────────────────────────────────────────────────────────────
  static update = catchServiceAsync(async (id: number, data: {
    name?:        string;
    description?: string;
    roleType?:    string;
    priority?:    number;
    status?:      string;
    updatedBy?:   number;
  }) => {
    return prisma.role.update({
      where: { id },
      data: {
        ...(data.name        !== undefined ? { name:        data.name }        : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.roleType    !== undefined ? { roleType:    data.roleType }    : {}),
        ...(data.priority    !== undefined ? { priority:    data.priority }    : {}),
        ...(data.status      !== undefined ? { status:      data.status }      : {}),
        ...(data.updatedBy   !== undefined ? { updatedBy:   data.updatedBy }   : {}),
      },
      select: roleSelect,
    });
  });

  // ── Soft Delete ───────────────────────────────────────────────────────────
  static softDelete = catchServiceAsync(async (id: number, deletedBy?: number) => {
    // Prevent deletion of system roles
    const role = await prisma.role.findUnique({ where: { id }, select: { isSystem: true } });
    if (role?.isSystem) {
      throw Object.assign(new Error('System roles cannot be deleted.'), { statusCode: 403 });
    }
    return prisma.role.update({
      where: { id },
      data:  { deletedAt: new Date(), updatedBy: deletedBy },
      select: roleSelect,
    });
  });

  // ── Permissions for a role ─────────────────────────────────────────────────
  static getPermissions = catchServiceAsync(async (roleId: number) => {
    return prisma.rolePermission.findMany({
      where: { roleId },
      include: {
        permission: {
          select: { id: true, name: true, code: true, action: true, module: { select: { name: true, code: true } } },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  });
}
