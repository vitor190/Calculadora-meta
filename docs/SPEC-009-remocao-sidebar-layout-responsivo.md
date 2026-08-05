# SPEC-009 — Remoção da sidebar e ajuste do layout responsivo

## Contexto

A área interna da calculadora, nas rotas `/calculadora/*`, utiliza uma sidebar fixa como navegação principal. O componente usa as larguras utilitárias `w-20` quando recolhido e `w-70` quando expandido, exige deslocamentos laterais equivalentes no conteúdo e mantém estados específicos para abertura, fechamento, hover e comportamento mobile. Como consequência, parte relevante da viewport deixa de ser aproveitada pelos formulários, cards, tabelas e resumos.

A própria calculadora já oferece navegação sequencial entre suas etapas por meio do `CalculatorShell`. Portanto, a sidebar pode ser removida sem alterar as rotas ou o fluxo de preenchimento existente.

## Objetivo

Remover completamente a sidebar da aplicação e reorganizar o layout das páginas internas para utilizar adequadamente toda a largura disponível, mantendo uma interface limpa, proporcional, acessível e responsiva, sem espaços residuais ou rolagem horizontal desnecessária.

## Alterações

### Remoção da sidebar

- Remover a renderização de `AppSidebar` e `Backdrop` do layout principal.
- Remover os componentes `app-sidebar.tsx` e `backdrop.tsx` quando não houver outros consumidores.
- Remover o store `sidebar.store.ts` e todos os estados, listeners e ações relacionados a expansão, recolhimento, hover e abertura mobile.
- Remover do `AppHeader` o botão de alternância da sidebar, seus ícones, handlers, estado derivado e label acessível.
- Remover offsets, margens, larguras, transições e breakpoints usados exclusivamente para reservar ou compensar o espaço da sidebar.
- Remover a configuração de variante de layout em `config/layout.ts` e a variável `VITE_LAYOUT_VARIANT`, caso permaneçam sem função após a alteração.
- Eliminar imports e referências que ficarem sem uso.

### Cabeçalho e navegação

- Manter o `AppHeader` no topo das páginas internas, ocupando toda a largura disponível.
- Manter no cabeçalho a alternância de tema, a identificação do usuário e o acesso ao histórico de versões.
- Reequilibrar o alinhamento do cabeçalho após a retirada do botão da sidebar, sem deixar um espaço vazio no lado esquerdo.
- Preservar a navegação sequencial do `CalculatorShell`, incluindo **Voltar**, **Próximo**, indicação da etapa e ação final.
- Preservar todas as rotas e redirecionamentos existentes em `AppRoutes`.
- Não introduzir uma nova navegação global como parte desta alteração.

### Aproveitamento da largura

- Fazer o contêiner estrutural do `AppLayout` e o conteúdo principal ocuparem `100%` da largura disponível da viewport.
- Remover os deslocamentos `lg:ml-70` e `lg:ml-20` e qualquer regra equivalente criada para a sidebar.
- Manter espaçamento lateral responsivo no conteúdo para evitar que textos e controles encostem nas bordas da tela.
- Revisar o limite de largura do `main` e o `max-w-5xl` do `CalculatorShell`, ampliando-os quando isso melhorar o uso do espaço sem prejudicar a legibilidade.
- Usar limites máximos adequados para blocos predominantemente textuais e permitir maior largura para grids, cards, tabelas e seções financeiras.
- Garantir que cards e grupos de campos cresçam de maneira proporcional, sem ficarem excessivamente estreitos ou dispersos.
- Fazer tabelas e estruturas tabulares ocuparem toda a largura do contêiner em que estão inseridas.

### Reorganização responsiva

- Revisar os grids de `InformationPage`, `MetaCostsPage`, `ProductsPage` e `SummaryPage` para aproveitar a largura adicional em desktop e notebook.
- Manter a ordem lógica de leitura e edição dos campos em todos os breakpoints.
- Permitir que colunas sejam empilhadas progressivamente em tablet e mobile.
- Aplicar `min-width: 0`, quebra de texto e contenção de largura onde necessário para impedir overflow causado por conteúdo longo.
- Tratar tabelas e linhas financeiras de forma responsiva, convertendo-as em blocos empilhados quando não houver largura suficiente.
- Evitar larguras fixas que ultrapassem a viewport e rolagem horizontal na página.
- Manter áreas de toque adequadas, foco visível e labels acessíveis nos controles.

## Comportamento esperado por viewport

### Desktop e notebook

- Cabeçalho e área principal usam toda a largura da viewport.
- O conteúdo permanece centralizado e equilibrado por meio de padding e limites máximos coerentes.
- Grids podem exibir mais colunas quando houver espaço real para os componentes.
- Cards, tabelas e resumos financeiros aproveitam a largura adicional sem criar grandes vazios internos.

### Tablet

- Grids reduzem o número de colunas de forma progressiva.
- Campos e ações permanecem alinhados e fáceis de operar.
- Nenhum conteúdo depende de hover ou de uma navegação lateral oculta.

### Mobile

- Conteúdo e controles são empilhados na ordem natural de leitura.
- Ações podem quebrar linha sem sobreposição ou corte.
- Tabelas responsivas não forçam a largura da página.
- Não existe menu lateral, backdrop ou botão de abertura da sidebar.

## Requisitos técnicos

- Alterar prioritariamente:
  - `src/layout/app-layout.tsx`;
  - `src/layout/app-header.tsx`;
  - `src/components/calculator-ui.tsx`;
  - páginas em `src/pages/information`, `src/pages/meta`, `src/pages/products` e `src/pages/summary` quando necessário.
- Remover, se ficarem sem uso:
  - `src/layout/app-sidebar.tsx`;
  - `src/layout/backdrop.tsx`;
  - `src/store/sidebar.store.ts`;
  - `src/config/layout.ts`.
- Preservar `ProposalPreviewPage`, que usa layout público independente e não renderiza a sidebar.
- Preservar estado, dados, cálculos, validações, temas e comportamentos funcionais atuais da calculadora.
- Reutilizar os tokens, componentes e padrões visuais existentes.
- Não adicionar biblioteca ou dependência para realizar os ajustes de layout.
- Remover código morto somente quando estiver relacionado à sidebar ou se tornar comprovadamente inutilizado por esta alteração.
- Validar os layouts nos temas claro e escuro.
- Executar `npm run typecheck` e `npm run build` ao final da implementação.

## Critérios de aceite

- A sidebar não é renderizada em nenhuma rota da aplicação.
- Não existe botão de abrir, fechar ou recolher menu lateral no cabeçalho.
- Não existe backdrop associado à navegação mobile.
- Componentes, store, listeners, configuração e imports exclusivos da sidebar foram removidos.
- O cabeçalho ocupa toda a largura e seus controles permanecem corretamente alinhados.
- O conteúdo principal não possui margem ou offset residual da sidebar.
- As páginas internas aproveitam adequadamente o espaço adicional em desktop e notebook.
- Cards e grids crescem ou redistribuem suas colunas de forma proporcional.
- Tabelas e seções financeiras usam toda a largura adequada do contêiner.
- Formulários aumentam de largura quando apropriado, mantendo limites que preservam a legibilidade.
- O fluxo **Voltar**, **Próximo** e a ação final continua funcionando entre todas as etapas.
- Rotas e redirecionamentos permanecem inalterados e funcionais.
- Nenhum componente ultrapassa a viewport ou causa rolagem horizontal desnecessária em desktop, notebook, tablet ou mobile.
- A interface continua funcional nos temas claro e escuro.
- Não existem referências quebradas, erros de TypeScript ou código morto relacionado à sidebar.
- Typecheck e build terminam sem erros.

## Restrições

- Não alterar cálculos, valores, descontos, conversões, validações ou estrutura do store da calculadora.
- Não alterar as rotas existentes nem o fluxo sequencial das etapas.
- Não modificar o layout público da proposta além de correções estritamente necessárias para evitar regressões compartilhadas.
- Não substituir a sidebar por outro menu lateral, drawer ou navegação sobreposta.
- Não adicionar dependências.
- Não criar um novo padrão visual desconectado da identidade atual da aplicação.
- Não resolver overflow ocultando conteúdo necessário.
- Manter acessibilidade, responsividade e suporte aos temas existentes.

## Resultado esperado

A aplicação deixa de ter sidebar e passa a apresentar um layout mais amplo e equilibrado. O cabeçalho e o conteúdo utilizam corretamente a viewport, enquanto formulários, grids, cards, tabelas e resumos se adaptam ao espaço disponível em cada breakpoint. O fluxo atual da calculadora permanece intacto, sem áreas vazias, offsets residuais, rolagem horizontal desnecessária ou código morto relacionado ao menu lateral.
