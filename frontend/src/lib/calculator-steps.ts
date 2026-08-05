import {
  Calculator,
  ChartNoAxesCombined,
  ClipboardList,
  PackageCheck,
  type LucideIcon,
} from 'lucide-react';

export interface CalculatorStep {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const calculatorSteps: readonly CalculatorStep[] = [
  { label: 'Informações', path: '/calculadora/informacoes', icon: ClipboardList },
  { label: 'Estimativa Meta', path: '/calculadora/meta', icon: Calculator },
  { label: 'Proposta Conexa', path: '/calculadora/produtos', icon: PackageCheck },
  { label: 'Resumo financeiro', path: '/calculadora/resumo', icon: ChartNoAxesCombined },
] as const;
