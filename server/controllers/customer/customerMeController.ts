import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { sendResponse } from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';
import { CustomerService } from '../../services/customer/customerService';
import { CustomerAddressService } from '../../services/customer/customerAddressService';
import { CustomerEventService } from '../../services/customer/customerEventService';
import { CustomerWalletService } from '../../services/customer/customerWalletService';
import { CustomerBookingService } from '../../services/customer/customerBookingService';
import { CustomerSupportService } from '../../services/customer/customerSupportService';
import { CustomerMarketingService } from '../../services/customer/customerMarketingService';

// Helper to resolve the customerId from the authenticated user
const getCustomerId = async (req: AuthRequest, res: Response): Promise<number | null> => {
  const userId = parseInt(String(req.user?.userId), 10);
  if (isNaN(userId)) {
    sendResponse(res, { statusCode: 401, message: 'Unauthorized' });
    return null;
  }

  const customer = await CustomerService.getCustomerByUserId(userId);
  if (!customer) {
    sendResponse(res, { statusCode: 404, message: 'Customer profile not found' });
    return null;
  }

  return customer.id;
};

// ── Addresses ──────────────────────────────────────────────────────────────
export class CustomerAddressController {
  static getAddresses = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const addresses = await CustomerAddressService.getAddresses(customerId);
    sendResponse(res, { statusCode: 200, data: addresses });
  });

  static getAddressById = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) return sendResponse(res, { statusCode: 400, message: 'Invalid address id' });

    const address = await CustomerAddressService.getAddressById(id, customerId);
    if (!address) return sendResponse(res, { statusCode: 404, message: 'Address not found' });

    sendResponse(res, { statusCode: 200, data: address });
  });

  static createAddress = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const address = await CustomerAddressService.createAddress(customerId, req.body);
    sendResponse(res, { statusCode: 201, message: 'Address created successfully', data: address });
  });

  static updateAddress = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) return sendResponse(res, { statusCode: 400, message: 'Invalid address id' });

    const address = await CustomerAddressService.updateAddress(id, customerId, req.body);
    sendResponse(res, { statusCode: 200, message: 'Address updated successfully', data: address });
  });

  static deleteAddress = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) return sendResponse(res, { statusCode: 400, message: 'Invalid address id' });

    await CustomerAddressService.deleteAddress(id, customerId);
    sendResponse(res, { statusCode: 200, message: 'Address deleted successfully' });
  });

  static setDefault = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) return sendResponse(res, { statusCode: 400, message: 'Invalid address id' });

    const address = await CustomerAddressService.setDefaultAddress(id, customerId);
    sendResponse(res, { statusCode: 200, message: 'Default address updated', data: address });
  });
}

// ── Events & Guests ────────────────────────────────────────────────────────
export class CustomerEventController {
  static getEvents = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const events = await CustomerEventService.getEvents(customerId);
    sendResponse(res, { statusCode: 200, data: events });
  });

  static getEventById = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) return sendResponse(res, { statusCode: 400, message: 'Invalid event id' });

    const event = await CustomerEventService.getEventById(id, customerId);
    if (!event) return sendResponse(res, { statusCode: 404, message: 'Event not found' });

    sendResponse(res, { statusCode: 200, data: event });
  });

  static createEvent = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    if (!req.body.eventTitle) {
      return sendResponse(res, { statusCode: 400, message: 'eventTitle is required' });
    }

    const event = await CustomerEventService.createEvent(customerId, req.body);
    sendResponse(res, { statusCode: 201, message: 'Draft event created successfully', data: event });
  });

  static updateEvent = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) return sendResponse(res, { statusCode: 400, message: 'Invalid event id' });

    const event = await CustomerEventService.updateEvent(id, customerId, req.body);
    sendResponse(res, { statusCode: 200, message: 'Event updated successfully', data: event });
  });

  static deleteEvent = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) return sendResponse(res, { statusCode: 400, message: 'Invalid event id' });

    await CustomerEventService.deleteEvent(id, customerId);
    sendResponse(res, { statusCode: 200, message: 'Event deleted successfully' });
  });

  // Guest list actions
  static getGuests = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const eventId = parseInt(req.params['eventId'] as string, 10);
    if (isNaN(eventId)) return sendResponse(res, { statusCode: 400, message: 'Invalid event id' });

    const guests = await CustomerEventService.getGuests(eventId, customerId);
    sendResponse(res, { statusCode: 200, data: guests });
  });

  static addGuest = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const eventId = parseInt(req.params['eventId'] as string, 10);
    if (isNaN(eventId)) return sendResponse(res, { statusCode: 400, message: 'Invalid event id' });

    const guest = await CustomerEventService.addGuest(eventId, customerId, req.body);
    sendResponse(res, { statusCode: 201, message: 'Guest added successfully', data: guest });
  });

  static updateGuest = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const eventId = parseInt(req.params['eventId'] as string, 10);
    const guestId = parseInt(req.params['guestId'] as string, 10);
    if (isNaN(eventId) || isNaN(guestId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid eventId or guestId parameters' });
    }

    const guest = await CustomerEventService.updateGuest(guestId, eventId, customerId, req.body);
    sendResponse(res, { statusCode: 200, message: 'Guest updated successfully', data: guest });
  });

  static deleteGuest = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const eventId = parseInt(req.params['eventId'] as string, 10);
    const guestId = parseInt(req.params['guestId'] as string, 10);
    if (isNaN(eventId) || isNaN(guestId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid eventId or guestId parameters' });
    }

    await CustomerEventService.deleteGuest(guestId, eventId, customerId);
    sendResponse(res, { statusCode: 200, message: 'Guest removed successfully' });
  });
}

// ── Wallet & Transactions ──────────────────────────────────────────────────
export class CustomerWalletController {
  static getWallet = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const wallet = await CustomerWalletService.getWallet(customerId);
    sendResponse(res, { statusCode: 200, data: wallet || {} });
  });

  static getTransactions = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const txs = await CustomerWalletService.getTransactions(customerId);
    sendResponse(res, { statusCode: 200, data: txs });
  });

  static getRewards = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const rewards = await CustomerWalletService.getRewards(customerId);
    sendResponse(res, { statusCode: 200, data: rewards });
  });

  static createTransaction = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const { transactionType, amount, bookingId, reference } = req.body;
    if (!transactionType || !amount) {
      return sendResponse(res, { statusCode: 400, message: 'transactionType and amount are required' });
    }

    const tx = await CustomerWalletService.createTransaction(customerId, {
      transactionType,
      amount: parseFloat(amount),
      bookingId: bookingId ? parseInt(bookingId, 10) : undefined,
      reference,
    });

    sendResponse(res, { statusCode: 201, message: 'Transaction processed successfully', data: tx });
  });

  static redeemReward = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const rewardId = parseInt(req.params['rewardId'] as string, 10);
    if (isNaN(rewardId)) return sendResponse(res, { statusCode: 400, message: 'Invalid reward id' });

    const result = await CustomerWalletService.redeemReward(rewardId, customerId);
    sendResponse(res, { statusCode: 200, message: 'Reward points redeemed to cash balance', data: result });
  });
}

// ── Bookings, Calculator, Quotations & Payment Methods ─────────────────────
export class CustomerBookingController {
  static getFavorites = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const favs = await CustomerBookingService.getFavorites(customerId);
    sendResponse(res, { statusCode: 200, data: favs });
  });

  static addFavorite = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const packageId = parseInt(req.body.packageId, 10);
    if (isNaN(packageId)) return sendResponse(res, { statusCode: 400, message: 'packageId is required and must be an integer' });

    const fav = await CustomerBookingService.addFavorite(customerId, packageId);
    sendResponse(res, { statusCode: 201, message: 'Package added to favorites', data: fav });
  });

  static removeFavorite = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const packageId = parseInt(req.params['packageId'] as string, 10);
    if (isNaN(packageId)) return sendResponse(res, { statusCode: 400, message: 'Invalid packageId parameter' });

    await CustomerBookingService.removeFavorite(customerId, packageId);
    sendResponse(res, { statusCode: 200, message: 'Package removed from favorites' });
  });

  static getCalculations = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const calcs = await CustomerBookingService.getCalculations(customerId);
    sendResponse(res, { statusCode: 200, data: calcs });
  });

  static saveCalculation = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const { calculatorId, title, estimatedPrice, selectedServices } = req.body;
    if (!calculatorId || !title) {
      return sendResponse(res, { statusCode: 400, message: 'calculatorId and title are required' });
    }

    const calc = await CustomerBookingService.saveCalculation(customerId, {
      calculatorId: parseInt(calculatorId, 10),
      title,
      estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : undefined,
      selectedServices,
    });

    sendResponse(res, { statusCode: 201, message: 'Calculator result saved', data: calc });
  });

  static deleteCalculation = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) return sendResponse(res, { statusCode: 400, message: 'Invalid saved calculation id' });

    await CustomerBookingService.deleteCalculation(id, customerId);
    sendResponse(res, { statusCode: 200, message: 'Saved calculation deleted' });
  });

  static getQuotations = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const quotes = await CustomerBookingService.getQuotations(customerId);
    sendResponse(res, { statusCode: 200, data: quotes });
  });

  static getQuotationById = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) return sendResponse(res, { statusCode: 400, message: 'Invalid quotation id' });

    const quote = await CustomerBookingService.getQuotationById(id, customerId);
    if (!quote) return sendResponse(res, { statusCode: 404, message: 'Quotation not found' });

    sendResponse(res, { statusCode: 200, data: quote });
  });

  static createQuotation = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const { totalAmount, finalAmount, calculatorId, bookingId, discount, validUntil } = req.body;
    if (totalAmount === undefined || finalAmount === undefined) {
      return sendResponse(res, { statusCode: 400, message: 'totalAmount and finalAmount are required' });
    }

    const quote = await CustomerBookingService.createQuotation(customerId, {
      totalAmount: parseFloat(totalAmount),
      finalAmount: parseFloat(finalAmount),
      calculatorId: calculatorId ? parseInt(calculatorId, 10) : undefined,
      bookingId: bookingId ? parseInt(bookingId, 10) : undefined,
      discount: discount ? parseFloat(discount) : undefined,
      validUntil,
    });

    sendResponse(res, { statusCode: 201, message: 'Quotation created', data: quote });
  });

  static getBookings = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const bookings = await CustomerBookingService.getBookings(customerId);
    sendResponse(res, { statusCode: 200, data: bookings });
  });

  static addBooking = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const { bookingId, eventTypeId, bookingDate, bookingStatus, paymentStatus, totalAmount } = req.body;
    if (!bookingId || !bookingDate || !bookingStatus || !paymentStatus || totalAmount === undefined) {
      return sendResponse(res, { statusCode: 400, message: 'Missing required booking history fields' });
    }

    const booking = await CustomerBookingService.addBookingRecord(customerId, {
      bookingId: parseInt(bookingId, 10),
      eventTypeId: eventTypeId ? parseInt(eventTypeId, 10) : undefined,
      bookingDate,
      bookingStatus,
      paymentStatus,
      totalAmount: parseFloat(totalAmount),
    });

    sendResponse(res, { statusCode: 201, message: 'Booking history updated', data: booking });
  });

  static getPaymentMethods = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const methods = await CustomerBookingService.getPaymentMethods(customerId);
    sendResponse(res, { statusCode: 200, data: methods });
  });

  static addPaymentMethod = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const { paymentType, accountName, accountNumber, provider, isDefault } = req.body;
    if (!paymentType || !accountName || !accountNumber) {
      return sendResponse(res, { statusCode: 400, message: 'paymentType, accountName, and accountNumber are required' });
    }

    const pm = await CustomerBookingService.addPaymentMethod(customerId, {
      paymentType,
      accountName,
      accountNumber,
      provider,
      isDefault: !!isDefault,
    });

    sendResponse(res, { statusCode: 201, message: 'Payment method saved', data: pm });
  });

  static deletePaymentMethod = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) return sendResponse(res, { statusCode: 400, message: 'Invalid payment method id' });

    await CustomerBookingService.deletePaymentMethod(id, customerId);
    sendResponse(res, { statusCode: 200, message: 'Payment method deleted' });
  });
}

// ── Support Tickets & Notifications ───────────────────────────────────────
export class CustomerSupportController {
  static getTickets = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const tickets = await CustomerSupportService.getTickets(customerId);
    sendResponse(res, { statusCode: 200, data: tickets });
  });

  static getTicketById = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) return sendResponse(res, { statusCode: 400, message: 'Invalid ticket id' });

    const ticket = await CustomerSupportService.getTicketById(id, customerId);
    if (!ticket) return sendResponse(res, { statusCode: 404, message: 'Ticket not found' });

    sendResponse(res, { statusCode: 200, data: ticket });
  });

  static createTicket = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const { subject, description, priority } = req.body;
    if (!subject || !description) {
      return sendResponse(res, { statusCode: 400, message: 'subject and description are required' });
    }

    const ticket = await CustomerSupportService.createTicket(customerId, { subject, description, priority });
    sendResponse(res, { statusCode: 201, message: 'Support ticket opened successfully', data: ticket });
  });

  static updateTicketStatus = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const id = parseInt(req.params['id'] as string, 10);
    const { status } = req.body;
    if (isNaN(id) || !status) {
      return sendResponse(res, { statusCode: 400, message: 'id parameter and status are required' });
    }

    const ticket = await CustomerSupportService.updateTicketStatus(id, customerId, status);
    sendResponse(res, { statusCode: 200, message: 'Ticket status updated', data: ticket });
  });

  static getNotifications = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const notifs = await CustomerSupportService.getNotifications(customerId);
    sendResponse(res, { statusCode: 200, data: notifs });
  });

  static markNotificationRead = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) return sendResponse(res, { statusCode: 400, message: 'Invalid notification id' });

    const notif = await CustomerSupportService.markAsRead(id, customerId);
    sendResponse(res, { statusCode: 200, message: 'Notification marked as read', data: notif });
  });

  static markAllNotificationsRead = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    await CustomerSupportService.markAllAsRead(customerId);
    sendResponse(res, { statusCode: 200, message: 'All notifications marked as read' });
  });
}

// ── Marketing: Referrals & Reviews ────────────────────────────────────────
export class CustomerMarketingController {
  static getReferrals = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const referrals = await CustomerMarketingService.getReferrals(customerId);
    sendResponse(res, { statusCode: 200, data: referrals });
  });

  static applyReferralCode = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const { referralCode } = req.body;
    if (!referralCode) {
      return sendResponse(res, { statusCode: 400, message: 'referralCode is required' });
    }

    const ref = await CustomerMarketingService.applyReferral(customerId, referralCode);
    sendResponse(res, { statusCode: 200, message: 'Referral code applied and rewards distributed!', data: ref });
  });

  static getReviews = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const reviews = await CustomerMarketingService.getReviews(customerId);
    sendResponse(res, { statusCode: 200, data: reviews });
  });

  static createReview = catchAsync(async (req: AuthRequest, res: Response) => {
    const customerId = await getCustomerId(req, res);
    if (!customerId) return;

    const { bookingId, rating, title, review, serviceQuality, supportExperience, bookingExperience, overallExperience } = req.body;
    if (!bookingId || rating === undefined) {
      return sendResponse(res, { statusCode: 400, message: 'bookingId and rating are required' });
    }

    const newReview = await CustomerMarketingService.createReview(customerId, {
      bookingId: parseInt(bookingId, 10),
      rating: parseInt(rating, 10),
      title,
      review,
      serviceQuality: serviceQuality ? parseInt(serviceQuality, 10) : undefined,
      supportExperience: supportExperience ? parseInt(supportExperience, 10) : undefined,
      bookingExperience: bookingExperience ? parseInt(bookingExperience, 10) : undefined,
      overallExperience: overallExperience ? parseInt(overallExperience, 10) : undefined,
    });

    sendResponse(res, { statusCode: 201, message: 'Overall service review submitted', data: newReview });
  });
}
