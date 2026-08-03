import { ExternalLink, Info, RotateCcw } from 'lucide-react';
import { AnimatedSelect, CalculatorCard, CalculatorShell, CurrencyInput, NumberInput, PageHeading } from '../../components/calculator-ui';
import { currencies, formatCurrency, type CurrencyCode } from '../../lib/currency';
import { META_PRICING_REFERENCE, META_PRICING_SOURCE_URL, getMetaPriceInBrl, type MetaCategory } from '../../lib/meta-pricing';
import { calculateTotals, useCalculator } from '../../store/calculator.store';

export function MetaCostsPage() {
  const store = useCalculator();
  const totals = calculateTotals(store);

  return (
    <CalculatorShell>
      <CalculatorCard>
        <PageHeading title="Custos da Meta" description="Tarifas oficiais da Meta para o Brasil na moeda de cobrança selecionada." />
        <div className="p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">País da empresa</p>
              <div className="mt-3 flex h-10 items-center gap-3">
                <span className="flex h-10 w-14 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"><img src="/flags/br.svg" alt="Bandeira do Brasil" className="h-6 w-9 rounded-[3px] shadow-theme-xs" /></span>
                <div><p className="text-sm font-semibold text-gray-900 dark:text-white">Brasil</p><p className="mt-0.5 text-xs text-gray-400">Mercado fixo da Meta</p></div>
              </div>
            </section>
            <section className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400" htmlFor="display-currency">Moeda de exibição</label>
              <div className="mt-3"><AnimatedSelect id="display-currency" value={store.currency} onChange={(event) => store.setCurrency(event.target.value as CurrencyCode)}>{currencies.map((currency) => <option key={currency.code} value={currency.code}>{currency.code} — {currency.name}</option>)}</AnimatedSelect></div>
            </section>
          </div>

          <aside className="mt-4 flex flex-col gap-4 rounded-xl border border-brand-100 bg-brand-50/70 p-4 dark:border-brand-500/20 dark:bg-brand-500/10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400"><Info size={17} /></span><div><p className="text-sm font-semibold text-gray-800 dark:text-white/90">Tabela oficial da Meta</p><p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Valores iniciais para o Brasil · {META_PRICING_REFERENCE.replace('Tabela da Meta para o Brasil — ', '')}.</p></div></div>
            <div className="flex shrink-0 flex-wrap items-center gap-2"><a href={META_PRICING_SOURCE_URL} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-brand-200 bg-white px-3 text-xs font-semibold text-brand-600 transition hover:bg-brand-50 dark:border-brand-500/30 dark:bg-gray-900 dark:text-brand-400 dark:hover:bg-gray-800">Consultar Meta<ExternalLink size={14} /></a><button type="button" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-3 text-xs font-semibold text-white transition hover:bg-brand-600" onClick={() => store.templates.forEach((item) => store.updateTemplate({ ...item, value: getMetaPriceInBrl(item.id as MetaCategory, store.currency) }))}><RotateCcw size={14} />Restaurar tabela</button></div>
          </aside>

          <div className="mt-6">
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








