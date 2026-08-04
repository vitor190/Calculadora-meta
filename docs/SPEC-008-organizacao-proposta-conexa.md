# SPEC-008 — Organização visual da Proposta Conexa

## Contexto

A página `ProposalPreviewPage`, disponível em `/proposta`, apresenta ao cliente a proposta comercial gerada a partir do detalhamento financeiro. Hoje, cabeçalho, ações, totais e seções usam pesos visuais muito próximos. Informações principais, detalhes de cálculo, recursos incluídos e estados vazios acabam competindo pela atenção, o que dificulta localizar o investimento e distinguir custos recorrentes da implantação.

## Objetivo

Reorganizar a **Proposta Conexa** como um documento comercial claro, agradável e fácil de conferir, aplicando a mesma lógica de hierarquia, agrupamento e leitura sequencial adotada em **Custos da Meta**, sem alterar dados, cálculos ou funcionalidades existentes.

## Princípios de organização

- Priorizar o valor mensal e o valor de implantação.
- Separar custos recorrentes de custos pontuais.
- Apresentar cada grupo na sequência item, composição, desconto e subtotal líquido.
- Reduzir ruído visual em recursos incluídos e estados vazios.
- Manter o documento compreensível sem depender de cores.
- Preservar na impressão a hierarquia existente na tela.

## Alterações

### Cabeçalho e ações

- Manter identidade da Infarma, título **Proposta comercial**, nome **Conexa** e data de emissão.
- Tornar o cabeçalho mais compacto, sem perder a identificação do documento.
- Organizar **Copiar link**, **Compartilhar** e **Imprimir ou salvar PDF** em uma barra compacta e separada do conteúdo.
- Manter a alternância de tema como ação auxiliar, com label acessível.
- Permitir quebra organizada das ações em telas estreitas, sem rolagem horizontal.
- Ocultar toda a barra de ações na impressão.

### Resumo do investimento

- Exibir no início:
  - **Investimento mensal**, referente a `totals.recurringTotal`;
  - **Implantação**, referente a `totals.implementationTotal`;
  - condição da implantação: pagamento único ou quantidade e valor das parcelas.
- Dar maior destaque ao investimento mensal.
- Identificar implantação como cobrança separada e pontual.
- Usar algarismos tabulares nos valores.
- Não somar mensalidade e implantação em um único destaque.

### Composição mensal

- Agrupar **Plano Conexa**, **Custos da Meta** e **Produtos adicionais** sob **Composição mensal**.
- Exibir os grupos nessa ordem: Plano Conexa, Custos da Meta e Produtos adicionais.
- Distinguir claramente título, itens e subtotal de cada grupo.
- Exibir ao final **Total mensal**, igual a `totals.recurringTotal`.

### Plano Conexa

- Exibir nome e descrição, valor original quando houver desconto, desconto e mensalidade líquida.
- Não exibir linha de desconto zerado.
- Tratar recursos como conteúdo complementar, em lista compacta, sem aparência de cobrança individual.
- Usar duas colunas para recursos somente quando houver largura suficiente.
- Se nenhum plano estiver selecionado, não apresentar card vazio.

### Custos da Meta

- Exibir somente categorias com `quantity > 0`.
- Apresentar categoria, quantidade, valor unitário e subtotal (`quantidade × valor unitário`).
- Exibir **Total Meta**, igual a `totals.meta`.
- Omitir a seção inteira quando nenhuma categoria tiver quantidade.

### Produtos adicionais

- Exibir por produto: nome, quantidade, valor unitário, valor bruto, desconto quando houver e subtotal líquido.
- Usar `calculateDiscount` e deixar explícita a relação `bruto − desconto = líquido`.
- Não exibir desconto zerado nem valor original redundante.
- Exibir subtotal do grupo igual a `totals.resources`.
- Omitir a seção inteira quando não houver produtos.

### Implantação

- Manter implantação fora da composição mensal.
- Exibir por serviço: nome, valor bruto, desconto quando houver e subtotal líquido.
- Fechar a seção com total líquido, condição de pagamento e valor da parcela quando houver parcelamento.
- Não apresentar parcelamento como item cobrado.
- Sem serviços, mostrar apenas **Sem custo de implantação** no resumo e omitir o detalhamento vazio.

### Estados vazios e rodapé

- Omitir grupos opcionais sem itens.
- Manter a tela **Proposta não encontrada**, com orientação para gerar novo link e suporte aos dois temas.
- Manter no rodapé a identificação da Infarma e a moeda usada.
- Não adicionar dados do cliente, validade, textos jurídicos ou condições inexistentes no modelo.

## Organização Visual Esperada

1. Barra de ações fora do documento.
2. Cabeçalho institucional compacto.
3. Resumo do investimento, com mensalidade em maior destaque.
4. **Composição mensal**, contendo apenas grupos aplicáveis.
5. Fechamento destacado do total mensal.
6. **Implantação**, quando aplicável, com total e condição de pagamento.
7. Rodapé institucional e moeda.

Em desktop, descrições e valores podem ocupar colunas alinhadas, com subtotais à direita. Em mobile, cada item deve ser empilhado na ordem natural de leitura, com subtotal após seus componentes e sem rolagem horizontal. A tela deve permanecer legível nos temas claro e escuro.

## Impressão e PDF

- Usar fundo branco, independentemente do tema ativo.
- Ocultar botões e controles interativos.
- Preservar contraste sem depender de fundos escuros.
- Evitar quebra de página dentro de item financeiro, resumo ou fechamento de seção quando o navegador permitir.
- Permitir quebra entre seções para evitar grandes espaços vazios.
- Evitar cortes de logo, textos e valores nas margens.
- Manter resultado adequado à impressão e a **Salvar como PDF**.

## Requisitos Técnicos

- Alterar prioritariamente `src/pages/proposal/ProposalPreviewPage.tsx`.
- Continuar usando `readProposalSnapshot`, `calculateTotals`, `calculateDiscount`, `formatCurrency` e `commercialCatalog`.
- Preservar `copyLink`, compartilhamento nativo com fallback, tema e `window.print()`.
- Preservar `/proposta` e o formato do parâmetro `dados`.
- Não alterar `CalculatorData`, `CalculatorTotals`, store ou fórmulas.
- Reutilizar tokens visuais existentes.
- Reutilizar componentes financeiros somente se forem adequados ao contexto público, sem acoplar a proposta ao store.
- Extrair componentes locais pequenos quando reduzirem repetição.
- Suportar nomes e descrições longos.
- Usar títulos em ordem lógica, elementos semânticos, labels acessíveis, foco visível e áreas de toque adequadas.
- Tratar falhas de clipboard ou compartilhamento sem impedir as demais ações.

## Critérios de Aceite

- O investimento mensal é o primeiro valor de maior destaque.
- Implantação fica separada e informa pagamento único ou parcelamento corretamente.
- A composição mensal segue Plano, Meta e Produtos adicionais.
- Itens da Meta mostram quantidade, valor unitário e subtotal corretos.
- Produtos mostram bruto, desconto aplicável e líquido corretos.
- Serviços mostram bruto, desconto aplicável e líquido corretos.
- Descontos zerados não aparecem.
- Total mensal corresponde a `totals.recurringTotal`.
- Total da implantação corresponde a `totals.implementationTotal`.
- Grupos opcionais ausentes não geram seções vazias.
- Recursos do plano continuam visíveis sem parecer cobranças.
- Copiar, compartilhar, tema e imprimir/PDF mantêm seus comportamentos.
- Dados ausentes ou inválidos continuam exibindo **Proposta não encontrada**.
- Não há rolagem horizontal em desktop ou mobile.
- Impressão/PDF usa fundo branco, oculta ações e evita cortes inadequados.
- Typecheck e build terminam sem erros.

## Restrições

- Não alterar valores, fórmulas, descontos ou parcelamento.
- Não modificar geração, serialização ou validação do snapshot.
- Não criar rota, store, serviço ou estado global.
- Não tornar a proposta editável.
- Não adicionar campos sem suporte no modelo atual.
- Não somar implantação ao mensal em um único destaque.
- Não adicionar biblioteca, geração de PDF no servidor ou dependência.
- Não criar padrão visual desconectado do restante da aplicação.
- Manter identidade visual, acessibilidade, responsividade e temas.

## Resultado Esperado

A Proposta Conexa passa a funcionar como um documento comercial organizado: o cliente identifica imediatamente o investimento mensal e a implantação, entende a composição de cada valor e encontra descontos e condições de pagamento sem ambiguidade. A página fica mais compacta, equilibrada e adequada para compartilhamento, celular, impressão e PDF, preservando os dados e cálculos atuais.
