# SPEC-004 — Correção da visualização da proposta

## Contexto

O botão **Visualizar proposta**, em `SummaryPage`, cria uma URL com o estado serializado no parâmetro `dados` e abre `/proposta` em uma nova aba. `ProposalPreviewPage` valida esse parâmetro e já apresenta um estado vazio quando ele está ausente ou inválido. Apesar de a base estar implementada, o fluxo precisa ser investigado ponta a ponta: serialização extensa na query string, bloqueio de popup, dados inválidos e exceções nas APIs de compartilhamento podem interromper a experiência. Há também textos aparentando problemas de codificação no arquivo da proposta.

## Objetivo

Garantir que **Visualizar proposta** sempre resulte em uma proposta válida ou em um estado informativo dentro do padrão visual, nunca em página de erro, tela em branco ou falha silenciosa.

## Alterações

- Reproduzir e documentar o erro nos navegadores suportados, com propostas vazias, parciais e completas.
- Validar o contrato entre `createProposalSnapshot`, `createProposalUrl` e `readProposalSnapshot`.
- Corrigir a causa encontrada preservando o modelo frontend e sem persistência.
- Tratar explicitamente falha ao abrir nova aba, URL inválida, payload ausente, JSON inválido e dados incompatíveis.
- Se a proposta completa ainda não puder ser exibida, manter/criar um placeholder em `/proposta` com logo, título, explicação e ação clara para retornar à calculadora.
- No estado inválido atual, acrescentar uma forma navegável de retorno, sem depender apenas da instrução textual.
- Corrigir textos com caracteres corrompidos na proposta.
- Proteger as ações **Copiar link** e **Compartilhar** contra rejeições, ausência das APIs e contexto sem permissão, oferecendo feedback ao usuário.
- Manter impressão/PDF, tema e cálculo dos totais quando houver uma proposta válida.

## Requisitos Técnicos

- Reutilizar rota `/proposta`, `ProposalPreviewPage`, serviços existentes, `calculateTotals`, `formatCurrency` e catálogo comercial.
- Não adicionar backend, banco de dados ou dependência pesada.
- A validação do snapshot deve continuar rejeitando estruturas inseguras ou inválidas.
- Erros esperados do navegador devem ser tratados sem exceções não capturadas no console.
- Cobrir ao menos geração/leitura de snapshot válido e fallback de snapshot inválido com testes, se a infraestrutura de testes for adicionada ao projeto; na ausência dela, registrar validação manual reproduzível.

## Critérios de Aceite

- Clicar em Visualizar proposta abre a proposta correspondente aos dados atuais.
- Planos, templates, produtos, implantação, descontos, moeda e totais exibidos correspondem ao resumo.
- Payload ausente, truncado ou inválido exibe um placeholder responsivo e uma ação de retorno.
- Popup bloqueado ou falha de abertura produz feedback na tela atual.
- Copiar, compartilhar e imprimir não derrubam a página quando a API correspondente não estiver disponível.
- Não há tela branca, rota sem tratamento ou caracteres corrompidos.
- A proposta funciona em desktop e mobile, nos temas claro e escuro.

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

O usuário visualiza uma proposta coerente com a simulação e, diante de qualquer dado ou capacidade indisponível, recebe uma tela estável e orientativa em vez de um erro.
