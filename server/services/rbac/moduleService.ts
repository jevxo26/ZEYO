import { prisma } from '../../config/prisma';
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



const moduleSelect = {
  id:           true,
  name:         true,
  code:         true,
  icon:         true,
  displayOrder: true,
  description:  true,
  status:       true,
  createdAt:    true,
  updatedAt:    true,
} as const;

export class ModuleService {

  // ── List ──────────────────────────────────────────────────────────────────
  static getAll = catchServiceAsync(async (status?: string) => {
    return prisma.module.findMany({
      where:   { ...(status ? { status } : {}) },
      select:  moduleSelect,
      orderBy: { displayOrder: 'asc' },
    });
  });

  // ── List with Permissions ─────────────────────────────────────────────────
  static getAllWithPermissions = catchServiceAsync(async () => {
    return prisma.module.findMany({
      where:   { status: 'active' },
      orderBy: { displayOrder: 'asc' },
      select: {
        ...moduleSelect,
        permissions: {
          where:   { status: 'active' },
          select:  { id: true, name: true, code: true, action: true, description: true },
          orderBy: { name: 'asc' },
        },
      },
    });
  });

  // ── Detail ────────────────────────────────────────────────────────────────
  static getById = catchServiceAsync(async (id: number) => {
    return prisma.module.findUnique({
      where:  { id },
      select: moduleSelect,
    });
  });

  // ── Create ────────────────────────────────────────────────────────────────
  static create = catchServiceAsync(async (data: {
    name:         string;
    code:         string;
    icon?:        string;
    displayOrder?: number;
    description?: string;
  }) => {
    return prisma.module.create({
      data: {
        name:         data.name,
        code:         data.code.toUpperCase(),
        icon:         data.icon,
        displayOrder: data.displayOrder ?? 0,
        description:  data.description,
        status:       'active',
      },
      select: moduleSelect,
    });
  });

  // ── Update ────────────────────────────────────────────────────────────────
  static update = catchServiceAsync(async (id: number, data: {
    name?:         string;
    icon?:         string;
    displayOrder?: number;
    description?:  string;
    status?:       string;
  }) => {
    return prisma.module.update({
      where: { id },
      data: {
        ...(data.name         !== undefined ? { name:         data.name }         : {}),
        ...(data.icon         !== undefined ? { icon:         data.icon }         : {}),
        ...(data.displayOrder !== undefined ? { displayOrder: data.displayOrder } : {}),
        ...(data.description  !== undefined ? { description:  data.description }  : {}),
        ...(data.status       !== undefined ? { status:       data.status }       : {}),
      },
      select: moduleSelect,
    });
  });

  // ── Delete ────────────────────────────────────────────────────────────────
  static delete = catchServiceAsync(async (id: number) => {
    return prisma.module.delete({ where: { id } });
  });
}
