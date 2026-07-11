import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ModuleService } from '../../services/rbac/moduleService';

export class ModuleController {

  // GET /api/rbac/modules
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const { status } = req.query as Record<string, string>;
    const modules = await ModuleService.getAll(status);
    sendResponse(res, { statusCode: 200, data: modules });
  });

  // GET /api/rbac/modules/with-permissions
  static getAllWithPermissions = catchAsync(async (_req: Request, res: Response) => {
    const modules = await ModuleService.getAllWithPermissions();
    sendResponse(res, { statusCode: 200, data: modules });
  });

  // GET /api/rbac/modules/:id
  static getById = catchAsync(async (req: Request, res: Response) => {
    const mod = await ModuleService.getById(Number(req.params.id));
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found', data: null });
    }
    sendResponse(res, { statusCode: 200, data: mod });
  });

  // POST /api/rbac/modules
  static create = catchAsync(async (req: Request, res: Response) => {
    const mod = await ModuleService.create(req.body);
    sendResponse(res, { statusCode: 201, message: 'Module created successfully', data: mod });
  });

  // PUT /api/rbac/modules/:id
  static update = catchAsync(async (req: Request, res: Response) => {
    const mod = await ModuleService.update(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Module updated successfully', data: mod });
  });

  // DELETE /api/rbac/modules/:id
  static delete = catchAsync(async (req: Request, res: Response) => {
    await ModuleService.delete(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Module deleted successfully', data: null });
  });
}
