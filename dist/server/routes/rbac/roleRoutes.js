"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roleController_1 = require("../../controllers/rbac/roleController");
const router = (0, express_1.Router)();
// List & create
router.get('/', roleController_1.RbacRoleController.getAll);
router.post('/', roleController_1.RbacRoleController.create);
// Lookup by code (must be before /:id to avoid conflict)
router.get('/code/:code', roleController_1.RbacRoleController.getByCode);
// Detail, update, delete
router.get('/:id', roleController_1.RbacRoleController.getById);
router.put('/:id', roleController_1.RbacRoleController.update);
router.delete('/:id', roleController_1.RbacRoleController.delete);
// Permissions for a role
router.get('/:id/permissions', roleController_1.RbacRoleController.getPermissions);
exports.default = router;
