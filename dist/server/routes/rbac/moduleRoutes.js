"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const moduleController_1 = require("../../controllers/rbac/moduleController");
const router = (0, express_1.Router)();
// Special endpoint (must be before /:id)
router.get('/with-permissions', moduleController_1.ModuleController.getAllWithPermissions);
// List & create
router.get('/', moduleController_1.ModuleController.getAll);
router.post('/', moduleController_1.ModuleController.create);
// Detail, update, delete
router.get('/:id', moduleController_1.ModuleController.getById);
router.put('/:id', moduleController_1.ModuleController.update);
router.delete('/:id', moduleController_1.ModuleController.delete);
exports.default = router;
