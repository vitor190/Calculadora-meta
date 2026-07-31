import { CalculatorCard, CalculatorShell, CurrencyInput, NumberInput, PageHeading } from '../../components/calculator-ui';
import { ui } from '../../lib/ui';
import { useCalculator, type DiscountType } from '../../store/calculator.store';

export function DiscountPage() {
  const store = useCalculator();
  return <CalculatorShell><CalculatorCard><PageHeading title="Desconto" description="Defina a condição comercial aplicada à proposta." /><div className="grid max-w-2xl gap-4 p-5 md:grid-cols-2 md:p-6"><select className={ui.input} value={store.discountType} onChange={(event) => store.setDiscountType(event.target.value as DiscountType)}><option value="none">Sem desconto</option><option value="percent">Desconto em %</option><option value="fixed">Desconto em {store.currency}</option></select>{store.discountType === 'fixed' && <CurrencyInput label="Valor do desconto" value={store.discountValue} onChange={store.setDiscountValue} />}{store.discountType === 'percent' && <div className="relative"><NumberInput label="Percentual de desconto" className="pr-9" max={100} value={store.discountValue} onChange={store.setDiscountValue} /><span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">%</span></div>}</div></CalculatorCard></CalculatorShell>;
}
