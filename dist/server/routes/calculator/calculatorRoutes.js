"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calculatorController_1 = require("../../controllers/calculator/calculatorController");
const router = (0, express_1.Router)();
// ── Calculator Session ────────────────────────────────────────────────────────
router.post('/', calculatorController_1.CalculatorController.create);
router.get('/session/:sessionId', calculatorController_1.CalculatorController.getBySession);
router.get('/settings', calculatorController_1.CalculatorController.getSettings);
router.get('/:id', calculatorController_1.CalculatorController.getById);
router.put('/:id/status', calculatorController_1.CalculatorController.updateStatus);
// ── Steps ─────────────────────────────────────────────────────────────────────
router.get('/:id/steps', calculatorController_1.CalculatorController.getSteps);
router.post('/:id/steps', calculatorController_1.CalculatorController.upsertStep);
// ── Selected Event ────────────────────────────────────────────────────────────
router.post('/:id/event', calculatorController_1.CalculatorController.upsertSelectedEvent);
// ── Selected Services ─────────────────────────────────────────────────────────
router.get('/:id/services', calculatorController_1.CalculatorController.getSelectedServices);
router.post('/:id/services', calculatorController_1.CalculatorController.selectService);
router.delete('/:id/services/:serviceId', calculatorController_1.CalculatorController.deselectService);
// ── Configurations & Options ──────────────────────────────────────────────────
router.post('/selected-services/:selectedServiceId/configurations', calculatorController_1.CalculatorController.upsertConfiguration);
router.delete('/configurations/:id', calculatorController_1.CalculatorController.deleteConfiguration);
router.post('/selected-services/:selectedServiceId/options', calculatorController_1.CalculatorController.upsertOption);
router.delete('/options/:id', calculatorController_1.CalculatorController.deleteOption);
// ── Addons ────────────────────────────────────────────────────────────────────
router.post('/addons', calculatorController_1.CalculatorController.addAddon);
router.put('/addons/:id', calculatorController_1.CalculatorController.updateAddon);
router.delete('/addons/:id', calculatorController_1.CalculatorController.removeAddon);
// ── Guests, Budget, Summary ───────────────────────────────────────────────────
router.post('/:id/guests', calculatorController_1.CalculatorController.upsertGuests);
router.post('/:id/budget', calculatorController_1.CalculatorController.upsertBudget);
router.post('/:id/summary', calculatorController_1.CalculatorController.upsertSummary);
// ── Pricing Rules / Discounts / Taxes ─────────────────────────────────────────
router.post('/:id/pricing-rules', calculatorController_1.CalculatorController.addPricingRule);
router.post('/:id/discounts', calculatorController_1.CalculatorController.addDiscount);
router.post('/:id/taxes', calculatorController_1.CalculatorController.addTax);
// ── Save Estimate ─────────────────────────────────────────────────────────────
router.post('/save', calculatorController_1.CalculatorController.saveEstimate);
router.get('/saved/:customerId', calculatorController_1.CalculatorController.getSavedEstimates);
// ── Quotation ─────────────────────────────────────────────────────────────────
router.post('/:id/quotation', calculatorController_1.CalculatorController.generateQuotation);
// ── Comparison ────────────────────────────────────────────────────────────────
router.post('/compare', calculatorController_1.CalculatorController.createComparison);
// ── History ───────────────────────────────────────────────────────────────────
router.get('/:id/history', calculatorController_1.CalculatorController.getHistory);
// ── Admin Settings ────────────────────────────────────────────────────────────
router.put('/settings/:id', calculatorController_1.CalculatorController.updateSettings);
exports.default = router;
