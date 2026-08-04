# SPEC-007 — Organização da página Custos da Meta

## Contexto

A página `MetaCostsPage`, disponível em `/calculadora/meta`, concentra a configuração das tarifas da Meta utilizadas na proposta. Atualmente, o início da página divide o mesmo nível de destaque entre **País da empresa** e **Moeda de exibição**, embora o país seja fixo como Brasil e não ofereça qualquer interação. Logo abaixo aparecem a referência da tabela oficial, as ações de consulta e restauração e, depois, a edição das categorias de template.

Essa distribuição ocupa espaço com uma informação fixa, separa controles relacionados e reduz a clareza da tarefa principal: conferir valores, informar quantidades e acompanhar o custo total da Meta.

## Objetivo

Reorganizar a página **Custos da Meta** para torná-la mais simples, compacta e fácil de operar, removendo a exibição de **País da empresa** e preservando todas as demais funcionalidades existentes.

## Alterações

- Remover da interface o card **País da empresa**, incluindo bandeira, nome “Brasil” e texto “Mercado fixo da Meta”.
- Manter o Brasil como mercado de referência interno das tarifas atuais; a remoção é somente visual e não deve alterar preços, conversões ou fontes de dados.
- Manter a seleção de **Moeda de exibição**, com todas as moedas atualmente disponíveis e atualização reativa dos valores apresentados.
- Reorganizar a área inicial para dar prioridade à moeda, à referência vigente da tabela e às ações relacionadas.
- Preservar a identificação **Tabela oficial da Meta**, a data ou referência comercial exibida e o aviso de que os valores são aplicáveis ao Brasil.
- Manter as ações **Consultar Meta** e **Restaurar tabela**, com os mesmos comportamentos atuais.
- Organizar a edição das categorias de template para facilitar a leitura da sequência:
  - categoria;
  - valor por template;
  - quantidade;
  - subtotal.
- Manter as categorias e a ordem provenientes de `store.templates`.
- Destacar o **Total Meta** como resultado da seção, sem competir visualmente com os campos de edição.
- Reduzir espaços e blocos redundantes, mantendo uma hierarquia clara entre configuração, referência oficial, itens e total.
- Preservar a navegação por etapas e o comportamento dos botões **Voltar** e **Próximo**.

## Organização Visual Esperada

1. Cabeçalho atual da página, com título e descrição.
2. Área compacta de configuração e referência, contendo:
   - seletor de moeda;
   - referência da tabela oficial;
   - ações de consulta e restauração.
3. Lista ou tabela responsiva com as categorias de template.
4. Total consolidado da Meta ao final dos itens.

Em desktop, os controles relacionados podem ocupar a mesma linha quando houver espaço. Em telas estreitas, devem ser empilhados na ordem de leitura, sem rolagem horizontal.

## Requisitos Técnicos

- Alterar prioritariamente `src/pages/meta/MetaCostsPage.tsx`.
- Continuar usando `CalculatorShell`, `CalculatorCard`, `PageHeading`, `AnimatedSelect`, `CurrencyInput` e `NumberInput`.
- Continuar usando `currencies`, `isCurrencyCode`, `formatCurrency`, `META_PRICING_REFERENCE`, `META_PRICING_SOURCE_URL` e `getMetaPriceInBrl` como fontes existentes.
- Preservar `calculateTotals` para o cálculo do total da Meta.
- Não alterar `CalculatorState`, a estrutura de `TemplateCost` nem as ações do store.
- Não introduzir seletor de país, nova configuração global ou nova fonte de preços.
- Reutilizar tokens, bordas, fundos, tipografia, botões, espaçamentos e estados de tema existentes.
- Manter labels acessíveis nos campos, foco visível e semântica adequada para links e botões.
- Remover o uso do arquivo de bandeira somente se ele ficar sem consumidores em toda a aplicação; não excluir ativos com outras utilizações.

## Critérios de Aceite

- O card e o texto **País da empresa** não aparecem mais em Custos da Meta.
- A página continua indicando, de forma discreta e contextual, que a tabela utilizada corresponde ao Brasil.
- O usuário consegue selecionar a moeda de exibição normalmente.
- **Consultar Meta** continua abrindo a fonte oficial em uma nova aba.
- **Restaurar tabela** continua restaurando os valores oficiais de todas as categorias.
- Valores unitários permanecem editáveis.
- Quantidades permanecem editáveis e respeitam as validações atuais.
- Cada subtotal corresponde a `valor × quantidade`.
- **Total Meta** corresponde à soma dos subtotais e atualiza imediatamente após qualquer edição.
- Marketing, Utilidade e Autenticação permanecem disponíveis na ordem atual.
- A página permanece legível e funcional em desktop e mobile, nos temas claro e escuro.
- A navegação entre as etapas continua funcionando.
- Typecheck e build são concluídos sem erros.

## Restrições

- Não remover ou alterar funcionalidades além da exibição do país.
- Não alterar preços oficiais, regras de conversão ou fórmulas.
- Não modificar a arquitetura existente.
- Não criar uma nova rota, store, serviço ou estado global.
- Não criar um novo padrão visual.
- Não transformar o Brasil em uma opção configurável.
- Não alterar a página de resumo financeiro ou a proposta de venda.
- Manter a identidade visual, responsividade e acessibilidade existentes.
- Evitar duplicação de código e componentes sem reutilização real.

## Resultado Esperado

A página Custos da Meta apresenta somente informações e controles úteis para a composição do custo, com a moeda, a referência oficial, as ações, as categorias e o total organizados em uma sequência clara. A indicação fixa de país deixa de ocupar um card próprio, enquanto todos os cálculos e comportamentos atuais permanecem intactos.
