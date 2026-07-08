import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { catchServiceAsync } from '../utils/catchServiceAsync';

const prisma = new PrismaClient();

const safeUserSelect = {
  id: true,
  name: true,
  firstName: true,
  lastName: true,
  fullName: true,
  email: true,
  phone: true,
  profileImage: true,
  dateOfBirth: true,
  gender: true,
  roleId: true,
  status: true,
  isVerified: true,
  emailVerified: true,
  phoneVerified: true,
  lastLoginAt: true,
  lastActiveAt: true,
  provider: true,
  providerId: true,
  role: true,
  userRole: {
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  issueDate: true,
  loginLog: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class UserService {
  static getAllUsers = catchServiceAsync(async () => {
    return prisma.user.findMany({
      where: { deletedAt: null },
      select: safeUserSelect,
    });
  });

  static getUserById = catchServiceAsync(async (id: number) => {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: safeUserSelect,
    });
  });

  static createUser = catchServiceAsync(async (data: Prisma.UserCreateInput) => {
    const createData = data as Prisma.UserCreateInput & { roleId?: number | null };
    const firstName = data.firstName?.toString().trim();
    const lastName = data.lastName?.toString().trim();
    const fullNameFromParts = [firstName, lastName].filter(Boolean).join(' ').trim();
    const fullName = data.fullName?.toString().trim() || fullNameFromParts || data.name?.toString().trim();
    const name = data.name?.toString().trim() || fullName || fullNameFromParts;

    if (!name) {
      throw new Error('Name is required');
    }

    const dataToSave: Prisma.UserCreateInput = {
      ...data,
      name,
      fullName: fullName || null,
      firstName: firstName || null,
      lastName: lastName || null,
      password: data.password ? await bcrypt.hash(data.password.toString(), 10) : undefined,
      userRole: createData.roleId
        ? { connect: { id: Number(createData.roleId) } }
        : { connect: { name: 'employee' } },
    };

    return prisma.user.create({ data: dataToSave, select: safeUserSelect });
  });

  static updateUser = catchServiceAsync(async (id: number, data: Prisma.UserUpdateInput) => {
    const updateData = data as Prisma.UserUpdateInput & {
      name?: string;
      firstName?: string;
      lastName?: string;
      fullName?: string;
      password?: string;
      roleId?: number | null;
    };

    const firstName = typeof updateData.firstName === 'string' ? updateData.firstName.trim() : undefined;
    const lastName = typeof updateData.lastName === 'string' ? updateData.lastName.trim() : undefined;
    const fullNameFromParts = [firstName, lastName].filter(Boolean).join(' ').trim();
    const fullName = typeof updateData.fullName === 'string'
      ? updateData.fullName.trim()
      : fullNameFromParts || (typeof updateData.name === 'string' ? updateData.name.trim() : undefined);
    const name = typeof updateData.name === 'string'
      ? updateData.name.trim()
      : fullName || fullNameFromParts;

    const dataToSave: Prisma.UserUpdateInput = {
      ...data,
      ...(name ? { name } : {}),
      ...(typeof updateData.firstName === 'string' ? { firstName } : {}),
      ...(typeof updateData.lastName === 'string' ? { lastName } : {}),
      ...(fullName ? { fullName } : {}),
      ...(typeof updateData.password === 'string'
        ? { password: await bcrypt.hash(updateData.password, 10) }
        : {}),
      ...(updateData.roleId !== undefined && updateData.roleId !== null
        ? { userRole: { connect: { id: Number(updateData.roleId) } } }
        : {}),
    };

    return prisma.user.update({
      where: { id },
      data: dataToSave,
      select: safeUserSelect,
    });
  });

  static deleteUser = catchServiceAsync(async (id: number) => {
    return prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'deleted',
      },
      select: safeUserSelect,
    });
  });
}
