import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { ui } from '../lib/ui';

export const calculatorSteps = ['/calculadora/meta', '/calculadora/produtos', '/calculadora/implantacao', '/calculadora/desconto', '/calculadora/resumo', '/calculadora/informacoes'];
export const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const numberValue = (value: string) => Math.max(0, Number(value) || 0);

export function CalculatorCard({ children }: { children: ReactNode }) {
  return <section className={`${ui.card} overflow-hidden`}>{children}</section>;
}

export function PageHeading({ title, description }: { title: string; description: string }) {
  return <div className="border-b border-gray-100 px-5 py-5 dark:border-gray-800 md:px-6"><p className={ui.eyebrow}>Calculadora comercial</p><h1 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white/90">{title}</h1><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p></div>;
}

export function CurrencyInput({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) {
  return <div className="relative"><span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs font-semibold text-gray-400">R$</span><input aria-label={label} className={`${ui.input} pl-10`} type="number" min="0" step="0.01" value={value} placeholder="0,00" onChange={(event) => onChange(numberValue(event.target.value))} /></div>;
}

export function CalculatorShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const index = Math.max(0, calculatorSteps.indexOf(location.pathname));
  return <div className="mx-auto max-w-5xl"><div className="mb-6"><h2 className={ui.pageTitle}>Calculadora de custos WhatsApp</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Simule uma proposta comercial completa com atualização instantânea.</p></div>{children}<div className="mt-6 flex items-center justify-between"><button disabled={index === 0} onClick={() => navigate(calculatorSteps[index - 1])} className={`${ui.secondaryButton} h-10 disabled:cursor-not-allowed disabled:opacity-40`}><ArrowLeft size={16} />Voltar</button><span className="text-xs text-gray-400">Etapa {index + 1} de {calculatorSteps.length}</span><button disabled={index === calculatorSteps.length - 1} onClick={() => navigate(calculatorSteps[index + 1])} className={`${ui.createButton} h-10 disabled:cursor-not-allowed disabled:opacity-40`}>Próximo<ArrowRight size={16} /></button></div></div>;
}
