import type { CSSProperties, ReactNode } from 'react';

interface FinancialDetailGroupProps {
  label: string;
  total: string;
  color: CSSProperties['backgroundColor'];
  children: ReactNode;
}

export function FinancialDetailGroup({ label, total, color, children }: FinancialDetailGroupProps) {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          {label}
        </span>
        <strong className="text-gray-900 dark:text-white">{total}</strong>
      </div>
      <div className="ml-[5px] mt-3 space-y-2 border-l border-gray-200 pl-5 dark:border-gray-700">
        {children}
      </div>
    </div>
  );
}

interface FinancialDetailRowProps {
  label: string;
  helper?: string;
  value: string;
  discount?: string;
}

export function FinancialDetailRow({ label, helper, value, discount }: FinancialDetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 text-xs">
      <div>
        <p className="text-gray-600 dark:text-gray-300">{label}</p>
        {helper && <p className="mt-0.5 text-[11px] text-gray-400">{helper}</p>}
      </div>
      <div className="text-right">
        <p className="font-medium text-gray-700 dark:text-gray-200">{value}</p>
        {discount && (
          <p className="mt-0.5 text-[11px] font-medium text-brand-600 dark:text-brand-400">
            {discount}
          </p>
        )}
      </div>
    </div>
  );
}

export function EmptyFinancialDetail({ children }: { children: ReactNode }) {
  return <p className="text-xs italic text-gray-400">{children}</p>;
}
