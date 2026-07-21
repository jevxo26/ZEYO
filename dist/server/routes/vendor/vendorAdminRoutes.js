"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const vendorController_1 = require("../../controllers/vendor/vendorController");
const vendorServiceController_1 = require("../../controllers/vendor/vendorServiceController");
const vendorScheduleController_1 = require("../../controllers/vendor/vendorScheduleController");
const vendorPortfolioController_1 = require("../../controllers/vendor/vendorPortfolioController");
const vendorEmployeeController_1 = require("../../controllers/vendor/vendorEmployeeController");
const vendorFinancialController_1 = require("../../controllers/vendor/vendorFinancialController");
const router = (0, express_1.Router)();
// Apply auth middleware to protect all vendor APIs for admins and managers only
router.use(authMiddleware_1.verifyToken);
router.use((0, authMiddleware_1.requireRole)('admin', 'manager'));
// Core Vendor CRUD
router.post('/', vendorController_1.VendorController.adminCreateVendor);
router.get('/', vendorController_1.VendorController.adminGetAllVendors);
router.get('/:id', vendorController_1.VendorController.adminGetVendorById);
router.put('/:id', vendorController_1.VendorController.adminUpdateVendor);
router.delete('/:id', vendorController_1.VendorController.adminDeleteVendor);
// Verifications
router.post('/:id/verify', vendorController_1.VendorController.adminVerifyVendor);
// Compliance Documents
router.post('/:id/documents', vendorController_1.VendorController.adminUploadDocument);
router.get('/:id/documents', vendorController_1.VendorController.adminGetDocuments);
router.patch('/documents/:docId/verify', vendorController_1.VendorController.adminVerifyDocument);
// Services
router.post('/:id/services', vendorServiceController_1.VendorServiceController.adminAddService);
router.get('/:id/services', vendorServiceController_1.VendorServiceController.adminGetServices);
router.put('/services/:serviceId', vendorServiceController_1.VendorServiceController.adminUpdateService);
router.delete('/services/:serviceId', vendorServiceController_1.VendorServiceController.adminDeleteService);
// Service Zones
router.post('/services/:serviceId/zones', vendorServiceController_1.VendorServiceController.adminAddServiceZone);
router.delete('/service-zones/:zoneId', vendorServiceController_1.VendorServiceController.adminRemoveServiceZone);
// Pricing
router.post('/services/:serviceId/pricing', vendorServiceController_1.VendorServiceController.adminSetPricing);
router.get('/services/:serviceId/pricing', vendorServiceController_1.VendorServiceController.adminGetPricing);
// Availability
router.post('/:id/availability', vendorScheduleController_1.VendorScheduleController.adminSetAvailability);
router.get('/:id/availability', vendorScheduleController_1.VendorScheduleController.adminGetAvailability);
// Calendar
router.post('/:id/calendar', vendorScheduleController_1.VendorScheduleController.adminAddCalendarBlock);
router.get('/:id/calendar', vendorScheduleController_1.VendorScheduleController.adminGetCalendar);
router.delete('/calendar/:blockId', vendorScheduleController_1.VendorScheduleController.adminRemoveCalendarBlock);
// Portfolios
router.post('/:id/portfolios', vendorPortfolioController_1.VendorPortfolioController.adminCreatePortfolio);
router.get('/:id/portfolios', vendorPortfolioController_1.VendorPortfolioController.adminGetPortfolios);
router.put('/portfolios/:portfolioId', vendorPortfolioController_1.VendorPortfolioController.adminUpdatePortfolio);
router.delete('/portfolios/:portfolioId', vendorPortfolioController_1.VendorPortfolioController.adminDeletePortfolio);
// Portfolio Gallery
router.post('/:id/gallery', vendorPortfolioController_1.VendorPortfolioController.adminAddToGallery);
router.get('/:id/gallery', vendorPortfolioController_1.VendorPortfolioController.adminGetGallery);
router.delete('/gallery/:galleryId', vendorPortfolioController_1.VendorPortfolioController.adminRemoveFromGallery);
// Employees
router.post('/:id/employees', vendorEmployeeController_1.VendorEmployeeController.adminAddEmployee);
router.get('/:id/employees', vendorEmployeeController_1.VendorEmployeeController.adminGetEmployees);
router.put('/employees/:employeeId', vendorEmployeeController_1.VendorEmployeeController.adminUpdateEmployee);
router.delete('/employees/:employeeId', vendorEmployeeController_1.VendorEmployeeController.adminDeleteEmployee);
// Bank Accounts
router.post('/:id/bank-accounts', vendorFinancialController_1.VendorFinancialController.adminAddBankAccount);
router.get('/:id/bank-accounts', vendorFinancialController_1.VendorFinancialController.adminGetBankAccounts);
router.patch('/:id/bank-accounts/:accountId/default', vendorFinancialController_1.VendorFinancialController.adminSetDefaultBankAccount);
router.delete('/bank-accounts/:accountId', vendorFinancialController_1.VendorFinancialController.adminDeleteBankAccount);
// Wallet & Ledger
router.get('/:id/wallet', vendorFinancialController_1.VendorFinancialController.adminGetWallet);
router.post('/:id/transactions', vendorFinancialController_1.VendorFinancialController.adminCreateTransaction);
router.get('/:id/transactions', vendorFinancialController_1.VendorFinancialController.adminGetTransactions);
// Payouts
router.post('/:id/payouts/request', vendorFinancialController_1.VendorFinancialController.adminRequestPayout);
router.get('/:id/payouts', vendorFinancialController_1.VendorFinancialController.adminGetPayouts);
router.patch('/payouts/:payoutId/process', vendorFinancialController_1.VendorFinancialController.adminProcessPayout);
exports.default = router;
