import { money } from '../../components/calculator-ui';

interface ChartItem {
  label: string;
  value: number;
  color: string;
}

export function CostDistributionChart({ items }: { items: ChartItem[] }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let accumulated = 0;
  const gradient = items.map((item) => {
    const start = total ? accumulated / total * 360 : 0;
    accumulated += item.value;
    const end = total ? accumulated / total * 360 : 0;
    return `${item.color} ${start}deg ${end}deg`;
  }).join(', ');

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 md:p-6">
      <div><h3 className="font-semibold text-gray-900 dark:text-white/90">Distribuição de custos</h3><p className="mt-1 text-xs text-gray-400">Participação de cada item no subtotal</p></div>
      <div className="mt-6 flex flex-col items-center gap-7 sm:flex-row">
        <div className="relative h-44 w-44 shrink-0 rounded-full" style={{ background: total ? `conic-gradient(${gradient})` : 'conic-gradient(#e4e7ec 0deg 360deg)' }}>
          <div className="absolute inset-7 flex flex-col items-center justify-center rounded-full bg-white dark:bg-gray-900"><span className="text-xs text-gray-400">Subtotal</span><strong className="mt-1 text-lg text-gray-900 dark:text-white/90">{money.format(total)}</strong></div>
        </div>
        <div className="w-full space-y-3">
          {items.map((item) => <div key={item.label} className="flex items-center justify-between gap-4 text-sm"><span className="flex min-w-0 items-center gap-2 text-gray-500 dark:text-gray-400"><i className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} /><span className="truncate">{item.label}</span></span><strong className="text-gray-800 dark:text-white/90">{money.format(item.value)}</strong></div>)}
        </div>
      </div>
    </article>
  );
}
