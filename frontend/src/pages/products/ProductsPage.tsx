import { Check, PackageOpen, Plus, Rocket, SlidersHorizontal, Sparkles, Trash2 } from 'lucide-react';
import { AnimatedSelect, CalculatorCard, CalculatorShell, CurrencyInput, PageHeading } from '../../components/calculator-ui';
import { DiscountFields } from '../../components/discount-fields';
import { commercialCatalog } from '../../lib/commercial-catalog';
import { formatCurrency, type CurrencyCode } from '../../lib/currency';
import { ui } from '../../lib/ui';
import { useCalculator } from '../../store/calculator.store';

const sectionLinks = [
  { href: '#plano', label: 'Plano', icon: PackageOpen },
  { href: '#produtos', label: 'Produtos adicionais', icon: SlidersHorizontal },
  { href: '#servicos', label: 'Implantação', icon: Rocket },
];

type Plan = (typeof commercialCatalog.plans)[number];

function PlanCard({ plan, selected, currency, onSelect }: { plan: Plan; selected: boolean; currency: CurrencyCode; onSelect: () => void }) {
  return <button type="button" onClick={onSelect} className={`relative flex h-full flex-col rounded-xl border p-5 text-left transition-all duration-200 ${selected ? 'border-brand-500 bg-brand-50 shadow-theme-sm ring-1 ring-brand-500/20 dark:bg-brand-500/10' : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-theme-sm dark:border-gray-800 dark:bg-gray-900'}`}>
    {plan.featured && <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-semibold text-white"><Sparkles size={11} />Mais escolhido</span>}
    <span className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg ${selected ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300'}`}><PackageOpen size={18} /></span>
    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h4>
    <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">{plan.tagline}</p>
    <div className="my-5 border-y border-gray-100 py-4 dark:border-gray-800">{plan.value > 0 ? <><strong className="text-2xl text-gray-900 dark:text-white">{formatCurrency(plan.value, currency)}</strong><span className="ml-1 text-xs text-gray-400">/mês</span></> : <strong className="text-xl text-gray-900 dark:text-white">Sob consulta</strong>}</div>
    <ul className="flex-1 space-y-2.5">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-xs text-gray-600 dark:text-gray-300"><Check size={14} className="mt-0.5 shrink-0 text-brand-500" />{feature}</li>)}</ul>
    <span className={`mt-5 inline-flex items-center gap-2 text-xs font-semibold ${selected ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'}`}><i className={`h-3.5 w-3.5 rounded-full border-2 ${selected ? 'border-brand-500 bg-brand-500 shadow-[inset_0_0_0_3px_white]' : 'border-gray-300 dark:border-gray-600'}`} />{selected ? 'Plano selecionado' : 'Selecionar plano'}</span>
  </button>;
}
export function ProductsPage() {
  const store = useCalculator();
  return <CalculatorShell><CalculatorCard><PageHeading title="Proposta Conexa" description="Escolha o plano e configure produtos, implantação e descontos em uma única tela." />
    <div className="sticky top-[72px] z-10 flex gap-2 overflow-x-auto border-b border-gray-100 bg-white/95 px-5 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 md:px-6">{sectionLinks.map(({ href, label, icon: Icon }) => <a key={href} href={href} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-brand-500/10"><Icon size={16} />{label}</a>)}</div>
    <div className="space-y-8 p-5 md:p-6">
      <section id="plano" className="scroll-mt-36">
        <div className="mb-5"><h3 className="font-semibold text-gray-900 dark:text-white/90">Planos Conexa</h3><p className="mt-1 text-xs text-gray-400">O Conexa cresce com o seu negócio. Escolha um plano e personalize a proposta quando necessário.</p></div>
        <div className="grid gap-4 lg:grid-cols-3">{commercialCatalog.plans.map((plan) => <PlanCard key={plan.id} plan={plan} selected={store.selectedPlanId === plan.id} currency={store.currency} onSelect={() => store.selectPlan(plan.id)} />)}</div>
        <div className="mt-5 grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02] md:grid-cols-2"><div><label className={ui.label}>Plano selecionado</label><AnimatedSelect value={store.selectedPlanId} onChange={(event) => store.selectPlan(event.target.value)}>{commercialCatalog.plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}</AnimatedSelect></div><div><label className={ui.label}>Valor mensal da proposta</label><CurrencyInput label="Valor mensal do plano" value={store.planValue} onChange={store.setPlanValue} /></div><div className="md:col-span-2"><DiscountFields title="Desconto do plano mensal" type={store.planDiscountType} value={store.planDiscountValue} currency={store.currency} onTypeChange={store.setPlanDiscountType} onValueChange={store.setPlanDiscountValue} /></div></div>
      </section>

      <section id="produtos" className="scroll-mt-36 border-t border-gray-100 pt-7 dark:border-gray-800">
        <div className="mb-4 flex items-center justify-between gap-4"><div><h3 className="font-semibold text-gray-900 dark:text-white/90">Produtos adicionais</h3><p className="mt-1 text-xs text-gray-400">Adicione produtos e defina valores e descontos individualmente.</p></div><button type="button" onClick={store.addResource} className={ui.compactCreateButton}><Plus size={16} className="shrink-0" />Adicionar produto</button></div>
        <div className="space-y-4">{store.resources.map((resource) => <div key={resource.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"><div className="grid items-center gap-3 sm:grid-cols-[1fr_1fr_36px]"><input className={ui.input} aria-label="Nome do produto" placeholder="Nome do produto" value={resource.name} onChange={(event) => store.updateResource({ ...resource, name: event.target.value })} /><CurrencyInput label={`Valor de ${resource.name || 'produto'}`} value={resource.value} onChange={(value) => store.updateResource({ ...resource, value })} /><button type="button" aria-label={`Excluir ${resource.name || 'produto'}`} onClick={() => store.removeResource(resource.id)} className={ui.dangerIconButton}><Trash2 size={17} /></button></div><div className="mt-3"><DiscountFields title={`Desconto de ${resource.name || 'produto'}`} type={resource.discountType} value={resource.discountValue} currency={store.currency} onTypeChange={(discountType) => store.updateResource({ ...resource, discountType, discountValue: 0 })} onValueChange={(discountValue) => store.updateResource({ ...resource, discountValue })} /></div></div>)}{!store.resources.length && <p className="rounded-xl border border-dashed border-gray-200 py-6 text-center text-xs text-gray-400 dark:border-gray-800">Nenhum produto adicionado</p>}</div>
      </section>

      <section id="servicos" className="scroll-mt-36 border-t border-gray-100 pt-7 dark:border-gray-800"><div className="mb-4 flex items-center justify-between gap-4"><div><h3 className="font-semibold text-gray-900 dark:text-white/90">Implantação</h3><p className="mt-1 text-xs text-gray-400">Adicione os itens de implantação, treinamento, Setup ou configuração.</p></div><button type="button" onClick={store.addService} className={ui.compactCreateButton}><Plus size={16} className="shrink-0" />Adicionar implantação</button></div><div className="space-y-4">{store.services.map((service) => <div key={service.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"><div className="grid gap-3 sm:grid-cols-[1fr_1fr_36px]"><input className={ui.input} aria-label="Nome da implantação" placeholder="Ex.: Implantação, treinamento ou Setup" value={service.name} onChange={(event) => store.updateService({ ...service, name: event.target.value })} /><CurrencyInput label={`Valor de ${service.name || 'implantação'}`} value={service.value} onChange={(value) => store.updateService({ ...service, value })} /><button type="button" aria-label={`Excluir ${service.name}`} onClick={() => store.removeService(service.id)} className={ui.dangerIconButton}><Trash2 size={17} /></button></div><div className="mt-3"><DiscountFields title={`Desconto de ${service.name || 'implantação'}`} type={service.discountType} value={service.discountValue} currency={store.currency} onTypeChange={(discountType) => store.updateService({ ...service, discountType, discountValue: 0 })} onValueChange={(discountValue) => store.updateService({ ...service, discountValue })} /></div></div>)}{!store.services.length && <p className="rounded-xl border border-dashed border-gray-200 py-6 text-center text-xs text-gray-400 dark:border-gray-800">Nenhuma implantação adicionada</p>}</div></section>
    </div>
  </CalculatorCard></CalculatorShell>;
}









