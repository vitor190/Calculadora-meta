import {
  BadgeCheck,
  Check,
  Clock3,
  Info,
  ShieldCheck,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react';
import { CalculatorCard, CalculatorShell, PageHeading } from '../../components/calculator-ui';

interface ApiOption {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  iconBackgroundClassName: string;
  items: string[];
}

const apiOptions: ApiOption[] = [
  {
    title: 'API Oficial',
    description: 'A opção indicada para empresas que priorizam confiabilidade.',
    icon: ShieldCheck,
    iconClassName: 'text-success-600 dark:text-success-400',
    iconBackgroundClassName: 'bg-success-50 dark:bg-success-500/10',
    items: [
      'Usa a API Oficial do WhatsApp Business.',
      'Possui suporte oficial da Meta e maior estabilidade.',
      'Segue a cobrança da Meta por mensagem de template, conforme a categoria e as regras vigentes.',
    ],
  },
  {
    title: 'API Não Oficial',
    description: 'Pode reduzir custos, mas envolve riscos importantes para a operação.',
    icon: TriangleAlert,
    iconClassName: 'text-warning-600 dark:text-warning-400',
    iconBackgroundClassName: 'bg-warning-50 dark:bg-warning-500/10',
    items: [
      'Não possui cobrança da Meta e normalmente tem menor custo operacional.',
      'Pode sofrer instabilidades e não possui suporte oficial da Meta.',
      'Existe risco de bloqueio ou banimento do número.',
    ],
  },
];

const comparison = [
  { label: 'Suporte da Meta', official: 'Sim', unofficial: 'Não' },
  { label: 'Estabilidade', official: 'Maior', unofficial: 'Pode variar' },
  { label: 'Cobrança da Meta', official: 'Conforme as regras vigentes', unofficial: 'Não' },
  { label: 'Risco de bloqueio', official: 'Menor, seguindo as políticas', unofficial: 'Maior' },
];

export function InformationPage() {
  return (
    <CalculatorShell>
      <CalculatorCard>
        <PageHeading
          title="API Oficial ou Não Oficial?"
          description="Entenda as diferenças para orientar o cliente com clareza."
        />

        <div className="space-y-6 p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {apiOptions.map((option) => {
              const Icon = option.icon;

              return (
                <section
                  key={option.title}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02]"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${option.iconBackgroundClassName} ${option.iconClassName}`}
                    >
                      <Icon
                        size={20}
                        aria-hidden="true"
                      />
                    </span>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white/90">
                        {option.title}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-3">
                    {option.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 text-sm text-gray-600 dark:text-gray-300"
                      >
                        <Check
                          size={16}
                          className={`mt-0.5 shrink-0 ${option.iconClassName}`}
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          <section aria-labelledby="comparison-title">
            <div className="flex items-center gap-2">
              <BadgeCheck
                size={18}
                className="text-brand-500"
                aria-hidden="true"
              />
              <h2
                id="comparison-title"
                className="text-base font-semibold text-gray-900 dark:text-white/90"
              >
                Comparação rápida
              </h2>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              As modalidades não oferecem o mesmo nível de segurança e confiabilidade.
            </p>

            <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="hidden grid-cols-[1.1fr_1fr_1fr] bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:bg-white/[0.02] sm:grid">
                <span>Critério</span>
                <span>API Oficial</span>
                <span>API Não Oficial</span>
              </div>
              {comparison.map((item) => (
                <div
                  key={item.label}
                  className="grid gap-3 border-t border-gray-100 px-4 py-3 first:border-t-0 dark:border-gray-800 sm:grid-cols-[1.1fr_1fr_1fr] sm:first:border-t"
                >
                  <strong className="text-sm text-gray-700 dark:text-gray-300">{item.label}</strong>
                  <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-success-600 dark:text-success-400"
                      aria-hidden="true"
                    />
                    <span>
                      <span className="font-medium sm:hidden">Oficial: </span>
                      {item.official}
                    </span>
                  </div>
                  <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <X
                      size={16}
                      className="mt-0.5 shrink-0 text-warning-600 dark:text-warning-400"
                      aria-hidden="true"
                    />
                    <span>
                      <span className="font-medium sm:hidden">Não Oficial: </span>
                      {item.unofficial}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-brand-100 bg-brand-50/70 p-4 dark:border-brand-500/20 dark:bg-brand-500/10">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                <Clock3
                  size={20}
                  aria-hidden="true"
                />
              </span>
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white/90">
                  Janela de atendimento de 24 horas
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  Quando o cliente envia uma mensagem, começa uma janela de 24 horas. Nesse período,
                  o atendente pode responder livremente, sem iniciar uma nova conversa. A janela é
                  renovada quando o cliente envia outra mensagem. Depois que ela termina, um novo
                  contato da empresa deve usar um template e pode gerar cobrança da Meta conforme a
                  categoria aplicável.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-500/30 dark:bg-brand-500/10">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                <Info
                  size={20}
                  aria-hidden="true"
                />
              </span>
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white/90">
                  O custo da Meta não está incluso no plano Infarma
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  A mensalidade do plano Infarma cobre somente os produtos e serviços contratados
                  com a Infarma. As mensagens de template da API Oficial são cobradas separadamente
                  pela Meta, conforme a categoria, a quantidade utilizada e a tabela vigente.
                </p>
              </div>
            </div>
          </section>

          <aside className="flex gap-2.5 text-xs text-gray-500 dark:text-gray-400">
            <Info
              size={16}
              className="shrink-0 text-brand-500"
              aria-hidden="true"
            />
            <p>
              Tarifas e regras da Meta podem mudar. Consulte a tabela oficial antes de fechar a
              proposta.
            </p>
          </aside>
        </div>
      </CalculatorCard>
    </CalculatorShell>
  );
}
