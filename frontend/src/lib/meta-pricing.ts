import type { CurrencyCode } from './currency';
import { convertToBrl } from './currency';

export const META_PRICING_SOURCE_URL =
  'https://whatsappbusiness.com/pt-br/products/platform-pricing/?country=Brasil&currency=Real%20brasileiro%20(BRL)&category=Authentication';

export const META_PRICING_REFERENCE = 'Tabela da Meta para o Brasil — julho de 2026';

export const metaBrazilPricesByCurrency = {
  BRL: { marketing: 0.3217, utility: 0.035, authentication: 0.035 },
  USD: { marketing: 0.0625, utility: 0.0068, authentication: 0.0068 },
  EUR: { marketing: 0.0518, utility: 0.0056, authentication: 0.0056 },
} as const satisfies Record<CurrencyCode, Record<string, number>>;

export type MetaCategory = keyof (typeof metaBrazilPricesByCurrency)['BRL'];

export function getMetaPriceInBrl(category: MetaCategory, currency: CurrencyCode) {
  return convertToBrl(metaBrazilPricesByCurrency[currency][category], currency);
}
