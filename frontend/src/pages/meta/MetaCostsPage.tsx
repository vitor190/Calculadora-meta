import { ExternalLink, Info, RotateCcw } from 'lucide-react';
import {
  CalculatorCard,
  CalculatorShell,
  CurrencyInput,
  NumberInput,
  PageHeading,
} from '../../components/calculator-ui';
import { formatCurrency } from '../../lib/currency';
import {
  META_PRICING_REFERENCE,
  META_PRICING_SOURCE_URL,
  getMetaPriceInBrl,
} from '../../lib/meta-pricing';
import { calculateTotals } from '../../services/calculator.service';
import { useCalculator } from '../../store/calculator.store';

export function MetaCostsPage() {
  const store = useCalculator();
  const totals = calculateTotals(store);

  return (
    <CalculatorShell>
      <CalculatorCard>
        <PageHeading
          title="Custos da Meta"
          description="Tarifas oficiais da Meta para o Brasil em Real brasileiro (BRL)."
        />
        <div className="p-5 md:p-6">
          <div>
            <aside className="flex flex-col gap-4 rounded-xl border border-brand-100 bg-brand-50/70 p-4 dark:border-brand-500/20 dark:bg-brand-500/10 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                  <Info
                    size={17}
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                    Tabela oficial da Meta
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Valores aplicáveis ao Brasil ·{' '}
                    {META_PRICING_REFERENCE.replace('Tabela da Meta para o Brasil — ', '')}.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <a
                  href={META_PRICING_SOURCE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-brand-200 bg-white px-3 text-xs font-semibold text-brand-600 transition hover:bg-brand-50 dark:border-brand-500/30 dark:bg-gray-900 dark:text-brand-400 dark:hover:bg-gray-800"
                >
                  Consultar Meta
                  <ExternalLink
                    size={14}
                    aria-hidden="true"
                  />
                </a>
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-3 text-xs font-semibold text-white transition hover:bg-brand-600"
                  onClick={() =>
                    store.templates.forEach((item) =>
                      store.updateTemplate({
                        ...item,
                        value: getMetaPriceInBrl(item.id, store.currency),
                      }),
                    )
                  }
                >
                  <RotateCcw
                    size={14}
                    aria-hidden="true"
                  />
                  Restaurar tabela
                </button>
              </div>
            </aside>
          </div>

          <section
            className="mt-5"
            aria-label="Categorias de templates da Meta"
          >
            <div className="grid gap-3 md:block md:divide-y md:divide-gray-100 md:overflow-hidden md:rounded-xl md:border md:border-gray-200 dark:md:divide-gray-800 dark:md:border-gray-800">
              <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(7rem,.7fr)_minmax(0,1fr)] gap-3 bg-gray-50 px-4 py-3 text-xs font-medium uppercase text-gray-400 dark:bg-white/[0.02] md:grid">
                <span>Categoria</span>
                <span>Valor por template</span>
                <span>Quantidade</span>
                <span className="text-right">Subtotal</span>
              </div>
              {store.templates.map((item) => (
                <div
                  key={item.id}
                  className="grid min-w-0 gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50/70 dark:border-gray-800 dark:bg-white/[0.02] dark:hover:bg-white/[0.04] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(7rem,.7fr)_minmax(0,1fr)] md:items-center md:rounded-none md:border-0 md:bg-transparent"
                >
                  <div>
                    <span className="mb-1 block text-[11px] font-medium uppercase text-gray-400 md:hidden">
                      Categoria
                    </span>
                    <strong className="text-sm text-gray-700 dark:text-gray-300">
                      {item.category}
                    </strong>
                  </div>
                  <div>
                    <span className="mb-1 block text-[11px] font-medium uppercase text-gray-400 md:hidden">
                      Valor por template
                    </span>
                    <CurrencyInput
                      label={`Valor ${item.category}`}
                      value={item.value}
                      onChange={(value) => store.updateTemplate({ ...item, value })}
                    />
                  </div>
                  <div>
                    <span className="mb-1 block text-[11px] font-medium uppercase text-gray-400 md:hidden">
                      Quantidade
                    </span>
                    <NumberInput
                      label={`Quantidade ${item.category}`}
                      className="text-center"
                      integer
                      min={1}
                      zeroPlaceholder
                      value={item.quantity}
                      onChange={(quantity) => store.updateTemplate({ ...item, quantity })}
                    />
                  </div>
                  <div className="flex items-center justify-between md:block">
                    <span className="text-[11px] font-medium uppercase text-gray-400 md:hidden">
                      Subtotal
                    </span>
                    <strong className="text-right text-sm tabular-nums text-gray-800 dark:text-white/90 md:block">
                      {formatCurrency(item.value * item.quantity, store.currency)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 dark:border-brand-500/20 dark:bg-brand-500/10">
              <span className="text-sm font-semibold text-brand-700 dark:text-brand-400">
                Total Meta
              </span>
              <strong className="text-lg font-semibold tabular-nums text-brand-700 dark:text-brand-400">
                {formatCurrency(totals.meta, store.currency)}
              </strong>
            </div>
          </section>
        </div>
      </CalculatorCard>
    </CalculatorShell>
  );
}
