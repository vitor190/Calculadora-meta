import { commercialCatalog } from '../lib/commercial-catalog';
import { getMetaPriceInBrl } from '../lib/meta-pricing';
import type {
  CalculatorData,
  CalculatorTotals,
  DiscountType,
  ExtraService,
  ProposalItem,
} from '../types/calculator.types';

export function createInitialCalculatorData(): CalculatorData {
  return {
    currency: 'BRL',
    templates: [
      {
        id: 'marketing',
        category: 'Marketing',
        value: getMetaPriceInBrl('marketing', 'BRL'),
        quantity: 0,
      },
      {
        id: 'utility',
        category: 'Utilidade',
        value: getMetaPriceInBrl('utility', 'BRL'),
        quantity: 0,
      },
      {
        id: 'authentication',
        category: 'Autenticação',
        value: getMetaPriceInBrl('authentication', 'BRL'),
        quantity: 0,
      },
    ],
    selectedPlanId: '',
    planValue: 0,
    resources: [],
    services: [],
    implementationInstallments: 1,
    planDiscountType: 'none',
    planDiscountValue: 0,
  };
}

export function createProposalItem(id = Date.now()): ProposalItem {
  return { id, name: '', value: 0, quantity: 0, discountType: 'none', discountValue: 0 };
}

export function createExtraService(id = Date.now()): ExtraService {
  return { id, name: '', value: 0, discountType: 'none', discountValue: 0 };
}

export function getPlanValue(planId: string): number {
  return commercialCatalog.plans.find((plan) => plan.id === planId)?.value ?? 0;
}

export function calculateDiscount(base: number, type: DiscountType, value: number): number {
  const safeBase = Math.max(base, 0);
  const requested =
    type === 'percent'
      ? (safeBase * Math.min(Math.max(value, 0), 100)) / 100
      : type === 'fixed'
        ? value
        : 0;
  return Math.min(Math.max(requested, 0), safeBase);
}

export function calculateTotals(data: CalculatorData): CalculatorTotals {
  const meta = data.templates.reduce((sum, item) => sum + item.value * item.quantity, 0);
  const templateQuantity = data.templates.reduce((sum, item) => sum + item.quantity, 0);
  const resourceGross = data.resources.reduce((sum, item) => sum + item.value * item.quantity, 0);
  const resourceDiscount = data.resources.reduce(
    (sum, item) =>
      sum + calculateDiscount(item.value * item.quantity, item.discountType, item.discountValue),
    0,
  );
  const services = data.services.reduce((sum, item) => sum + item.value, 0);
  const planDiscount = calculateDiscount(
    data.planValue,
    data.planDiscountType,
    data.planDiscountValue,
  );
  const serviceDiscount = data.services.reduce(
    (sum, item) => sum + calculateDiscount(item.value, item.discountType, item.discountValue),
    0,
  );
  const resources = resourceGross - resourceDiscount;
  const recurringSubtotal = meta + data.planValue + resourceGross;
  const recurringDiscount = planDiscount + resourceDiscount;
  const recurringTotal = recurringSubtotal - recurringDiscount;
  const implementationTotal = services - serviceDiscount;
  const subtotal = recurringSubtotal + services;

  return {
    meta,
    templateQuantity,
    averageTemplate: templateQuantity > 0 ? meta / templateQuantity : 0,
    resourceGross,
    resourceDiscount,
    resources,
    services,
    subtotal,
    recurringSubtotal,
    recurringDiscount,
    recurringTotal,
    implementationTotal,
    planDiscount,
    serviceDiscount,
    discount: planDiscount + resourceDiscount + serviceDiscount,
    discountedPlan: data.planValue - planDiscount,
    discountedServices: implementationTotal,
    final: recurringTotal + implementationTotal,
  };
}
