/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { RoleService } from '../services/roleService';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

const allowedStatuses = ['active', 'inactive', 'suspended', 'deleted'];
const allowedGenders = ['male', 'female', 'other', 'prefer_not_to_say'];

const isValidDate = (value: unknown) => {
  if (value === undefined || value === null || value === '') {
    return true;
  }

  const parsedDate = new Date(value as string);
  return !Number.isNaN(parsedDate.getTime());
};

const validateUserPayload = async (payload: Record<string, unknown>) => {
  if (payload.roleId !== undefined && payload.roleId !== null && payload.roleId !== '') {
    const parsedRoleId = Number(payload.roleId);
    if (!Number.isInteger(parsedRoleId) || parsedRoleId < 1) {
      return 'Invalid roleId value';
    }

    const role = await RoleService.getRoleById(parsedRoleId);
    if (!role) {
      return 'Role not found';
    }
  }

  if (payload.status && !allowedStatuses.includes(String(payload.status))) {
    return 'Invalid status value';
  }

  if (payload.gender && !allowedGenders.includes(String(payload.gender))) {
    return 'Invalid gender value';
  }

  if (!isValidDate(payload.dateOfBirth)) {
    return 'Invalid dateOfBirth value';
  }

  return null;
};

export class UserController {
  static getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    sendResponse(res, {
      statusCode: 200,
      data: users,
    });
  });

  static getUserById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      sendResponse(res, {
        statusCode: 400,
        message: 'Invalid user id',
      });
      return;
    }

    const user = await UserService.getUserById(id);
    if (user) {
      sendResponse(res, {
        statusCode: 200,
        data: user,
      });
    } else {
      sendResponse(res, {
        statusCode: 404,
        message: 'User not found',
      });
    }
  });

  static createUser = catchAsync(async (req: Request, res: Response) => {
    if (!req.body || !req.body.email) {
      sendResponse(res, {
        statusCode: 400,
        message: 'Email is required',
      });
      return;
    }

    const validationError = await validateUserPayload(req.body as Record<string, unknown>);
    if (validationError) {
      sendResponse(res, {
        statusCode: 400,
        message: validationError,
      });
      return;
    }

    const user = await UserService.createUser(req.body);
    sendResponse(res, {
      statusCode: 201,
      message: 'User created successfully',
      data: user,
    });
  });

  static updateUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      sendResponse(res, {
        statusCode: 400,
        message: 'Invalid user id',
      });
      return;
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      sendResponse(res, {
        statusCode: 400,
        message: 'Update data is required',
      });
      return;
    }

    const validationError = await validateUserPayload(req.body as Record<string, unknown>);
    if (validationError) {
      sendResponse(res, {
        statusCode: 400,
        message: validationError,
      });
      return;
    }

    const user = await UserService.updateUser(id, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'User updated successfully',
      data: user,
    });
  });

  static deleteUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      sendResponse(res, {
        statusCode: 400,
        message: 'Invalid user id',
      });
      return;
    }

    await UserService.deleteUser(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'User deleted successfully',
    });
  });

  static getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = parseInt((req as any).user?.userId, 10);
    if (!userId || Number.isNaN(userId)) {
      sendResponse(res, { statusCode: 401, message: 'Unauthorized' });
      return;
    }

    const profile = await UserService.getUserProfile(userId);
    sendResponse(res, {
      statusCode: 200,
      data: profile || {},
    });
  });

  static updateUserProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = parseInt((req as any).user?.userId, 10);
    if (!userId || Number.isNaN(userId)) {
      sendResponse(res, { statusCode: 401, message: 'Unauthorized' });
      return;
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      sendResponse(res, { statusCode: 400, message: 'Update data is required' });
      return;
    }

    const profile = await UserService.upsertUserProfile(userId, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'Profile updated successfully',
      data: profile,
    });
  });

  //user address
  // ─── USER ADDRESS ───────────────────────────────────────────

static getUserAddresses = catchAsync(async (req: Request, res: Response) => {
  const userId = parseInt((req as any).user?.userId, 10);
  if (!userId || Number.isNaN(userId)) {
    return sendResponse(res, { statusCode: 401, message: 'Unauthorized' });
  }

  const addresses = await UserService.getUserAddresses(userId);
  sendResponse(res, { statusCode: 200, data: addresses });
});

static getUserAddressById = catchAsync(async (req: Request, res: Response) => {
  const userId = parseInt((req as any).user?.userId, 10);
  const addressId = parseInt(req.params.addressId as string, 10);

  if (!userId || Number.isNaN(userId)) {
    return sendResponse(res, { statusCode: 401, message: 'Unauthorized' });
  }
  if (!addressId || Number.isNaN(addressId)) {
    return sendResponse(res, { statusCode: 400, message: 'Invalid address id' });
  }

  const address = await UserService.getUserAddressById(userId, addressId);
  if (!address) {
    return sendResponse(res, { statusCode: 404, message: 'Address not found' });
  }
  sendResponse(res, { statusCode: 200, data: address });
});

static createUserAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = parseInt((req as any).user?.userId, 10);
  if (!userId || Number.isNaN(userId)) {
    return sendResponse(res, { statusCode: 401, message: 'Unauthorized' });
  }

  const { receiverName, receiverPhone, addressLine1, countryId } = req.body;
  if (!receiverName || !receiverPhone || !addressLine1 || !countryId) {
    return sendResponse(res, {
      statusCode: 400,
      message: 'receiverName, receiverPhone, addressLine1 and countryId are required',
    });
  }

  const address = await UserService.createUserAddress(userId, req.body);
  sendResponse(res, { statusCode: 201, message: 'Address created successfully', data: address });
});

static updateUserAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = parseInt((req as any).user?.userId, 10);
  const addressId = parseInt(req.params.addressId as string, 10);

  if (!userId || Number.isNaN(userId)) {
    return sendResponse(res, { statusCode: 401, message: 'Unauthorized' });
  }
  if (!addressId || Number.isNaN(addressId)) {
    return sendResponse(res, { statusCode: 400, message: 'Invalid address id' });
  }
  if (!req.body || Object.keys(req.body).length === 0) {
    return sendResponse(res, { statusCode: 400, message: 'Update data is required' });
  }

  const address = await UserService.updateUserAddress(userId, addressId, req.body);
  sendResponse(res, { statusCode: 200, message: 'Address updated successfully', data: address });
});

static deleteUserAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = parseInt((req as any).user?.userId, 10);
  const addressId = parseInt(req.params.addressId as string, 10);

  if (!userId || Number.isNaN(userId)) {
    return sendResponse(res, { statusCode: 401, message: 'Unauthorized' });
  }
  if (!addressId || Number.isNaN(addressId)) {
    return sendResponse(res, { statusCode: 400, message: 'Invalid address id' });
  }

  await UserService.deleteUserAddress(userId, addressId);
  sendResponse(res, { statusCode: 200, message: 'Address deleted successfully' });
});

static setDefaultAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = parseInt((req as any).user?.userId, 10);
  const addressId = parseInt(req.params.addressId as string, 10);

  if (!userId || Number.isNaN(userId)) {
    return sendResponse(res, { statusCode: 401, message: 'Unauthorized' });
  }
  if (!addressId || Number.isNaN(addressId)) {
    return sendResponse(res, { statusCode: 400, message: 'Invalid address id' });
  }

  await UserService.setDefaultAddress(userId, addressId);
  sendResponse(res, { statusCode: 200, message: 'Default address updated successfully' });
});
}

