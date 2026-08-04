import { useMemo, useState, type ReactNode } from 'react';
import { Check, Copy, Moon, Printer, Share2, Sun } from 'lucide-react';
import { commercialCatalog } from '../../lib/commercial-catalog';
import { formatCurrency } from '../../lib/currency';
import { readProposalSnapshot } from '../../services/proposal.service';
import { calculateDiscount, calculateTotals } from '../../services/calculator.service';
import { useTheme } from '../../store/theme.store';

const actionClass =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:focus-visible:ring-offset-gray-950';

function Section({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="proposal-section overflow-hidden rounded-2xl bg-gray-50/80 ring-1 ring-gray-200 shadow-sm shadow-gray-200/40 dark:bg-gray-950/50 dark:ring-gray-700 dark:shadow-none">
      <header className="flex items-center gap-3 border-b border-gray-200 bg-white/90 px-5 py-4 dark:border-gray-700 dark:bg-gray-900/90 sm:px-6">
        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-brand-50 px-2 text-[10px] font-bold tracking-wider text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
          {eyebrow}
        </span>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white/90">
          {title}
        </h3>
      </header>
      <div className="divide-y divide-gray-100 px-5 dark:divide-gray-800 sm:px-6">{children}</div>
    </section>
  );
}

function FinancialItem({
  title,
  description,
  details,
  totalLabel = 'Subtotal líquido',
  total,
}: {
  title: string;
  description?: string;
  details: ReactNode;
  totalLabel?: string;
  total: string;
}) {
  return (
    <div className="financial-item grid gap-3 py-5 md:grid-cols-[minmax(0,1fr)_minmax(15rem,auto)] md:gap-8">
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
      <div className="min-w-0 space-y-1.5 text-sm md:text-right">
        {details}
        <div className="flex items-baseline justify-between gap-4 pt-1 font-semibold text-gray-900 md:justify-end dark:text-white/90">
          <span className="text-xs text-gray-500 dark:text-gray-400">{totalLabel}</span>
          <span className="tabular-nums">{total}</span>
        </div>
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
      className={`flex items-baseline justify-between gap-4 md:justify-end ${
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
      className={`section-closing flex items-center justify-between gap-5 py-4 ${
        prominent ? 'text-brand-700 dark:text-brand-400' : 'text-gray-900 dark:text-white/90'
      }`}
    >
      <strong className="text-sm">{label}</strong>
      <strong className={`${prominent ? 'text-xl' : 'text-base'} tabular-nums`}>{value}</strong>
    </div>
  );
}

export function ProposalPreviewPage() {
  const proposal = useMemo(() => readProposalSnapshot(), []);
  const [actionMessage, setActionMessage] = useState('');
  const { theme, toggleTheme } = useTheme();

  if (!proposal)
    return (
      <main className="grid min-h-screen place-items-center bg-gray-50 p-6 dark:bg-gray-950">
        <div className="max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <img
            src="/logo-infarma.png"
            alt="Infarma"
            className="mx-auto h-16 w-auto dark:brightness-0 dark:invert"
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

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setActionMessage('Link copiado');
    } catch {
      setActionMessage('Não foi possível copiar o link');
    }
    window.setTimeout(() => setActionMessage(''), 2000);
  };

  const share = async () => {
    if (!navigator.share) {
      await copyLink();
      return;
    }

    try {
      await navigator.share({
        title: 'Proposta Comercial Conexa',
        text: 'Confira a proposta comercial Conexa.',
        url: window.location.href,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      await copyLink();
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-b from-brand-50/60 via-gray-50 to-gray-100 text-gray-900 transition-colors dark:from-gray-950 dark:via-[#111827] dark:to-gray-950 dark:text-white/90">
      <style>
        {`@media print {
          html, body { width: 100%; height: 100%; background: #fff !important; }
          body { margin: 0 !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .proposal-actions { display: none !important; }
          .proposal-page { width: 100% !important; max-width: none !important; padding: 0 !important; }
          .proposal-card, .proposal-section { background: #fff !important; color: #101828 !important; box-shadow: none !important; }
          .proposal-card { border: 0 !important; border-radius: 0 !important; }
          .proposal-section { border-color: #d0d5dd !important; }
          .proposal-section *, .proposal-summary * { border-color: #e4e7ec !important; color: #344054 !important; }
          .proposal-header { min-height: 0 !important; padding: 3mm 5mm !important; background: #fff !important; border-bottom: 1px solid #d0d5dd !important; color: #101828 !important; }
          .proposal-header img { width: 28mm !important; height: 9mm !important; }
          .proposal-header img { filter: none !important; }
          .proposal-header * { color: #344054 !important; }
          .proposal-header h1 { margin-top: 0 !important; font-size: 16px !important; line-height: 1.1 !important; }
          .proposal-summary { padding: 3mm 5mm !important; background: #f2f4f7 !important; }
          .proposal-summary > div { gap: 4mm !important; }
          .proposal-summary p { margin-top: 1mm !important; font-size: 8px !important; line-height: 1.25 !important; }
          .proposal-summary .text-4xl, .proposal-summary .sm\\:text-5xl { font-size: 22px !important; }
          .proposal-summary .text-2xl, .proposal-summary .sm\\:text-3xl { font-size: 16px !important; }
          .summary-card { background: #fff !important; break-inside: avoid; page-break-inside: avoid; }
          .proposal-content { display: grid !important; grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); align-items: start; gap: 3mm !important; padding: 3mm 5mm !important; }
          .proposal-content > .proposal-composition:only-child { grid-column: 1 / -1; }
          .proposal-composition { display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: 2.5mm !important; }
          .proposal-section-heading, .proposal-composition > .section-closing { grid-column: 1 / -1; }
          .proposal-section-heading { gap: 2mm !important; padding-bottom: 1.5mm !important; }
          .proposal-section-heading span { height: 7mm !important; }
          .proposal-section-heading h2 { font-size: 14px !important; line-height: 1.15 !important; }
          .proposal-section-heading p { margin-top: .5mm !important; font-size: 8px !important; }
          .proposal-section { border-radius: 2mm !important; }
          .proposal-section header { gap: 1.5mm !important; padding: 1.5mm 2mm !important; }
          .proposal-section header span { height: 5mm !important; min-width: 5mm !important; font-size: 7px !important; }
          .proposal-section header h3 { font-size: 8px !important; }
          .proposal-section > div { padding-inline: 2mm !important; }
          .financial-item { display: grid !important; grid-template-columns: minmax(0, 1fr) auto !important; gap: 2mm !important; padding-block: 1.5mm !important; }
          .financial-item h4, .financial-item div { font-size: 8px !important; line-height: 1.2 !important; }
          .financial-item p, .financial-item span { margin-top: .5mm !important; font-size: 7px !important; line-height: 1.2 !important; }
          .plan-features { padding-block: 1.5mm !important; }
          .plan-features p { margin-bottom: 1mm !important; font-size: 7px !important; }
          .plan-features ul { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: .5mm 2mm !important; }
          .plan-features li { font-size: 7px !important; line-height: 1.2 !important; }
          .plan-features svg { width: 9px !important; height: 9px !important; }
          .section-closing { gap: 2mm !important; padding: 1.5mm 2mm !important; }
          .section-closing strong, .section-closing h3 { font-size: 10px !important; }
          .proposal-implementation { display: grid !important; gap: 2mm !important; }
          .proposal-implementation .section-closing { padding-block: 1mm !important; }
          .proposal-implementation .section-closing div { margin-top: 1mm !important; padding: 1.5mm 2mm !important; font-size: 7px !important; }
          .proposal-section > div > p { padding-block: 1.5mm !important; font-size: 7px !important; line-height: 1.25 !important; }
          .financial-item, .section-closing { break-inside: avoid; page-break-inside: avoid; }
          .proposal-section { break-inside: avoid; page-break-inside: avoid; }
          .proposal-footer { padding: 1.5mm 5mm !important; font-size: 7px !important; }
          @page { size: A4 landscape; margin: 7mm; }
        }`}
      </style>

      <div className="proposal-page mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
        <nav
          aria-label="Ações da proposta"
          className="proposal-actions mb-4 flex flex-wrap items-center justify-end gap-2"
        >
          <p
            aria-live="polite"
            className="mr-auto min-h-5 text-xs text-gray-500 dark:text-gray-400"
          >
            {actionMessage}
          </p>
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
            onClick={copyLink}
            className={actionClass}
          >
            {actionMessage === 'Link copiado' ? (
              <Check
                size={16}
                aria-hidden="true"
              />
            ) : (
              <Copy
                size={16}
                aria-hidden="true"
              />
            )}
            {actionMessage === 'Link copiado' ? 'Link copiado' : 'Copiar link'}
          </button>
          <button
            type="button"
            onClick={share}
            className={actionClass}
          >
            <Share2
              size={16}
              aria-hidden="true"
            />
            Compartilhar
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className={`${actionClass} border-brand-500 bg-brand-500 font-semibold text-white hover:bg-brand-600 dark:border-brand-500 dark:bg-brand-500 dark:text-white`}
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
            <img
              src="/logo-infarma.png"
              alt="Infarma Sistemas de Gestão"
              className="h-12 w-36 object-contain object-left dark:brightness-0 dark:invert"
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
                  Investimento mensal
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
                  Implantação
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
                  eyebrow="01"
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
                      ) : null
                    }
                    totalLabel="Mensalidade líquida"
                    total={formatCurrency(totals.discountedPlan, currency)}
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
                </Section>
              )}

              {templates.length > 0 && (
                <Section
                  title="Custos da Meta"
                  eyebrow={selectedPlan ? '02' : '01'}
                >
                  {templates.map((item) => (
                    <FinancialItem
                      key={item.id}
                      title={item.category}
                      description={`${item.quantity} template${item.quantity === 1 ? '' : 's'} × ${formatCurrency(item.value, currency)} por unidade`}
                      details={null}
                      totalLabel="Subtotal"
                      total={formatCurrency(item.quantity * item.value, currency)}
                    />
                  ))}
                  <GroupTotal
                    label="Estimativa de custo da Meta"
                    value={formatCurrency(totals.meta, currency)}
                  />
                  <p className="py-3 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    Esta é uma estimativa baseada no volume informado. O valor não está incluso na
                    mensalidade Infarma e pode variar conforme o uso e a tabela vigente da Meta.
                  </p>
                </Section>
              )}

              {proposal.resources.length > 0 && (
                <Section
                  title="Produtos adicionais"
                  eyebrow={
                    selectedPlan ? (templates.length ? '03' : '02') : templates.length ? '02' : '01'
                  }
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
                              label="Valor bruto"
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
                  <div className="section-closing py-5">
                    <GroupTotal
                      label="Total da implantação"
                      value={formatCurrency(totals.implementationTotal, currency)}
                      prominent
                    />
                    <div className="mt-1 flex flex-col gap-1 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:bg-gray-800/60 dark:text-gray-300 sm:flex-row sm:items-center sm:justify-between">
                      <span>Condição de pagamento</span>
                      <strong className="tabular-nums text-gray-900 dark:text-white/90">
                        {paymentCondition}
                      </strong>
                    </div>
                  </div>
                </Section>
              </section>
            )}
          </div>

          <footer className="proposal-footer flex flex-col gap-1 border-t border-gray-200 bg-gray-50 px-7 py-5 text-center text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-950/80 dark:text-gray-400 sm:flex-row sm:justify-between sm:text-left">
            <span>Proposta comercial gerada pela Infarma Sistemas de Gestão.</span>
            <span>Valores apresentados em {currency}.</span>
          </footer>
        </article>
      </div>
    </main>
  );
}
