# SPEC-012 — Barra de etapas no header

## Contexto

O fluxo da calculadora possui quatro páginas sequenciais: **Informações**, **Custos da Meta**, **Proposta Conexa** e **Resumo financeiro**. A ordem está representada por `calculatorSteps`, e o `CalculatorShell` oferece os botões **Voltar**, **Próximo** e a indicação textual da etapa atual no rodapé do conteúdo.

O cabeçalho não apresenta a posição do usuário no fluxo. Sem uma visão global das etapas, é necessário chegar ao fim da página para confirmar o progresso ou mudar de etapa pela navegação sequencial.

## Objetivo

Adicionar ao `AppHeader` um stepper com círculos e ícones que represente as quatro páginas da calculadora, destaque a etapa atual e permita compreender o progresso em qualquer ponto da tela.

## Regras de negócio

- O stepper deve representar, nesta ordem:
  1. **Informações** — `/calculadora/informacoes`;
  2. **Custos da Meta** — `/calculadora/meta`;
  3. **Proposta Conexa** — `/calculadora/produtos`;
  4. **Resumo financeiro** — `/calculadora/resumo`.
- Cada círculo deve conter um ícone semanticamente relacionado à página correspondente.
- A etapa atual deve ser determinada pela rota ativa, sem criar um segundo estado de navegação.
- Etapas anteriores devem ser apresentadas como concluídas.
- Etapas posteriores devem ser apresentadas como pendentes.
- Como o fluxo atual não bloqueia rotas, todas as etapas devem permanecer navegáveis pelo stepper.
- A navegação pelo stepper não deve limpar nem recalcular dados fora das regras já existentes.
- A rota pública `/proposta` não deve exibir o stepper.

## Estados visuais

### Etapa atual

- Círculo com maior destaque visual, usando a cor principal da aplicação.
- Ícone com contraste adequado.
- Label visível em viewports que comportem texto.
- Indicação acessível com `aria-current="step"`.

### Etapa concluída

- Círculo e conector com aparência de progresso concluído.
- Manter o ícone próprio da página dentro do círculo; não substituí-lo por número.
- Contraste suficiente nos temas claro e escuro.

### Etapa pendente

- Círculo, ícone e conector em estilo neutro.
- Permanecer identificável e acionável, sem aparentar estado desabilitado.

## Alterações de interface

- Posicionar o stepper na região central do `AppHeader`, entre a identidade da aplicação e as ações auxiliares.
- Usar círculos interligados por linhas para comunicar sequência e progresso.
- Exibir labels das etapas em desktop quando houver espaço suficiente.
- Em notebook ou tablet, reduzir espaçamentos e ocultar progressivamente os labels, preservando círculos, ícones e nomes acessíveis.
- Em mobile, permitir uma versão compacta que caiba na viewport sem rolagem horizontal; a marca textual pode ser reduzida conforme necessário, mas os controles não podem se sobrepor.
- Manter a indicação e os botões sequenciais do `CalculatorShell`, salvo decisão posterior em SPEC própria.

## Alterações necessárias

- Criar um componente dedicado, como `CalculatorStepper`, para evitar sobrecarregar `AppHeader`.
- Centralizar a definição de etapas, labels, rotas e ícones em uma única fonte compartilhada pelo stepper e pelo `CalculatorShell`.
- Usar `useLocation` para identificar a rota atual e `Link` ou `useNavigate` para navegação.
- Tratar rota desconhecida sem marcar incorretamente uma etapa; os redirecionamentos atuais continuam sendo responsabilidade de `AppRoutes`.
- Usar listas e elementos de navegação com semântica adequada.

## Impacto

- `src/layout/app-header.tsx`.
- `src/components/calculator-ui.tsx`, devido à definição atual de `calculatorSteps`.
- Possível criação de componente e configuração compartilhada de etapas.
- O cabeçalho ganhará maior densidade de informação e exigirá validação específica em larguras intermediárias.
- Nenhum impacto esperado em dados, cálculos, store, proposta pública ou regras de preenchimento.

## Dependências

- Depende da ordem e das rotas atuais definidas em `AppRoutes` e `calculatorSteps`.
- Deve ser coordenada com a SPEC-011, que libera no cabeçalho o espaço ocupado pelo perfil Comercial.
- Deve respeitar a troca de ícones da marca definida na SPEC-010.
- Não depende da persistência prevista na SPEC-014.

## Critérios de aceite

- O cabeçalho apresenta quatro círculos na ordem correta das páginas.
- Cada círculo contém um ícone correspondente à sua página.
- A rota ativa determina corretamente a etapa atual após navegação e atualização da página.
- Etapas anteriores, atual e posteriores possuem estados visualmente distintos.
- A etapa atual expõe `aria-current="step"`.
- Todas as etapas podem ser acionadas por mouse e teclado.
- Navegar pelo stepper preserva os dados atuais da simulação.
- O stepper não aparece em `/proposta`.
- Não existe duplicação divergente da lista ou ordem de etapas.
- Não ocorre corte, sobreposição ou rolagem horizontal em desktop, notebook, tablet ou mobile.
- O componente permanece legível nos temas claro e escuro.
- **Voltar**, **Próximo**, indicador textual e ação final continuam funcionando.
- Typecheck e build terminam sem erros.

## Observações técnicas

- Ícones podem reutilizar a biblioteca `lucide-react` já instalada.
- O estado concluído deve ser derivado da posição da rota atual na lista; não é necessário persistir progresso separado.
- Labels ocultos visualmente continuam precisando de nomes acessíveis.
- Os círculos devem manter área de toque adequada mesmo quando o desenho visível for menor.

## Restrições

- Não adicionar biblioteca de stepper.
- Não criar estado global apenas para controlar a etapa atual.
- Não bloquear o acesso a etapas futuras.
- Não alterar rotas nem a ordem do fluxo.
- Não remover a navegação inferior nesta SPEC.

## Resultado esperado

O usuário passa a enxergar no cabeçalho sua posição nas quatro etapas e pode navegar diretamente entre elas. O stepper usa círculos com ícones, comunica claramente estados atual, concluído e pendente e se adapta a todas as larguras sem comprometer os demais controles.
