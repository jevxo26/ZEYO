"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatorController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const calculatorService_1 = require("../../services/calculator/calculatorService");
class CalculatorController {
}
exports.CalculatorController = CalculatorController;
_a = CalculatorController;
// ── Calculator ───────────────────────────────────────────────────────────────
CalculatorController.create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.create(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Calculator session created', data });
});
CalculatorController.getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.getById(Number(req.params.id));
    if (!data)
        return res.status(404).json({ success: false, message: 'Calculator not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
CalculatorController.getBySession = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.getBySession(String(req.params.sessionId));
    if (!data)
        return res.status(404).json({ success: false, message: 'Session not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
CalculatorController.updateStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status, completedAt } = req.body;
    const data = await calculatorService_1.CalculatorService.updateStatus(Number(req.params.id), status, completedAt);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Status updated', data });
});
// ── Steps ─────────────────────────────────────────────────────────────────────
CalculatorController.getSteps = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.getSteps(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
CalculatorController.upsertStep = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { stepNumber, stepName, isCompleted } = req.body;
    const data = await calculatorService_1.CalculatorService.upsertStep(Number(req.params.id), stepNumber, stepName, isCompleted);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Step updated', data });
});
// ── Selected Event ────────────────────────────────────────────────────────────
CalculatorController.upsertSelectedEvent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.upsertSelectedEvent(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Event selected', data });
});
// ── Selected Services ─────────────────────────────────────────────────────────
CalculatorController.getSelectedServices = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.getSelectedServices(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
CalculatorController.selectService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { serviceId, displayOrder } = req.body;
    const data = await calculatorService_1.CalculatorService.selectService(Number(req.params.id), serviceId, displayOrder);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Service selected', data });
});
CalculatorController.deselectService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.deselectService(Number(req.params.id), Number(req.params.serviceId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Service deselected', data });
});
// ── Configurations ────────────────────────────────────────────────────────────
CalculatorController.upsertConfiguration = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const _b = req.body, { configurationId } = _b, data = __rest(_b, ["configurationId"]);
    const result = await calculatorService_1.CalculatorService.upsertConfiguration(Number(req.params.selectedServiceId), configurationId, data);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Configuration saved', data: result });
});
CalculatorController.deleteConfiguration = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await calculatorService_1.CalculatorService.deleteConfiguration(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Configuration removed', data: null });
});
// ── Options ───────────────────────────────────────────────────────────────────
CalculatorController.upsertOption = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const _b = req.body, { optionId } = _b, data = __rest(_b, ["optionId"]);
    const result = await calculatorService_1.CalculatorService.upsertOption(Number(req.params.selectedServiceId), optionId, data);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Option saved', data: result });
});
CalculatorController.deleteOption = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await calculatorService_1.CalculatorService.deleteOption(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Option removed', data: null });
});
// ── Addons ────────────────────────────────────────────────────────────────────
CalculatorController.addAddon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.addAddon(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Addon added', data });
});
CalculatorController.updateAddon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.updateAddon(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Addon updated', data });
});
CalculatorController.removeAddon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await calculatorService_1.CalculatorService.removeAddon(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Addon removed', data: null });
});
// ── Guest Information ─────────────────────────────────────────────────────────
CalculatorController.upsertGuests = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.upsertGuests(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Guest info saved', data });
});
// ── Budget ────────────────────────────────────────────────────────────────────
CalculatorController.upsertBudget = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.upsertBudget(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Budget updated', data });
});
// ── Estimate Summary ──────────────────────────────────────────────────────────
CalculatorController.upsertSummary = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.upsertSummary(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Summary updated', data });
});
// ── Pricing Rules / Discounts / Taxes ─────────────────────────────────────────
CalculatorController.addPricingRule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.addPricingRule(Object.assign({ calculatorId: Number(req.params.id) }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Pricing rule added', data });
});
CalculatorController.addDiscount = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.addDiscount(Object.assign({ calculatorId: Number(req.params.id) }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Discount applied', data });
});
CalculatorController.addTax = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.addTax(Object.assign({ calculatorId: Number(req.params.id) }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Tax applied', data });
});
// ── Save / Quotation ──────────────────────────────────────────────────────────
CalculatorController.saveEstimate = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.saveEstimate(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Estimate saved', data });
});
CalculatorController.getSavedEstimates = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.getSavedEstimates(Number(req.params.customerId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
CalculatorController.generateQuotation = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.generateQuotation(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Quotation generated', data });
});
// ── Comparison ────────────────────────────────────────────────────────────────
CalculatorController.createComparison = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.createComparison(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Comparison created', data });
});
// ── History ───────────────────────────────────────────────────────────────────
CalculatorController.getHistory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.getHistory(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
// ── Settings ──────────────────────────────────────────────────────────────────
CalculatorController.getSettings = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const data = await calculatorService_1.CalculatorService.getSettings();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
CalculatorController.updateSettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await calculatorService_1.CalculatorService.updateSettings(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Settings updated', data });
});
