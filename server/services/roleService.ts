import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../utils/catchServiceAsync';

const prisma = new PrismaClient();

const safeRoleSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class RoleService {
  static getAllRoles = catchServiceAsync(async () => {
    return prisma.role.findMany({
      orderBy: { name: 'asc' },
      select: safeRoleSelect,
    });
  });

  static getRoleById = catchServiceAsync(async (id: number) => {
    return prisma.role.findUnique({
      where: { id },
      select: safeRoleSelect,
    });
  });
}