import { create } from 'zustand';
import { getMetaPriceInBrl } from '../lib/meta-pricing';
import {
  createExtraService,
  createInitialCalculatorData,
  createProposalItem,
  getPlanValue,
} from '../services/calculator.service';
import type { CalculatorState } from '../types/calculator.types';

export const useCalculator = create<CalculatorState>((set) => ({
  ...createInitialCalculatorData(),

  setCurrency: (currency) =>
    set((state) => ({
      currency,
      templates: state.templates.map((template) => ({
        ...template,
        value: getMetaPriceInBrl(template.id, currency),
      })),
    })),

  updateTemplate: (template) =>
    set((state) => ({
      templates: state.templates.map((current) =>
        current.id === template.id ? template : current,
      ),
    })),

  selectPlan: (selectedPlanId) =>
    set({
      selectedPlanId,
      planValue: getPlanValue(selectedPlanId),
      planDiscountValue: 0,
    }),

  setPlanValue: (planValue) => set({ planValue }),
  updateResource: (resource) =>
    set((state) => ({
      resources: state.resources.map((current) =>
        current.id === resource.id ? resource : current,
      ),
    })),
  addResource: () => set((state) => ({ resources: [...state.resources, createProposalItem()] })),
  removeResource: (id) =>
    set((state) => ({ resources: state.resources.filter((item) => item.id !== id) })),
  updateService: (service) =>
    set((state) => ({
      services: state.services.map((current) => (current.id === service.id ? service : current)),
    })),
  addService: () => set((state) => ({ services: [...state.services, createExtraService()] })),
  removeService: (id) =>
    set((state) => ({ services: state.services.filter((item) => item.id !== id) })),
  setImplementationInstallments: (implementationInstallments) =>
    set({ implementationInstallments }),
  setPlanDiscountType: (planDiscountType) => set({ planDiscountType, planDiscountValue: 0 }),
  setPlanDiscountValue: (planDiscountValue) => set({ planDiscountValue }),
}));
