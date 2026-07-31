import { Calculator, CheckCircle2, History, Moon, PanelLeft, X } from 'lucide-react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const versions = [
  {
    version: '1.0.0',
    date: '30 de julho de 2026',
    current: true,
    title: 'Lançamento da Calculadora Conexa',
    changes: [
      { icon: Calculator, text: 'Calculadora de custos da Meta com atualização em tempo real.' },
      { icon: PanelLeft, text: 'Navegação em etapas integrada ao layout corporativo da Infarma.' },
      { icon: Moon, text: 'Suporte completo aos temas claro e escuro.' },
    ],
  },
];

export function VersionHistoryModal({ isOpen, onClose }: VersionHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000001] flex items-center justify-center p-4">
      <button type="button" aria-label="Fechar histórico" onClick={onClose} className="absolute inset-0 bg-gray-950/60 backdrop-blur-[2px]" />
      <section role="dialog" aria-modal="true" aria-labelledby="version-history-title" className="relative z-10 max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xl dark:border-gray-800 dark:bg-gray-900">
        <header className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/10"><History size={20} /></span>
            <div><h2 id="version-history-title" className="font-semibold text-gray-900 dark:text-white/90">Histórico de Versões</h2><p className="text-xs text-gray-400">Evolução da Calculadora Conexa</p></div>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"><X size={20} /></button>
        </header>

        <div className="custom-scrollbar max-h-[calc(85vh-74px)] overflow-y-auto p-5 md:p-6">
          {versions.map((item) => (
            <article key={item.version} className="relative border-l-2 border-brand-100 pl-6 dark:border-brand-500/20">
              <span className="absolute -left-[7px] top-0 h-3 w-3 rounded-full border-2 border-white bg-brand-500 dark:border-gray-900" />
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-lg font-semibold text-gray-900 dark:text-white/90">v{item.version}</span>
                {item.current && <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success-700 dark:bg-success-500/10 dark:text-success-400"><CheckCircle2 size={12} />Versão atual</span>}
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
              <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">{item.title}</h3>
              <div className="space-y-2">
                {item.changes.map(({ icon: Icon, text }) => <div key={text} className="flex gap-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300"><Icon size={16} className="mt-0.5 shrink-0 text-brand-500" /><span>{text}</span></div>)}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
