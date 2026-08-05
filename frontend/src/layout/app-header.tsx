import { History, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { CalculatorStepper } from '../components/calculator-stepper';
import { ThemeBrandIcon } from '../components/theme-brand-icon';
import { VersionHistoryModal } from '../components/version-history-modal';
import { useTheme } from '../store/theme.store';

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

  return (
    <header className="sticky top-0 z-9999 flex w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex w-full max-w-400 items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-5 lg:px-6 xl:grid xl:grid-cols-[1fr_auto_1fr]">
        <Link
          to="/calculadora/informacoes"
          className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          aria-label="Calculadora Conexa — início"
        >
          <ThemeBrandIcon
            alt=""
            className="h-9 w-9 shrink-0"
          />
          <div className="hidden min-w-0 lg:block">
            <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
              Calculadora Conexa
            </p>
            <p className="truncate text-xs text-gray-400">Infarma Sistemas</p>
          </div>
        </Link>
        <CalculatorStepper />
        <div className="flex shrink-0 items-center justify-self-end gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsVersionHistoryOpen(true)}
            aria-label="Abrir histórico de versões"
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 px-2.5 text-gray-500 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900 sm:px-3"
          >
            <History
              size={18}
              aria-hidden="true"
            />
            <span className="hidden text-sm font-medium 2xl:inline">Histórico</span>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
      <VersionHistoryModal
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
      />
    </header>
  );
}
