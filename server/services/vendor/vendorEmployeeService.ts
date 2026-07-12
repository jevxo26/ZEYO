import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

export class VendorEmployeeService {
  static addEmployee = catchServiceAsync(async (vendorId: number, data: {
    employeeName: string;
    phone: string;
    email?: string;
    designation: string; // Photographer | Cameraman | Decorator | Chef | Driver | Event Manager
    status?: string;
    joinedAt?: Date | string;
  }) => {
    return prisma.vendorEmployee.create({
      data: {
        vendorId,
        employeeName: data.employeeName,
        phone: data.phone,
        email: data.email || null,
        designation: data.designation,
        status: data.status || 'active',
        joinedAt: data.joinedAt ? new Date(data.joinedAt) : null,
      },
    });
  });

  static getEmployees = catchServiceAsync(async (vendorId: number) => {
    return prisma.vendorEmployee.findMany({
      where: { vendorId },
    });
  });

  static updateEmployee = catchServiceAsync(async (id: number, data: {
    employeeName?: string;
    phone?: string;
    email?: string;
    designation?: string;
    status?: string;
    joinedAt?: Date | string;
  }) => {
    const { joinedAt, ...rest } = data;
    return prisma.vendorEmployee.update({
      where: { id },
      data: {
        ...rest,
        ...(joinedAt ? { joinedAt: new Date(joinedAt) } : {}),
      },
    });
  });

  static deleteEmployee = catchServiceAsync(async (id: number) => {
    return prisma.vendorEmployee.delete({
      where: { id },
    });
  });
}
