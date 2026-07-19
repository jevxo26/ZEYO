"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerMarketingController = exports.CustomerSupportController = exports.CustomerBookingController = exports.CustomerWalletController = exports.CustomerEventController = exports.CustomerAddressController = void 0;
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
const customerService_1 = require("../../services/customer/customerService");
const customerAddressService_1 = require("../../services/customer/customerAddressService");
const customerEventService_1 = require("../../services/customer/customerEventService");
const customerWalletService_1 = require("../../services/customer/customerWalletService");
const customerBookingService_1 = require("../../services/customer/customerBookingService");
const customerSupportService_1 = require("../../services/customer/customerSupportService");
const customerMarketingService_1 = require("../../services/customer/customerMarketingService");
// Helper to resolve the customerId from the authenticated user
const getCustomerId = async (req, res) => {
    var _g;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    if (isNaN(userId)) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 401, message: 'Unauthorized' });
        return null;
    }
    const customer = await customerService_1.CustomerService.getCustomerByUserId(userId);
    if (!customer) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'Customer profile not found' });
        return null;
    }
    return customer.id;
};
// ── Addresses ──────────────────────────────────────────────────────────────
class CustomerAddressController {
}
exports.CustomerAddressController = CustomerAddressController;
_a = CustomerAddressController;
CustomerAddressController.getAddresses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const addresses = await customerAddressService_1.CustomerAddressService.getAddresses(customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: addresses });
});
CustomerAddressController.getAddressById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid address id' });
    const address = await customerAddressService_1.CustomerAddressService.getAddressById(id, customerId);
    if (!address)
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'Address not found' });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: address });
});
CustomerAddressController.createAddress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const address = await customerAddressService_1.CustomerAddressService.createAddress(customerId, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Address created successfully', data: address });
});
CustomerAddressController.updateAddress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid address id' });
    const address = await customerAddressService_1.CustomerAddressService.updateAddress(id, customerId, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Address updated successfully', data: address });
});
CustomerAddressController.deleteAddress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid address id' });
    await customerAddressService_1.CustomerAddressService.deleteAddress(id, customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Address deleted successfully' });
});
CustomerAddressController.setDefault = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid address id' });
    const address = await customerAddressService_1.CustomerAddressService.setDefaultAddress(id, customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Default address updated', data: address });
});
// ── Events & Guests ────────────────────────────────────────────────────────
class CustomerEventController {
}
exports.CustomerEventController = CustomerEventController;
_b = CustomerEventController;
CustomerEventController.getEvents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const events = await customerEventService_1.CustomerEventService.getEvents(customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: events });
});
CustomerEventController.getEventById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid event id' });
    const event = await customerEventService_1.CustomerEventService.getEventById(id, customerId);
    if (!event)
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'Event not found' });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: event });
});
CustomerEventController.createEvent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    if (!req.body.eventTitle) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'eventTitle is required' });
    }
    const event = await customerEventService_1.CustomerEventService.createEvent(customerId, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Draft event created successfully', data: event });
});
CustomerEventController.updateEvent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid event id' });
    const event = await customerEventService_1.CustomerEventService.updateEvent(id, customerId, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Event updated successfully', data: event });
});
CustomerEventController.deleteEvent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid event id' });
    await customerEventService_1.CustomerEventService.deleteEvent(id, customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Event deleted successfully' });
});
// Guest list actions
CustomerEventController.getGuests = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const eventId = parseInt(req.params['eventId'], 10);
    if (isNaN(eventId))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid event id' });
    const guests = await customerEventService_1.CustomerEventService.getGuests(eventId, customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: guests });
});
CustomerEventController.addGuest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const eventId = parseInt(req.params['eventId'], 10);
    if (isNaN(eventId))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid event id' });
    const guest = await customerEventService_1.CustomerEventService.addGuest(eventId, customerId, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Guest added successfully', data: guest });
});
CustomerEventController.updateGuest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const eventId = parseInt(req.params['eventId'], 10);
    const guestId = parseInt(req.params['guestId'], 10);
    if (isNaN(eventId) || isNaN(guestId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid eventId or guestId parameters' });
    }
    const guest = await customerEventService_1.CustomerEventService.updateGuest(guestId, eventId, customerId, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Guest updated successfully', data: guest });
});
CustomerEventController.deleteGuest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const eventId = parseInt(req.params['eventId'], 10);
    const guestId = parseInt(req.params['guestId'], 10);
    if (isNaN(eventId) || isNaN(guestId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid eventId or guestId parameters' });
    }
    await customerEventService_1.CustomerEventService.deleteGuest(guestId, eventId, customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Guest removed successfully' });
});
// ── Wallet & Transactions ──────────────────────────────────────────────────
class CustomerWalletController {
}
exports.CustomerWalletController = CustomerWalletController;
_c = CustomerWalletController;
CustomerWalletController.getWallet = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const wallet = await customerWalletService_1.CustomerWalletService.getWallet(customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: wallet || {} });
});
CustomerWalletController.getTransactions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const txs = await customerWalletService_1.CustomerWalletService.getTransactions(customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: txs });
});
CustomerWalletController.getRewards = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const rewards = await customerWalletService_1.CustomerWalletService.getRewards(customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: rewards });
});
CustomerWalletController.createTransaction = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const { transactionType, amount, bookingId, reference } = req.body;
    if (!transactionType || !amount) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'transactionType and amount are required' });
    }
    const tx = await customerWalletService_1.CustomerWalletService.createTransaction(customerId, {
        transactionType,
        amount: parseFloat(amount),
        bookingId: bookingId ? parseInt(bookingId, 10) : undefined,
        reference,
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Transaction processed successfully', data: tx });
});
CustomerWalletController.redeemReward = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const rewardId = parseInt(req.params['rewardId'], 10);
    if (isNaN(rewardId))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid reward id' });
    const result = await customerWalletService_1.CustomerWalletService.redeemReward(rewardId, customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Reward points redeemed to cash balance', data: result });
});
// ── Bookings, Calculator, Quotations & Payment Methods ─────────────────────
class CustomerBookingController {
}
exports.CustomerBookingController = CustomerBookingController;
_d = CustomerBookingController;
CustomerBookingController.getFavorites = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const favs = await customerBookingService_1.CustomerBookingService.getFavorites(customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: favs });
});
CustomerBookingController.addFavorite = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const packageId = parseInt(req.body.packageId, 10);
    if (isNaN(packageId))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'packageId is required and must be an integer' });
    const fav = await customerBookingService_1.CustomerBookingService.addFavorite(customerId, packageId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Package added to favorites', data: fav });
});
CustomerBookingController.removeFavorite = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const packageId = parseInt(req.params['packageId'], 10);
    if (isNaN(packageId))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid packageId parameter' });
    await customerBookingService_1.CustomerBookingService.removeFavorite(customerId, packageId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Package removed from favorites' });
});
CustomerBookingController.getCalculations = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const calcs = await customerBookingService_1.CustomerBookingService.getCalculations(customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: calcs });
});
CustomerBookingController.saveCalculation = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const { calculatorId, title, estimatedPrice, selectedServices } = req.body;
    if (!calculatorId || !title) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'calculatorId and title are required' });
    }
    const calc = await customerBookingService_1.CustomerBookingService.saveCalculation(customerId, {
        calculatorId: parseInt(calculatorId, 10),
        title,
        estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : undefined,
        selectedServices,
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Calculator result saved', data: calc });
});
CustomerBookingController.deleteCalculation = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid saved calculation id' });
    await customerBookingService_1.CustomerBookingService.deleteCalculation(id, customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Saved calculation deleted' });
});
CustomerBookingController.getQuotations = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const quotes = await customerBookingService_1.CustomerBookingService.getQuotations(customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: quotes });
});
CustomerBookingController.getQuotationById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid quotation id' });
    const quote = await customerBookingService_1.CustomerBookingService.getQuotationById(id, customerId);
    if (!quote)
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'Quotation not found' });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: quote });
});
CustomerBookingController.createQuotation = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const { totalAmount, finalAmount, calculatorId, bookingId, discount, validUntil } = req.body;
    if (totalAmount === undefined || finalAmount === undefined) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'totalAmount and finalAmount are required' });
    }
    const quote = await customerBookingService_1.CustomerBookingService.createQuotation(customerId, {
        totalAmount: parseFloat(totalAmount),
        finalAmount: parseFloat(finalAmount),
        calculatorId: calculatorId ? parseInt(calculatorId, 10) : undefined,
        bookingId: bookingId ? parseInt(bookingId, 10) : undefined,
        discount: discount ? parseFloat(discount) : undefined,
        validUntil,
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Quotation created', data: quote });
});
CustomerBookingController.getBookings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const bookings = await customerBookingService_1.CustomerBookingService.getBookings(customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: bookings });
});
CustomerBookingController.addBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const { bookingId, eventTypeId, bookingDate, bookingStatus, paymentStatus, totalAmount } = req.body;
    if (!bookingId || !bookingDate || !bookingStatus || !paymentStatus || totalAmount === undefined) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Missing required booking history fields' });
    }
    const booking = await customerBookingService_1.CustomerBookingService.addBookingRecord(customerId, {
        bookingId: parseInt(bookingId, 10),
        eventTypeId: eventTypeId ? parseInt(eventTypeId, 10) : undefined,
        bookingDate,
        bookingStatus,
        paymentStatus,
        totalAmount: parseFloat(totalAmount),
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Booking history updated', data: booking });
});
CustomerBookingController.getPaymentMethods = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const methods = await customerBookingService_1.CustomerBookingService.getPaymentMethods(customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: methods });
});
CustomerBookingController.addPaymentMethod = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const { paymentType, accountName, accountNumber, provider, isDefault } = req.body;
    if (!paymentType || !accountName || !accountNumber) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'paymentType, accountName, and accountNumber are required' });
    }
    const pm = await customerBookingService_1.CustomerBookingService.addPaymentMethod(customerId, {
        paymentType,
        accountName,
        accountNumber,
        provider,
        isDefault: !!isDefault,
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Payment method saved', data: pm });
});
CustomerBookingController.deletePaymentMethod = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid payment method id' });
    await customerBookingService_1.CustomerBookingService.deletePaymentMethod(id, customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Payment method deleted' });
});
// ── Support Tickets & Notifications ───────────────────────────────────────
class CustomerSupportController {
}
exports.CustomerSupportController = CustomerSupportController;
_e = CustomerSupportController;
CustomerSupportController.getTickets = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const tickets = await customerSupportService_1.CustomerSupportService.getTickets(customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: tickets });
});
CustomerSupportController.getTicketById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid ticket id' });
    const ticket = await customerSupportService_1.CustomerSupportService.getTicketById(id, customerId);
    if (!ticket)
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'Ticket not found' });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: ticket });
});
CustomerSupportController.createTicket = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const { subject, description, priority } = req.body;
    if (!subject || !description) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'subject and description are required' });
    }
    const ticket = await customerSupportService_1.CustomerSupportService.createTicket(customerId, { subject, description, priority });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Support ticket opened successfully', data: ticket });
});
CustomerSupportController.updateTicketStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const id = parseInt(req.params['id'], 10);
    const { status } = req.body;
    if (isNaN(id) || !status) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'id parameter and status are required' });
    }
    const ticket = await customerSupportService_1.CustomerSupportService.updateTicketStatus(id, customerId, status);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Ticket status updated', data: ticket });
});
CustomerSupportController.getNotifications = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const notifs = await customerSupportService_1.CustomerSupportService.getNotifications(customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: notifs });
});
CustomerSupportController.markNotificationRead = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid notification id' });
    const notif = await customerSupportService_1.CustomerSupportService.markAsRead(id, customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Notification marked as read', data: notif });
});
CustomerSupportController.markAllNotificationsRead = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    await customerSupportService_1.CustomerSupportService.markAllAsRead(customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'All notifications marked as read' });
});
// ── Marketing: Referrals & Reviews ────────────────────────────────────────
class CustomerMarketingController {
}
exports.CustomerMarketingController = CustomerMarketingController;
_f = CustomerMarketingController;
CustomerMarketingController.getReferrals = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const referrals = await customerMarketingService_1.CustomerMarketingService.getReferrals(customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: referrals });
});
CustomerMarketingController.applyReferralCode = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const { referralCode } = req.body;
    if (!referralCode) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'referralCode is required' });
    }
    const ref = await customerMarketingService_1.CustomerMarketingService.applyReferral(customerId, referralCode);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Referral code applied and rewards distributed!', data: ref });
});
CustomerMarketingController.getReviews = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const reviews = await customerMarketingService_1.CustomerMarketingService.getReviews(customerId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: reviews });
});
CustomerMarketingController.createReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId)
        return;
    const { bookingId, rating, title, review, serviceQuality, supportExperience, bookingExperience, overallExperience } = req.body;
    if (!bookingId || rating === undefined) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'bookingId and rating are required' });
    }
    const newReview = await customerMarketingService_1.CustomerMarketingService.createReview(customerId, {
        bookingId: parseInt(bookingId, 10),
        rating: parseInt(rating, 10),
        title,
        review,
        serviceQuality: serviceQuality ? parseInt(serviceQuality, 10) : undefined,
        supportExperience: supportExperience ? parseInt(supportExperience, 10) : undefined,
        bookingExperience: bookingExperience ? parseInt(bookingExperience, 10) : undefined,
        overallExperience: overallExperience ? parseInt(overallExperience, 10) : undefined,
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Overall service review submitted', data: newReview });
});
