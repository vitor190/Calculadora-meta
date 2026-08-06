import { useMemo, type ReactNode } from 'react';
import { Check, Moon, Printer, Sun } from 'lucide-react';
import { ThemeBrandIcon } from '../../components/theme-brand-icon';
import { commercialCatalog } from '../../lib/commercial-catalog';
import { formatCurrency } from '../../lib/currency';
import { readProposalSnapshot } from '../../services/proposal.service';
import { calculateDiscount, calculateTotals } from '../../services/calculator.service';
import { selectCalculatorData, useCalculator } from '../../store/calculator.store';
import { useTheme } from '../../store/theme.store';

const actionClass =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:focus-visible:ring-offset-gray-950';

function Section({
  title,
  eyebrow,
  className = '',
  children,
}: {
  title: string;
  eyebrow: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`proposal-section overflow-hidden rounded-2xl bg-gray-50/80 ring-1 ring-gray-200 shadow-sm shadow-gray-200/40 dark:bg-gray-950/50 dark:ring-gray-700 dark:shadow-none ${className}`}
    >
      <header className="proposal-category-heading flex items-center gap-3 border-b border-gray-200 bg-white/90 px-5 py-4 dark:border-gray-700 dark:bg-gray-900/90 sm:px-6">
        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-brand-50 px-2 text-[10px] font-bold tracking-wider text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
          {eyebrow}
        </span>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white/90">
          {title}
        </h3>
      </header>
      <div className="proposal-category-content divide-y divide-gray-100 px-5 dark:divide-gray-800 sm:px-6">
        <div className="report-table-heading hidden" aria-hidden="true">
          <span>Produto / serviço</span>
          <span>Como o valor foi calculado</span>
          <span>Total</span>
        </div>
        {children}
      </div>
    </section>
  );
}

function FinancialItem({
  title,
  description,
  details,
  totalLabel = 'Total do item',
  total,
  showTotal = true,
}: {
  title: string;
  description?: string;
  details: ReactNode;
  totalLabel?: string;
  total: string;
  showTotal?: boolean;
}) {
  return (
    <div className="financial-item grid gap-3 py-5 md:grid-cols-[minmax(0,0.9fr)_minmax(20rem,1.1fr)] md:gap-6">
      <div className="min-w-0">
        <h4 className="break-words text-sm font-semibold text-gray-900 dark:text-white/90">
          {title}
        </h4>
        {description && (
          <p className="mt-1 break-words text-xs leading-5 text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      <div className="financial-item-details min-w-0 space-y-1.5 text-sm">
        {details}
        {showTotal && (
          <div className="financial-item-subtotal flex items-baseline justify-between gap-4 border-t border-gray-100 pt-2 font-semibold text-gray-900 dark:border-gray-800 dark:text-white/90">
            <span className="text-xs text-gray-500 dark:text-gray-400">{totalLabel}</span>
            <span className="tabular-nums">{total}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function AmountLine({
  label,
  value,
  discount = false,
}: {
  label: string;
  value: string;
  discount?: boolean;
}) {
  return (
    <div
      className={`amount-line flex items-baseline justify-between gap-4 ${
        discount ? 'text-success-600 dark:text-success-400' : 'text-gray-500 dark:text-gray-400'
      }`}
    >
      <span className="text-xs">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function GroupTotal({
  label,
  value,
  prominent = false,
}: {
  label: string;
  value: string;
  prominent?: boolean;
}) {
  return (
    <div
      className={`category-total section-closing flex items-center justify-between gap-5 py-4 ${
        prominent ? 'text-brand-700 dark:text-brand-400' : 'text-gray-900 dark:text-white/90'
      }`}
    >
      <strong className="text-sm">{label}</strong>
      <strong className={`${prominent ? 'text-xl' : 'text-base'} tabular-nums`}>{value}</strong>
    </div>
  );
}

export function ProposalPreviewPage() {
  const hasSharedData = useMemo(() => new URLSearchParams(window.location.search).has('dados'), []);
  const sharedProposal = useMemo(() => readProposalSnapshot(), []);
  const calculatorState = useCalculator();
  const proposal = hasSharedData ? sharedProposal : selectCalculatorData(calculatorState);
  const { theme, toggleTheme } = useTheme();

  if (!proposal)
    return (
      <main className="grid min-h-screen place-items-center bg-gray-50 p-6 dark:bg-gray-950">
        <div className="max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <ThemeBrandIcon
            alt="Infarma"
            className="mx-auto h-16 w-16 object-contain"
          />
          <h1 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white/90">
            Proposta não encontrada
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Abra novamente o detalhamento financeiro e gere um novo link.
          </p>
        </div>
      </main>
    );

  const totals = calculateTotals(proposal);
  const selectedPlan = commercialCatalog.plans.find((plan) => plan.id === proposal.selectedPlanId);
  const templates = proposal.templates.filter((item) => item.quantity > 0);
  const currency = proposal.currency;
  const installments = proposal.implementationInstallments;
  const paymentCondition =
    installments > 1
      ? `${installments} parcelas de ${formatCurrency(totals.implementationTotal / installments, currency)}`
      : 'Pagamento único';

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-b from-brand-50/60 via-gray-50 to-gray-100 text-gray-900 transition-colors dark:from-gray-950 dark:via-[#111827] dark:to-gray-950 dark:text-white/90">
      <style>
        {`@media print {
          html, body { width: 100%; height: 100%; background: #fff !important; }
          body { margin: 0 !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          main { min-height: 0 !important; background: #fff !important; background-image: none !important; color: #101828 !important; }
          .proposal-actions { display: none !important; }
          .proposal-currency-note { display: none !important; }
          .proposal-page { width: 100% !important; max-width: none !important; padding: 0 !important; }
          .proposal-card, .proposal-section { background: #fff !important; color: #101828 !important; box-shadow: none !important; }
          .proposal-card { width: 100% !important; padding-bottom: 10mm !important; border: 0 !important; border-radius: 0 !important; }
          .proposal-section { border: 1px solid #d0d5dd !important; background: #fff !important; }
          .proposal-section *, .proposal-summary * { border-color: #e4e7ec !important; color: #344054 !important; }
          .proposal-section > header { background: #eef2f6 !important; border-color: #cfd6df !important; }
          .proposal-section > header span { background: #dbeafe !important; color: #075985 !important; }
          .proposal-section > header h3 { color: #162345 !important; }
          .proposal-header { min-height: 0 !important; padding: 3mm 6mm !important; background: #fff !important; border-bottom: 1px solid #d0d5dd !important; color: #101828 !important; }
          .proposal-header img { width: 15mm !important; height: 15mm !important; }
          .proposal-header img { filter: none !important; }
          .proposal-header * { color: #344054 !important; }
          .proposal-header h1 { margin-top: .5mm !important; font-size: 19px !important; line-height: 1.1 !important; }
          .proposal-header p { font-size: 8px !important; }
          .proposal-summary { padding: 3mm 6mm !important; background: #e8edf3 !important; }
          .proposal-summary > div { gap: 5mm !important; }
          .proposal-summary .summary-card { padding: 2.5mm 4mm !important; border: 1px solid #98a2b3 !important; border-radius: 0 !important; }
          .proposal-summary .summary-card:first-of-type { border-left: 1.5mm solid #0792f1 !important; }
          .proposal-summary .summary-card:last-of-type { border-left: 1.5mm solid #087f8c !important; }
          .proposal-summary .summary-card > p:first-of-type { color: #162345 !important; }
          .proposal-summary p { margin-top: 1.5mm !important; font-size: 9px !important; line-height: 1.3 !important; }
          .proposal-summary .text-4xl, .proposal-summary .sm\\:text-5xl { font-size: 27px !important; }
          .proposal-summary .text-2xl, .proposal-summary .sm\\:text-3xl { font-size: 21px !important; }
          .summary-card { background: #fff !important; break-inside: avoid; page-break-inside: avoid; }
          .proposal-content { display: block !important; padding: 3mm 6mm 4mm !important; }
          .proposal-composition { display: flex !important; flex-direction: column !important; }
          .proposal-implementation { display: block !important; }
          .proposal-plan { order: 1; }
          .proposal-resources { order: 2; }
          .proposal-composition > .section-closing { order: 3; }
          .proposal-meta { order: 4; margin-bottom: 3mm !important; border-top-width: 1px !important; }
          .proposal-section-heading { display: block !important; margin: 0 !important; padding: 1.5mm 3mm !important; border: 1px solid #98a2b3 !important; border-bottom: 0 !important; background: #162345 !important; }
          .proposal-section-heading { break-inside: avoid-page !important; page-break-inside: avoid !important; }
          .proposal-section-heading > span { display: none !important; }
          .proposal-section-heading h2 { color: #fff !important; font-size: 12px !important; line-height: 1.2 !important; }
          .proposal-section-heading p { margin-top: .7mm !important; color: #d0d5dd !important; font-size: 8px !important; }
          .proposal-section { margin: 0 !important; overflow: visible !important; border-width: 0 1px 1px !important; border-radius: 0 !important; break-inside: auto !important; page-break-inside: auto !important; }
          .proposal-section + .proposal-section { border-top: 0 !important; }
          .proposal-meta { margin-top: 3mm !important; break-inside: avoid-page !important; page-break-inside: avoid !important; }
          .proposal-resources { margin-top: .8mm !important; }
          .proposal-section header { gap: 2.5mm !important; padding: 1.8mm 3.5mm !important; border-top: 1px solid #98a2b3 !important; }
          .proposal-category-heading { break-after: avoid-page !important; page-break-after: avoid !important; }
          .proposal-section header > span { display: none !important; }
          .proposal-section header h3 { font-size: 10px !important; line-height: 1.25 !important; letter-spacing: .08em !important; }
          .proposal-section > div { padding-inline: 3.5mm !important; }
          .proposal-category-content > :not(:last-child) { border-color: #d0d5dd !important; }
          .financial-item { display: grid !important; grid-template-columns: minmax(0, 42%) minmax(0, 1fr) !important; align-items: start !important; column-gap: 5mm !important; padding-block: 2mm !important; overflow: visible !important; }
          .financial-item > div:first-child { padding-top: .35mm !important; }
          .financial-item-details { grid-column: 2 !important; width: auto !important; overflow: visible !important; }
          .financial-item-details > * + * { margin-top: 1mm !important; }
          .financial-item-details span { color: #344054 !important; }
          .financial-item h4 { font-size: 9.5px !important; line-height: 1.35 !important; font-weight: 700 !important; color: #1d2939 !important; }
          .financial-item p, .financial-item span { margin-top: 0 !important; font-size: 8.5px !important; line-height: 1.35 !important; }
          .amount-line > span:first-child, .financial-item-subtotal > span:first-child { font-weight: 600 !important; }
          .amount-line > span:last-child, .financial-item-subtotal > span:last-child { min-width: 27mm !important; text-align: right !important; white-space: nowrap !important; }
          .financial-item-subtotal { margin-top: .8mm !important; padding-top: .5mm !important; border-top: 0 !important; }
          .financial-item-subtotal span { font-weight: 700 !important; color: #1d2939 !important; }
          .plan-features { padding: 1.8mm 3mm !important; }
          .plan-features p { margin-bottom: 1.5mm !important; font-size: 8px !important; }
          .plan-features ul { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: .5mm 2mm !important; }
          .plan-features li { font-size: 8px !important; line-height: 1.3 !important; }
          .plan-features li { break-inside: avoid-page !important; page-break-inside: avoid !important; }
          .plan-features svg { width: 10px !important; height: 10px !important; }
          .section-closing { border-radius: 0 !important; gap: 2.5mm !important; padding: 2mm 3.5mm !important; }
          .proposal-composition > .section-closing { margin: 0 0 3mm !important; background: #e0f2fe !important; border: 1px solid #38bdf8 !important; color: #075985 !important; }
          .proposal-composition > .section-closing * { color: #075985 !important; }
          .section-closing strong, .section-closing h3 { font-size: 12.5px !important; line-height: 1.3 !important; }
          .proposal-implementation { margin-top: 4mm !important; break-inside: auto !important; page-break-inside: auto !important; }
          .proposal-implementation > .proposal-section-heading { display: none !important; }
          .proposal-implementation > .proposal-section { border-top-width: 1px !important; }
          .proposal-implementation .section-closing { padding-block: 2.2mm !important; }
          .proposal-implementation .payment-condition { margin-top: 1mm !important; padding: 1.5mm 3mm !important; border: 1px solid #d0d5dd !important; border-radius: 0 !important; background: #f9fafb !important; color: #344054 !important; font-size: 8px !important; }
          .proposal-implementation .payment-condition * { color: #344054 !important; }
          .proposal-section > div > p { padding-block: 1.2mm !important; font-size: 8px !important; line-height: 1.25 !important; }
          .financial-item, .section-closing, .category-total, .category-note, .payment-condition { break-inside: avoid-page !important; page-break-inside: avoid !important; }
          .category-total, .category-note { break-before: avoid-page !important; page-break-before: avoid !important; }
          .proposal-section-heading { break-after: avoid-page !important; page-break-after: avoid !important; }
          .proposal-header { border-bottom: 0 !important; }
          .proposal-header > div { border-color: #0792f1 !important; }
          .proposal-header h1 { font-size: 15px !important; font-weight: 600 !important; }
          .proposal-header p:first-child { color: #075985 !important; font-size: 7px !important; }
          .proposal-summary { margin: 0 6mm 3mm !important; padding: 2.5mm 3.5mm !important; border: 1.5px solid #667085 !important; background: #f2f4f7 !important; }
          .proposal-summary > div { grid-template-columns: 1.3fr 1fr !important; align-items: stretch !important; }
          .proposal-summary .summary-card { padding: 1.5mm 3mm !important; border: 0 !important; border-left: 1mm solid #0792f1 !important; background: transparent !important; }
          .proposal-summary .summary-card:last-of-type { border-left-color: #087f8c !important; }
          .proposal-summary .text-4xl, .proposal-summary .sm\\:text-5xl { font-size: 18px !important; }
          .proposal-summary .text-2xl, .proposal-summary .sm\\:text-3xl { font-size: 16px !important; }
          .proposal-content { padding-top: 0 !important; }
          .proposal-section-heading { padding: 1.5mm 0 1mm !important; border-width: 0 0 1.5px !important; border-color: #344054 !important; background: #fff !important; }
          .proposal-section-heading h2 { color: #101828 !important; font-size: 11px !important; }
          .proposal-section-heading p { color: #475467 !important; }
          .proposal-section { border-width: 0 !important; }
          .proposal-section + .proposal-section { border-top: 0 !important; }
          .proposal-section > header { padding: 1.5mm 0 !important; border-width: 0 !important; background: #fff !important; }
          .proposal-section > header span { height: auto !important; min-width: 0 !important; padding: .7mm 1.5mm !important; border-radius: .5mm !important; background: #e0f2fe !important; color: #075985 !important; }
          .proposal-section > header h3 { color: #101828 !important; }
          .proposal-section > .proposal-category-content { padding-inline: 0 !important; }
          .proposal-category-content { outline: 1px solid #98a2b3 !important; outline-offset: -1px !important; }
          .proposal-category-content > :not(:first-child) { border-top-width: 0 !important; }
          .report-table-heading { display: grid !important; grid-template-columns: minmax(0, 42%) minmax(0, 1fr) 27mm !important; column-gap: 5mm !important; align-items: center !important; padding: 1.8mm 3mm !important; border-top: 1px solid #d0d5dd !important; border-bottom: 1px solid #d0d5dd !important; background: #f2f4f7 !important; color: #344054 !important; }
          .report-table-heading span { font-size: 7px !important; line-height: 1.2 !important; font-weight: 700 !important; color: #344054 !important; }
          .report-table-heading span:last-child { text-align: right !important; }
          .financial-item { margin-top: 0 !important; padding: 2.2mm 3mm !important; border: 0 !important; background: #fff !important; }
          .financial-item:nth-of-type(even) { background: #f9fafb !important; }
          .financial-item + .financial-item { margin-top: 0 !important; border-top: 1px solid #d0d5dd !important; }
          .proposal-plan .financial-item { border-bottom: 1px solid #d0d5dd !important; }
          .proposal-implementation .financial-item { border-bottom: 1px solid #d0d5dd !important; }
          .proposal-implementation .financial-item + .financial-item { border-top: 0 !important; }
          .financial-item-details { display: grid !important; grid-template-columns: minmax(0, 1fr) 27mm !important; column-gap: 5mm !important; }
          .financial-item-details > * { grid-column: 1 / -1 !important; display: grid !important; grid-template-columns: minmax(0, 1fr) 27mm !important; column-gap: 5mm !important; }
          .financial-item-subtotal { border: 0 !important; }
          .category-total { margin-top: 0 !important; padding: 2.2mm 3mm !important; border: 0 !important; border-bottom: 1.5px solid #049df6 !important; background: #e5f7ff !important; color: #0066a3 !important; }
          .category-total * { color: #0066a3 !important; }
          .category-total strong:first-child { margin-left: auto !important; font-size: 8px !important; }
          .category-total strong:last-child { min-width: 27mm !important; text-align: right !important; }
          .category-note { margin-top: 0 !important; padding: 1.5mm 3mm !important; background: #f9fafb !important; }
          .proposal-composition > .section-closing { margin-top: 2mm !important; background: #e0f2fe !important; border-width: 1px 1px 1.5px !important; border-color: #0284c7 !important; }
          .proposal-footer { position: fixed !important; right: 0 !important; bottom: -1mm !important; left: 0 !important; padding: 1.5mm 6mm !important; background: #f2f4f7 !important; border-color: #d0d5dd !important; color: #667085 !important; font-size: 8px !important; }
          @page { size: A4 portrait; margin: 6mm 6mm 12mm; }
        }`}
      </style>

      <div className="proposal-page mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
        <nav
          aria-label="Ações da proposta"
          className="proposal-actions mb-4 flex flex-wrap items-center justify-end gap-2"
        >
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Ativar tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
            className={`${actionClass} w-10 px-0`}
          >
            {theme === 'dark' ? (
              <Sun
                size={17}
                aria-hidden="true"
              />
            ) : (
              <Moon
                size={17}
                aria-hidden="true"
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className={actionClass}
          >
            <Printer
              size={16}
              aria-hidden="true"
            />
            Imprimir ou salvar PDF
          </button>
        </nav>

        <article className="proposal-card overflow-hidden rounded-2xl border border-gray-200 border-t-4 border-t-brand-500 bg-white shadow-xl shadow-brand-950/10 dark:border-gray-700 dark:border-t-brand-400 dark:bg-gray-900 dark:shadow-2xl dark:shadow-black/30">
          <header className="proposal-header flex flex-col gap-5 bg-white px-6 py-6 text-gray-900 dark:bg-gray-900 dark:text-white sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <ThemeBrandIcon
              alt="Infarma Sistemas de Gestão"
              className="h-14 w-14 object-contain"
              lightOnPrint
            />
            <div className="border-l-2 border-brand-500 pl-4 sm:border-l-0 sm:border-r-2 sm:pl-0 sm:pr-4 sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-600 dark:text-brand-400">
                Proposta comercial
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">Conexa</h1>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Emitida em {new Intl.DateTimeFormat('pt-BR').format(new Date())}
              </p>
            </div>
          </header>

          <section
            aria-labelledby="investment-title"
            className="proposal-summary bg-[#162345] px-5 py-7 text-white sm:px-8 sm:py-9"
          >
            <h2
              id="investment-title"
              className="sr-only"
            >
              Resumo do investimento
            </h2>
            <div className="grid gap-7 sm:grid-cols-[1.3fr_1fr] sm:items-end sm:gap-0">
              <div className="summary-card min-w-0 sm:pr-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-300">
                  1 · Mensalidade Infarma
                </p>
                <p className="mt-3 break-words text-4xl font-bold tabular-nums tracking-tight text-white sm:text-5xl">
                  {formatCurrency(totals.infarmaRecurringTotal, currency)}
                </p>
                <p className="mt-3 text-xs text-white/60">
                  Mensalidade Infarma · estimativa da Meta apresentada separadamente
                </p>
              </div>
              <div className="summary-card min-w-0 border-t border-white/15 pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
                  2 · Implantação
                </p>
                {proposal.services.length ? (
                  <>
                    <p className="mt-2 break-words text-2xl font-semibold tabular-nums text-white sm:text-3xl">
                      {formatCurrency(totals.implementationTotal, currency)}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-white/60">
                      Cobrança pontual e separada · {paymentCondition}
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-base font-semibold text-white">
                    Sem custo de implantação
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="proposal-content space-y-12 p-5 sm:p-8">
            <section
              aria-labelledby="monthly-composition-title"
              className="proposal-composition space-y-5"
            >
              <div className="proposal-section-heading flex items-start gap-4 border-b border-gray-200 pb-5 dark:border-gray-700">
                <span className="mt-1 h-10 w-1 shrink-0 rounded-full bg-brand-500" />
                <div>
                  <h2
                    id="monthly-composition-title"
                    className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white/90"
                  >
                    Composição mensal
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Itens que compõem o investimento recorrente.
                  </p>
                </div>
              </div>

              {selectedPlan && (
                <Section
                  title="Plano Conexa"
                  eyebrow="MENSAL"
                  className="proposal-plan"
                >
                  <FinancialItem
                    title={selectedPlan.name}
                    description={selectedPlan.tagline}
                    details={
                      totals.planDiscount > 0 ? (
                        <>
                          <AmountLine
                            label="Mensalidade original"
                            value={formatCurrency(proposal.planValue, currency)}
                          />
                          <AmountLine
                            label="Desconto"
                            value={`− ${formatCurrency(totals.planDiscount, currency)}`}
                            discount
                          />
                        </>
                      ) : (
                        <AmountLine
                          label="Sem desconto"
                          value={formatCurrency(totals.discountedPlan, currency)}
                        />
                      )
                    }
                    total={formatCurrency(totals.discountedPlan, currency)}
                    showTotal={false}
                  />
                  {selectedPlan.features.length > 0 && (
                    <div className="plan-features py-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Recursos incluídos
                      </p>
                      <ul className="grid gap-x-8 gap-y-2 lg:grid-cols-2">
                        {selectedPlan.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex min-w-0 items-start gap-2 text-xs leading-5 text-gray-600 dark:text-gray-300"
                          >
                            <Check
                              size={14}
                              aria-hidden="true"
                              className="mt-0.5 shrink-0 text-success-600 dark:text-success-400"
                            />
                            <span className="break-words">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <GroupTotal
                    label="Total mensal do plano"
                    value={formatCurrency(totals.discountedPlan, currency)}
                  />
                </Section>
              )}

              {templates.length > 0 && (
                <Section
                  title="Estimativa Meta"
                  eyebrow="ESTIMATIVA"
                  className="proposal-meta"
                >
                  {templates.map((item) => (
                    <FinancialItem
                      key={item.id}
                      title={item.category}
                      details={
                        <AmountLine
                          label={`${item.quantity} template${item.quantity === 1 ? '' : 's'} × ${formatCurrency(item.value, currency)}`}
                          value={formatCurrency(item.quantity * item.value, currency)}
                        />
                      }
                      totalLabel="Total estimado"
                      total={formatCurrency(item.quantity * item.value, currency)}
                    />
                  ))}
                  <GroupTotal
                    label="Estimativa Meta"
                    value={formatCurrency(totals.meta, currency)}
                  />
                  <p className="category-note py-3 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    Esta é uma estimativa baseada no volume informado. O valor não está incluso na
                    mensalidade Infarma e pode variar conforme o uso e a tabela vigente da Meta.
                  </p>
                </Section>
              )}

              {proposal.resources.length > 0 && (
                <Section
                  title="Produtos adicionais"
                  eyebrow="MENSAL"
                  className="proposal-resources"
                >
                  {proposal.resources.map((item) => {
                    const gross = item.value * item.quantity;
                    const discount = calculateDiscount(
                      gross,
                      item.discountType,
                      item.discountValue,
                    );
                    return (
                      <FinancialItem
                        key={item.id}
                        title={item.name || 'Produto adicional'}
                        details={
                          <>
                            <AmountLine
                              label={`${item.quantity} unidade${item.quantity === 1 ? '' : 's'} × ${formatCurrency(item.value, currency)}`}
                              value={formatCurrency(gross, currency)}
                            />
                            {discount > 0 && (
                              <AmountLine
                                label="Desconto"
                                value={`− ${formatCurrency(discount, currency)}`}
                                discount
                              />
                            )}
                          </>
                        }
                        total={formatCurrency(gross - discount, currency)}
                      />
                    );
                  })}
                  <GroupTotal
                    label="Total de produtos adicionais"
                    value={formatCurrency(totals.resources, currency)}
                  />
                </Section>
              )}

              <div className="section-closing flex flex-col gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-6 py-6 text-brand-950 sm:flex-row sm:items-end sm:justify-between dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-white">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
                    Fechamento mensal
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">Mensalidade Infarma</h3>
                </div>
                <strong className="break-words text-3xl tabular-nums tracking-tight text-brand-700 dark:text-brand-400">
                  {formatCurrency(totals.infarmaRecurringTotal, currency)}
                </strong>
              </div>
            </section>

            {proposal.services.length > 0 && (
              <section
                aria-labelledby="implementation-title"
                className="proposal-implementation space-y-4"
              >
                <div className="proposal-section-heading flex items-start gap-4 border-b border-gray-200 pb-5 dark:border-gray-700">
                  <span className="mt-1 h-10 w-1 shrink-0 rounded-full bg-[#087f8c]" />
                  <div>
                    <h2
                      id="implementation-title"
                      className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white/90"
                    >
                      Implantação
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Serviços pontuais, cobrados separadamente da mensalidade.
                    </p>
                  </div>
                </div>
                <Section
                  title="Serviços de implantação"
                  eyebrow="PONTUAL"
                >
                  {proposal.services.map((item) => {
                    const discount = calculateDiscount(
                      item.value,
                      item.discountType,
                      item.discountValue,
                    );
                    return (
                      <FinancialItem
                        key={item.id}
                        title={item.name || 'Implantação'}
                        details={
                          <>
                            <AmountLine
                              label="Valor antes do desconto"
                              value={formatCurrency(item.value, currency)}
                            />
                            {discount > 0 && (
                              <AmountLine
                                label="Desconto"
                                value={`− ${formatCurrency(discount, currency)}`}
                                discount
                              />
                            )}
                          </>
                        }
                        total={formatCurrency(item.value - discount, currency)}
                      />
                    );
                  })}
                  <GroupTotal
                    label="Total da implantação"
                    value={formatCurrency(totals.implementationTotal, currency)}
                  />
                  <div className="payment-condition mt-1 flex flex-col gap-1 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:bg-gray-800/60 dark:text-gray-300 sm:flex-row sm:items-center sm:justify-between">
                    <span>Condição de pagamento</span>
                    <strong className="tabular-nums text-gray-900 dark:text-white/90">
                      {paymentCondition}
                    </strong>
                  </div>
                </Section>
              </section>
            )}
          </div>

          <footer className="proposal-footer flex flex-col gap-1 border-t border-gray-200 bg-gray-50 px-7 py-5 text-center text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-950/80 dark:text-gray-400 sm:flex-row sm:justify-between sm:text-left">
            <span>Proposta comercial gerada pela Infarma Sistemas de Gestão.</span>
            <span className="proposal-currency-note">Valores apresentados em {currency}.</span>
          </footer>
        </article>
      </div>
    </main>
  );
}
