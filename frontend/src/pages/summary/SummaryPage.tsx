import type { ReactNode } from 'react';
import { CalculatorShell } from '../../components/calculator-ui';
import { commercialCatalog } from '../../lib/commercial-catalog';
import { formatCurrency } from '../../lib/currency';
import { calculateTotals, useCalculator, type DiscountType } from '../../store/calculator.store';

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
  return <CalculatorShell>
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-semibold text-gray-900 dark:text-white/90">Detalhamento financeiro</h3><p className="mt-1 text-xs text-gray-400">Itens adicionados em cada categoria da proposta</p></div><span className="rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-700 dark:bg-success-500/10 dark:text-success-400">Atualizado em tempo real</span></div>
      <div className="divide-y divide-gray-100 px-5 dark:divide-gray-800">
        <DetailGroup label="Custos da Meta" total={formatCurrency(totals.meta, store.currency)} color="#049df6">{usedTemplates.length ? usedTemplates.map((item) => <DetailRow key={item.id} label={item.category} helper={`${item.quantity} template${item.quantity === 1 ? '' : 's'} × ${formatCurrency(item.value, store.currency)}`} value={formatCurrency(item.value * item.quantity, store.currency)} />) : <EmptyDetail>Nenhum template informado.</EmptyDetail>}</DetailGroup>
        <DetailGroup label="Plano Conexa" total={formatCurrency(totals.discountedPlan, store.currency)} color="#32a699">{selectedPlan ? <><DetailRow label={selectedPlan.name} helper="Valor mensal da proposta" value={store.planValue > 0 ? formatCurrency(store.planValue, store.currency) : 'Nenhum valor adicionado'} discount={totals.planDiscount > 0 ? `− ${formatCurrency(totals.planDiscount, store.currency)} de desconto` : undefined} /><div className="mt-3 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"><div className="grid grid-cols-[1fr_auto] gap-4 bg-gray-50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:bg-white/[0.03]"><span>Recurso</span><span>Situação</span></div><div className="divide-y divide-gray-100 dark:divide-gray-800">{selectedPlan.features.map((feature) => <div key={feature} className="grid grid-cols-[1fr_auto] items-center gap-4 bg-white px-3 py-2.5 text-xs dark:bg-gray-900"><span className="text-gray-600 dark:text-gray-300">{feature}</span><span className="rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-semibold text-success-700 dark:bg-success-500/10 dark:text-success-400">Incluído</span></div>)}</div></div></> : <EmptyDetail>Nenhum plano selecionado.</EmptyDetail>}</DetailGroup>
        <DetailGroup label="Produtos adicionais" total={formatCurrency(totals.resources, store.currency)} color="#7a5af8">{addedResources.length ? addedResources.map((item) => { const grossValue = item.value * item.quantity; const discount = discountAmount(grossValue, item.discountType, item.discountValue); const netValue = grossValue - discount; const quantityText = `${item.quantity} unidade${item.quantity === 1 ? '' : 's'} × ${formatCurrency(item.value, store.currency)}`; return <DetailRow key={item.id} label={item.name || 'Produto sem nome'} value={formatCurrency(grossValue, store.currency)} helper={quantityText} discount={discount > 0 ? `− ${formatCurrency(discount, store.currency)} de desconto · Final: ${formatCurrency(netValue, store.currency)}` : undefined} />; }) : <EmptyDetail>Nenhum produto adicionado.</EmptyDetail>}</DetailGroup>
        <DetailGroup label="Implantação" total={formatCurrency(totals.discountedServices, store.currency)} color="#f04438">{store.services.length ? store.services.map((item) => { const discount = discountAmount(item.value, item.discountType, item.discountValue); const netValue = item.value - discount; const discountedText = discount > 0 ? `Valor com desconto: ${formatCurrency(netValue, store.currency)}` : undefined; const installmentText = item.installments > 1 ? `${item.installments}x de ${formatCurrency(netValue / item.installments, store.currency)}` : undefined; return <DetailRow key={item.id} label={item.name || 'Implantação sem nome'} value={formatCurrency(item.value, store.currency)} helper={[discountedText, installmentText].filter(Boolean).join(' · ') || undefined} discount={discount > 0 ? `− ${formatCurrency(discount, store.currency)} de desconto` : undefined} />; }) : <EmptyDetail>Nenhuma implantação adicionada.</EmptyDetail>}</DetailGroup>
      </div>
      <div className="grid md:grid-cols-2"><div className="flex items-center justify-between gap-4 bg-brand-500 px-5 py-5 text-white"><div><p className="text-xs font-medium uppercase tracking-wider text-white/70">Total mensal</p><p className="mt-1 text-sm text-white/80">Meta, plano e produtos</p></div><strong className="text-xl font-semibold sm:text-2xl">{formatCurrency(totals.recurringTotal, store.currency)}</strong></div><div className="flex items-center justify-between gap-4 bg-[#087f8c] px-5 py-5 text-white"><div><p className="text-xs font-medium uppercase tracking-wider text-white/70">Implantação</p><p className="mt-1 text-sm text-white/80">Pagamento separado</p></div><strong className="text-xl font-semibold sm:text-2xl">{formatCurrency(totals.implementationTotal, store.currency)}</strong></div></div>
    </section>
  </CalculatorShell>;
}














