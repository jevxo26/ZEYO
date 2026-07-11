"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permissionController_1 = require("../../controllers/rbac/permissionController");
const router = (0, express_1.Router)();
// List & create  (supports ?moduleId=&action=&status= query filters)
router.get('/', permissionController_1.PermissionController.getAll);
router.post('/', permissionController_1.PermissionController.create);
// Detail, update, delete
router.get('/:id', permissionController_1.PermissionController.getById);
router.put('/:id', permissionController_1.PermissionController.update);
router.delete('/:id', permissionController_1.PermissionController.delete);
exports.default = router;
