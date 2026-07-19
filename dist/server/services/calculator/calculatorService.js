"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatorService = void 0;
// ─────────────────────────────────────────────────────────────────────────────
// CalculatorService
// Core business logic for the Smart Event Calculator
// ─────────────────────────────────────────────────────────────────────────────
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
exports.CalculatorService = {
    // ── Calculator CRUD ─────────────────────────────────────────────────────────
    create: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.smartEventCalculator.create({ data })),
    getById: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.smartEventCalculator.findUnique({
        where: { id },
        include: {
            selectedEvent: { include: { event: true, zone: true } },
            selectedServices: {
                include: {
                    service: true,
                    configurations: { include: { configuration: true } },
                    options: { include: { option: true } },
                    addons: { include: { addon: true } },
                },
            },
            guestInformation: true,
            budgetCalculation: true,
            estimateSummary: true,
            steps: { orderBy: { stepNumber: 'asc' } },
            pricingRules: true,
            appliedDiscounts: true,
            appliedTaxes: true,
        },
    })),
    getBySession: (0, catchServiceAsync_1.catchServiceAsync)(async (sessionId) => prisma.smartEventCalculator.findUnique({
        where: { sessionId },
        include: {
            selectedEvent: { include: { event: true, zone: true } },
            selectedServices: { include: { service: true, configurations: true, options: true, addons: true } },
            budgetCalculation: true,
            estimateSummary: true,
        },
    })),
    updateStatus: (0, catchServiceAsync_1.catchServiceAsync)(async (id, status, completedAt) => prisma.smartEventCalculator.update({ where: { id }, data: { status, completedAt } })),
    // ── Steps ───────────────────────────────────────────────────────────────────
    upsertStep: (0, catchServiceAsync_1.catchServiceAsync)(async (calculatorId, stepNumber, stepName, isCompleted) => prisma.calculatorStep.upsert({
        where: { calculatorId_stepNumber: { calculatorId, stepNumber } },
        create: { calculatorId, stepNumber, stepName, isCompleted, completedAt: isCompleted ? new Date() : null },
        update: { isCompleted, completedAt: isCompleted ? new Date() : null },
    })),
    getSteps: (0, catchServiceAsync_1.catchServiceAsync)(async (calculatorId) => prisma.calculatorStep.findMany({ where: { calculatorId }, orderBy: { stepNumber: 'asc' } })),
    // ── Selected Event ──────────────────────────────────────────────────────────
    upsertSelectedEvent: (0, catchServiceAsync_1.catchServiceAsync)(async (calculatorId, data) => prisma.selectedEvent.upsert({
        where: { calculatorId },
        create: Object.assign({ calculatorId }, data),
        update: data,
    })),
    // ── Selected Services ───────────────────────────────────────────────────────
    selectService: (0, catchServiceAsync_1.catchServiceAsync)(async (calculatorId, serviceId, displayOrder) => prisma.selectedService.upsert({
        where: { calculatorId_serviceId: { calculatorId, serviceId } },
        create: { calculatorId, serviceId, isSelected: true, displayOrder: displayOrder !== null && displayOrder !== void 0 ? displayOrder : 0 },
        update: { isSelected: true },
    })),
    deselectService: (0, catchServiceAsync_1.catchServiceAsync)(async (calculatorId, serviceId) => prisma.selectedService.update({
        where: { calculatorId_serviceId: { calculatorId, serviceId } },
        data: { isSelected: false },
    })),
    getSelectedServices: (0, catchServiceAsync_1.catchServiceAsync)(async (calculatorId) => prisma.selectedService.findMany({
        where: { calculatorId, isSelected: true },
        orderBy: { displayOrder: 'asc' },
        include: {
            service: { include: { pricing: true } },
            configurations: { include: { configuration: true } },
            options: { include: { option: true } },
            addons: { include: { addon: true } },
        },
    })),
    // ── Configurations ──────────────────────────────────────────────────────────
    upsertConfiguration: (0, catchServiceAsync_1.catchServiceAsync)(async (selectedServiceId, configurationId, data) => prisma.selectedServiceConfiguration.upsert({
        where: { selectedServiceId_configurationId: { selectedServiceId, configurationId } },
        create: Object.assign({ selectedServiceId, configurationId }, data),
        update: data,
    })),
    deleteConfiguration: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.selectedServiceConfiguration.delete({ where: { id } })),
    // ── Options ─────────────────────────────────────────────────────────────────
    upsertOption: (0, catchServiceAsync_1.catchServiceAsync)(async (selectedServiceId, optionId, data) => prisma.selectedServiceOption.upsert({
        where: { selectedServiceId_optionId: { selectedServiceId, optionId } },
        create: Object.assign({ selectedServiceId, optionId }, data),
        update: data,
    })),
    deleteOption: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.selectedServiceOption.delete({ where: { id } })),
    // ── Addons ──────────────────────────────────────────────────────────────────
    addAddon: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.selectedAddon.create({ data })),
    updateAddon: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.selectedAddon.update({ where: { id }, data })),
    removeAddon: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.selectedAddon.delete({ where: { id } })),
    // ── Guest Information ───────────────────────────────────────────────────────
    upsertGuests: (0, catchServiceAsync_1.catchServiceAsync)(async (calculatorId, data) => prisma.guestInformation.upsert({
        where: { calculatorId },
        create: Object.assign({ calculatorId }, data),
        update: data,
    })),
    // ── Budget Calculation ──────────────────────────────────────────────────────
    upsertBudget: (0, catchServiceAsync_1.catchServiceAsync)(async (calculatorId, data) => prisma.budgetCalculation.upsert({
        where: { calculatorId },
        create: Object.assign({ calculatorId }, data),
        update: data,
    })),
    // ── Estimate Summary ────────────────────────────────────────────────────────
    upsertSummary: (0, catchServiceAsync_1.catchServiceAsync)(async (calculatorId, data) => prisma.estimateSummary.upsert({
        where: { calculatorId },
        create: Object.assign({ calculatorId }, data),
        update: data,
    })),
    // ── Pricing Rules ───────────────────────────────────────────────────────────
    addPricingRule: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.pricingRule.create({ data })),
    // ── Discounts & Taxes ───────────────────────────────────────────────────────
    addDiscount: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.appliedDiscount.create({ data })),
    addTax: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.appliedTax.create({ data })),
    // ── Save Estimate ───────────────────────────────────────────────────────────
    saveEstimate: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.savedEstimate.create({ data })),
    getSavedEstimates: (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => prisma.savedEstimate.findMany({
        where: { customerId, status: { not: 'deleted' } },
        orderBy: { createdAt: 'desc' },
    })),
    // ── Quotation ───────────────────────────────────────────────────────────────
    generateQuotation: (0, catchServiceAsync_1.catchServiceAsync)(async (calculatorId, data) => {
        const count = await prisma.quotation.count();
        const number = `QUO-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
        return prisma.quotation.upsert({
            where: { calculatorId },
            create: Object.assign({ calculatorId, quotationNumber: number }, data),
            update: Object.assign(Object.assign({}, data), { status: 'draft' }),
        });
    }),
    // ── Comparison ──────────────────────────────────────────────────────────────
    createComparison: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.comparison.create({ data })),
    // ── History ─────────────────────────────────────────────────────────────────
    addHistory: (0, catchServiceAsync_1.catchServiceAsync)(async (calculatorId, totalAmount, changes) => {
        var _a;
        const last = await prisma.estimateHistory.findFirst({ where: { calculatorId }, orderBy: { version: 'desc' } });
        return prisma.estimateHistory.create({
            data: { calculatorId, version: ((_a = last === null || last === void 0 ? void 0 : last.version) !== null && _a !== void 0 ? _a : 0) + 1, totalAmount, changes },
        });
    }),
    getHistory: (0, catchServiceAsync_1.catchServiceAsync)(async (calculatorId) => prisma.estimateHistory.findMany({ where: { calculatorId }, orderBy: { version: 'desc' } })),
    // ── Settings (singleton) ────────────────────────────────────────────────────
    getSettings: (0, catchServiceAsync_1.catchServiceAsync)(async () => {
        const s = await prisma.calculatorSetting.findFirst();
        if (s)
            return s;
        return prisma.calculatorSetting.create({ data: {} });
    }),
    updateSettings: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.calculatorSetting.update({ where: { id }, data })),
};
