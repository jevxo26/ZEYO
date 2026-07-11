import { Router } from 'express';
import { verifyToken } from '../../middlewares/authMiddleware';
import { CustomerController } from '../../controllers/customer/customerController';
import {
  CustomerAddressController,
  CustomerEventController,
  CustomerWalletController,
  CustomerBookingController,
  CustomerSupportController,
  CustomerMarketingController,
} from '../../controllers/customer/customerMeController';

const router = Router();

// All customer routes require token verification
router.use(verifyToken);

// ─── Profile & Activities ───────────────────────────────────────────────────
router.get('/profile/me', CustomerController.getMyProfile);
router.post('/profile/me', CustomerController.createMyProfile);
router.put('/profile/me', CustomerController.updateMyProfile);
router.delete('/profile/me', CustomerController.deleteMyProfile);
router.get('/activities/me', CustomerController.getMyActivities);

// ─── Saved Addresses ────────────────────────────────────────────────────────
router.get('/addresses', CustomerAddressController.getAddresses);
router.post('/addresses', CustomerAddressController.createAddress);
router.get('/addresses/:id', CustomerAddressController.getAddressById);
router.put('/addresses/:id', CustomerAddressController.updateAddress);
router.delete('/addresses/:id', CustomerAddressController.deleteAddress);
router.patch('/addresses/:id/default', CustomerAddressController.setDefault);

// ─── Saved / Planned Draft Events & Guests ──────────────────────────────────
router.get('/events', CustomerEventController.getEvents);
router.post('/events', CustomerEventController.createEvent);
router.get('/events/:id', CustomerEventController.getEventById);
router.put('/events/:id', CustomerEventController.updateEvent);
router.delete('/events/:id', CustomerEventController.deleteEvent);

router.get('/events/:eventId/guests', CustomerEventController.getGuests);
router.post('/events/:eventId/guests', CustomerEventController.addGuest);
router.put('/events/:eventId/guests/:guestId', CustomerEventController.updateGuest);
router.delete('/events/:eventId/guests/:guestId', CustomerEventController.deleteGuest);

// ─── Wallet & Transactions ──────────────────────────────────────────────────
router.get('/wallet', CustomerWalletController.getWallet);
router.get('/wallet/transactions', CustomerWalletController.getTransactions);
router.post('/wallet/transactions', CustomerWalletController.createTransaction);
router.get('/wallet/rewards', CustomerWalletController.getRewards);
router.patch('/wallet/rewards/:rewardId/redeem', CustomerWalletController.redeemReward);

// ─── Favorite Packages ───────────────────────────────────────────────────────
router.get('/favorites', CustomerBookingController.getFavorites);
router.post('/favorites', CustomerBookingController.addFavorite);
router.delete('/favorites/:packageId', CustomerBookingController.removeFavorite);

// ─── Smart Calculator Calculations ──────────────────────────────────────────
router.get('/calculations', CustomerBookingController.getCalculations);
router.post('/calculations', CustomerBookingController.saveCalculation);
router.delete('/calculations/:id', CustomerBookingController.deleteCalculation);

// ─── Quotations ─────────────────────────────────────────────────────────────
router.get('/quotations', CustomerBookingController.getQuotations);
router.post('/quotations', CustomerBookingController.createQuotation);
router.get('/quotations/:id', CustomerBookingController.getQuotationById);

// ─── Booking History ────────────────────────────────────────────────────────
router.get('/bookings', CustomerBookingController.getBookings);
router.post('/bookings', CustomerBookingController.addBooking);

// ─── Saved Payment Methods ──────────────────────────────────────────────────
router.get('/payment-methods', CustomerBookingController.getPaymentMethods);
router.post('/payment-methods', CustomerBookingController.addPaymentMethod);
router.delete('/payment-methods/:id', CustomerBookingController.deletePaymentMethod);

// ─── Support Tickets ────────────────────────────────────────────────────────
router.get('/support/tickets', CustomerSupportController.getTickets);
router.post('/support/tickets', CustomerSupportController.createTicket);
router.get('/support/tickets/:id', CustomerSupportController.getTicketById);
router.patch('/support/tickets/:id/status', CustomerSupportController.updateTicketStatus);

// ─── System & Transactional Notifications ──────────────────────────────────
router.get('/notifications', CustomerSupportController.getNotifications);
router.patch('/notifications/:id/read', CustomerSupportController.markNotificationRead);
router.patch('/notifications/read-all', CustomerSupportController.markAllNotificationsRead);

// ─── Referrals ──────────────────────────────────────────────────────────────
router.get('/referrals', CustomerMarketingController.getReferrals);
router.post('/referrals/redeem', CustomerMarketingController.applyReferralCode);

// ─── Platform Overall Service Reviews ───────────────────────────────────────
router.get('/reviews', CustomerMarketingController.getReviews);
router.post('/reviews', CustomerMarketingController.createReview);

export default router;
