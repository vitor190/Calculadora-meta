import { currencies, type CurrencyCode } from '../lib/currency';
import type {
  CalculatorData,
  DiscountType,
  ExtraService,
  ProposalItem,
  TemplateCost,
} from '../types/calculator.types';

const discountTypes: readonly DiscountType[] = ['none', 'percent', 'fixed'];

export function createProposalSnapshot(data: CalculatorData): CalculatorData {
  return {
    currency: data.currency,
    templates: data.templates,
    selectedPlanId: data.selectedPlanId,
    planValue: data.planValue,
    resources: data.resources,
    services: data.services,
    implementationInstallments: data.implementationInstallments,
    planDiscountType: data.planDiscountType,
    planDiscountValue: data.planDiscountValue,
  };
}

export function createProposalUrl(data: CalculatorData, origin = window.location.origin): string {
  const url = new URL('/proposta', origin);
  url.searchParams.set('dados', JSON.stringify(createProposalSnapshot(data)));
  return url.toString();
}

export function readProposalSnapshot(search = window.location.search): CalculatorData | null {
  try {
    const encoded = new URLSearchParams(search).get('dados');
    if (!encoded) return null;
    const value: unknown = JSON.parse(encoded);
    if (!isRecord(value) || !isCurrency(value.currency)) return null;
    if (
      !isArrayOf(value.templates, isTemplateCost) ||
      !isArrayOf(value.resources, isProposalItem) ||
      !isArrayOf(value.services, isExtraService)
    )
      return null;

    return {
      currency: value.currency,
      templates: value.templates,
      selectedPlanId: typeof value.selectedPlanId === 'string' ? value.selectedPlanId : '',
      planValue: toNonNegativeNumber(value.planValue),
      resources: value.resources,
      services: value.services,
      implementationInstallments: Math.min(
        5,
        Math.max(1, Math.trunc(toNonNegativeNumber(value.implementationInstallments) || 1)),
      ),
      planDiscountType: isDiscountType(value.planDiscountType) ? value.planDiscountType : 'none',
      planDiscountValue: toNonNegativeNumber(value.planDiscountValue),
    };
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isCurrency(value: unknown): value is CurrencyCode {
  return typeof value === 'string' && currencies.some((currency) => currency.code === value);
}

function isDiscountType(value: unknown): value is DiscountType {
  return discountTypes.some((type) => type === value);
}

function toNonNegativeNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0;
}

function isArrayOf<T>(value: unknown, guard: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(guard);
}
function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}
function isTemplateCost(value: unknown): value is TemplateCost {
  return (
    isRecord(value) &&
    (value.id === 'marketing' || value.id === 'utility' || value.id === 'authentication') &&
    typeof value.category === 'string' &&
    isNonNegativeNumber(value.value) &&
    isNonNegativeNumber(value.quantity)
  );
}
function isProposalItem(value: unknown): value is ProposalItem {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    isNonNegativeNumber(value.value) &&
    isNonNegativeNumber(value.quantity) &&
    isDiscountType(value.discountType) &&
    isNonNegativeNumber(value.discountValue)
  );
}
function isExtraService(value: unknown): value is ExtraService {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    isNonNegativeNumber(value.value) &&
    isDiscountType(value.discountType) &&
    isNonNegativeNumber(value.discountValue)
  );
}
