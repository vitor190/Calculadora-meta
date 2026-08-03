import { create } from 'zustand';
import type { CurrencyCode } from '../lib/currency';
import { getMetaPriceInBrl, type MetaCategory } from '../lib/meta-pricing';
import { commercialCatalog } from '../lib/commercial-catalog';

export interface TemplateCost { id: string; category: string; value: number; quantity: number; }
export interface ProposalItem { id: number; name: string; value: number; discountType: DiscountType; discountValue: number; }
export interface ExtraService { id: number; name: string; value: number; discountType: DiscountType; discountValue: number; }
export type DiscountType = 'none' | 'percent' | 'fixed';

interface CalculatorState {
  currency: CurrencyCode;
  templates: TemplateCost[];
  selectedPlanId: string;
  planValue: number;
  resources: ProposalItem[];
  services: ExtraService[];
  planDiscountType: DiscountType;
  planDiscountValue: number;
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
  setPlanDiscountType: (type: DiscountType) => void;
  setPlanDiscountValue: (value: number) => void;
}

export const useCalculator = create<CalculatorState>((set) => ({
  currency: 'BRL',
  templates: [
    { id: 'marketing', category: 'Marketing', value: getMetaPriceInBrl('marketing', 'BRL'), quantity: 0 },
    { id: 'utility', category: 'Utilidade', value: getMetaPriceInBrl('utility', 'BRL'), quantity: 0 },
    { id: 'authentication', category: 'Autenticação', value: getMetaPriceInBrl('authentication', 'BRL'), quantity: 0 },
  ],
  selectedPlanId: commercialCatalog.plans[0].id,
  planValue: commercialCatalog.plans[0].value,
  resources: [],
  services: [],
  planDiscountType: 'none',
  planDiscountValue: 0,
  setCurrency: (currency) => set((state) => ({ currency, templates: state.templates.map((item) => ({ ...item, value: getMetaPriceInBrl(item.id as MetaCategory, currency) })) })),
  updateTemplate: (template) => set((state) => ({ templates: state.templates.map((item) => item.id === template.id ? template : item) })),
  selectPlan: (selectedPlanId) => set({ selectedPlanId, planValue: commercialCatalog.plans.find((item) => item.id === selectedPlanId)?.value ?? 0, planDiscountValue: 0 }),
  setPlanValue: (planValue) => set({ planValue }),
  updateResource: (resource) => set((state) => ({ resources: state.resources.map((item) => item.id === resource.id ? resource : item) })),
  addResource: () => set((state) => ({ resources: [...state.resources, { id: Date.now(), name: '', value: 0, discountType: 'none', discountValue: 0 }] })),
  removeResource: (id) => set((state) => ({ resources: state.resources.filter((item) => item.id !== id) })),
  addService: () => set((state) => ({ services: [...state.services, { id: Date.now(), name: '', value: 0, discountType: 'none', discountValue: 0 }] })),
  updateService: (service) => set((state) => ({ services: state.services.map((item) => item.id === service.id ? service : item) })),
  removeService: (id) => set((state) => ({ services: state.services.filter((item) => item.id !== id) })),
  setPlanDiscountType: (planDiscountType) => set({ planDiscountType, planDiscountValue: 0 }),
  setPlanDiscountValue: (planDiscountValue) => set({ planDiscountValue }),
}));

function getDiscount(base: number, type: DiscountType, value: number) {
  const requested = type === 'percent' ? base * Math.min(value, 100) / 100 : type === 'fixed' ? value : 0;
  return Math.min(Math.max(requested, 0), base);
}

export function calculateTotals(state: CalculatorState) {
  const meta = state.templates.reduce((sum, item) => sum + item.value * item.quantity, 0);
  const templateQuantity = state.templates.reduce((sum, item) => sum + item.quantity, 0);
  const resourceGross = state.resources.reduce((sum, item) => sum + item.value, 0);
  const resourceDiscount = state.resources.reduce((sum, item) => sum + getDiscount(item.value, item.discountType, item.discountValue), 0);
  const resources = resourceGross - resourceDiscount;
  const services = state.services.reduce((sum, item) => sum + item.value, 0);
  const planDiscount = getDiscount(state.planValue, state.planDiscountType, state.planDiscountValue);
  const serviceDiscount = state.services.reduce((sum, item) => sum + getDiscount(item.value, item.discountType, item.discountValue), 0);
  const discount = planDiscount + resourceDiscount + serviceDiscount;
  const subtotal = meta + state.planValue + resourceGross + services;
  return { meta, templateQuantity, resourceGross, resourceDiscount, averageTemplate: templateQuantity ? meta / templateQuantity : 0, resources, services, subtotal, planDiscount, serviceDiscount, discount, discountedPlan: state.planValue - planDiscount, discountedServices: services - serviceDiscount, final: subtotal - discount };
}


