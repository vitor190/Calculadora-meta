import { ExternalLink } from 'lucide-react';
import { CalculatorShell } from '../../components/calculator-ui';
import {
  EmptyFinancialDetail,
  FinancialDetailGroup,
  FinancialDetailRow,
} from '../../components/financial-detail';
import { commercialCatalog } from '../../lib/commercial-catalog';
import { formatCurrency } from '../../lib/currency';
import { calculateDiscount, calculateTotals } from '../../services/calculator.service';
import { useCalculator } from '../../store/calculator.store';

export function SummaryPage() {
  const store = useCalculator();
  const totals = calculateTotals(store);
  const selectedPlan = commercialCatalog.plans.find((plan) => plan.id === store.selectedPlanId);
  const addedResources = store.resources;
  const usedTemplates = store.templates.filter((template) => template.quantity > 0);
  const openProposal = () => {
    window.open('/proposta', '_blank', 'noopener,noreferrer');
  };
  return (
    <CalculatorShell
      finalAction={
        <button
          type="button"
          onClick={openProposal}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Visualizar proposta
          <ExternalLink size={16} />
        </button>
      }
    >
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white/90">
              Detalhamento financeiro
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              Itens adicionados em cada categoria da proposta
            </p>
          </div>
          <span className="rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-700 dark:bg-success-500/10 dark:text-success-400">
            Atualizado em tempo real
          </span>
        </div>
        <div className="grid min-w-0 items-start gap-4 p-5 lg:grid-cols-1">
          <FinancialDetailGroup
            label="Estimativa Meta"
            total={formatCurrency(totals.meta, store.currency)}
            color="#049df6"
          >
            {usedTemplates.length ? (
              usedTemplates.map((item) => (
                <FinancialDetailRow
                  key={item.id}
                  label={item.category}
                  details={[
                    { label: 'Quantidade', value: String(item.quantity) },
                    { label: 'Valor unitário', value: formatCurrency(item.value, store.currency) },
                  ]}
                  value={formatCurrency(item.value * item.quantity, store.currency)}
                  valueLabel="Total do item"
                />
              ))
            ) : (
              <EmptyFinancialDetail>Nenhum template informado.</EmptyFinancialDetail>
            )}
          </FinancialDetailGroup>
          <FinancialDetailGroup
            label="Plano Conexa"
            total={formatCurrency(totals.discountedPlan, store.currency)}
            color="#32a699"
          >
            {selectedPlan ? (
              <>
                <FinancialDetailRow
                  label={selectedPlan.name}
                  details={[
                    {
                      label: 'Valor mensal',
                      value: formatCurrency(store.planValue, store.currency),
                    },
                    ...(totals.planDiscount > 0
                      ? [
                          {
                            label: 'Desconto',
                            value: `− ${formatCurrency(totals.planDiscount, store.currency)}`,
                            highlight: true,
                          },
                        ]
                      : []),
                  ]}
                  value={
                    store.planValue > 0
                      ? formatCurrency(totals.discountedPlan, store.currency)
                      : 'Nenhum valor adicionado'
                  }
                  valueLabel="Mensalidade líquida"
                />
                <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 bg-gray-50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:bg-white/[0.03]">
                    <span>Recurso</span>
                    <span>Situação</span>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {selectedPlan.features.map((feature) => (
                      <div
                        key={feature}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 bg-white px-3 py-2.5 text-xs dark:bg-gray-900"
                      >
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                        <span className="rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-semibold text-success-700 dark:bg-success-500/10 dark:text-success-400">
                          Incluído
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <EmptyFinancialDetail>Nenhum plano selecionado.</EmptyFinancialDetail>
            )}
          </FinancialDetailGroup>
          <FinancialDetailGroup
            label="Produtos adicionais"
            total={formatCurrency(totals.resources, store.currency)}
            color="#7a5af8"
          >
            {addedResources.length ? (
              addedResources.map((item) => {
                const grossValue = item.value * item.quantity;
                const discount = calculateDiscount(
                  grossValue,
                  item.discountType,
                  item.discountValue,
                );
                const netValue = grossValue - discount;
                return (
                  <FinancialDetailRow
                    key={item.id}
                    label={item.name || 'Produto sem nome'}
                    details={[
                      { label: 'Quantidade', value: String(item.quantity) },
                      {
                        label: 'Valor unitário',
                        value: formatCurrency(item.value, store.currency),
                      },
                      { label: 'Valor bruto', value: formatCurrency(grossValue, store.currency) },
                      ...(discount > 0
                        ? [
                            {
                              label: 'Desconto',
                              value: `− ${formatCurrency(discount, store.currency)}`,
                              highlight: true,
                            },
                          ]
                        : []),
                    ]}
                    value={formatCurrency(netValue, store.currency)}
                    valueLabel="Subtotal líquido"
                  />
                );
              })
            ) : (
              <EmptyFinancialDetail>Nenhum produto adicionado.</EmptyFinancialDetail>
            )}
          </FinancialDetailGroup>
          <FinancialDetailGroup
            label="Implantação"
            total={formatCurrency(totals.discountedServices, store.currency)}
            color="#f04438"
          >
            {store.services.length ? (
              <>
                {store.services.map((item) => {
                  const discount = calculateDiscount(
                    item.value,
                    item.discountType,
                    item.discountValue,
                  );
                  const netValue = item.value - discount;
                  return (
                    <FinancialDetailRow
                      key={item.id}
                      label={item.name || 'Implantação sem nome'}
                      details={[
                        { label: 'Valor bruto', value: formatCurrency(item.value, store.currency) },
                        ...(discount > 0
                          ? [
                              {
                                label: 'Desconto',
                                value: `− ${formatCurrency(discount, store.currency)}`,
                                highlight: true,
                              },
                            ]
                          : []),
                      ]}
                      value={formatCurrency(netValue, store.currency)}
                      valueLabel="Subtotal líquido"
                    />
                  );
                })}
                <FinancialDetailRow
                  label="Parcelamento total"
                  details={[
                    {
                      label: 'Total da implantação',
                      value: formatCurrency(totals.implementationTotal, store.currency),
                    },
                  ]}
                  value={
                    store.implementationInstallments > 1
                      ? `${store.implementationInstallments}x de ${formatCurrency(totals.implementationTotal / store.implementationInstallments, store.currency)}`
                      : 'Pagamento único'
                  }
                  valueLabel="Condição de pagamento"
                />
              </>
            ) : (
              <EmptyFinancialDetail>Nenhuma implantação adicionada.</EmptyFinancialDetail>
            )}
          </FinancialDetailGroup>
        </div>
        <div className="grid md:grid-cols-3">
          <div className="flex items-center justify-between gap-4 bg-brand-500 px-5 py-5 text-white">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                Mensalidade Infarma
              </p>
              <p className="mt-1 text-sm text-white/80">Plano e produtos adicionais</p>
            </div>
            <strong className="text-xl font-semibold sm:text-2xl">
              {formatCurrency(totals.infarmaRecurringTotal, store.currency)}
            </strong>
          </div>
          <div className="flex items-center justify-between gap-4 bg-[#087f8c] px-5 py-5 text-white">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                Implantação
              </p>
              <p className="mt-1 text-sm text-white/80">
                {store.services.length === 0
                  ? 'Nenhum valor adicionado'
                  : store.implementationInstallments > 1
                    ? `${store.implementationInstallments}x de ${formatCurrency(totals.implementationTotal / store.implementationInstallments, store.currency)}`
                    : 'Pagamento único'}
              </p>
            </div>
            <strong className="text-xl font-semibold sm:text-2xl">
              {formatCurrency(totals.implementationTotal, store.currency)}
            </strong>
          </div>
          <div className="flex items-center justify-between gap-4 bg-[#162345] px-5 py-5 text-white">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                Estimativa Meta
              </p>
              <p className="mt-1 text-sm text-white/80">Baseada no volume informado</p>
            </div>
            <strong className="text-xl font-semibold sm:text-2xl">
              {formatCurrency(totals.meta, store.currency)}
            </strong>
          </div>
        </div>
      </section>
    </CalculatorShell>
  );
}
