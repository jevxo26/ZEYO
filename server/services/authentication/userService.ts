import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

// Safe user select — never exposes password or sensitive token fields
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

  // id comes in as string from req.params — parse to Int for Prisma
 static getUserProfile = catchServiceAsync(async (userId: number) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: true,
      userRole: true,
    },
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

    const user = await prisma.user.create({ data: dataToSave, select: safeUserSelect });

    // Auto-create empty UserProfile for new users created via admin panel
    try {
      await prisma.userProfile.create({ data: { userId: user.id } });
    } catch {
      // Profile may already exist — ignore duplicate
    }

    return user;
  });

  // id comes in as string from req.params — parse to Int for Prisma
  static updateUser = catchServiceAsync(async (id: string, data: Prisma.UserUpdateInput) => {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) throw new Error('Invalid user id');

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
      where: { id: numericId },
      data: dataToSave,
      select: safeUserSelect,
    });
  });

  // Soft delete — sets deletedAt and status='deleted'
  static deleteUser = catchServiceAsync(async (id: string) => {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) throw new Error('Invalid user id');

    return prisma.user.update({
      where: { id: numericId },
      data: {
        deletedAt: new Date(),
        status: 'deleted',
      },
      select: safeUserSelect,
    });
  });

  static getUserById = catchServiceAsync(async (id: string) => {
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    throw new Error("Invalid user id");
  }

  return prisma.user.findFirst({
    where: {
      id: numericId,
      deletedAt: null,
    },
    select: safeUserSelect,
  });
});

 
  static upsertUserProfile = catchServiceAsync(async (userId: number, data: Record<string, unknown>) => {
    // Omit any relational fields; only keep plain profile scalar fields
    const { user: _user, id: _id, userId: _uid, createdAt: _ca, updatedAt: _ua, ...safeData } = data as any;
    return prisma.userProfile.upsert({
      where: { userId },
      update: safeData as Prisma.UserProfileUpdateInput,
      create: {
        ...(safeData as Prisma.UserProfileUncheckedCreateInput),
        userId,
      },
    });
  });
}
