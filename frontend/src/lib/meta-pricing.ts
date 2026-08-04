import type { CurrencyCode } from './currency';
import { convertToBrl } from './currency';

export const META_PRICING_SOURCE_URL =
  'https://whatsappbusiness.com/pt-br/products/platform-pricing/?country=Brasil&currency=Real%20brasileiro%20(BRL)&category=Authentication';

export const META_PRICING_REFERENCE = 'Tabela da Meta para o Brasil — 2026';

export const metaBrazilPricesByCurrency = {
  BRL: { marketing: 0.3217, utility: 0.035, authentication: 0.035 },
} as const satisfies Record<CurrencyCode, Record<string, number>>;

export type MetaCategory = keyof (typeof metaBrazilPricesByCurrency)['BRL'];

export function getMetaPriceInBrl(category: MetaCategory, currency: CurrencyCode) {
  return convertToBrl(metaBrazilPricesByCurrency[currency][category], currency);
}
