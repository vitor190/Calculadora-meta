import { PackageOpen, Plus, Rocket, SlidersHorizontal, Trash2 } from 'lucide-react';
import { AnimatedSelect, CalculatorCard, CalculatorShell, CurrencyInput, PageHeading } from '../../components/calculator-ui';
import { DiscountFields } from '../../components/discount-fields';
import { commercialCatalog } from '../../lib/commercial-catalog';
import { ui } from '../../lib/ui';
import { useCalculator } from '../../store/calculator.store';

const sectionLinks = [
  { href: '#plano', label: 'Plano', icon: PackageOpen },
  { href: '#recursos', label: 'Recursos adicionais', icon: SlidersHorizontal },
  { href: '#servicos', label: 'Serviços extras', icon: Rocket },
];

export function ProductsPage() {
  const store = useCalculator();
  return <CalculatorShell><CalculatorCard><PageHeading title="Proposta Conexa" description="Escolha o plano e configure recursos, serviços e descontos em uma única tela." />
    <div className="sticky top-[72px] z-10 flex gap-2 overflow-x-auto border-b border-gray-100 bg-white/95 px-5 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 md:px-6">{sectionLinks.map(({ href, label, icon: Icon }) => <a key={href} href={href} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-brand-500/10"><Icon size={16} />{label}</a>)}</div>
    <div className="space-y-8 p-5 md:p-6">
      <section id="plano" className="scroll-mt-36"><div className="mb-4"><h3 className="font-semibold text-gray-900 dark:text-white/90">Plano mensal</h3><p className="mt-1 text-xs text-gray-400">Selecione um plano e informe manualmente o valor mensal.</p></div><div className="grid gap-4 md:grid-cols-2"><div><label className={ui.label}>Plano</label><AnimatedSelect value={store.selectedPlanId} onChange={(event) => store.selectPlan(event.target.value)}>{commercialCatalog.plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}</AnimatedSelect></div><div><label className={ui.label}>Valor mensal</label><CurrencyInput label="Valor mensal do plano" value={store.planValue} onChange={store.setPlanValue} /></div></div><div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02]"><DiscountFields title="Desconto do plano mensal" type={store.planDiscountType} value={store.planDiscountValue} currency={store.currency} onTypeChange={store.setPlanDiscountType} onValueChange={store.setPlanDiscountValue} /></div></section>

      <section id="recursos" className="scroll-mt-36 border-t border-gray-100 pt-7 dark:border-gray-800">
        <div className="mb-4 flex items-center justify-between gap-4"><div><h3 className="font-semibold text-gray-900 dark:text-white/90">Recursos adicionais</h3><p className="mt-1 text-xs text-gray-400">Adicione recursos e defina valores e descontos individualmente.</p></div><button type="button" onClick={store.addResource} className={ui.compactCreateButton}><Plus size={16} className="shrink-0" />Adicionar recurso</button></div>
        <div className="space-y-4">{store.resources.map((resource) => <div key={resource.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"><div className="grid items-center gap-3 sm:grid-cols-[1fr_1fr_36px]"><input className={ui.input} aria-label="Nome do recurso" placeholder="Nome do recurso" value={resource.name} onChange={(event) => store.updateResource({ ...resource, name: event.target.value })} /><CurrencyInput label={`Valor de ${resource.name || 'recurso'}`} value={resource.value} onChange={(value) => store.updateResource({ ...resource, value })} /><button type="button" aria-label={`Excluir ${resource.name || 'recurso'}`} onClick={() => store.removeResource(resource.id)} className={ui.dangerIconButton}><Trash2 size={17} /></button></div><div className="mt-3"><DiscountFields title={`Desconto de ${resource.name || 'recurso'}`} type={resource.discountType} value={resource.discountValue} currency={store.currency} onTypeChange={(discountType) => store.updateResource({ ...resource, discountType, discountValue: 0 })} onValueChange={(discountValue) => store.updateResource({ ...resource, discountValue })} /></div></div>)}{!store.resources.length && <p className="rounded-xl border border-dashed border-gray-200 py-6 text-center text-xs text-gray-400 dark:border-gray-800">Nenhum recurso adicionado</p>}</div>
      </section>

      <section id="servicos" className="scroll-mt-36 border-t border-gray-100 pt-7 dark:border-gray-800"><div className="mb-4 flex items-center justify-between gap-4"><div><h3 className="font-semibold text-gray-900 dark:text-white/90">Serviços extras</h3><p className="mt-1 text-xs text-gray-400">Adicione implantação, treinamento, Setup ou qualquer outro serviço.</p></div><button type="button" onClick={store.addService} className={ui.compactCreateButton}><Plus size={16} className="shrink-0" />Adicionar serviço</button></div><div className="space-y-4">{store.services.map((service) => <div key={service.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"><div className="grid gap-3 sm:grid-cols-[1fr_1fr_36px]"><input className={ui.input} aria-label="Nome do serviço" placeholder="Ex.: Implantação, treinamento ou Setup" value={service.name} onChange={(event) => store.updateService({ ...service, name: event.target.value })} /><CurrencyInput label={`Valor de ${service.name || 'serviço'}`} value={service.value} onChange={(value) => store.updateService({ ...service, value })} /><button type="button" aria-label={`Excluir ${service.name}`} onClick={() => store.removeService(service.id)} className={ui.dangerIconButton}><Trash2 size={17} /></button></div><div className="mt-3"><DiscountFields title={`Desconto de ${service.name || 'serviço'}`} type={service.discountType} value={service.discountValue} currency={store.currency} onTypeChange={(discountType) => store.updateService({ ...service, discountType, discountValue: 0 })} onValueChange={(discountValue) => store.updateService({ ...service, discountValue })} /></div></div>)}{!store.services.length && <p className="rounded-xl border border-dashed border-gray-200 py-6 text-center text-xs text-gray-400 dark:border-gray-800">Nenhum serviço extra adicionado</p>}</div></section>
    </div>
  </CalculatorCard></CalculatorShell>;
}






