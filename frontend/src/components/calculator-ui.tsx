import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { ui } from '../lib/ui';
import { convertFromBrl, convertToBrl, getCurrencySymbol } from '../lib/currency';
import { useCalculator } from '../store/calculator.store';

export const calculatorSteps = ['/calculadora/meta', '/calculadora/produtos', '/calculadora/implantacao', '/calculadora/desconto', '/calculadora/resumo', '/calculadora/informacoes'];
export const numberValue = (value: string) => Math.max(0, Number(value) || 0);
export const preventInvalidNumberKeys = (event: KeyboardEvent<HTMLInputElement>, allowDecimal = true) => {
  const blockedKeys = allowDecimal ? ['e', 'E', '+', '-'] : ['e', 'E', '+', '-', '.', ','];
  if (blockedKeys.includes(event.key)) event.preventDefault();
};

export function CalculatorCard({ children }: { children: ReactNode }) {
  return <section className={`${ui.card} overflow-hidden`}>{children}</section>;
}

export function PageHeading({ title, description }: { title: string; description: string }) {
  return <div className="border-b border-gray-100 px-5 py-5 dark:border-gray-800 md:px-6"><p className={ui.eyebrow}>Calculadora comercial</p><h1 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white/90">{title}</h1><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p></div>;
}

export function CurrencyInput({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) {
  const currency = useCalculator((state) => state.currency);
  const displayValue = Number(convertFromBrl(value, currency).toFixed(6));
  const [draft, setDraft] = useState<string | null>(null);
  return <div className="relative"><span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs font-semibold text-gray-400">{getCurrencySymbol(currency)}</span><input aria-label={label} className={`${ui.input} pl-11 focus:opacity-100 ${draft === null && displayValue === 0 ? 'opacity-50' : 'opacity-100'}`} type="number" min="0" step="0.01" value={draft ?? displayValue} placeholder="0,00" onFocus={(event) => { if (displayValue === 0) setDraft(''); else { setDraft(String(displayValue)); event.currentTarget.select(); } }} onBlur={() => { if (draft === '') onChange(0); setDraft(null); }} onKeyDown={(event) => preventInvalidNumberKeys(event)} onChange={(event) => { const next = event.target.value; setDraft(next); if (next !== '') onChange(convertToBrl(numberValue(next), currency)); }} /></div>;
}

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  integer?: boolean;
  min?: number;
  max?: number;
  zeroPlaceholder?: boolean;
  className?: string;
}

export function NumberInput({ value, onChange, label, integer = false, min = 0, max, zeroPlaceholder = false, className = '' }: NumberInputProps) {
  const [draft, setDraft] = useState<string | null>(null);
  return <input aria-label={label} className={`${ui.input} focus:opacity-100 ${draft === null && value === 0 ? 'opacity-50' : 'opacity-100'} ${className}`} type="number" min={min} max={max} step={integer ? 1 : 0.01} value={draft ?? value} placeholder="0" onFocus={(event) => { if (value === 0) setDraft(''); else { setDraft(String(value)); event.currentTarget.select(); } }} onBlur={() => { if (draft === '') onChange(zeroPlaceholder ? 0 : min); setDraft(null); }} onKeyDown={(event) => preventInvalidNumberKeys(event, !integer)} onChange={(event) => { const next = event.target.value; if (next === '') { setDraft(''); return; } const parsed = integer ? Math.floor(numberValue(next)) : numberValue(next); if (zeroPlaceholder && parsed < min) { setDraft(''); onChange(0); return; } const bounded = Math.max(min, max === undefined ? parsed : Math.min(max, parsed)); setDraft(String(bounded)); onChange(bounded); }} />;
}

export function CalculatorShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const index = Math.max(0, calculatorSteps.indexOf(location.pathname));
  return <div className="mx-auto max-w-5xl"><div className="mb-6"><h2 className={ui.pageTitle}>Calculadora de custos WhatsApp</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Simule uma proposta comercial completa com atualização instantânea.</p></div>{children}<div className="mt-6 flex items-center justify-between"><button disabled={index === 0} onClick={() => navigate(calculatorSteps[index - 1])} className={`${ui.secondaryButton} h-10 disabled:cursor-not-allowed disabled:opacity-40`}><ArrowLeft size={16} />Voltar</button><span className="text-xs text-gray-400">Etapa {index + 1} de {calculatorSteps.length}</span><button disabled={index === calculatorSteps.length - 1} onClick={() => navigate(calculatorSteps[index + 1])} className={`${ui.createButton} h-10 disabled:cursor-not-allowed disabled:opacity-40`}>Próximo<ArrowRight size={16} /></button></div></div>;
}
