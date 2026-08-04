import { BookOpen, CircleDollarSign, FileText, PackageOpen } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useSidebar } from '../store/sidebar.store';

const navItems = [
  { label: 'Informações', path: '/calculadora/informacoes', icon: BookOpen },
  { label: 'Custos da Meta', path: '/calculadora/meta', icon: CircleDollarSign },
  { label: 'Proposta Conexa', path: '/calculadora/produtos', icon: PackageOpen },
  { label: 'Resumo financeiro', path: '/calculadora/resumo', icon: FileText },
];

export function AppSidebar() {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const showText = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed left-0 top-0 z-[99999] flex h-screen flex-col border-r border-white/10 bg-infarma-navy transition-all duration-300 ease-in-out dark:bg-gray-900 lg:translate-x-0 ${isExpanded || isHovered ? 'w-70' : 'w-70 lg:w-20'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex items-center border-b border-white/10 px-6 py-8 ${!showText ? 'lg:justify-center' : 'justify-start'}`}
      >
        <Link
          to="/calculadora/informacoes"
          className="flex w-full min-w-0 items-center gap-3"
        >
          <img
            src={showText ? '/logo-infarma.png' : '/icon-infarma.png'}
            alt="Infarma"
            className={`${showText ? 'h-24 w-full' : 'h-8 w-8'} object-contain transition-all duration-300`}
          />
        </Link>
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto px-3 py-4">
        {showText && (
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">
            Calculadora comercial
          </p>
        )}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                title={!showText ? item.label : undefined}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${!showText ? 'lg:justify-center' : ''} ${isActive ? 'border-l-2 border-brand-500 bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              >
                <Icon
                  size={20}
                  className={`shrink-0 ${isActive ? 'text-brand-500' : 'text-white/70 group-hover:text-white'}`}
                />
                {showText && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
      {showText && (
        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-center text-xs text-white/30">2026 Infarma Sistemas</p>
        </div>
      )}
    </aside>
  );
}
