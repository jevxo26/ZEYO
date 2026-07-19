"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const customerController_1 = require("../../controllers/customer/customerController");
const customerMeController_1 = require("../../controllers/customer/customerMeController");
const router = (0, express_1.Router)();
// All customer routes require token verification
router.use(authMiddleware_1.verifyToken);
// ─── Profile & Activities ───────────────────────────────────────────────────
router.get('/profile/me', customerController_1.CustomerController.getMyProfile);
router.post('/profile/me', customerController_1.CustomerController.createMyProfile);
router.put('/profile/me', customerController_1.CustomerController.updateMyProfile);
router.delete('/profile/me', customerController_1.CustomerController.deleteMyProfile);
router.get('/activities/me', customerController_1.CustomerController.getMyActivities);
// ─── Saved Addresses ────────────────────────────────────────────────────────
router.get('/addresses', customerMeController_1.CustomerAddressController.getAddresses);
router.post('/addresses', customerMeController_1.CustomerAddressController.createAddress);
router.get('/addresses/:id', customerMeController_1.CustomerAddressController.getAddressById);
router.put('/addresses/:id', customerMeController_1.CustomerAddressController.updateAddress);
router.delete('/addresses/:id', customerMeController_1.CustomerAddressController.deleteAddress);
router.patch('/addresses/:id/default', customerMeController_1.CustomerAddressController.setDefault);
// ─── Saved / Planned Draft Events & Guests ──────────────────────────────────
router.get('/events', customerMeController_1.CustomerEventController.getEvents);
router.post('/events', customerMeController_1.CustomerEventController.createEvent);
router.get('/events/:id', customerMeController_1.CustomerEventController.getEventById);
router.put('/events/:id', customerMeController_1.CustomerEventController.updateEvent);
router.delete('/events/:id', customerMeController_1.CustomerEventController.deleteEvent);
router.get('/events/:eventId/guests', customerMeController_1.CustomerEventController.getGuests);
router.post('/events/:eventId/guests', customerMeController_1.CustomerEventController.addGuest);
router.put('/events/:eventId/guests/:guestId', customerMeController_1.CustomerEventController.updateGuest);
router.delete('/events/:eventId/guests/:guestId', customerMeController_1.CustomerEventController.deleteGuest);
// ─── Wallet & Transactions ──────────────────────────────────────────────────
router.get('/wallet', customerMeController_1.CustomerWalletController.getWallet);
router.get('/wallet/transactions', customerMeController_1.CustomerWalletController.getTransactions);
router.post('/wallet/transactions', customerMeController_1.CustomerWalletController.createTransaction);
router.get('/wallet/rewards', customerMeController_1.CustomerWalletController.getRewards);
router.patch('/wallet/rewards/:rewardId/redeem', customerMeController_1.CustomerWalletController.redeemReward);
// ─── Favorite Packages ───────────────────────────────────────────────────────
router.get('/favorites', customerMeController_1.CustomerBookingController.getFavorites);
router.post('/favorites', customerMeController_1.CustomerBookingController.addFavorite);
router.delete('/favorites/:packageId', customerMeController_1.CustomerBookingController.removeFavorite);
// ─── Smart Calculator Calculations ──────────────────────────────────────────
router.get('/calculations', customerMeController_1.CustomerBookingController.getCalculations);
router.post('/calculations', customerMeController_1.CustomerBookingController.saveCalculation);
router.delete('/calculations/:id', customerMeController_1.CustomerBookingController.deleteCalculation);
// ─── Quotations ─────────────────────────────────────────────────────────────
router.get('/quotations', customerMeController_1.CustomerBookingController.getQuotations);
router.post('/quotations', customerMeController_1.CustomerBookingController.createQuotation);
router.get('/quotations/:id', customerMeController_1.CustomerBookingController.getQuotationById);
// ─── Booking History ────────────────────────────────────────────────────────
router.get('/bookings', customerMeController_1.CustomerBookingController.getBookings);
router.post('/bookings', customerMeController_1.CustomerBookingController.addBooking);
// ─── Saved Payment Methods ──────────────────────────────────────────────────
router.get('/payment-methods', customerMeController_1.CustomerBookingController.getPaymentMethods);
router.post('/payment-methods', customerMeController_1.CustomerBookingController.addPaymentMethod);
router.delete('/payment-methods/:id', customerMeController_1.CustomerBookingController.deletePaymentMethod);
// ─── Support Tickets ────────────────────────────────────────────────────────
router.get('/support/tickets', customerMeController_1.CustomerSupportController.getTickets);
router.post('/support/tickets', customerMeController_1.CustomerSupportController.createTicket);
router.get('/support/tickets/:id', customerMeController_1.CustomerSupportController.getTicketById);
router.patch('/support/tickets/:id/status', customerMeController_1.CustomerSupportController.updateTicketStatus);
// ─── System & Transactional Notifications ──────────────────────────────────
router.get('/notifications', customerMeController_1.CustomerSupportController.getNotifications);
router.patch('/notifications/:id/read', customerMeController_1.CustomerSupportController.markNotificationRead);
router.patch('/notifications/read-all', customerMeController_1.CustomerSupportController.markAllNotificationsRead);
// ─── Referrals ──────────────────────────────────────────────────────────────
router.get('/referrals', customerMeController_1.CustomerMarketingController.getReferrals);
router.post('/referrals/redeem', customerMeController_1.CustomerMarketingController.applyReferralCode);
// ─── Platform Overall Service Reviews ───────────────────────────────────────
router.get('/reviews', customerMeController_1.CustomerMarketingController.getReviews);
router.post('/reviews', customerMeController_1.CustomerMarketingController.createReview);
exports.default = router;
