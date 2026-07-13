import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CalculatorService } from '../../services/calculator/calculatorService';

export class CalculatorController {

  // ── Calculator ───────────────────────────────────────────────────────────────
  static create = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.create(req.body);
    sendResponse(res, { statusCode: 201, message: 'Calculator session created', data });
  });

  static getById = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.getById(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: 'Calculator not found', data: null });
    sendResponse(res, { statusCode: 200, data });
  });

  static getBySession = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.getBySession(String(req.params.sessionId));
    if (!data) return res.status(404).json({ success: false, message: 'Session not found', data: null });
    sendResponse(res, { statusCode: 200, data });
  });

  static updateStatus = catchAsync(async (req: Request, res: Response) => {
    const { status, completedAt } = req.body;
    const data = await CalculatorService.updateStatus(Number(req.params.id), status, completedAt);
    sendResponse(res, { statusCode: 200, message: 'Status updated', data });
  });

  // ── Steps ─────────────────────────────────────────────────────────────────────
  static getSteps = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.getSteps(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data });
  });

  static upsertStep = catchAsync(async (req: Request, res: Response) => {
    const { stepNumber, stepName, isCompleted } = req.body;
    const data = await CalculatorService.upsertStep(Number(req.params.id), stepNumber, stepName, isCompleted);
    sendResponse(res, { statusCode: 200, message: 'Step updated', data });
  });

  // ── Selected Event ────────────────────────────────────────────────────────────
  static upsertSelectedEvent = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.upsertSelectedEvent(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Event selected', data });
  });

  // ── Selected Services ─────────────────────────────────────────────────────────
  static getSelectedServices = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.getSelectedServices(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data });
  });

  static selectService = catchAsync(async (req: Request, res: Response) => {
    const { serviceId, displayOrder } = req.body;
    const data = await CalculatorService.selectService(Number(req.params.id), serviceId, displayOrder);
    sendResponse(res, { statusCode: 200, message: 'Service selected', data });
  });

  static deselectService = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.deselectService(Number(req.params.id), Number(req.params.serviceId));
    sendResponse(res, { statusCode: 200, message: 'Service deselected', data });
  });

  // ── Configurations ────────────────────────────────────────────────────────────
  static upsertConfiguration = catchAsync(async (req: Request, res: Response) => {
    const { configurationId, ...data } = req.body;
    const result = await CalculatorService.upsertConfiguration(Number(req.params.selectedServiceId), configurationId, data);
    sendResponse(res, { statusCode: 200, message: 'Configuration saved', data: result });
  });

  static deleteConfiguration = catchAsync(async (req: Request, res: Response) => {
    await CalculatorService.deleteConfiguration(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Configuration removed', data: null });
  });

  // ── Options ───────────────────────────────────────────────────────────────────
  static upsertOption = catchAsync(async (req: Request, res: Response) => {
    const { optionId, ...data } = req.body;
    const result = await CalculatorService.upsertOption(Number(req.params.selectedServiceId), optionId, data);
    sendResponse(res, { statusCode: 200, message: 'Option saved', data: result });
  });

  static deleteOption = catchAsync(async (req: Request, res: Response) => {
    await CalculatorService.deleteOption(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Option removed', data: null });
  });

  // ── Addons ────────────────────────────────────────────────────────────────────
  static addAddon = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.addAddon(req.body);
    sendResponse(res, { statusCode: 201, message: 'Addon added', data });
  });

  static updateAddon = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.updateAddon(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Addon updated', data });
  });

  static removeAddon = catchAsync(async (req: Request, res: Response) => {
    await CalculatorService.removeAddon(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Addon removed', data: null });
  });

  // ── Guest Information ─────────────────────────────────────────────────────────
  static upsertGuests = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.upsertGuests(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Guest info saved', data });
  });

  // ── Budget ────────────────────────────────────────────────────────────────────
  static upsertBudget = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.upsertBudget(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Budget updated', data });
  });

  // ── Estimate Summary ──────────────────────────────────────────────────────────
  static upsertSummary = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.upsertSummary(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Summary updated', data });
  });

  // ── Pricing Rules / Discounts / Taxes ─────────────────────────────────────────
  static addPricingRule = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.addPricingRule({ calculatorId: Number(req.params.id), ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Pricing rule added', data });
  });

  static addDiscount = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.addDiscount({ calculatorId: Number(req.params.id), ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Discount applied', data });
  });

  static addTax = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.addTax({ calculatorId: Number(req.params.id), ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Tax applied', data });
  });

  // ── Save / Quotation ──────────────────────────────────────────────────────────
  static saveEstimate = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.saveEstimate(req.body);
    sendResponse(res, { statusCode: 201, message: 'Estimate saved', data });
  });

  static getSavedEstimates = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.getSavedEstimates(Number(req.params.customerId));
    sendResponse(res, { statusCode: 200, data });
  });

  static generateQuotation = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.generateQuotation(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 201, message: 'Quotation generated', data });
  });

  // ── Comparison ────────────────────────────────────────────────────────────────
  static createComparison = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.createComparison(req.body);
    sendResponse(res, { statusCode: 201, message: 'Comparison created', data });
  });

  // ── History ───────────────────────────────────────────────────────────────────
  static getHistory = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.getHistory(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data });
  });

  // ── Settings ──────────────────────────────────────────────────────────────────
  static getSettings = catchAsync(async (_req: Request, res: Response) => {
    const data = await CalculatorService.getSettings();
    sendResponse(res, { statusCode: 200, data });
  });

  static updateSettings = catchAsync(async (req: Request, res: Response) => {
    const data = await CalculatorService.updateSettings(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Settings updated', data });
  });
}
