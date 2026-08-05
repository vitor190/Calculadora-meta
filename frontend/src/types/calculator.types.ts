import type { CurrencyCode } from '../lib/currency';
import type { MetaCategory } from '../lib/meta-pricing';

export type DiscountType = 'none' | 'percent' | 'fixed';

export interface TemplateCost {
  id: MetaCategory;
  category: string;
  value: number;
  quantity: number;
}

export interface ProposalItem {
  id: number;
  name: string;
  value: number;
  quantity: number;
  discountType: DiscountType;
  discountValue: number;
}

export interface ExtraService {
  id: number;
  name: string;
  value: number;
  discountType: DiscountType;
  discountValue: number;
}

export interface CalculatorData {
  currency: CurrencyCode;
  templates: TemplateCost[];
  selectedPlanId: string;
  planValue: number;
  resources: ProposalItem[];
  services: ExtraService[];
  implementationInstallments: number;
  planDiscountType: DiscountType;
  planDiscountValue: number;
}

export interface CalculatorActions {
  resetCalculator: () => void;
  setCurrency: (currency: CurrencyCode) => void;
  updateTemplate: (template: TemplateCost) => void;
  selectPlan: (id: string) => void;
  setPlanValue: (value: number) => void;
  updateResource: (resource: ProposalItem) => void;
  addResource: () => void;
  removeResource: (id: number) => void;
  addService: () => void;
  updateService: (service: ExtraService) => void;
  removeService: (id: number) => void;
  setImplementationInstallments: (installments: number) => void;
  setPlanDiscountType: (type: DiscountType) => void;
  setPlanDiscountValue: (value: number) => void;
}

export type CalculatorState = CalculatorData & CalculatorActions;

export interface CalculatorTotals {
  meta: number;
  templateQuantity: number;
  averageTemplate: number;
  resourceGross: number;
  resourceDiscount: number;
  resources: number;
  services: number;
  subtotal: number;
  recurringSubtotal: number;
  recurringDiscount: number;
  infarmaRecurringTotal: number;
  recurringTotal: number;
  implementationTotal: number;
  planDiscount: number;
  serviceDiscount: number;
  discount: number;
  discountedPlan: number;
  discountedServices: number;
  final: number;
}
