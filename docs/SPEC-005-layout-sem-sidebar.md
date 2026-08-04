# SPEC-005 — Avaliação do layout sem Sidebar

## Contexto

O layout atual é composto por `AppSidebar`, `Backdrop`, `AppHeader` e a área de conteúdo. Em desktop, o conteúdo recebe margem esquerda de `20` ou `70` conforme o estado da Sidebar; em mobile, a navegação é aberta sobre o conteúdo. A remoção direta da Sidebar sem ajustar essas dependências deixaria espaço vazio, controles sem função e possível perda de navegação.

Esta iniciativa é um experimento visual e não autoriza a remoção definitiva da navegação existente.

## Objetivo

Disponibilizar uma variante temporária e reversível sem Sidebar para avaliar aproveitamento de espaço, legibilidade e navegação, preservando a aplicação atual como referência.

## Alterações

- Implementar uma variante de teste ativável de forma explícita e facilmente removível, sem apagar `AppSidebar` ou `sidebar.store`.
- Na variante, ocultar Sidebar e Backdrop e remover as margens laterais dependentes de expansão/hover.
- Manter `AppHeader`; esconder ou adaptar apenas o controle que abre a Sidebar para que não fique inoperante.
- Garantir acesso às quatro etapas por meio dos controles **Voltar/Próximo** já existentes; se for necessário acesso direto, reutilizar o padrão visual do header em vez de inventar uma navegação concorrente.
- Manter `max-w-400` no layout e `max-w-5xl` no `CalculatorShell`, avaliando mudanças de largura somente se documentadas no teste.
- Definir cenários de comparação: desktop amplo, notebook, tablet e mobile; registrar evidências e decisão final.
- Após a avaliação, permitir desativar a variante sem reconstruir os componentes removidos.

## Requisitos Técnicos

- Preferir uma flag local de build/configuração ou uma variante de layout simples; não persistir a preferência do usuário, pois não é uma funcionalidade final.
- Reutilizar React Router, AppHeader, CalculatorShell e controles de etapa.
- Não excluir arquivos nem alterar o contrato do `useSidebar` durante o experimento.
- Testar foco, teclado, contraste, rolagem, largura e mudança de breakpoint.
- Documentar qual configuração corresponde ao layout de produção e qual corresponde ao experimento.

## Critérios de Aceite

- A variante sem Sidebar pode ser ativada para teste e desativada sem perda do layout original.
- Quando ativa, não existe margem vazia ou backdrop associado à Sidebar.
- Nenhum botão de menu sem função permanece visível.
- Todas as etapas continuam acessíveis.
- Conteúdo, cards e alinhamentos permanecem legíveis nos breakpoints existentes.
- Não há rolagem horizontal ou regressão nos temas claro e escuro.
- O resultado da avaliação é registrado antes de qualquer decisão de remoção definitiva.

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
- Não remover a Sidebar definitivamente nesta SPEC.

## Resultado Esperado

A equipe consegue comparar a experiência com e sem Sidebar em uma variante controlada, sem comprometer a navegação nem perder a implementação atual.
