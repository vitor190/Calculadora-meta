import { ChevronDown } from 'lucide-react';
import { CalculatorCard, CalculatorShell, CurrencyInput, NumberInput, PageHeading } from '../../components/calculator-ui';
import { currencies, formatCurrency, type CurrencyCode } from '../../lib/currency';
import { ui } from '../../lib/ui';
import { calculateTotals, useCalculator } from '../../store/calculator.store';

export function MetaCostsPage() {
  const store = useCalculator();
  const totals = calculateTotals(store);

  return (
    <CalculatorShell>
      <CalculatorCard>
        <PageHeading title="Custos da Meta" description="Valores-base da Meta para o Brasil, com conversão para a moeda de exibição." />
        <div className="p-5 md:p-6">
          <div className="grid items-end gap-5 sm:grid-cols-2">
            <div>
              <label className={ui.label}>País da empresa</label>
              <div className="flex h-[38px] items-center gap-3">
                <img src="/flags/br.svg" alt="Bandeira do Brasil" className="h-6 w-9 rounded-[3px] shadow-theme-xs" />
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">Brasil</span>
               
              </div>
            </div>
            <div>
              <label className={ui.label} htmlFor="display-currency">Moeda de exibição</label>
              <div className="relative">
                <select id="display-currency" className={`${ui.input} appearance-none pr-10`} value={store.currency} onChange={(event) => store.setCurrency(event.target.value as CurrencyCode)}>
                  {currencies.map((currency) => <option key={currency.code} value={currency.code}>{currency.code} — {currency.name}</option>)}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mt-11">
            <div className="hidden grid-cols-[1.2fr_1fr_.7fr_1fr] gap-3 border-b border-gray-100 pb-3 text-xs font-medium uppercase text-gray-400 dark:border-gray-800 md:grid">
              <span>Categoria</span><span>Valor por template</span><span>Quantidade</span><span className="text-right">Subtotal</span>
            </div>
            {store.templates.map((item) => (
              <div key={item.id} className="grid gap-3 border-b border-gray-100 py-4 dark:border-gray-800 md:grid-cols-[1.2fr_1fr_.7fr_1fr] md:items-center">
                <strong className="text-sm text-gray-700 dark:text-gray-300">{item.category}</strong>
                <CurrencyInput label={`Valor ${item.category}`} value={item.value} onChange={(value) => store.updateTemplate({ ...item, value })} />
                <NumberInput label={`Quantidade ${item.category}`} className="text-center" integer min={1} zeroPlaceholder value={item.quantity} onChange={(quantity) => store.updateTemplate({ ...item, quantity })} />
                <strong className="text-right text-sm text-gray-800 dark:text-white/90">{formatCurrency(item.value * item.quantity, store.currency)}</strong>
              </div>
            ))}
            <div className="mt-4 flex justify-between rounded-lg bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
              <span>Total Meta</span><span>{formatCurrency(totals.meta, store.currency)}</span>
            </div>
          </div>
        </div>
      </CalculatorCard>
    </CalculatorShell>
  );
}
