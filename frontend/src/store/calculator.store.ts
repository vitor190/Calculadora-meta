import { create } from 'zustand';
import type { CurrencyCode } from '../lib/currency';

export interface TemplateCost {
  id: string;
  category: string;
  value: number;
  quantity: number;
}

export interface AdditionalProduct {
  id: number;
  name: string;
  value: number;
}

export type DiscountType = 'none' | 'percent' | 'fixed';

interface CalculatorState {
  currency: CurrencyCode;
  templates: TemplateCost[];
  planValue: number;
  hasEcommerce: boolean;
  ecommerceValue: number;
  products: AdditionalProduct[];
  deployment: number;
  discountType: DiscountType;
  discountValue: number;
  setCurrency: (currency: CurrencyCode) => void;
  updateTemplate: (template: TemplateCost) => void;
  setPlanValue: (value: number) => void;
  setHasEcommerce: (value: boolean) => void;
  setEcommerceValue: (value: number) => void;
  addProduct: () => void;
  updateProduct: (product: AdditionalProduct) => void;
  removeProduct: (id: number) => void;
  setDeployment: (value: number) => void;
  setDiscountType: (type: DiscountType) => void;
  setDiscountValue: (value: number) => void;
}

export const useCalculator = create<CalculatorState>((set) => ({
  currency: 'BRL',
  templates: [
    { id: 'marketing', category: 'Marketing', value: 0, quantity: 0 },
    { id: 'utility', category: 'Utilidade', value: 0, quantity: 0 },
    { id: 'authentication', category: 'Autenticação', value: 0, quantity: 0 },
  ],
  planValue: 0,
  hasEcommerce: false,
  ecommerceValue: 0,
  products: [],
  deployment: 0,
  discountType: 'none',
  discountValue: 0,
  setCurrency: (currency) => set({ currency }),
  updateTemplate: (template) => set((state) => ({ templates: state.templates.map((item) => item.id === template.id ? template : item) })),
  setPlanValue: (planValue) => set({ planValue }),
  setHasEcommerce: (hasEcommerce) => set({ hasEcommerce }),
  setEcommerceValue: (ecommerceValue) => set({ ecommerceValue }),
  addProduct: () => set((state) => ({ products: [...state.products, { id: Date.now(), name: '', value: 0 }] })),
  updateProduct: (product) => set((state) => ({ products: state.products.map((item) => item.id === product.id ? product : item) })),
  removeProduct: (id) => set((state) => ({ products: state.products.filter((item) => item.id !== id) })),
  setDeployment: (deployment) => set({ deployment }),
  setDiscountType: (discountType) => set({ discountType, discountValue: 0 }),
  setDiscountValue: (discountValue) => set({ discountValue }),
}));

export function calculateTotals(state: CalculatorState) {
  const meta = state.templates.reduce((sum, item) => sum + item.value * item.quantity, 0);
  const templateQuantity = state.templates.reduce((sum, item) => sum + item.quantity, 0);
  const ecommerce = state.hasEcommerce ? state.ecommerceValue : 0;
  const additional = state.products.reduce((sum, item) => sum + item.value, 0);
  const subtotal = meta + state.planValue + ecommerce + additional + state.deployment;
  const rawDiscount = state.discountType === 'percent'
    ? subtotal * Math.min(state.discountValue, 100) / 100
    : state.discountType === 'fixed' ? state.discountValue : 0;
  const discount = Math.min(rawDiscount, subtotal);
  return { meta, templateQuantity, averageTemplate: templateQuantity ? meta / templateQuantity : 0, ecommerce, additional, subtotal, discount, final: subtotal - discount };
}
