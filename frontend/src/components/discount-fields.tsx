import { CurrencyInput, NumberInput } from './calculator-ui';
import { ui } from '../lib/ui';
import type { DiscountType } from '../store/calculator.store';

interface DiscountFieldsProps {
  title: string;
  type: DiscountType;
  value: number;
  currency: string;
  onTypeChange: (type: DiscountType) => void;
  onValueChange: (value: number) => void;
}

export function DiscountFields({ title, type, value, currency, onTypeChange, onValueChange }: DiscountFieldsProps) {
  return <div><label className={ui.label}>{title}</label><div className="grid gap-3 sm:grid-cols-2"><select className={ui.input} value={type} onChange={(event) => onTypeChange(event.target.value as DiscountType)}><option value="none">Sem desconto</option><option value="percent">Percentual (%)</option><option value="fixed">Valor fixo ({currency})</option></select>{type === 'fixed' && <CurrencyInput label={title} value={value} onChange={onValueChange} />}{type === 'percent' && <div className="relative"><NumberInput label={title} className="pr-9" max={100} value={value} onChange={onValueChange} /><span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">%</span></div>}</div></div>;
}
