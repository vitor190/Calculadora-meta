import { formatCurrency, type CurrencyCode } from '../../lib/currency';

interface BarItem {
  label: string;
  value: number;
}

export function CostComparisonChart({ items, currency }: { items: BarItem[]; currency: CurrencyCode }) {
  const maximum = Math.max(...items.map((item) => item.value), 1);
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 md:p-6">
      <div><h3 className="font-semibold text-gray-900 dark:text-white/90">Composição da proposta</h3><p className="mt-1 text-xs text-gray-400">Comparativo dos valores por categoria</p></div>
      <div className="mt-7 space-y-5">
        {items.map((item) => <div key={item.label}><div className="mb-2 flex justify-between text-xs"><span className="font-medium text-gray-600 dark:text-gray-300">{item.label}</span><span className="text-gray-500 dark:text-gray-400">{formatCurrency(item.value, currency)}</span></div><div className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"><div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${item.value / maximum * 100}%` }} /></div></div>)}
      </div>
    </article>
  );
}
