import { useMemo, useState, type ReactNode } from 'react';
import { Check, Copy, Moon, Printer, Share2, Sun } from 'lucide-react';
import { commercialCatalog } from '../../lib/commercial-catalog';
import { formatCurrency, type CurrencyCode } from '../../lib/currency';
import { calculateTotals, type CalculatorState, type DiscountType, type ExtraService, type ProposalItem, type TemplateCost } from '../../store/calculator.store';
import { useTheme } from '../../store/theme.store';

interface ProposalSnapshot { currency: CurrencyCode; templates: TemplateCost[]; selectedPlanId: string; planValue: number; resources: ProposalItem[]; services: ExtraService[]; planDiscountType: DiscountType; planDiscountValue: number; }

function discountAmount(value: number, type: DiscountType, discount: number) {
  const requested = type === 'percent' ? value * Math.min(discount, 100) / 100 : type === 'fixed' ? discount : 0;
  return Math.min(Math.max(requested, 0), value);
}

function readProposal(): ProposalSnapshot | null {
  try {
    const value = new URLSearchParams(window.location.search).get('dados');
    if (!value) return null;
    const data = JSON.parse(value) as ProposalSnapshot;
    return data.currency && Array.isArray(data.templates) && Array.isArray(data.resources) && Array.isArray(data.services) ? data : null;
  } catch { return null; }
}

const emptyClass = 'py-5 text-sm text-gray-500 dark:text-gray-400';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="proposal-section overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"><div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800"><h2 className="font-semibold text-gray-900 dark:text-white/90">{title}</h2></div><div className="divide-y divide-gray-100 px-6 dark:divide-gray-800">{children}</div></section>;
}

function Row({ title, description, value, secondary }: { title: string; description?: string; value: string; secondary?: string }) {
  return <div className="flex items-start justify-between gap-6 py-4"><div><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</p>{description && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>}</div><div className="shrink-0 text-right"><p className="text-sm font-semibold text-gray-900 dark:text-white/90">{value}</p>{secondary && <p className="mt-1 text-xs font-medium text-brand-600 dark:text-brand-400">{secondary}</p>}</div></div>;
}

export function ProposalPreviewPage() {
  const proposal = useMemo(readProposal, []);
  const [copied, setCopied] = useState(false);
  const { theme, toggleTheme } = useTheme();

  if (!proposal) return <main className="grid min-h-screen place-items-center bg-gray-50 p-6 dark:bg-gray-950"><div className="max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900"><img src="/logo-infarma.png" alt="Infarma" className="mx-auto h-16 w-auto dark:brightness-0 dark:invert" /><h1 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white/90">Proposta não encontrada</h1><p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Abra novamente o detalhamento financeiro e gere um novo link.</p></div></main>;

  const totals = calculateTotals(proposal as CalculatorState);
  const selectedPlan = commercialCatalog.plans.find((plan) => plan.id === proposal.selectedPlanId);
  const templates = proposal.templates.filter((item) => item.quantity > 0);
  const currency = proposal.currency;
  const copyLink = async () => { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 2000); };
  const share = async () => { if (navigator.share) await navigator.share({ title: 'Proposta Comercial Conexa', text: 'Confira a proposta comercial Conexa.', url: window.location.href }); else await copyLink(); };

  return <main className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-white/90">
    <style>{'@media print {.proposal-actions{display:none!important}html,body,.proposal-page{background:#fff!important}.proposal-page{padding:0!important}.proposal-card,.proposal-section{background:#fff!important;color:#101828!important;box-shadow:none!important}.proposal-section *{border-color:#e4e7ec!important;color:#344054!important}@page{margin:12mm}}'}</style>
    <div className="proposal-page mx-auto max-w-5xl px-5 py-8 sm:px-8">
      <div className="proposal-actions mb-5 flex flex-wrap justify-end gap-2">
        <button onClick={toggleTheme} aria-label={`Ativar tema ${theme === 'dark' ? 'claro' : 'escuro'}`} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5">{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
        <button onClick={copyLink} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Link copiado' : 'Copiar link'}</button>
        <button onClick={share} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"><Share2 size={16} />Compartilhar</button>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"><Printer size={16} />Imprimir ou salvar PDF</button>
      </div>

      <article className="proposal-card overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
        <header className="flex flex-col gap-6 bg-[#162345] px-7 py-8 text-white sm:flex-row sm:items-center sm:justify-between"><img src="/logo-infarma.png" alt="Infarma Sistemas de Gestão" className="h-20 w-48 object-contain object-left brightness-0 invert" /><div className="sm:text-right"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">Proposta comercial</p><h1 className="mt-2 text-2xl font-semibold">Conexa</h1><p className="mt-1 text-sm text-white/60">Emitida em {new Intl.DateTimeFormat('pt-BR').format(new Date())}</p></div></header>

        <div className="grid gap-4 bg-gray-50 p-6 dark:bg-gray-950 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"><p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Investimento mensal</p><p className="mt-2 text-3xl font-bold text-brand-600 dark:text-brand-400">{formatCurrency(totals.recurringTotal, currency)}</p><p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Meta, plano e produtos adicionais</p></div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"><p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Implantação</p><p className="mt-2 text-3xl font-bold text-[#087f8c] dark:text-[#45c2c8]">{formatCurrency(totals.implementationTotal, currency)}</p><p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Pagamento separado do valor mensal</p></div>
        </div>

        <div className="space-y-5 p-6">
          <Section title="Plano Conexa">{selectedPlan ? <><Row title={selectedPlan.name} description={selectedPlan.tagline} value={formatCurrency(totals.discountedPlan, currency)} secondary={totals.planDiscount > 0 ? `${formatCurrency(totals.planDiscount, currency)} de desconto` : undefined} /><div className="grid gap-2 py-4 sm:grid-cols-2">{selectedPlan.features.map((feature) => <div key={feature} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><Check size={14} className="text-success-600 dark:text-success-400" />{feature}</div>)}</div></> : <p className={emptyClass}>Nenhum plano selecionado.</p>}</Section>
          <Section title="Custos da Meta">{templates.length ? templates.map((item) => <Row key={item.id} title={item.category} description={`${item.quantity} template${item.quantity === 1 ? '' : 's'} × ${formatCurrency(item.value, currency)}`} value={formatCurrency(item.value * item.quantity, currency)} />) : <p className={emptyClass}>Nenhum template informado.</p>}</Section>
          <Section title="Produtos adicionais">{proposal.resources.length ? proposal.resources.map((item) => { const gross = item.value * item.quantity; const discount = discountAmount(gross, item.discountType, item.discountValue); return <Row key={item.id} title={item.name || 'Produto adicional'} description={`${item.quantity} unidade${item.quantity === 1 ? '' : 's'} × ${formatCurrency(item.value, currency)}${discount ? ` · Valor original: ${formatCurrency(gross, currency)}` : ''}`} value={formatCurrency(gross - discount, currency)} secondary={discount ? `${formatCurrency(discount, currency)} de desconto` : undefined} />; }) : <p className={emptyClass}>Nenhum produto adicional.</p>}</Section>
          <Section title="Implantação">{proposal.services.length ? proposal.services.map((item) => { const discount = discountAmount(item.value, item.discountType, item.discountValue); const net = item.value - discount; const installments = item.installments > 1 ? `${item.installments}x de ${formatCurrency(net / item.installments, currency)}` : 'Pagamento único'; return <Row key={item.id} title={item.name || 'Implantação'} description={`${installments}${discount ? ` · Valor original: ${formatCurrency(item.value, currency)}` : ''}`} value={formatCurrency(net, currency)} secondary={discount ? `${formatCurrency(discount, currency)} de desconto` : undefined} />; }) : <p className={emptyClass}>Nenhuma implantação adicionada.</p>}</Section>
        </div>
        <footer className="border-t border-gray-100 px-7 py-6 text-center text-xs text-gray-400 dark:border-gray-800 dark:text-gray-500">Proposta comercial gerada pela Infarma Sistemas de Gestão. Valores apresentados em {currency}.</footer>
      </article>
    </div>
  </main>;
}
