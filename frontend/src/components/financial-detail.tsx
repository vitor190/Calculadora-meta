import type { CSSProperties, ReactNode } from 'react';
import { formatCurrency, type CurrencyCode } from '../lib/currency';
import { calculateDiscount } from '../services/calculator.service';
import type { ProposalItem } from '../types/calculator.types';

interface FinancialDetailGroupProps {
  label: string;
  total: string;
  color: CSSProperties['backgroundColor'];
  children: ReactNode;
}

export function FinancialDetailGroup({ label, total, color, children }: FinancialDetailGroupProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="relative flex items-center justify-between gap-4 border-b border-gray-100 bg-gray-50 px-4 py-3.5 dark:border-gray-800 dark:bg-white/[0.03]">
        <span
          className="absolute inset-y-0 left-0 w-1"
          style={{ backgroundColor: color }}
        />
        <h4 className="pl-1 text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</h4>
        <strong className="shrink-0 text-sm text-gray-900 dark:text-white">{total}</strong>
      </div>
      <div className="space-y-3 p-4">{children}</div>
    </section>
  );
}

interface FinancialDetailRowProps {
  label: string;
  details?: Array<{
    label: string;
    value: string;
    highlight?: boolean;
  }>;
  value: string;
  valueLabel?: string;
}

export function FinancialDetailRow({
  label,
  details = [],
  value,
  valueLabel = 'Subtotal',
}: FinancialDetailRowProps) {
  return (
    <article className="flex flex-col gap-2 border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-gray-800 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
      <div className="min-w-0">
        <h5 className="break-words text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </h5>
        {details.length > 0 && (
          <p className="mt-1 flex flex-wrap gap-y-0.5 text-[11px] text-gray-400">
            {details.map((detail, index) => (
              <span
                key={detail.label}
                className={detail.highlight ? 'font-medium text-brand-600 dark:text-brand-400' : ''}
              >
                {index > 0 && <span className="mx-2 text-gray-300 dark:text-gray-700">·</span>}
                {detail.label}: {detail.value}
              </span>
            ))}
          </p>
        )}
      </div>
      <div className="shrink-0 sm:text-right">
        <strong className="text-sm text-gray-900 dark:text-white">{value}</strong>
        <p className="mt-0.5 text-[10px] text-gray-400">{valueLabel}</p>
      </div>
    </article>
  );
}

export function EmptyFinancialDetail({ children }: { children: ReactNode }) {
  return <p className="text-xs italic text-gray-400">{children}</p>;
}

interface ProductFinancialCardProps {
  item: ProposalItem;
  currency: CurrencyCode;
}

interface ProductFinancialBreakdownProps extends ProductFinancialCardProps {
  compact?: boolean;
}

interface CompactFinancialBreakdownProps {
  grossValue: number;
  discount: number;
  netValue: number;
  currency: CurrencyCode;
  grossLabel?: string;
  netLabel?: string;
}

export function CompactFinancialBreakdown({
  grossValue,
  discount,
  netValue,
  currency,
  grossLabel = 'Bruto',
  netLabel = 'Subtotal',
}: CompactFinancialBreakdownProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs dark:border-gray-800 dark:bg-gray-900">
      <span className="text-gray-500 dark:text-gray-400">
        {grossLabel}:{' '}
        <strong className="tabular-nums text-gray-700 dark:text-gray-200">
          {formatCurrency(grossValue, currency)}
        </strong>
      </span>
      {discount > 0 && (
        <span className="tabular-nums text-brand-600 dark:text-brand-400">
          Desconto: − {formatCurrency(discount, currency)}
        </span>
      )}
      <span className="font-semibold text-gray-900 dark:text-white">
        {netLabel}: <span className="tabular-nums">{formatCurrency(netValue, currency)}</span>
      </span>
    </div>
  );
}

export function ProductFinancialBreakdown({
  item,
  currency,
  compact = false,
}: ProductFinancialBreakdownProps) {
  const grossValue = item.value * item.quantity;
  const discount = calculateDiscount(grossValue, item.discountType, item.discountValue);
  const netValue = grossValue - discount;
  const discountType =
    item.discountType === 'percent'
      ? `Percentual (${item.discountValue}%)`
      : `Fixo (${formatCurrency(item.discountValue, currency)})`;

  if (compact)
    return (
      <CompactFinancialBreakdown
        grossValue={grossValue}
        discount={discount}
        netValue={netValue}
        currency={currency}
      />
    );

  return (
    <>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 px-4 py-3 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Quantidade
          </dt>
          <dd className="mt-0.5 text-xs font-medium text-gray-700 dark:text-gray-200">
            {item.quantity} unidade{item.quantity === 1 ? '' : 's'}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Valor unitário
          </dt>
          <dd className="mt-0.5 text-xs font-medium text-gray-700 dark:text-gray-200">
            {formatCurrency(item.value, currency)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Valor bruto
          </dt>
          <dd className="mt-0.5 text-xs font-medium text-gray-700 dark:text-gray-200">
            {formatCurrency(grossValue, currency)}
          </dd>
        </div>
        {discount > 0 && (
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Desconto · {discountType}
            </dt>
            <dd className="mt-0.5 text-xs font-medium text-brand-600 dark:text-brand-400">
              − {formatCurrency(discount, currency)}
            </dd>
          </div>
        )}
      </dl>
      <div className="flex items-center justify-between gap-4 border-t border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-white/[0.03]">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
          Subtotal líquido
        </span>
        <strong className="text-sm text-gray-900 dark:text-white">
          {formatCurrency(netValue, currency)}
        </strong>
      </div>
    </>
  );
}

export function ProductFinancialCard({ item, currency }: ProductFinancialCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-white/[0.03]">
        <h4 className="break-words text-sm font-semibold text-gray-800 dark:text-gray-200">
          {item.name || 'Produto sem nome'}
        </h4>
      </div>
      <ProductFinancialBreakdown
        item={item}
        currency={currency}
      />
    </article>
  );
}
