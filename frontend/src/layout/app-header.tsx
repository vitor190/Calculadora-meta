import { ChevronDown, History, Moon, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ThemeBrandIcon } from '../components/theme-brand-icon';
import { VersionHistoryModal } from '../components/version-history-modal';
import { useTheme } from '../store/theme.store';

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, []);

  return (
    <header className="sticky top-0 z-9999 flex w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex w-full max-w-400 items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-6">
        <Link
          to="/calculadora/informacoes"
          className="flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          aria-label="Calculadora Conexa — início"
        >
          <ThemeBrandIcon
            alt=""
            className="h-9 w-9 shrink-0"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
              Calculadora Conexa
            </p>
            <p className="truncate text-xs text-gray-400">Infarma Sistemas</p>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div
            className="relative hidden sm:block"
            ref={menuRef}
          >
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-brand-500 to-infarma-teal text-sm font-semibold text-white">
                C
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">Comercial</p>
                <p className="text-xs text-gray-400">Conexa</p>
              </div>
              <ChevronDown
                size={16}
                className={`mx-1 text-gray-400 transition-transform duration-200 ease-out ${isUserMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900">
                <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                    Time Comercial
                  </p>
                  <p className="text-xs text-gray-400">Calculadora Conexa</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsVersionHistoryOpen(true);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <History
                    size={16}
                    className="text-gray-500 dark:text-gray-400"
                  />
                  Histórico de Versões
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <VersionHistoryModal
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
      />
    </header>
  );
}
