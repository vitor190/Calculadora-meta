import { create } from 'zustand';
import { persist, type PersistStorage, type StorageValue } from 'zustand/middleware';
import { commercialCatalog } from '../lib/commercial-catalog';
import { currencies, type CurrencyCode } from '../lib/currency';
import { getMetaPriceInBrl } from '../lib/meta-pricing';
import {
  createExtraService,
  createInitialCalculatorData,
  createProposalItem,
  getPlanValue,
} from '../services/calculator.service';
import type {
  CalculatorData,
  CalculatorState,
  DiscountType,
  ExtraService,
  ProposalItem,
  TemplateCost,
} from '../types/calculator.types';

export const CALCULATOR_STORAGE_KEY = 'calculadora-conexa:simulation';
const CALCULATOR_STORAGE_VERSION = 1;
const discountTypes: readonly DiscountType[] = ['none', 'percent', 'fixed'];

const simulationStorage: PersistStorage<CalculatorData> = {
  getItem: (name) => {
    try {
      const value = window.localStorage.getItem(name);
      return value ? (JSON.parse(value) as StorageValue<CalculatorData>) : null;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, JSON.stringify(value));
    } catch {
      // A calculadora continua funcionando quando o armazenamento estiver indisponível.
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      // A calculadora continua funcionando quando o armazenamento estiver indisponível.
    }
  },
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;
const isNonNegativeNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;
const isDiscountType = (value: unknown): value is DiscountType =>
  discountTypes.includes(value as DiscountType);
const isValidDiscount = (type: unknown, value: unknown) =>
  isDiscountType(type) && isNonNegativeNumber(value) && (type !== 'percent' || value <= 100);
const isCurrency = (value: unknown): value is CurrencyCode =>
  typeof value === 'string' && currencies.some(({ code }) => code === value);
const isTemplate = (value: unknown): value is TemplateCost =>
  isRecord(value) &&
  (value.id === 'marketing' || value.id === 'utility' || value.id === 'authentication') &&
  typeof value.category === 'string' &&
  isNonNegativeNumber(value.value) &&
  isNonNegativeNumber(value.quantity);
const isResource = (value: unknown): value is ProposalItem =>
  isRecord(value) &&
  Number.isSafeInteger(value.id) &&
  typeof value.name === 'string' &&
  isNonNegativeNumber(value.value) &&
  isNonNegativeNumber(value.quantity) &&
  isValidDiscount(value.discountType, value.discountValue);
const isService = (value: unknown): value is ExtraService =>
  isRecord(value) &&
  Number.isSafeInteger(value.id) &&
  typeof value.name === 'string' &&
  isNonNegativeNumber(value.value) &&
  isValidDiscount(value.discountType, value.discountValue);

function sanitizePersistedData(value: unknown): CalculatorData {
  const defaults = createInitialCalculatorData();
  if (!isRecord(value)) return defaults;

  const storedTemplates = Array.isArray(value.templates) ? value.templates : null;
  const templates = storedTemplates
    ? defaults.templates.map(
        (fallback) =>
          storedTemplates.find((item: unknown) => isTemplate(item) && item.id === fallback.id) ??
          fallback,
      )
    : defaults.templates;
  const resources = Array.isArray(value.resources)
    ? value.resources.filter(isResource)
    : defaults.resources;
  const services = Array.isArray(value.services)
    ? value.services.filter(isService)
    : defaults.services;

  return {
    currency: isCurrency(value.currency) ? value.currency : defaults.currency,
    templates,
    selectedPlanId:
      value.selectedPlanId === '' ||
      commercialCatalog.plans.some(({ id }) => id === value.selectedPlanId)
        ? (value.selectedPlanId as string)
        : defaults.selectedPlanId,
    planValue: isNonNegativeNumber(value.planValue) ? value.planValue : defaults.planValue,
    resources,
    services,
    implementationInstallments:
      Number.isInteger(value.implementationInstallments) &&
      Number(value.implementationInstallments) >= 1 &&
      Number(value.implementationInstallments) <= 5
        ? Number(value.implementationInstallments)
        : defaults.implementationInstallments,
    planDiscountType: isDiscountType(value.planDiscountType)
      ? value.planDiscountType
      : defaults.planDiscountType,
    planDiscountValue:
      isNonNegativeNumber(value.planDiscountValue) &&
      isValidDiscount(value.planDiscountType, value.planDiscountValue)
        ? value.planDiscountValue
        : defaults.planDiscountValue,
  };
}

export function selectCalculatorData(state: CalculatorState): CalculatorData {
  return {
    currency: state.currency,
    templates: state.templates,
    selectedPlanId: state.selectedPlanId,
    planValue: state.planValue,
    resources: state.resources,
    services: state.services,
    implementationInstallments: state.implementationInstallments,
    planDiscountType: state.planDiscountType,
    planDiscountValue: state.planDiscountValue,
  };
}

const nextItemId = (items: Array<{ id: number }>) =>
  Math.max(Date.now(), ...items.map(({ id }) => id + 1));

export const useCalculator = create<CalculatorState>()(
  persist<CalculatorState, [], [], CalculatorData>(
    (set) => ({
      ...createInitialCalculatorData(),

      resetCalculator: () => {
        set(createInitialCalculatorData());
        simulationStorage.removeItem(CALCULATOR_STORAGE_KEY);
      },

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
      addResource: () =>
        set((state) => ({
          resources: [...state.resources, createProposalItem(nextItemId(state.resources))],
        })),
      removeResource: (id) =>
        set((state) => ({ resources: state.resources.filter((item) => item.id !== id) })),
      updateService: (service) =>
        set((state) => ({
          services: state.services.map((current) =>
            current.id === service.id ? service : current,
          ),
        })),
      addService: () =>
        set((state) => ({
          services: [...state.services, createExtraService(nextItemId(state.services))],
        })),
      removeService: (id) =>
        set((state) => ({ services: state.services.filter((item) => item.id !== id) })),
      setImplementationInstallments: (implementationInstallments) =>
        set({ implementationInstallments }),
      setPlanDiscountType: (planDiscountType) => set({ planDiscountType, planDiscountValue: 0 }),
      setPlanDiscountValue: (planDiscountValue) => set({ planDiscountValue }),
    }),
    {
      name: CALCULATOR_STORAGE_KEY,
      version: CALCULATOR_STORAGE_VERSION,
      storage: simulationStorage,
      partialize: selectCalculatorData,
      migrate: (persistedState, version) =>
        version === CALCULATOR_STORAGE_VERSION
          ? sanitizePersistedData(persistedState)
          : createInitialCalculatorData(),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...sanitizePersistedData(persistedState),
      }),
    },
  ),
);
