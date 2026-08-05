# SPEC-013 — Remoção da identificação BRL no PDF da proposta

## Contexto

A proposta usa `formatCurrency` para apresentar os valores no padrão brasileiro, com símbolo monetário e duas casas decimais. Além disso, o rodapé informa **Valores apresentados em BRL.**. Como a impressão do navegador é o mecanismo usado para **Imprimir ou salvar PDF**, essa identificação textual também aparece no documento gerado.

Os cálculos e o snapshot continuam usando `BRL` como código interno da moeda. A solicitação trata somente da apresentação no PDF, não da moeda utilizada nos dados.

## Objetivo

Remover a sigla **BRL** do PDF da proposta, mantendo todos os valores monetários corretamente formatados em Real e sem alterar cálculos, dados ou apresentação necessária na tela.

## Regras de negócio

- Nenhuma ocorrência visível da sigla **BRL** deve aparecer na impressão ou no PDF.
- Os valores devem continuar exibindo o símbolo `R$`, separadores no padrão `pt-BR` e duas casas decimais.
- A remoção da sigla não deve retirar o símbolo monetário dos valores.
- A moeda interna da proposta continua sendo `BRL`.
- Não alterar valores, arredondamentos, descontos, totais ou condições de pagamento.
- O escopo é a saída de impressão/PDF da rota `/proposta`.

## Alterações de interface

- Remover ou ocultar na impressão o texto **Valores apresentados em BRL.** do rodapé.
- Se for necessário manter uma indicação de moeda no PDF, usar texto sem a sigla, como **Valores apresentados em reais.**, sem duplicar o símbolo já exibido nos valores.
- Manter o restante do rodapé institucional e sua organização visual.
- Não alterar a barra de ações, o conteúdo das seções ou a hierarquia do documento.

## Alterações necessárias

- Ajustar `ProposalPreviewPage.tsx` e suas regras de `@media print`.
- Manter o uso de `formatCurrency` ou criar uma opção de apresentação específica somente se a saída atual puder produzir o código `BRL` em algum ambiente.
- Se houver uma opção adicional no formatador, ela não deve mudar o comportamento das páginas internas da calculadora.
- Validar a saída pela pré-visualização de impressão e por **Salvar como PDF**.

## Impacto

- Impacto direto apenas na representação impressa da proposta.
- Possível impacto controlado em `src/lib/currency.ts` caso seja necessária uma opção de formatação explícita.
- Nenhum impacto esperado no store, snapshot, URL da proposta, conversões ou telas internas.

## Dependências

- Depende do fluxo atual de impressão por `window.print()` e dos estilos de impressão da `ProposalPreviewPage`.
- É independente da remoção das ações de copiar e compartilhar prevista na SPEC-015.

## Critérios de aceite

- A sigla **BRL** não aparece em nenhuma página do PDF gerado.
- O rodapé institucional permanece visível e alinhado.
- Todos os valores continuam no formato `R$ 0,00`.
- Totais, subtotais, descontos, parcelas e valores unitários permanecem numericamente idênticos aos exibidos antes do ajuste.
- A proposta na tela não sofre alteração indevida.
- A impressão continua usando fundo branco e não apresenta cortes ou quebras adicionais.
- Typecheck e build terminam sem erros.

## Observações técnicas

- O código `currency` deve continuar presente no modelo para serialização, validação e formatação.
- Evitar substituições globais em strings monetárias; a retirada deve ocorrer no elemento ou na configuração de apresentação correta.
- Testar ao menos proposta sem itens opcionais, proposta completa e implantação parcelada.

## Restrições

- Não substituir `BRL` por outro código de moeda.
- Não remover `R$` nem converter valores.
- Não alterar `CalculatorData`, fórmulas ou snapshot.
- Não implementar gerador de PDF adicional.
- Não modificar outras páginas que usam `formatCurrency` sem necessidade comprovada.

## Resultado esperado

O PDF da proposta continua exibindo valores claros e corretamente formatados em reais, mas deixa de apresentar a sigla técnica **BRL**, preservando integralmente os dados e o layout de impressão.
