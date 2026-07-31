import { CalculatorCard, CalculatorShell, CurrencyInput, PageHeading } from '../../components/calculator-ui';
import { ui } from '../../lib/ui';
import { useCalculator } from '../../store/calculator.store';

export function DeploymentPage() {
  const { deployment, setDeployment } = useCalculator();
  return <CalculatorShell><CalculatorCard><PageHeading title="Implantação" description="Informe o custo único de configuração e ativação." /><div className="max-w-lg p-5 md:p-6"><label className={ui.label}>Valor da implantação</label><CurrencyInput label="Valor da implantação" value={deployment} onChange={setDeployment} /></div></CalculatorCard></CalculatorShell>;
}
