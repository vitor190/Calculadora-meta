export const currencies = [
  { code: 'BRL', name: 'Real Brasileiro', locale: 'pt-BR', rateFromBrl: 1 },
  { code: 'USD', name: 'Dólar Americano', locale: 'en-US', rateFromBrl: 0.183 },
  { code: 'EUR', name: 'Euro', locale: 'de-DE', rateFromBrl: 0.158 },
] as const;

export type CurrencyCode = (typeof currencies)[number]['code'];

export const isCurrencyCode = (value: string): value is CurrencyCode =>
  currencies.some((currency) => currency.code === value);

export const getCurrency = (code: CurrencyCode) =>
  currencies.find((currency) => currency.code === code) ?? currencies[0];

export const convertFromBrl = (valueInBrl: number, currency: CurrencyCode) =>
  valueInBrl * getCurrency(currency).rateFromBrl;

export const convertToBrl = (value: number, currency: CurrencyCode) =>
  value / getCurrency(currency).rateFromBrl;

export const formatCurrency = (valueInBrl: number, currency: CurrencyCode) => {
  const config = getCurrency(currency);
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertFromBrl(valueInBrl, currency));
};

export const getCurrencySymbol = (currency: CurrencyCode) => {
  const config = getCurrency(currency);
  return (
    new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      currencyDisplay: 'narrowSymbol',
    })
      .formatToParts(0)
      .find((part) => part.type === 'currency')?.value ?? config.code
  );
};
