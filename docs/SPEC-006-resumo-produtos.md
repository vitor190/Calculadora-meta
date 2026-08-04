# SPEC-006 — Resumo individual dos produtos

## Contexto

Produtos adicionais são armazenados individualmente em `resources`, com nome, quantidade, valor e desconto. Em `SummaryPage`, cada item já é calculado separadamente, mas é exibido como uma linha compacta dentro de `FinancialDetailGroup`; o subtotal líquido aparece embutido no texto de desconto, e os custos não têm hierarquia de card. Isso dificulta a conferência quando há vários produtos.

## Objetivo

Exibir cada produto adicionado em um card próprio, com todos os dados necessários para conferência comercial, preservando os cálculos e o padrão visual existentes.

## Alterações

- Na seção **Produtos adicionais** do resumo, substituir cada linha de produto por um card individual.
- Cada card deve mostrar explicitamente:
  - nome;
  - quantidade;
  - valor unitário;
  - valor bruto (`quantidade × valor unitário`);
  - desconto, quando aplicável, com tipo e valor;
  - subtotal líquido do produto.
- Considerar como “custos envolvidos” os componentes financeiros existentes no modelo atual: valor unitário, valor bruto e desconto. Não inventar taxas que não existam no domínio.
- Manter o total consolidado do grupo de produtos adicionais.
- Renderizar um card por item de `resources`, preservando ordem e chave pelo `id`.
- Manter o estado vazio **Nenhum produto adicionado**.
- Aplicar a mesma clareza na visualização da proposta se ela for considerada um resumo de produtos destinado ao cliente, reutilizando o componente quando houver benefício real.
- Continuar usando `calculateDiscount` e `formatCurrency` como fontes de cálculo e formatação.

## Requisitos Técnicos

- Reutilizar bordas, fundos, tipografia, espaçamento, temas e tokens usados nos cards atuais.
- Evoluir `FinancialDetailRow` ou criar um componente específico somente se ele for reutilizado por mais de uma tela/contexto; evitar duplicar a fórmula de subtotal.
- Não alterar a estrutura de `CalculatorState`, pois os dados necessários já existem em `ProposalItem`.
- Garantir quebra de texto para nomes longos e layout empilhado em telas estreitas.
- Manter cálculos reativos via Zustand e serviços existentes, sem botão de atualização.

## Critérios de Aceite

- Cada produto adicionado gera exatamente um card individual no resumo.
- Nome, quantidade, valor unitário, bruto, desconto aplicável e subtotal líquido estão visíveis e corretos.
- Para produto sem desconto, o subtotal é igual a quantidade × valor unitário e não há informação enganosa de desconto.
- Para desconto percentual ou fixo, o subtotal corresponde à regra de `calculateDiscount`.
- O total do grupo equivale à soma dos subtotais líquidos individuais.
- Vários produtos permanecem distinguíveis e legíveis em desktop e mobile.
- Inclusão, edição e remoção de produtos atualizam os cards imediatamente.
- Estado vazio, acessibilidade e temas atuais são preservados.

## Restrições

- Não alterar funcionalidades não relacionadas.
- Não modificar a arquitetura existente.
- Não criar novos padrões visuais.
- Manter a identidade visual atual.
- Reutilizar componentes sempre que possível.
- Evitar duplicação de código.
- Criar novos componentes apenas quando houver reutilização real.
- Seguir o padrão atual de nomenclatura.
- Seguir a organização atual das pastas.
- Manter responsividade.
- Manter acessibilidade existente.

## Resultado Esperado

O resumo apresenta cada produto como uma unidade financeira fácil de conferir, enquanto o total consolidado e os cálculos atuais continuam corretos e atualizados em tempo real.
