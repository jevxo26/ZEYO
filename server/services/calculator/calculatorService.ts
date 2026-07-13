// ─────────────────────────────────────────────────────────────────────────────
// CalculatorService
// Core business logic for the Smart Event Calculator
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

export const CalculatorService = {

  // ── Calculator CRUD ─────────────────────────────────────────────────────────
  create: catchServiceAsync(async (data: {
    customerId?: number; zoneId?: number; eventId?: number;
  }) => prisma.smartEventCalculator.create({ data })),

  getById: catchServiceAsync(async (id: number) =>
    prisma.smartEventCalculator.findUnique({
      where: { id },
      include: {
        selectedEvent:    { include: { event: true, zone: true } },
        selectedServices: {
          include: {
            service:        true,
            configurations: { include: { configuration: true } },
            options:        { include: { option: true } },
            addons:         { include: { addon: true } },
          },
        },
        guestInformation:  true,
        budgetCalculation: true,
        estimateSummary:   true,
        steps:             { orderBy: { stepNumber: 'asc' } },
        pricingRules:      true,
        appliedDiscounts:  true,
        appliedTaxes:      true,
      },
    })),

  getBySession: catchServiceAsync(async (sessionId: string) =>
    prisma.smartEventCalculator.findUnique({
      where: { sessionId },
      include: {
        selectedEvent:    { include: { event: true, zone: true } },
        selectedServices: { include: { service: true, configurations: true, options: true, addons: true } },
        budgetCalculation: true,
        estimateSummary:   true,
      },
    })),

  updateStatus: catchServiceAsync(async (id: number, status: string, completedAt?: Date) =>
    prisma.smartEventCalculator.update({ where: { id }, data: { status, completedAt } })),

  // ── Steps ───────────────────────────────────────────────────────────────────
  upsertStep: catchServiceAsync(async (calculatorId: number, stepNumber: number, stepName: string, isCompleted: boolean) =>
    prisma.calculatorStep.upsert({
      where:  { calculatorId_stepNumber: { calculatorId, stepNumber } },
      create: { calculatorId, stepNumber, stepName, isCompleted, completedAt: isCompleted ? new Date() : null },
      update: { isCompleted, completedAt: isCompleted ? new Date() : null },
    })),

  getSteps: catchServiceAsync(async (calculatorId: number) =>
    prisma.calculatorStep.findMany({ where: { calculatorId }, orderBy: { stepNumber: 'asc' } })),

  // ── Selected Event ──────────────────────────────────────────────────────────
  upsertSelectedEvent: catchServiceAsync(async (calculatorId: number, data: {
    eventId: number; zoneId: number; guestCount?: number;
    eventDate?: Date; eventTime?: string; venueType?: string;
  }) => prisma.selectedEvent.upsert({
    where:  { calculatorId },
    create: { calculatorId, ...data },
    update: data,
  })),

  // ── Selected Services ───────────────────────────────────────────────────────
  selectService: catchServiceAsync(async (calculatorId: number, serviceId: number, displayOrder?: number) =>
    prisma.selectedService.upsert({
      where:  { calculatorId_serviceId: { calculatorId, serviceId } },
      create: { calculatorId, serviceId, isSelected: true, displayOrder: displayOrder ?? 0 },
      update: { isSelected: true },
    })),

  deselectService: catchServiceAsync(async (calculatorId: number, serviceId: number) =>
    prisma.selectedService.update({
      where:  { calculatorId_serviceId: { calculatorId, serviceId } },
      data:   { isSelected: false },
    })),

  getSelectedServices: catchServiceAsync(async (calculatorId: number) =>
    prisma.selectedService.findMany({
      where:   { calculatorId, isSelected: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        service:        { include: { pricing: true } },
        configurations: { include: { configuration: true } },
        options:        { include: { option: true } },
        addons:         { include: { addon: true } },
      },
    })),

  // ── Configurations ──────────────────────────────────────────────────────────
  upsertConfiguration: catchServiceAsync(async (selectedServiceId: number, configurationId: number, data: {
    configurationValue: string; additionalPrice?: number;
  }) => prisma.selectedServiceConfiguration.upsert({
    where:  { selectedServiceId_configurationId: { selectedServiceId, configurationId } },
    create: { selectedServiceId, configurationId, ...data },
    update: data,
  })),

  deleteConfiguration: catchServiceAsync(async (id: number) =>
    prisma.selectedServiceConfiguration.delete({ where: { id } })),

  // ── Options ─────────────────────────────────────────────────────────────────
  upsertOption: catchServiceAsync(async (selectedServiceId: number, optionId: number, data: {
    optionValue?: string; price?: number;
  }) => prisma.selectedServiceOption.upsert({
    where:  { selectedServiceId_optionId: { selectedServiceId, optionId } },
    create: { selectedServiceId, optionId, ...data },
    update: data,
  })),

  deleteOption: catchServiceAsync(async (id: number) =>
    prisma.selectedServiceOption.delete({ where: { id } })),

  // ── Addons ──────────────────────────────────────────────────────────────────
  addAddon: catchServiceAsync(async (data: {
    selectedServiceId: number; addonId: number;
    quantity: number; unitPrice: number; totalPrice: number;
  }) => prisma.selectedAddon.create({ data })),

  updateAddon: catchServiceAsync(async (id: number, data: { quantity: number; unitPrice: number; totalPrice: number }) =>
    prisma.selectedAddon.update({ where: { id }, data })),

  removeAddon: catchServiceAsync(async (id: number) =>
    prisma.selectedAddon.delete({ where: { id } })),

  // ── Guest Information ───────────────────────────────────────────────────────
  upsertGuests: catchServiceAsync(async (calculatorId: number, data: {
    adultGuest: number; childGuest?: number; vipGuest?: number; totalGuest: number;
  }) => prisma.guestInformation.upsert({
    where:  { calculatorId },
    create: { calculatorId, ...data },
    update: data,
  })),

  // ── Budget Calculation ──────────────────────────────────────────────────────
  upsertBudget: catchServiceAsync(async (calculatorId: number, data: {
    subtotal: number; serviceCharge?: number; tax?: number;
    discount?: number; grandTotal: number; currency?: string;
  }) => prisma.budgetCalculation.upsert({
    where:  { calculatorId },
    create: { calculatorId, ...data },
    update: data,
  })),

  // ── Estimate Summary ────────────────────────────────────────────────────────
  upsertSummary: catchServiceAsync(async (calculatorId: number, data: {
    totalServices: number; estimatedBudget: number; totalAddonCost?: number;
    totalTax?: number; totalDiscount?: number; finalAmount: number;
  }) => prisma.estimateSummary.upsert({
    where:  { calculatorId },
    create: { calculatorId, ...data },
    update: data,
  })),

  // ── Pricing Rules ───────────────────────────────────────────────────────────
  addPricingRule: catchServiceAsync(async (data: {
    calculatorId: number; ruleName: string; ruleType?: string;
    ruleValue: number; description?: string;
  }) => prisma.pricingRule.create({ data })),

  // ── Discounts & Taxes ───────────────────────────────────────────────────────
  addDiscount: catchServiceAsync(async (data: {
    calculatorId: number; discountName: string; discountType?: string;
    discountValue: number; discountAmount: number;
  }) => prisma.appliedDiscount.create({ data })),

  addTax: catchServiceAsync(async (data: {
    calculatorId: number; taxName: string; taxRate: number; taxAmount: number;
  }) => prisma.appliedTax.create({ data })),

  // ── Save Estimate ───────────────────────────────────────────────────────────
  saveEstimate: catchServiceAsync(async (data: {
    customerId: number; calculatorId: number; estimateName: string;
  }) => prisma.savedEstimate.create({ data })),

  getSavedEstimates: catchServiceAsync(async (customerId: number) =>
    prisma.savedEstimate.findMany({
      where:   { customerId, status: { not: 'deleted' } },
      orderBy: { createdAt: 'desc' },
    })),

  // ── Quotation ───────────────────────────────────────────────────────────────
  generateQuotation: catchServiceAsync(async (calculatorId: number, data: {
    subtotal: number; discount?: number; tax?: number;
    grandTotal: number; validUntil?: Date;
  }) => {
    const count   = await prisma.quotation.count();
    const number  = `QUO-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
    return prisma.quotation.upsert({
      where:  { calculatorId },
      create: { calculatorId, quotationNumber: number, ...data },
      update: { ...data, status: 'draft' },
    });
  }),

  // ── Comparison ──────────────────────────────────────────────────────────────
  createComparison: catchServiceAsync(async (data: {
    customerId: number; estimateOneId: number;
    estimateTwoId: number; comparisonResult?: object;
  }) => prisma.comparison.create({ data })),

  // ── History ─────────────────────────────────────────────────────────────────
  addHistory: catchServiceAsync(async (calculatorId: number, totalAmount: number, changes?: object) => {
    const last = await prisma.estimateHistory.findFirst({ where: { calculatorId }, orderBy: { version: 'desc' } });
    return prisma.estimateHistory.create({
      data: { calculatorId, version: (last?.version ?? 0) + 1, totalAmount, changes },
    });
  }),

  getHistory: catchServiceAsync(async (calculatorId: number) =>
    prisma.estimateHistory.findMany({ where: { calculatorId }, orderBy: { version: 'desc' } })),

  // ── Settings (singleton) ────────────────────────────────────────────────────
  getSettings: catchServiceAsync(async () => {
    const s = await prisma.calculatorSetting.findFirst();
    if (s) return s;
    return prisma.calculatorSetting.create({ data: {} });
  }),

  updateSettings: catchServiceAsync(async (id: number, data: Partial<{
    allowSaveEstimate: boolean; allowQuotation: boolean; allowComparison: boolean;
    allowInstantBooking: boolean; allowPackageConversion: boolean; status: string;
  }>) => prisma.calculatorSetting.update({ where: { id }, data })),
};
