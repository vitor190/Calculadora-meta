import {
  Check,
  PackageOpen,
  Plus,
  Rocket,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  AnimatedSelect,
  CalculatorCard,
  CalculatorShell,
  CurrencyInput,
  NumberInput,
  PageHeading,
} from '../../components/calculator-ui';
import { DiscountFields } from '../../components/discount-fields';
import { commercialCatalog } from '../../lib/commercial-catalog';
import { formatCurrency, type CurrencyCode } from '../../lib/currency';
import { ui } from '../../lib/ui';
import { useCalculator } from '../../store/calculator.store';
import type { ExtraService, ProposalItem } from '../../types/calculator.types';

const sectionLinks = [
  { href: '#plano', label: 'Plano', icon: PackageOpen },
  { href: '#produtos', label: 'Produtos adicionais', icon: SlidersHorizontal },
  { href: '#servicos', label: 'Implantação', icon: Rocket },
];

type Plan = (typeof commercialCatalog.plans)[number];

function PlanCard({
  plan,
  selected,
  currency,
  onSelect,
}: {
  plan: Plan;
  selected: boolean;
  currency: CurrencyCode;
  onSelect: () => void;
}) {
  const cardClass = selected
    ? 'border-brand-500 bg-brand-50 shadow-theme-sm ring-1 ring-brand-500/20 dark:bg-brand-500/10'
    : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-theme-sm dark:border-gray-800 dark:bg-gray-900';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex h-full flex-col rounded-xl border p-5 text-left transition-all duration-200 ${cardClass}`}
    >
      {plan.featured && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-semibold text-white">
          <Sparkles size={11} />
          Mais escolhido
        </span>
      )}
      <span
        className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg ${selected ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300'}`}
      >
        <PackageOpen size={18} />
      </span>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h4>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">
        {plan.tagline}
      </p>
      <div className="my-5 border-y border-gray-100 py-4 dark:border-gray-800">
        {plan.value > 0 ? (
          <>
            <strong className="text-2xl text-gray-900 dark:text-white">
              {formatCurrency(plan.value, currency)}
            </strong>
            <span className="ml-1 text-xs text-gray-400">/mês</span>
          </>
        ) : (
          <strong className="text-xl text-gray-900 dark:text-white">Sob consulta</strong>
        )}
      </div>
      <ul className="flex-1 space-y-2.5">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex gap-2 text-xs text-gray-600 dark:text-gray-300"
          >
            <Check
              size={14}
              className="mt-0.5 shrink-0 text-brand-500"
            />
            {feature}
          </li>
        ))}
      </ul>
      <span
        className={`mt-5 inline-flex items-center gap-2 text-xs font-semibold ${selected ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'}`}
      >
        <span
          className={`h-3.5 w-3.5 rounded-full border-2 ${selected ? 'border-brand-500 bg-brand-500 shadow-[inset_0_0_0_3px_white]' : 'border-gray-300 dark:border-gray-600'}`}
        />
        {selected ? 'Plano selecionado' : 'Selecionar plano'}
      </span>
    </button>
  );
}

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white/90">{title}</h3>
        <p className="mt-1 text-xs text-gray-400">{description}</p>
      </div>
      {action}
    </div>
  );
}

function ProductCard({
  item,
  currency,
  onChange,
  onRemove,
}: {
  item: ProposalItem;
  currency: CurrencyCode;
  onChange: (item: ProposalItem) => void;
  onRemove: () => void;
}) {
  const name = item.name || 'produto';
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="grid items-center gap-3 sm:grid-cols-[1fr_1fr_140px_36px]">
        <input
          className={ui.input}
          aria-label="Nome do produto"
          placeholder="Nome do produto"
          value={item.name}
          onChange={(event) => onChange({ ...item, name: event.target.value })}
        />
        <CurrencyInput
          label={`Valor de ${name}`}
          value={item.value}
          onChange={(value) => onChange({ ...item, value })}
        />
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Qtd.
          </span>
          <NumberInput
            label={`Quantidade de ${name}`}
            className="pl-12 text-center"
            integer
            min={1}
            zeroPlaceholder
            value={item.quantity}
            onChange={(quantity) => onChange({ ...item, quantity })}
          />
        </div>
        <button
          type="button"
          aria-label={`Excluir ${name}`}
          onClick={onRemove}
          className={ui.dangerIconButton}
        >
          <Trash2 size={17} />
        </button>
      </div>
      <div className="mt-3">
        <DiscountFields
          title={`Desconto de ${name}`}
          type={item.discountType}
          value={item.discountValue}
          currency={currency}
          onTypeChange={(discountType) => onChange({ ...item, discountType, discountValue: 0 })}
          onValueChange={(discountValue) => onChange({ ...item, discountValue })}
        />
      </div>
    </div>
  );
}

function ImplementationCard({
  item,
  currency,
  onChange,
  onRemove,
}: {
  item: ExtraService;
  currency: CurrencyCode;
  onChange: (item: ExtraService) => void;
  onRemove: () => void;
}) {
  const name = item.name || 'implantação';
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_36px]">
        <input
          className={ui.input}
          aria-label="Nome da implantação"
          placeholder="Ex.: Implantação, treinamento ou Setup"
          value={item.name}
          onChange={(event) => onChange({ ...item, name: event.target.value })}
        />
        <CurrencyInput
          label={`Valor de ${name}`}
          value={item.value}
          onChange={(value) => onChange({ ...item, value })}
        />
        <button
          type="button"
          aria-label={`Excluir ${name}`}
          onClick={onRemove}
          className={ui.dangerIconButton}
        >
          <Trash2 size={17} />
        </button>
      </div>
      <div className="mt-3">
        <DiscountFields
          title={`Desconto de ${name}`}
          type={item.discountType}
          value={item.discountValue}
          currency={currency}
          onTypeChange={(discountType) => onChange({ ...item, discountType, discountValue: 0 })}
          onValueChange={(discountValue) => onChange({ ...item, discountValue })}
        />
      </div>
    </div>
  );
}

export function ProductsPage() {
  const store = useCalculator();

  return (
    <CalculatorShell>
      <CalculatorCard>
        <PageHeading
          title="Proposta Conexa"
          description="Escolha o plano e configure produtos, implantação e descontos em uma única tela."
        />
        <nav
          className="sticky top-[72px] z-10 flex gap-2 overflow-x-auto border-b border-gray-100 bg-white/95 px-5 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 md:px-6"
          aria-label="Seções da proposta"
        >
          {sectionLinks.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-brand-500/10"
            >
              <Icon size={16} />
              {label}
            </a>
          ))}
        </nav>

        <div className="space-y-8 p-5 md:p-6">
          <section
            id="plano"
            className="scroll-mt-36"
          >
            <div className="mb-5">
              <h3 className="font-semibold text-gray-900 dark:text-white/90">Planos Conexa</h3>
              <p className="mt-1 text-xs text-gray-400">
                O Conexa cresce com o seu negócio. Escolha um plano e personalize a proposta quando
                necessário.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {commercialCatalog.plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  selected={store.selectedPlanId === plan.id}
                  currency={store.currency}
                  onSelect={() => store.selectPlan(plan.id)}
                />
              ))}
            </div>
            <div className="mt-5 grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02] md:grid-cols-2">
              <div>
                <label className={ui.label}>Plano selecionado</label>
                <AnimatedSelect
                  value={store.selectedPlanId}
                  onChange={(event) => store.selectPlan(event.target.value)}
                >
                  <option
                    value=""
                    disabled
                  >
                    Selecione um plano
                  </option>
                  {commercialCatalog.plans.map((plan) => (
                    <option
                      key={plan.id}
                      value={plan.id}
                    >
                      {plan.name}
                    </option>
                  ))}
                </AnimatedSelect>
              </div>
              <div>
                <label className={ui.label}>Valor mensal da proposta</label>
                <CurrencyInput
                  label="Valor mensal do plano"
                  value={store.planValue}
                  onChange={store.setPlanValue}
                />
              </div>
              <div className="md:col-span-2">
                <DiscountFields
                  title="Desconto do plano mensal"
                  type={store.planDiscountType}
                  value={store.planDiscountValue}
                  currency={store.currency}
                  onTypeChange={store.setPlanDiscountType}
                  onValueChange={store.setPlanDiscountValue}
                />
              </div>
            </div>
          </section>

          <section
            id="produtos"
            className="scroll-mt-36 border-t border-gray-100 pt-7 dark:border-gray-800"
          >
            <SectionHeader
              title="Produtos adicionais"
              description="Adicione produtos e defina valores e descontos individualmente."
              action={
                <button
                  type="button"
                  onClick={store.addResource}
                  className={ui.compactCreateButton}
                >
                  <Plus size={16} />
                  Adicionar produto
                </button>
              }
            />
            <div className="space-y-4">
              {store.resources.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  currency={store.currency}
                  onChange={store.updateResource}
                  onRemove={() => store.removeResource(item.id)}
                />
              ))}
              {store.resources.length === 0 && (
                <p className="rounded-xl border border-dashed border-gray-200 py-6 text-center text-xs text-gray-400 dark:border-gray-800">
                  Nenhum produto adicionado
                </p>
              )}
            </div>
          </section>

          <section
            id="servicos"
            className="scroll-mt-36 border-t border-gray-100 pt-7 dark:border-gray-800"
          >
            <SectionHeader
              title="Implantação"
              description="Adicione itens de implantação, treinamento, Setup ou configuração."
              action={
                <button
                  type="button"
                  onClick={store.addService}
                  className={ui.compactCreateButton}
                >
                  <Plus size={16} />
                  Adicionar implantação
                </button>
              }
            />
            <div className="space-y-4">
              {store.services.map((item) => (
                <ImplementationCard
                  key={item.id}
                  item={item}
                  currency={store.currency}
                  onChange={store.updateService}
                  onRemove={() => store.removeService(item.id)}
                />
              ))}
              {store.services.length === 0 && (
                <p className="rounded-xl border border-dashed border-gray-200 py-6 text-center text-xs text-gray-400 dark:border-gray-800">
                  Nenhuma implantação adicionada
                </p>
              )}
            </div>
            {store.services.length > 0 && (
              <div className="mt-5 border-t border-gray-100 pt-5 dark:border-gray-800">
                <div className="sm:max-w-sm">
                  <label className={ui.label}>Parcelamento total da implantação</label>
                  <AnimatedSelect
                    aria-label="Parcelamento total da implantação"
                    value={store.implementationInstallments}
                    onChange={(event) =>
                      store.setImplementationInstallments(Number(event.target.value))
                    }
                  >
                    {[1, 2, 3, 4, 5].map((installment) => (
                      <option
                        key={installment}
                        value={installment}
                      >
                        {installment}x
                      </option>
                    ))}
                  </AnimatedSelect>
                  <p className="mt-2 text-xs text-gray-400">
                    Aplicado ao valor total de todas as implantações.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </CalculatorCard>
    </CalculatorShell>
  );
}
