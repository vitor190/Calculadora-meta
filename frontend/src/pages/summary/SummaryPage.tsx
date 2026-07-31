import { BadgePercent, CircleDollarSign, MessageSquareText, ReceiptText } from 'lucide-react';
import { CalculatorShell } from '../../components/calculator-ui';
import { formatCurrency } from '../../lib/currency';
import { calculateTotals, useCalculator } from '../../store/calculator.store';
import { CostComparisonChart } from './CostComparisonChart';
import { CostDistributionChart } from './CostDistributionChart';
import { MetricCard } from './MetricCard';

export function SummaryPage() {
  const store = useCalculator();
  const totals = calculateTotals(store);
  const costs = [
    { label: 'Meta', value: totals.meta, color: '#049df6' },
    { label: 'Plano Conexa', value: totals.discountedPlan, color: '#32a699' },
    { label: 'Ecommerce', value: totals.ecommerce, color: '#7a5af8' },
    { label: 'Produtos adicionais', value: totals.additional, color: '#f79009' },
    { label: 'Implantação', value: totals.discountedDeployment, color: '#f04438' },
  ];

  return (
    <CalculatorShell>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total final" value={formatCurrency(totals.final, store.currency)} helper={`Valor em ${store.currency}`} icon={CircleDollarSign} />
        <MetricCard label="Subtotal" value={formatCurrency(totals.subtotal, store.currency)} helper="Antes dos descontos" icon={ReceiptText} tone="success" />
        <MetricCard label="Descontos" value={formatCurrency(totals.discount, store.currency)} helper="Plano mensal + implantação" icon={BadgePercent} tone="warning" />
        <MetricCard label="Templates" value={String(totals.templateQuantity)} helper={`Média de ${formatCurrency(totals.averageTemplate, store.currency)}`} icon={MessageSquareText} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <CostDistributionChart items={costs} currency={store.currency} />
        <CostComparisonChart items={costs} currency={store.currency} />
      </div>

      <section className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <div><h3 className="font-semibold text-gray-900 dark:text-white/90">Detalhamento financeiro</h3><p className="mt-1 text-xs text-gray-400">Valores consolidados da simulação</p></div>
          <span className="rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-700 dark:bg-success-500/10 dark:text-success-400">Atualizado em tempo real</span>
        </div>
        <div className="divide-y divide-gray-100 px-5 dark:divide-gray-800">
          {costs.map((item) => <div key={item.label} className="flex items-center justify-between py-3.5 text-sm"><span className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.label}</span><strong className="text-gray-800 dark:text-white/90">{formatCurrency(item.value, store.currency)}</strong></div>)}
          {totals.planDiscount > 0 && <div className="flex items-center justify-between py-3.5 text-sm text-brand-600 dark:text-brand-400"><span>Desconto do plano mensal</span><strong>− {formatCurrency(totals.planDiscount, store.currency)}</strong></div>}{totals.deploymentDiscount > 0 && <div className="flex items-center justify-between py-3.5 text-sm text-brand-600 dark:text-brand-400"><span>Desconto da implantação</span><strong>− {formatCurrency(totals.deploymentDiscount, store.currency)}</strong></div>}
        </div>
        <div className="flex items-center justify-between bg-brand-500 px-5 py-5 text-white"><div><p className="text-xs font-medium uppercase tracking-wider text-white/70">Total final da proposta</p><p className="mt-1 text-sm text-white/80">Pronto para apresentação em {store.currency}</p></div><strong className="text-2xl font-semibold sm:text-3xl">{formatCurrency(totals.final, store.currency)}</strong></div>
      </section>
    </CalculatorShell>
  );
}




