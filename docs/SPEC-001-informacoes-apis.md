# SPEC-001 — Informações sobre API Oficial e API Não Oficial

## Contexto

A aplicação possui a rota `/calculadora/informacoes`, renderizada por `InformationPage`, e a apresenta como a quarta etapa do fluxo. Hoje essa aba contém somente cinco notas curtas sobre cobrança de templates e janela de atendimento da Meta. Ela não explica as duas modalidades de API, não compara riscos e benefícios e pode deixar o vendedor sem argumentos claros para orientar o cliente.

A explicação deve permanecer nessa aba, pois criar outra tela duplicaria o fluxo e contrariaria a navegação já estabelecida.

## Objetivo

Transformar a aba **Informações** em um conteúdo simples e educativo que permita compreender e comparar a API Oficial e a API Não Oficial, incluindo o funcionamento da janela de atendimento de 24 horas.

## Alterações

- Manter a rota `/calculadora/informacoes`, o item da Sidebar e a estrutura de `CalculatorShell`, `CalculatorCard` e `PageHeading`.
- Reorganizar o conteúdo de `InformationPage` em blocos visualmente distintos, dentro da mesma aba.
- Criar um bloco **API Oficial** informando que ela:
  - usa a API Oficial do WhatsApp Business;
  - possui suporte oficial da Meta e maior estabilidade;
  - é indicada para empresas que priorizam confiabilidade;
  - segue o modelo de cobrança por conversas aplicável pela Meta.
- Criar um bloco **API Não Oficial** informando que ela:
  - não possui cobrança da Meta;
  - normalmente tem menor custo operacional;
  - pode sofrer instabilidades;
  - possui risco de bloqueio ou banimento do número;
  - não possui suporte oficial da Meta.
- Incluir uma comparação objetiva de vantagens e limitações, sem induzir equivalência de confiabilidade entre as modalidades.
- Explicar que uma mensagem iniciada pelo cliente abre uma janela de atendimento de 24 horas; dentro dela o atendente pode responder livremente sem iniciar nova conversa; após o encerramento, novos contatos podem gerar cobrança conforme a categoria aplicável.
- Revisar os textos atuais e remover repetições ou afirmações conflitantes.
- Manter linguagem não técnica, frases curtas e conteúdo útil durante uma negociação comercial.

## Requisitos Técnicos

- Reutilizar os componentes de `src/components/calculator-ui.tsx`, estilos de cards, ícones Lucide e tokens presentes em `src/lib/ui.ts` e `src/index.css`.
- Preservar modo claro/escuro, grid responsivo e padrões de espaçamento atuais.
- Preferir dados estruturados e mapeamento de conteúdo, como já ocorre com `items`, quando isso reduzir repetição.
- Não criar rota, store, serviço, modal ou estado global para conteúdo estático.
- Validar o texto comercial com a regra vigente da Meta antes da publicação caso a terminologia de cobrança tenha sido atualizada.

## Critérios de Aceite

- A aba Informações apresenta API Oficial, API Não Oficial, comparação e janela de 24 horas.
- Todos os pontos descritos em **Alterações** aparecem em linguagem simples.
- Não há conteúdo duplicado nem uma nova tela para o tema.
- A navegação atual continua funcionando por Sidebar e botões de etapa.
- O conteúdo é legível sem rolagem horizontal em desktop e mobile.
- Modo claro, modo escuro e acessibilidade existentes são preservados.

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

O vendedor encontra, na aba Informações já existente, uma explicação clara das duas modalidades e consegue orientar o cliente sobre custos, estabilidade, suporte, riscos e janela de atendimento sem sair do fluxo da calculadora.
