import {
  ChartNoAxesCombined,
  ClipboardList,
  PackageCheck,
  Target,
  type LucideIcon,
} from 'lucide-react';

export interface CalculatorStep {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const calculatorSteps: readonly CalculatorStep[] = [
  { label: 'Informações', path: '/calculadora/informacoes', icon: ClipboardList },
  { label: 'Custos da Meta', path: '/calculadora/meta', icon: Target },
  { label: 'Proposta Conexa', path: '/calculadora/produtos', icon: PackageCheck },
  { label: 'Resumo financeiro', path: '/calculadora/resumo', icon: ChartNoAxesCombined },
] as const;
