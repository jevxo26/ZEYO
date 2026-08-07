import { Router } from 'express';
import { CalculatorController } from '../../controllers/calculator/calculatorController';

const router = Router();

// ── Calculator Session ────────────────────────────────────────────────────────
router.post('/',                          CalculatorController.create);
router.get('/session/:sessionId',         CalculatorController.getBySession);
router.get('/settings',                   CalculatorController.getSettings);
router.get('/:id',                        CalculatorController.getById);
router.put('/:id/status',                 CalculatorController.updateStatus);

// ── Steps ─────────────────────────────────────────────────────────────────────
router.get('/:id/steps',                  CalculatorController.getSteps);
router.post('/:id/steps',                 CalculatorController.upsertStep);

// ── Selected Event ────────────────────────────────────────────────────────────
router.post('/:id/event',                 CalculatorController.upsertSelectedEvent);

// ── Selected Services ─────────────────────────────────────────────────────────
router.get('/:id/services',               CalculatorController.getSelectedServices);
router.post('/:id/services',              CalculatorController.selectService);
router.delete('/:id/services/:serviceId', CalculatorController.deselectService);

// ── Configurations & Options ──────────────────────────────────────────────────
router.post('/selected-services/:selectedServiceId/configurations', CalculatorController.upsertConfiguration);
router.delete('/configurations/:id',                                CalculatorController.deleteConfiguration);
router.post('/selected-services/:selectedServiceId/options',        CalculatorController.upsertOption);
router.delete('/options/:id',                                       CalculatorController.deleteOption);

// ── Addons ────────────────────────────────────────────────────────────────────
router.post('/addons',           CalculatorController.addAddon);
router.put('/addons/:id',        CalculatorController.updateAddon);
router.delete('/addons/:id',     CalculatorController.removeAddon);

// ── Guests, Budget, Summary ───────────────────────────────────────────────────
router.post('/:id/guests',       CalculatorController.upsertGuests);
router.post('/:id/budget',       CalculatorController.upsertBudget);
router.post('/:id/summary',      CalculatorController.upsertSummary);

// ── Pricing Rules / Discounts / Taxes ─────────────────────────────────────────
router.post('/:id/pricing-rules', CalculatorController.addPricingRule);
router.post('/:id/discounts',     CalculatorController.addDiscount);
router.post('/:id/taxes',         CalculatorController.addTax);

// ── Save Estimate ─────────────────────────────────────────────────────────────
router.post('/save',                        CalculatorController.saveEstimate);
router.get('/saved/:customerId',            CalculatorController.getSavedEstimates);

// ── Quotation ─────────────────────────────────────────────────────────────────
router.post('/:id/quotation',              CalculatorController.generateQuotation);

// ── Comparison ────────────────────────────────────────────────────────────────
router.post('/compare',                    CalculatorController.createComparison);

// ── History ───────────────────────────────────────────────────────────────────
router.get('/:id/history',                 CalculatorController.getHistory);

// ── Admin Settings ────────────────────────────────────────────────────────────
router.put('/settings/:id',                CalculatorController.updateSettings);

export default router;
