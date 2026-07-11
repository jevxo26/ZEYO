import { PrismaClient, Prisma, UserProfile } from '@prisma/client';
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

  static getUserById = catchServiceAsync(async (id: number | string) => {
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      throw new Error('Invalid user id');
    }

    return prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
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

  static updateUser = catchServiceAsync(async (id: number | string, data: Prisma.UserUpdateInput) => {
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      throw new Error('Invalid user id');
    }

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
      where: { id: userId },
      data: dataToSave,
      select: safeUserSelect,
    });
  });

  static deleteUser = catchServiceAsync(async (id: number | string) => {
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      throw new Error('Invalid user id');
    }

    return prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        status: 'deleted',
      },
      select: safeUserSelect,
    });
  });


   static getUserProfile = catchServiceAsync(async (userId: number) => {
    return prisma.userProfile.findUnique({
      where: { userId },
    });
  });
  static upsertUserProfile = catchServiceAsync(async (userId: number, data: Partial<UserProfile>) => {
    return prisma.userProfile.upsert({
      where: { userId },
      update: data,
      create: {
        ...data,
        userId,
      },
    });
  });

  //user address
  static getUserAddresses = catchServiceAsync(async (userId: number) => {
  return prisma.userAddress.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
});
static getUserAddressById = catchServiceAsync(async (userId: number, addressId: number) => {
  return prisma.userAddress.findFirst({
    where: { id: addressId, userId },
  });
});
static createUserAddress = catchServiceAsync(async (userId: number, data: Prisma.UserAddressUncheckedCreateInput) => {
  const count = await prisma.userAddress.count({ where: { userId } });
  return prisma.userAddress.create({
    data: {
      ...data,
      userId,
      isDefault: count === 0 ? true : (data.isDefault ?? false),
    },
  });
});
static updateUserAddress = catchServiceAsync(async (userId: number, addressId: number, data: Prisma.UserAddressUncheckedUpdateInput) => {
  const existing = await prisma.userAddress.findFirst({ where: { id: addressId, userId } });
  if (!existing) throw new Error('Address not found');
  return prisma.userAddress.update({
    where: { id: addressId },
    data,
  });
});
static deleteUserAddress = catchServiceAsync(async (userId: number, addressId: number) => {
  const existing = await prisma.userAddress.findFirst({ where: { id: addressId, userId } });
  if (!existing) throw new Error('Address not found');
  await prisma.userAddress.delete({ where: { id: addressId } });
  if (existing.isDefault) {
    const next = await prisma.userAddress.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    if (next) {
      await prisma.userAddress.update({ where: { id: next.id }, data: { isDefault: true } });
    }
  }
  return existing;
});
static setDefaultAddress = catchServiceAsync(async (userId: number, addressId: number) => {
  const existing = await prisma.userAddress.findFirst({ where: { id: addressId, userId } });
  if (!existing) throw new Error('Address not found');
  return prisma.$transaction([
    prisma.userAddress.updateMany({
      where: { userId },
      data: { isDefault: false },
    }),
    prisma.userAddress.update({
      where: { id: addressId },
      data: { isDefault: true },
    }),
  ]);
});
};


