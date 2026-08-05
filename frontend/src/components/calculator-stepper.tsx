import { Link, useLocation } from 'react-router';
import { calculatorSteps } from '../lib/calculator-steps';

export function CalculatorStepper() {
  const { pathname } = useLocation();
  const currentIndex = calculatorSteps.findIndex((step) => step.path === pathname);

  return (
    <nav
      aria-label="Etapas da calculadora"
      className="min-w-0 flex-1 xl:flex-none"
    >
      <ol className="flex w-full items-start justify-center">
        {calculatorSteps.map((step, index) => {
          const isCurrent = index === currentIndex;
          const isCompleted = currentIndex >= 0 && index < currentIndex;
          const Icon = step.icon;

          return (
            <li
              key={step.path}
              className={`flex min-w-0 items-start ${index < calculatorSteps.length - 1 ? 'flex-1' : ''}`}
            >
              <Link
                to={step.path}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`${step.label}${isCurrent ? ', etapa atual' : isCompleted ? ', concluída' : ', pendente'}`}
                className="group flex shrink-0 flex-col items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                <span
                  className={`flex size-8 items-center justify-center rounded-full border transition-colors sm:size-9 ${
                    isCurrent
                      ? 'border-brand-500 bg-brand-500 text-white shadow-focus-ring'
                      : isCompleted
                        ? 'border-brand-500 bg-brand-50 text-brand-600 group-hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-400 dark:group-hover:bg-brand-500/25'
                        : 'border-gray-300 bg-white text-gray-500 group-hover:border-brand-300 group-hover:text-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:group-hover:border-brand-700 dark:group-hover:text-brand-400'
                  }`}
                >
                  <Icon
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>
                <span
                  className={`mt-1.5 hidden whitespace-nowrap text-[11px] font-medium xl:block ${
                    isCurrent
                      ? 'text-brand-600 dark:text-brand-400'
                      : isCompleted
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </Link>
              {index < calculatorSteps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`mt-4 h-0.5 min-w-1 flex-1 sm:mt-[17px] xl:w-10 xl:flex-none ${
                    isCompleted ? 'bg-brand-500 dark:bg-brand-400' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
