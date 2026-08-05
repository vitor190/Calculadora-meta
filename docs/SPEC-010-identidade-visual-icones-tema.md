# SPEC-010 — Identidade visual dos ícones por tema

## Contexto

A aplicação possui dois ativos compactos da identidade da Infarma em `frontend/public`: `favicon.svg` e `icon-infarma.png`. Atualmente, o cabeçalho e o documento da proposta não aplicam uma regra única para alternar esses ativos conforme o tema. O `AppHeader` usa sempre `/favicon.svg`, enquanto a proposta usa `/favicon.svg` no documento e `/logo-infarma.png` no estado de proposta não encontrada.

Essa diferença reduz a consistência visual entre a área interna e a proposta pública, principalmente no tema escuro.

## Objetivo

Padronizar a identidade visual compacta da Infarma no cabeçalho e na página de proposta, exibindo o ativo adequado para cada tema sem alterar o funcionamento da alternância de tema ou a estrutura das páginas.

## Regras de negócio

- No tema claro, exibir `/favicon.svg`.
- No tema escuro, exibir `/icon-infarma.png`.
- Considerar `favicon.svg` como o ativo correspondente à referência `@favicons.svg` informada na demanda, pois esse é o nome existente no projeto.
- A troca deve ocorrer imediatamente quando o usuário alternar o tema, sem recarregar a página.
- A regra deve ser aplicada no `AppHeader` e em todos os estados da `ProposalPreviewPage`, incluindo proposta válida e proposta não encontrada.
- Na impressão ou geração de PDF, usar a identidade prevista para fundo claro, independentemente do tema ativo na tela.
- Textos alternativos e nomes acessíveis devem continuar identificando a Infarma sem duplicar informação para leitores de tela.

## Alterações de interface

- Substituir o ícone estático do cabeçalho por uma renderização dependente de `theme`.
- Aplicar a mesma lógica ao ícone do cabeçalho institucional da proposta.
- Padronizar o estado **Proposta não encontrada** para usar os mesmos ativos e a mesma regra de tema.
- Manter dimensões, alinhamento, proporção e área ocupada atuais para evitar deslocamentos durante a troca.
- Evitar filtros CSS que alterem indevidamente as cores originais dos arquivos.

## Alterações necessárias

- Reutilizar o estado fornecido por `useTheme` nos componentes envolvidos.
- Centralizar a seleção do caminho do ativo em uma função ou componente pequeno se isso evitar repetição real.
- Garantir que ambos os arquivos sejam carregáveis a partir de `frontend/public`.
- Ajustar as regras de `@media print` da proposta para garantir o ativo claro no PDF.
- Não modificar o favicon do documento HTML, pois esta SPEC trata dos ícones renderizados na interface.

## Impacto

- `frontend/src/layout/app-header.tsx`.
- `frontend/src/pages/proposal/ProposalPreviewPage.tsx`.
- Possível extração de componente local e reutilizável para a marca temática.
- Nenhum impacto esperado em rotas, dados da calculadora, cálculos, snapshot da proposta ou store de tema.

## Dependências

- Depende da infraestrutura atual de tema em `src/store/theme.store.ts`.
- Deve ser compatibilizada com a SPEC-011, que altera os demais elementos do cabeçalho, e com a SPEC-012, que adiciona o stepper ao mesmo espaço.
- Não depende da implementação das demais SPECs para funcionar isoladamente.

## Critérios de aceite

- O cabeçalho exibe `/favicon.svg` no tema claro.
- O cabeçalho exibe `/icon-infarma.png` no tema escuro.
- A proposta válida exibe o ativo correto em ambos os temas.
- O estado **Proposta não encontrada** exibe o ativo correto em ambos os temas.
- A troca acontece imediatamente após alternar o tema.
- Não há salto de layout, distorção ou perda de proporção dos ícones.
- A impressão e o PDF mantêm o ícone adequado para fundo branco e com contraste legível.
- Acessibilidade, tema, histórico, impressão e demais ações continuam funcionando.
- Typecheck e build terminam sem erros.

## Observações técnicas

- Preferir a seleção explícita `theme === 'dark'` em vez de depender somente de variantes CSS quando isso tornar o comportamento de impressão mais previsível.
- Se forem renderizados dois elementos para controle exclusivo por CSS, o elemento oculto não deve permanecer exposto à árvore de acessibilidade.
- Validar o resultado nos temas claro e escuro e na pré-visualização de impressão.

## Restrições

- Não criar novos ativos nem editar os arquivos de imagem existentes.
- Não alterar cores, dimensões ou estrutura geral do cabeçalho e da proposta além do necessário para a troca dos ícones.
- Não modificar a persistência ou a regra de seleção do tema.
- Não aplicar esta regra a logotipos ou imagens que estejam fora do cabeçalho e da página de proposta.

## Resultado esperado

A marca compacta da Infarma passa a responder ao tema de forma consistente no cabeçalho e na proposta, usando o SVG no modo claro e o PNG no modo escuro, sem regressões visuais ou funcionais.
