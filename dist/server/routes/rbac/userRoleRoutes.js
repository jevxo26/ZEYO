"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoleController_1 = require("../../controllers/rbac/userRoleController");
const router = (0, express_1.Router)();
// Assign a role to a user
router.post('/assign', userRoleController_1.UserRoleController.assign);
// Revoke a role from a user
router.delete('/revoke', userRoleController_1.UserRoleController.revoke);
// Get all active roles for a specific user
router.get('/:userId', userRoleController_1.UserRoleController.getByUser);
// Get all users assigned to a specific role
router.get('/role/:roleId/users', userRoleController_1.UserRoleController.getUsersByRole);
exports.default = router;
