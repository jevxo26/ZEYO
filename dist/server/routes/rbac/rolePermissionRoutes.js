"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rolePermissionController_1 = require("../../controllers/rbac/rolePermissionController");
const router = (0, express_1.Router)();
// Get all permissions for a role
router.get('/:roleId', rolePermissionController_1.RolePermissionController.getByRole);
// Assign a permission (single)
router.post('/assign', rolePermissionController_1.RolePermissionController.assign);
// Bulk assign permissions
router.post('/bulk-assign', rolePermissionController_1.RolePermissionController.bulkAssign);
// Revoke a single permission
router.delete('/revoke', rolePermissionController_1.RolePermissionController.revoke);
// Revoke all permissions from a role
router.delete('/revoke-all/:roleId', rolePermissionController_1.RolePermissionController.revokeAll);
exports.default = router;
