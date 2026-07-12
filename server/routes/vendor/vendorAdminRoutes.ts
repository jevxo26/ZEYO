import { Router } from 'express';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';
import { VendorController } from '../../controllers/vendor/vendorController';
import { VendorServiceController } from '../../controllers/vendor/vendorServiceController';
import { VendorScheduleController } from '../../controllers/vendor/vendorScheduleController';
import { VendorPortfolioController } from '../../controllers/vendor/vendorPortfolioController';
import { VendorEmployeeController } from '../../controllers/vendor/vendorEmployeeController';
import { VendorFinancialController } from '../../controllers/vendor/vendorFinancialController';

const router = Router();

// Apply auth middleware to protect all vendor APIs for admins and managers only
router.use(verifyToken);
router.use(requireRole('admin', 'manager'));

// Core Vendor CRUD
router.post('/', VendorController.adminCreateVendor);
router.get('/', VendorController.adminGetAllVendors);
router.get('/:id', VendorController.adminGetVendorById);
router.put('/:id', VendorController.adminUpdateVendor);
router.delete('/:id', VendorController.adminDeleteVendor);

// Verifications
router.post('/:id/verify', VendorController.adminVerifyVendor);

// Compliance Documents
router.post('/:id/documents', VendorController.adminUploadDocument);
router.get('/:id/documents', VendorController.adminGetDocuments);
router.patch('/documents/:docId/verify', VendorController.adminVerifyDocument);

// Services
router.post('/:id/services', VendorServiceController.adminAddService);
router.get('/:id/services', VendorServiceController.adminGetServices);
router.put('/services/:serviceId', VendorServiceController.adminUpdateService);
router.delete('/services/:serviceId', VendorServiceController.adminDeleteService);

// Service Zones
router.post('/services/:serviceId/zones', VendorServiceController.adminAddServiceZone);
router.delete('/service-zones/:zoneId', VendorServiceController.adminRemoveServiceZone);

// Pricing
router.post('/services/:serviceId/pricing', VendorServiceController.adminSetPricing);
router.get('/services/:serviceId/pricing', VendorServiceController.adminGetPricing);

// Availability
router.post('/:id/availability', VendorScheduleController.adminSetAvailability);
router.get('/:id/availability', VendorScheduleController.adminGetAvailability);

// Calendar
router.post('/:id/calendar', VendorScheduleController.adminAddCalendarBlock);
router.get('/:id/calendar', VendorScheduleController.adminGetCalendar);
router.delete('/calendar/:blockId', VendorScheduleController.adminRemoveCalendarBlock);

// Portfolios
router.post('/:id/portfolios', VendorPortfolioController.adminCreatePortfolio);
router.get('/:id/portfolios', VendorPortfolioController.adminGetPortfolios);
router.put('/portfolios/:portfolioId', VendorPortfolioController.adminUpdatePortfolio);
router.delete('/portfolios/:portfolioId', VendorPortfolioController.adminDeletePortfolio);

// Portfolio Gallery
router.post('/:id/gallery', VendorPortfolioController.adminAddToGallery);
router.get('/:id/gallery', VendorPortfolioController.adminGetGallery);
router.delete('/gallery/:galleryId', VendorPortfolioController.adminRemoveFromGallery);

// Employees
router.post('/:id/employees', VendorEmployeeController.adminAddEmployee);
router.get('/:id/employees', VendorEmployeeController.adminGetEmployees);
router.put('/employees/:employeeId', VendorEmployeeController.adminUpdateEmployee);
router.delete('/employees/:employeeId', VendorEmployeeController.adminDeleteEmployee);

// Bank Accounts
router.post('/:id/bank-accounts', VendorFinancialController.adminAddBankAccount);
router.get('/:id/bank-accounts', VendorFinancialController.adminGetBankAccounts);
router.patch('/:id/bank-accounts/:accountId/default', VendorFinancialController.adminSetDefaultBankAccount);
router.delete('/bank-accounts/:accountId', VendorFinancialController.adminDeleteBankAccount);

// Wallet & Ledger
router.get('/:id/wallet', VendorFinancialController.adminGetWallet);
router.post('/:id/transactions', VendorFinancialController.adminCreateTransaction);
router.get('/:id/transactions', VendorFinancialController.adminGetTransactions);

// Payouts
router.post('/:id/payouts/request', VendorFinancialController.adminRequestPayout);
router.get('/:id/payouts', VendorFinancialController.adminGetPayouts);
router.patch('/payouts/:payoutId/process', VendorFinancialController.adminProcessPayout);

export default router;
