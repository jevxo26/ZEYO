"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const customerController_1 = require("../../controllers/customer/customerController");
const router = (0, express_1.Router)();
// Admin customer management routes
router.use(authMiddleware_1.verifyToken);
router.use((0, authMiddleware_1.requireRole)('admin', 'manager'));
router.get('/', customerController_1.CustomerController.adminGetAllCustomers);
router.get('/:id', customerController_1.CustomerController.adminGetCustomerById);
router.post('/', (0, authMiddleware_1.requireRole)('admin'), customerController_1.CustomerController.adminCreateCustomer);
router.put('/:id', customerController_1.CustomerController.adminUpdateCustomer);
router.delete('/:id', (0, authMiddleware_1.requireRole)('admin'), customerController_1.CustomerController.adminDeleteCustomer);
exports.default = router;
