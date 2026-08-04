# SPEC-002 — Reorganização da experiência inicial

## Contexto

Atualmente as rotas raiz e `/calculadora` redirecionam diretamente para `/calculadora/meta`. A ordem de `calculatorSteps` é Meta, Produtos, Resumo e Informações, e o logotipo da Sidebar também leva à primeira simulação. Assim, o usuário começa a preencher valores antes de compreender as modalidades disponíveis. A melhoria é necessária para tornar a jornada comercial educativa sem criar um fluxo paralelo.

## Objetivo

Fazer da aba **Informações** o ponto inicial da jornada e conduzir o usuário às etapas de simulação somente depois da contextualização sobre as APIs.

## Alterações

- Alterar os redirecionamentos das rotas raiz e `/calculadora` para `/calculadora/informacoes`.
- Reordenar `calculatorSteps` para: Informações, Custos da Meta, Proposta Conexa e Resumo financeiro.
- Reordenar os itens de `navItems` na Sidebar para refletir a mesma sequência.
- Alterar o destino do logotipo para `/calculadora/informacoes`.
- Na aba Informações, manter o conteúdo educativo definido pela SPEC-001 e permitir o avanço para Custos da Meta pelo botão **Próximo** existente.
- Atualizar numeração e estados habilitado/desabilitado dos controles de etapa a partir da nova ordem.
- Manter acesso direto a qualquer rota pela Sidebar e por URL; a leitura das informações deve ser orientada, não imposta por bloqueio.
- Manter o fallback de rota desconhecida coerente com a nova entrada, redirecionando para Informações.

## Requisitos Técnicos

- Centralizar a ordem das etapas ou garantir que `calculatorSteps` e `navItems` permaneçam sincronizados sem introduzir um novo padrão desnecessário.
- Reutilizar React Router, `CalculatorShell`, Sidebar e controles atuais.
- Não criar tela introdutória, modal obrigatório, armazenamento de progresso ou regra de bloqueio.
- Preservar os dados em memória no store durante toda a navegação.

## Critérios de Aceite

- Acessar `/` ou `/calculadora` abre a aba Informações.
- O fluxo **Próximo** segue Informações → Meta → Produtos → Resumo.
- O fluxo **Voltar** percorre a ordem inversa.
- A Sidebar e o indicador “Etapa X de 4” exibem a mesma ordem.
- O logotipo leva ao início educativo.
- Links diretos para as etapas continuam válidos e não apagam a simulação em memória.
- Rotas desconhecidas não levam a página de erro.

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

Ao entrar na calculadora, o usuário primeiro entende as modalidades disponíveis e depois avança naturalmente pela simulação, usando a mesma navegação e os mesmos componentes já conhecidos.
