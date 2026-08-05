import { useState, type KeyboardEvent, type ReactNode, type SelectHTMLAttributes } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { ui } from '../lib/ui';
import { convertFromBrl, convertToBrl, getCurrencySymbol } from '../lib/currency';
import { selectCalculatorData, useCalculator } from '../store/calculator.store';
import { createInitialCalculatorData } from '../services/calculator.service';
import { calculatorSteps } from '../lib/calculator-steps';

export const numberValue = (value: string) => Math.max(0, Number(value) || 0);
export const preventInvalidNumberKeys = (
  event: KeyboardEvent<HTMLInputElement>,
  allowDecimal = true,
) => {
  const blockedKeys = allowDecimal ? ['e', 'E', '+', '-'] : ['e', 'E', '+', '-', '.', ','];
  if (blockedKeys.includes(event.key)) event.preventDefault();
};

export function AnimatedSelect({
  children,
  className = '',
  onChange,
  onBlur,
  onKeyDown,
  onPointerDown,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <select
        {...props}
        className={`${ui.input} appearance-none pr-12 ${className}`}
        onPointerDown={(event) => {
          setIsOpen((open) => !open);
          onPointerDown?.(event);
        }}
        onChange={(event) => {
          setIsOpen(false);
          onChange?.(event);
        }}
        onBlur={(event) => {
          setIsOpen(false);
          onBlur?.(event);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape' || event.key === 'Enter' || event.key === 'Tab')
            setIsOpen(false);
          else if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === ' ')
            setIsOpen(true);
          onKeyDown?.(event);
        }}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200 ease-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}
      />
    </div>
  );
}
export function CalculatorCard({ children }: { children: ReactNode }) {
  return <section className={`${ui.card} overflow-hidden`}>{children}</section>;
}

export function PageHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-b border-gray-100 px-5 py-5 dark:border-gray-800 md:px-6">
      <p className={ui.eyebrow}>Calculadora comercial</p>
      <h1 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white/90">{title}</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}

export function CurrencyInput({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
}) {
  const currency = useCalculator((state) => state.currency);
  const displayValue = Number(convertFromBrl(value, currency).toFixed(6));
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs font-semibold text-gray-400">
        {getCurrencySymbol(currency)}
      </span>
      <input
        aria-label={label}
        className={`${ui.input} pl-11 focus:opacity-100 ${draft === null && displayValue === 0 ? 'opacity-50' : 'opacity-100'}`}
        type="number"
        min="0"
        step="0.01"
        value={draft ?? displayValue}
        placeholder="0,00"
        onFocus={(event) => {
          if (displayValue === 0) setDraft('');
          else {
            setDraft(String(displayValue));
            event.currentTarget.select();
          }
        }}
        onBlur={() => {
          if (draft === '') onChange(0);
          setDraft(null);
        }}
        onKeyDown={(event) => preventInvalidNumberKeys(event)}
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          if (next !== '') onChange(convertToBrl(numberValue(next), currency));
        }}
      />
    </div>
  );
}

function NumberStepper({
  label,
  onIncrement,
  onDecrement,
  incrementDisabled = false,
  decrementDisabled = false,
}: {
  label: string;
  onIncrement: () => void;
  onDecrement: () => void;
  incrementDisabled?: boolean;
  decrementDisabled?: boolean;
}) {
  const buttonClass =
    'flex h-1/2 w-9 items-center justify-center text-gray-400 transition hover:text-brand-500 focus-visible:z-10 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-brand-400';

  return (
    <span className="absolute inset-y-1 right-1 flex w-9 flex-col">
      <button
        type="button"
        className={buttonClass}
        aria-label={`Aumentar ${label}`}
        onClick={onIncrement}
        disabled={incrementDisabled}
      >
        <ChevronUp
          size={13}
          strokeWidth={2.25}
        />
      </button>
      <button
        type="button"
        className={buttonClass}
        aria-label={`Diminuir ${label}`}
        onClick={onDecrement}
        disabled={decrementDisabled}
      >
        <ChevronDown
          size={13}
          strokeWidth={2.25}
        />
      </button>
    </span>
  );
}

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  integer?: boolean;
  min?: number;
  max?: number;
  zeroPlaceholder?: boolean;
  showStepper?: boolean;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  label,
  integer = false,
  min = 0,
  max,
  zeroPlaceholder = false,
  showStepper = true,
  className = '',
}: NumberInputProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const changeByStep = (direction: 1 | -1) => {
    const step = integer ? 1 : 0.01;
    const next = value + direction * step;
    const lowerBound = zeroPlaceholder ? 0 : min;
    const bounded = Math.max(lowerBound, max === undefined ? next : Math.min(max, next));
    setDraft(null);
    onChange(integer ? Math.floor(bounded) : Number(bounded.toFixed(2)));
  };
  return (
    <div className="relative">
      <input
        aria-label={label}
        className={`${ui.input} ${showStepper ? 'pr-10' : 'pr-3'} focus:opacity-100 ${draft === null && value === 0 ? 'opacity-50' : 'opacity-100'} ${className}`}
        type="number"
        min={min}
        max={max}
        step={integer ? 1 : 0.01}
        value={draft ?? value}
        placeholder="0"
        onFocus={(event) => {
          if (value === 0) setDraft('');
          else {
            setDraft(String(value));
            event.currentTarget.select();
          }
        }}
        onBlur={() => {
          if (draft === '') onChange(zeroPlaceholder ? 0 : min);
          setDraft(null);
        }}
        onKeyDown={(event) => preventInvalidNumberKeys(event, !integer)}
        onChange={(event) => {
          const next = event.target.value;
          if (next === '') {
            setDraft('');
            return;
          }
          const parsed = integer ? Math.floor(numberValue(next)) : numberValue(next);
          if (zeroPlaceholder && parsed < min) {
            setDraft('');
            onChange(0);
            return;
          }
          const bounded = Math.max(min, max === undefined ? parsed : Math.min(max, parsed));
          setDraft(String(bounded));
          onChange(bounded);
        }}
      />
      {showStepper && (
        <NumberStepper
          label={label.toLocaleLowerCase('pt-BR')}
          onIncrement={() => changeByStep(1)}
          onDecrement={() => changeByStep(-1)}
          incrementDisabled={max !== undefined && value >= max}
          decrementDisabled={value <= (zeroPlaceholder ? 0 : min)}
        />
      )}
    </div>
  );
}

export function CalculatorShell({
  children,
  finalAction,
}: {
  children: ReactNode;
  finalAction?: ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const calculatorState = useCalculator();
  const calculatorData = selectCalculatorData(calculatorState);
  const { resetCalculator } = calculatorState;
  const index = Math.max(
    0,
    calculatorSteps.findIndex((step) => step.path === location.pathname),
  );
  const startNewSimulation = () => {
    resetCalculator();
    navigate('/calculadora/informacoes');
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className={ui.pageTitle}>Calculadora de custos WhatsApp</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Simule uma proposta comercial completa com atualização instantânea.
          </p>
        </div>
        <button
          type="button"
          className={`${ui.secondaryButton} min-h-10 self-start whitespace-nowrap`}
          onClick={() => {
            const hasChanges =
              JSON.stringify(calculatorData) !== JSON.stringify(createInitialCalculatorData());
            if (hasChanges) {
              setIsResetConfirmOpen(true);
              return;
            }
            startNewSimulation();
          }}
        >
          <RotateCcw
            size={16}
            aria-hidden="true"
          />
          Nova simulação
        </button>
      </div>
      {children}
      <div className="mt-6 grid grid-cols-2 items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="order-2 sm:order-1">
          {index > 0 && (
            <button
              onClick={() => navigate(calculatorSteps[index - 1].path)}
              className={`${ui.secondaryButton} h-10`}
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
          )}
        </div>
        <span className="order-1 col-span-2 justify-self-center text-xs text-gray-400 sm:order-2 sm:col-span-1">
          Etapa {index + 1} de {calculatorSteps.length}
        </span>
        {index === calculatorSteps.length - 1 ? (
          <div className="order-3 min-w-0 justify-self-end">{finalAction}</div>
        ) : (
          <button
            onClick={() => navigate(calculatorSteps[index + 1].path)}
            className={`${ui.createButton} order-3 h-10 justify-self-end`}
          >
            Próximo
            <ArrowRight size={16} />
          </button>
        )}
      </div>
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-[10000001] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Cancelar nova simulação"
            onClick={() => setIsResetConfirmOpen(false)}
            className="absolute inset-0 bg-gray-950/60 backdrop-blur-[2px]"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-simulation-title"
            aria-describedby="reset-simulation-description"
            onKeyDown={(event) => {
              if (event.key === 'Escape') setIsResetConfirmOpen(false);
            }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xl dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="p-5 sm:p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400">
                <RotateCcw
                  size={21}
                  aria-hidden="true"
                />
              </span>
              <h2
                id="reset-simulation-title"
                className="mt-4 text-lg font-semibold text-gray-900 dark:text-white/90"
              >
                Iniciar uma nova simulação?
              </h2>
              <p
                id="reset-simulation-description"
                className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400"
              >
                Todos os dados da simulação atual serão descartados. Esta ação não pode ser
                desfeita.
              </p>
            </div>
            <footer className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-950/50 sm:flex-row sm:justify-end">
              <button
                type="button"
                autoFocus
                onClick={() => setIsResetConfirmOpen(false)}
                className={`${ui.secondaryButton} min-h-10 justify-center px-4`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={startNewSimulation}
                className={`${ui.createButton} min-h-10 justify-center`}
              >
                <RotateCcw
                  size={16}
                  aria-hidden="true"
                />
                Iniciar nova simulação
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
