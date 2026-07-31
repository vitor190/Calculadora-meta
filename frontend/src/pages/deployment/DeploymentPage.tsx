import { CalculatorCard, CalculatorShell, CurrencyInput, PageHeading } from '../../components/calculator-ui';
import { DiscountFields } from '../../components/discount-fields';
import { ui } from '../../lib/ui';
import { useCalculator } from '../../store/calculator.store';

export function DeploymentPage() {
  const store = useCalculator();
  return <CalculatorShell><CalculatorCard><PageHeading title="Implantação" description="Informe o custo único de configuração e a condição comercial deste serviço." /><div className="grid gap-5 p-5 md:grid-cols-2 md:p-6"><div><label className={ui.label}>Valor da implantação</label><CurrencyInput label="Valor da implantação" value={store.deployment} onChange={store.setDeployment} /></div><DiscountFields title="Desconto da implantação" type={store.deploymentDiscountType} value={store.deploymentDiscountValue} currency={store.currency} onTypeChange={store.setDeploymentDiscountType} onValueChange={store.setDeploymentDiscountValue} /></div></CalculatorCard></CalculatorShell>;
}
