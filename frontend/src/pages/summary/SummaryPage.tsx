import { BadgePercent, CircleDollarSign, MessageSquareText, ReceiptText } from 'lucide-react';
import type { ReactNode } from 'react';
import { CalculatorShell } from '../../components/calculator-ui';
import { commercialCatalog } from '../../lib/commercial-catalog';
import { formatCurrency } from '../../lib/currency';
import { calculateTotals, useCalculator, type DiscountType } from '../../store/calculator.store';
import { CostComparisonChart } from './CostComparisonChart';
import { CostDistributionChart } from './CostDistributionChart';
import { MetricCard } from './MetricCard';

function discountAmount(value: number, type: DiscountType, discount: number) {
  const amount = type === 'percent' ? value * Math.min(discount, 100) / 100 : type === 'fixed' ? discount : 0;
  return Math.min(Math.max(amount, 0), value);
}

function DetailGroup({ label, total, color, children }: { label: string; total: string; color: string; children: ReactNode }) {
  return <div className="py-4"><div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />{label}</span><strong className="text-gray-900 dark:text-white">{total}</strong></div><div className="ml-[5px] mt-3 space-y-2 border-l border-gray-200 pl-5 dark:border-gray-700">{children}</div></div>;
}

function DetailRow({ label, helper, value, discount }: { label: string; helper?: string; value: string; discount?: string }) {
  return <div className="flex items-start justify-between gap-4 text-xs"><div><p className="text-gray-600 dark:text-gray-300">{label}</p>{helper && <p className="mt-0.5 text-[11px] text-gray-400">{helper}</p>}</div><div className="text-right"><p className="font-medium text-gray-700 dark:text-gray-200">{value}</p>{discount && <p className="mt-0.5 text-[11px] font-medium text-brand-600 dark:text-brand-400">{discount}</p>}</div></div>;
}

function EmptyDetail({ children }: { children: ReactNode }) {
  return <p className="text-xs italic text-gray-400">{children}</p>;
}

export function SummaryPage() {
  const store = useCalculator();
  const totals = calculateTotals(store);
  const selectedPlan = commercialCatalog.plans.find((plan) => plan.id === store.selectedPlanId);
  const addedResources = store.resources;
  const usedTemplates = store.templates.filter((template) => template.quantity > 0);
  const costs = [
    { label: 'Meta', value: totals.meta, color: '#049df6' },
    { label: 'Plano Conexa', value: totals.discountedPlan, color: '#32a699' },
    { label: 'Produtos adicionais', value: totals.resources, color: '#7a5af8' },
    { label: 'Implantação', value: totals.discountedServices, color: '#f04438' },
  ];

  return <CalculatorShell>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Total final" value={formatCurrency(totals.final, store.currency)} helper={`Valor em ${store.currency}`} icon={CircleDollarSign} />
      <MetricCard label="Subtotal" value={formatCurrency(totals.subtotal, store.currency)} helper="Antes dos descontos" icon={ReceiptText} tone="success" />
      <MetricCard label="Descontos" value={formatCurrency(totals.discount, store.currency)} helper="Plano, produtos e implantação" icon={BadgePercent} tone="warning" />
      <MetricCard label="Templates" value={String(totals.templateQuantity)} helper={`Média de ${formatCurrency(totals.averageTemplate, store.currency)}`} icon={MessageSquareText} />
    </div>

    <div className="mt-5 grid gap-5 xl:grid-cols-2"><CostDistributionChart items={costs} currency={store.currency} /><CostComparisonChart items={costs} currency={store.currency} /></div>

    <section className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-semibold text-gray-900 dark:text-white/90">Detalhamento financeiro</h3><p className="mt-1 text-xs text-gray-400">Itens adicionados em cada categoria da proposta</p></div><span className="rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-700 dark:bg-success-500/10 dark:text-success-400">Atualizado em tempo real</span></div>
      <div className="divide-y divide-gray-100 px-5 dark:divide-gray-800">
        <DetailGroup label="Custos da Meta" total={formatCurrency(totals.meta, store.currency)} color="#049df6">{usedTemplates.length ? usedTemplates.map((item) => <DetailRow key={item.id} label={item.category} helper={`${item.quantity} template${item.quantity === 1 ? '' : 's'} × ${formatCurrency(item.value, store.currency)}`} value={formatCurrency(item.value * item.quantity, store.currency)} />) : <EmptyDetail>Nenhum template informado.</EmptyDetail>}</DetailGroup>
        <DetailGroup label="Plano Conexa" total={formatCurrency(totals.discountedPlan, store.currency)} color="#32a699">{store.planValue > 0 ? <DetailRow label={selectedPlan?.name ?? 'Plano selecionado'} helper="Valor mensal" value={formatCurrency(store.planValue, store.currency)} discount={totals.planDiscount > 0 ? `− ${formatCurrency(totals.planDiscount, store.currency)} de desconto` : undefined} /> : <EmptyDetail>Nenhum valor adicionado.</EmptyDetail>}</DetailGroup>
        <DetailGroup label="Produtos adicionais" total={formatCurrency(totals.resources, store.currency)} color="#7a5af8">{addedResources.length ? addedResources.map((item) => { const discount = discountAmount(item.value, item.discountType, item.discountValue); return <DetailRow key={item.id} label={item.name || 'Produto sem nome'} value={formatCurrency(item.value - discount, store.currency)} helper={discount > 0 ? `Valor original: ${formatCurrency(item.value, store.currency)}` : undefined} discount={discount > 0 ? `− ${formatCurrency(discount, store.currency)} de desconto` : undefined} />; }) : <EmptyDetail>Nenhum produto adicionado.</EmptyDetail>}</DetailGroup>
        <DetailGroup label="Implantação" total={formatCurrency(totals.discountedServices, store.currency)} color="#f04438">{store.services.length ? store.services.map((item) => { const discount = discountAmount(item.value, item.discountType, item.discountValue); return <DetailRow key={item.id} label={item.name || 'Implantação sem nome'} value={formatCurrency(item.value - discount, store.currency)} helper={discount > 0 ? `Valor original: ${formatCurrency(item.value, store.currency)}` : undefined} discount={discount > 0 ? `− ${formatCurrency(discount, store.currency)} de desconto` : undefined} />; }) : <EmptyDetail>Nenhuma implantação adicionada.</EmptyDetail>}</DetailGroup>
      </div>
      <div className="flex items-center justify-between bg-brand-500 px-5 py-5 text-white"><div><p className="text-xs font-medium uppercase tracking-wider text-white/70">Total final da proposta</p><p className="mt-1 text-sm text-white/80">Pronto para apresentação em {store.currency}</p></div><strong className="text-2xl font-semibold sm:text-3xl">{formatCurrency(totals.final, store.currency)}</strong></div>
    </section>
  </CalculatorShell>;
}




