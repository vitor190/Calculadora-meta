import { Info } from 'lucide-react';
import { CalculatorCard, CalculatorShell, PageHeading } from '../../components/calculator-ui';

const items = ['A Meta cobra por template enviado.', 'Cada categoria possui um custo diferente.', 'O cliente abre uma janela de atendimento de 24 horas ao enviar uma mensagem.', 'Durante essa janela é possível responder normalmente sem iniciar uma nova conversa.', 'A janela de 24 horas é renovada apenas quando o cliente envia uma nova mensagem.'];

export function InformationPage() {
  return <CalculatorShell><CalculatorCard><PageHeading title="Como funciona a cobrança da Meta" description="Informações importantes para orientar sua proposta." /><div className="grid gap-3 p-5 md:grid-cols-2 md:p-6">{items.map((item) => <div key={item} className="flex gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300"><Info size={18} className="shrink-0 text-brand-500" />{item}</div>)}</div></CalculatorCard></CalculatorShell>;
}


