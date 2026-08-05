# SPEC-014 — Persistência da simulação em Local Storage

## Contexto

Os dados da calculadora são mantidos em memória pelo store Zustand `useCalculator`. Ao atualizar ou fechar a página, moeda, quantidades, plano, produtos, serviços, descontos e parcelamento voltam ao estado inicial criado por `createInitialCalculatorData`.

O tema já possui persistência própria em Local Storage, mas os dados comerciais da simulação ainda não são persistidos. Como o preenchimento ocorre em quatro etapas, a perda de estado interrompe o trabalho e obriga o usuário a reconstruir a proposta.

## Objetivo

Persistir localmente todos os dados editáveis da simulação, restaurá-los de forma segura após atualização ou reabertura da aplicação e oferecer uma ação explícita para iniciar uma nova simulação.

## Regras de negócio

### Dados persistidos

- Persistir somente os campos de `CalculatorData`:
  - `currency`;
  - `templates`, incluindo valores e quantidades;
  - `selectedPlanId`;
  - `planValue`;
  - `resources`, incluindo ids, nomes, valores, quantidades e descontos;
  - `services`, incluindo ids, nomes, valores e descontos;
  - `implementationInstallments`;
  - `planDiscountType`;
  - `planDiscountValue`.
- Não persistir actions do Zustand, totais derivados ou funções.
- O tema continua usando sua chave e persistência atuais, fora do estado da simulação.
- O snapshot codificado na URL pública da proposta não deve ser substituído pelos dados locais.

### Momento de salvamento

- Salvar automaticamente após toda alteração válida no estado persistível.
- A atualização no Local Storage deve acompanhar o estado confirmado pelo store, sem depender de mudança de página.
- Não gravar estados intermediários inválidos de campos enquanto o usuário ainda está digitando.

### Recuperação

- Restaurar os dados persistidos ao inicializar o store, antes da primeira renderização útil da calculadora.
- Após atualizar a página, manter o usuário na rota atual e apresentar os mesmos dados preenchidos.
- Ao reabrir a aplicação no mesmo navegador e origem, continuar a última simulação salva.
- Se não houver dados persistidos válidos, usar `createInitialCalculatorData()`.
- Se o conteúdo estiver corrompido, incompatível ou incompleto, ignorar as partes inválidas e usar defaults seguros sem impedir a abertura da aplicação.

### Limpeza e nova simulação

- Disponibilizar uma ação explícita **Nova simulação** na área da calculadora.
- Ao confirmar a ação, limpar os dados persistidos e restaurar integralmente `createInitialCalculatorData()`.
- Após a limpeza, navegar para `/calculadora/informacoes`.
- Solicitar confirmação antes de descartar uma simulação que contenha alterações relevantes.
- Se o estado já estiver igual ao inicial, permitir reinício direto sem alerta desnecessário.
- Limpar a simulação não deve apagar preferência de tema.
- A proposta pública aberta por URL não deve limpar nem sobrescrever automaticamente a simulação local.

## Alterações de interface

- Adicionar a ação **Nova simulação** próxima ao título geral da calculadora ou em outra posição comum às quatro etapas.
- Usar o padrão visual dos botões secundários existentes.
- Exibir confirmação clara de que os dados atuais serão descartados.
- Garantir funcionamento por teclado, foco visível e área de toque adequada.
- Em mobile, a ação deve quebrar ou reposicionar sem causar rolagem horizontal.

## Alterações necessárias

- Adicionar persistência ao `calculator.store.ts`, preferencialmente com o middleware oficial `persist` já disponível no Zustand.
- Definir uma chave específica e estável, como `calculadora-conexa:simulation`.
- Incluir versão do formato persistido e estratégia de migração ou descarte seguro para versões incompatíveis.
- Usar `partialize` ou mecanismo equivalente para armazenar apenas `CalculatorData`.
- Adicionar ao store uma action de reset tipada, como `resetCalculator`.
- Integrar a ação **Nova simulação** no `CalculatorShell` ou em componente compartilhado pelas etapas.
- Validar valores recuperados antes de incorporá-los ao estado, incluindo moeda, descontos, arrays e parcelamento.

## Impacto

- `src/store/calculator.store.ts`.
- `src/types/calculator.types.ts` para a action de reset e eventuais tipos de persistência.
- `src/services/calculator.service.ts` como fonte única do estado inicial.
- `src/components/calculator-ui.tsx` ou componente compartilhado para a ação de nova simulação.
- O comportamento passa a conservar dados entre sessões na mesma origem do navegador.
- Não há sincronização entre dispositivos, usuários, navegadores ou abas além do comportamento nativo do Local Storage.

## Dependências

- Depende do modelo `CalculatorData` e de `createInitialCalculatorData`.
- Não depende da SPEC-010, SPEC-011, SPEC-012, SPEC-013 ou SPEC-015.
- Se a ação for posicionada no cabeçalho, sua implementação deve ser coordenada com as SPECs 010, 011 e 012; a posição preferencial é junto ao título do `CalculatorShell` para reduzir esse acoplamento.

## Critérios de aceite

- Todos os campos de `CalculatorData` são restaurados após atualizar a página.
- Moeda, tarifas editadas, quantidades, plano, valor, descontos, produtos, serviços e parcelamento permanecem idênticos após recarregar.
- Alterações são salvas automaticamente sem ação manual.
- Actions e totais derivados não são serializados.
- Dados inválidos no Local Storage não quebram a aplicação.
- Ausência de dados persistidos inicia a calculadora com os defaults atuais.
- **Nova simulação** restaura todos os defaults e remove a simulação anterior do armazenamento.
- A limpeza redireciona para a primeira etapa.
- O tema escolhido não é apagado ao iniciar nova simulação.
- Abrir ou imprimir uma proposta pública não altera a simulação persistida.
- Não há mudança nas fórmulas ou totais calculados.
- A interface continua responsiva e acessível.
- Typecheck e build terminam sem erros.

## Observações técnicas

- O Local Storage pode falhar ou estar indisponível; leitura e gravação não devem tornar a aplicação inutilizável.
- A hidratação deve evitar sobrescrever dados válidos com defaults depois da primeira renderização.
- Tratar ids de itens restaurados para evitar colisões ao adicionar novos produtos ou serviços.
- Não usar o evento `beforeunload` como mecanismo principal de persistência.
- Cobrir em teste manual atualização na mesma etapa, fechamento e reabertura, conteúdo corrompido e nova simulação.

## Restrições

- Não persistir dados em servidor, cookies, IndexedDB ou URL.
- Não armazenar totais calculados.
- Não alterar fórmulas, catálogos ou preços oficiais durante a hidratação.
- Não limpar dados automaticamente ao concluir ou visualizar uma proposta.
- Não apagar outras chaves do Local Storage.
- Não adicionar nova dependência, pois Zustand já oferece o middleware necessário.

## Resultado esperado

A calculadora preserva automaticamente a simulação em andamento e a restaura após atualização ou reabertura. O usuário só perde os dados ao confirmar **Nova simulação**, sem afetar tema, proposta pública ou outras informações armazenadas pela aplicação.
