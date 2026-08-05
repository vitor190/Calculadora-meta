# SPEC-016 — Estrutura do PDF de custos por categoria e página

## Contexto

A proposta comercial da rota `/proposta` é convertida em PDF pela impressão nativa do navegador, acionada por **Imprimir ou salvar PDF**. Todo o documento é montado em `ProposalPreviewPage.tsx`, e as regras de `@media print` reorganizam a composição mensal, compactam os itens financeiros e tentam impedir que seções sejam divididas entre páginas.

Atualmente, `proposal-composition` reúne plano, produtos adicionais, fechamento mensal e estimativa da Meta, enquanto a implantação é renderizada em um bloco separado. Na impressão, a ordem visual é alterada por CSS e toda `.proposal-section` recebe `break-inside: avoid`. Essa combinação trata uma categoria inteira como indivisível: categorias pequenas podem permanecer agrupadas, mas categorias com muitos itens podem ultrapassar a área útil da folha, provocar espaços excessivos, deslocar conteúdo de forma imprevisível ou gerar quebras inadequadas. Cabeçalhos, itens e totais também não possuem uma estratégia explícita para continuar uma categoria em outra página.

## Objetivo

Reestruturar a apresentação dos custos no PDF para organizar cada grupo financeiro por categoria e distribuir seu conteúdo corretamente entre páginas, mantendo a hierarquia visual, a legibilidade e todos os cálculos existentes.

## Regras de negócio

- Manter as categorias financeiras atuais e seus significados:
  - Plano Conexa;
  - Estimativa Meta;
  - Produtos adicionais;
  - Serviços de implantação.
- Apresentar os itens dentro da categoria à qual pertencem, preservando a ordem atual dos dados.
- Manter a Estimativa Meta separada da Mensalidade Infarma, conforme a regra comercial vigente.
- Manter descontos, valores brutos, valores líquidos, quantidades, valores unitários, subtotais, totais e condição de pagamento numericamente inalterados.
- Não criar, remover, combinar ou reclassificar itens financeiros para solucionar a paginação.
- O total de cada categoria deve permanecer associado visualmente à respectiva lista de itens.
- O fechamento da Mensalidade Infarma deve continuar representando somente os valores hoje considerados por `totals.infarmaRecurringTotal`.
- O total da implantação e sua condição de pagamento devem continuar vinculados aos serviços de implantação.

## Estrutura visual esperada

1. Cabeçalho institucional e resumo do investimento.
2. Título da composição mensal.
3. Categorias recorrentes, cada uma com:
   - cabeçalho da categoria;
   - itens e respectivos detalhes de preço;
   - subtotal ou total da categoria, quando existente.
4. Fechamento da Mensalidade Infarma.
5. Estimativa Meta em bloco próprio, sem ser incorporada ao fechamento mensal da Infarma.
6. Seção de implantação, quando houver, com itens, total e condição de pagamento.
7. Rodapé institucional.

A ordem final deve respeitar a separação comercial já adotada pela proposta. Eventuais mudanças de ordem feitas apenas para impressão devem ser explícitas e não podem alterar a versão exibida em tela sem necessidade.

## Regras de paginação

- Considerar a área útil de uma página A4 em orientação retrato e as margens definidas em `@page`.
- Evitar quebra interna de um item financeiro individual, de um subtotal/total e do bloco de condição de pagamento.
- Não deixar o cabeçalho de uma categoria isolado no final de uma página; ele deve permanecer com pelo menos o primeiro item da categoria.
- Não deixar o total de uma categoria isolado no início da página seguinte quando houver espaço para mantê-lo com o último item.
- Permitir que uma categoria extensa continue em outra página. A regra de não quebra não deve ser aplicada à categoria inteira quando seu conteúdo puder exceder uma página.
- Quando uma categoria continuar em outra página, preservar identificação suficiente para que os itens não pareçam pertencer à categoria anterior ou seguinte. Se necessário, repetir ou criar um cabeçalho de continuação somente na impressão.
- Manter títulos de seção, subtotais, totais e observações associados ao conteúdo correspondente.
- Evitar sobreposição com o rodapé fixo, reservando espaço inferior compatível em todas as páginas.
- Evitar páginas em branco, grandes vazios injustificados e cortes de texto, bordas ou valores monetários.
- Não depender de uma quantidade fixa de categorias ou itens.

## Alterações necessárias

- Ajustar prioritariamente `src/pages/proposal/ProposalPreviewPage.tsx` e suas regras de `@media print`.
- Revisar a estrutura dos componentes locais `Section`, `FinancialItem` e `GroupTotal` para expor classes ou elementos semânticos adequados ao controle de quebra de página.
- Substituir a regra global que impede a quebra de toda `.proposal-section` por regras mais granulares para cabeçalho, item, fechamento e grupos de continuação.
- Revisar a ordenação de `.proposal-plan`, `.proposal-resources`, `.proposal-meta`, do fechamento mensal e da `.proposal-implementation` para que a sequência impressa seja determinística.
- Se a paginação confiável exigir divisão prévia dos itens, extrair uma função ou componente reutilizável e determinístico, sem duplicar a renderização das fórmulas financeiras.
- Manter `window.print()` como mecanismo de impressão e geração do PDF.
- Manter `formatCurrency`, `calculateDiscount` e `calculateTotals` como fontes dos valores apresentados.
- Preservar as regras de impressão que removem a barra de ações e adaptam cores, tipografia e dimensões para papel.

## Cenários de validação

- Proposta mínima, contendo somente um plano e sem itens opcionais.
- Proposta com uma única categoria de poucos itens.
- Proposta completa, com plano, Meta, produtos adicionais e implantação.
- Categoria com itens suficientes para atravessar uma quebra de página.
- Duas ou mais categorias cuja transição ocorra próxima ao fim de uma página.
- Muitos itens em Meta, produtos adicionais e implantação, validando mais de duas páginas.
- Itens com nomes e descrições longos, descontos e valores monetários de maior largura.
- Implantação parcelada e em pagamento único.
- Geração pela pré-visualização de impressão e pela opção **Salvar como PDF**.

## Critérios de aceite

- Os custos aparecem agrupados na categoria correta em todas as páginas do PDF.
- Cada categoria mantém cabeçalho, itens e total visualmente identificáveis.
- Categorias extensas podem continuar em páginas seguintes sem corte ou sobreposição.
- Nenhum cabeçalho de categoria fica isolado sem conteúdo relacionado no fim de uma página.
- Nenhum item financeiro, subtotal, total ou condição de pagamento é quebrado internamente de forma incorreta.
- Cabeçalhos, subtotais, totais e observações permanecem associados à categoria correta.
- O rodapé não encobre conteúdo e permanece consistente nas páginas em que for exibido.
- O PDF não apresenta páginas em branco, sobreposições, conteúdo cortado ou espaços excessivos causados por uma categoria tratada como bloco indivisível.
- O layout funciona para documentos pequenos, médios e grandes, independentemente da quantidade de itens.
- Valores, descontos, subtotais, totais, parcelas e arredondamentos são idênticos aos anteriores à alteração.
- A proposta em tela continua legível e funcional nos temas claro e escuro.
- A geração do PDF continua disponível pelo botão atual.
- Typecheck e build são concluídos sem erros.

## Impacto

- Impacto direto na estrutura HTML e nos estilos de impressão da proposta comercial.
- Possível impacto controlado nos componentes locais de apresentação financeira da `ProposalPreviewPage` para permitir agrupamento e paginação mais granular.
- Nenhum impacto esperado no store, no snapshot compartilhado, nas rotas, no catálogo comercial ou nos serviços de cálculo.

## Dependências

- Depende do fluxo atual de impressão do navegador por `window.print()` e do suporte às propriedades CSS de fragmentação para impressão.
- Deve considerar em conjunto as regras de rodapé, margem A4 e ocultação de elementos exclusivas de `@media print`.
- Deve preservar as alterações de apresentação do PDF definidas na SPEC-013 e as ações restantes da proposta definidas na SPEC-015.

## Restrições

- Não alterar `CalculatorData`, `CalculatorTotals`, o snapshot da proposta ou sua serialização.
- Não alterar fórmulas, descontos, conversões monetárias, arredondamentos ou regras comerciais.
- Não implementar uma biblioteca ou um gerador de PDF adicional sem necessidade comprovada.
- Não fixar manualmente a quantidade de itens por página sem considerar a altura variável do conteúdo.
- Não duplicar cálculos ou manter duas fontes distintas para os mesmos valores.
- Não resolver a paginação reduzindo o conteúdo a ponto de prejudicar a leitura.
- Não introduzir um novo padrão visual incompatível com a proposta existente.
- Não alterar outras páginas da calculadora sem relação direta com a geração do PDF.

## Resultado esperado

O PDF apresenta uma sequência financeira clara e previsível, com os custos corretamente separados por categoria e distribuídos entre páginas A4. Categorias curtas permanecem coesas e categorias extensas continuam de forma controlada, sem separar indevidamente cabeçalhos, itens e totais, preservando integralmente os dados e cálculos atuais.
