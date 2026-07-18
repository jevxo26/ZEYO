import { prisma } from '../../config/prisma';
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



const permissionSelect = {
  id:          true,
  name:        true,
  code:        true,
  description: true,
  moduleId:    true,
  action:      true,
  status:      true,
  createdAt:   true,
  updatedAt:   true,
} as const;

export class PermissionService {

  // ── List ──────────────────────────────────────────────────────────────────
  static getAll = catchServiceAsync(async (filters?: { moduleId?: number; action?: string; status?: string }) => {
    return prisma.permission.findMany({
      where: {
        ...(filters?.moduleId ? { moduleId: filters.moduleId } : {}),
        ...(filters?.action   ? { action:   filters.action }   : {}),
        ...(filters?.status   ? { status:   filters.status }   : {}),
      },
      select: {
        ...permissionSelect,
        module: { select: { id: true, name: true, code: true } },
      },
      orderBy: [{ moduleId: 'asc' }, { name: 'asc' }],
    });
  });

  // ── Detail ────────────────────────────────────────────────────────────────
  static getById = catchServiceAsync(async (id: number) => {
    return prisma.permission.findUnique({
      where:  { id },
      select: {
        ...permissionSelect,
        module: { select: { id: true, name: true, code: true } },
      },
    });
  });

  // ── Create ────────────────────────────────────────────────────────────────
  static create = catchServiceAsync(async (data: {
    name:         string;
    code:         string;
    moduleId:     number;
    action:       string;
    description?: string;
  }) => {
    const permission = await prisma.permission.create({
      data: {
        name:        data.name,
        code:        data.code.toUpperCase(),
        moduleId:    data.moduleId,
        action:      data.action,
        description: data.description,
        status:      'active',
      },
      select: permissionSelect,
    });

    // Auto-create ModulePermission join
    await prisma.modulePermission.upsert({
      where:  { moduleId_permissionId: { moduleId: data.moduleId, permissionId: permission.id } },
      update: {},
      create: { moduleId: data.moduleId, permissionId: permission.id },
    });

    return permission;
  });

  // ── Update ────────────────────────────────────────────────────────────────
  static update = catchServiceAsync(async (id: number, data: {
    name?:        string;
    description?: string;
    action?:      string;
    status?:      string;
  }) => {
    return prisma.permission.update({
      where: { id },
      data: {
        ...(data.name        !== undefined ? { name:        data.name }        : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.action      !== undefined ? { action:      data.action }      : {}),
        ...(data.status      !== undefined ? { status:      data.status }      : {}),
      },
      select: permissionSelect,
    });
  });

  // ── Delete ────────────────────────────────────────────────────────────────
  static delete = catchServiceAsync(async (id: number) => {
    return prisma.permission.delete({ where: { id } });
  });
}
