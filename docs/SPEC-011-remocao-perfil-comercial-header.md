# SPEC-011 — Remoção do perfil Comercial do header

## Contexto

O `AppHeader` exibe um bloco de perfil com avatar, os textos **Comercial** e **Conexa** e uma seta de expansão. Ao acioná-lo, é aberto um menu com a identificação **Time Comercial**, **Calculadora Conexa** e o acesso a **Histórico de Versões**.

O perfil não representa autenticação, seleção de usuário ou configuração de conta. Entretanto, o histórico de versões é uma funcionalidade válida e hoje depende desse menu para permanecer acessível.

## Objetivo

Remover toda a apresentação do perfil **Comercial** do cabeçalho, preservando a alternância de tema, a identidade da aplicação e o acesso ao histórico de versões.

## Regras de negócio

- Remover avatar, textos **Comercial**, **Conexa**, **Time Comercial**, seta e menu de perfil.
- Remover o estado, a referência de elemento, o listener de clique externo e a lógica usados exclusivamente para abrir e fechar esse menu.
- O histórico de versões não deve ser removido.
- Disponibilizar o histórico como ação independente no cabeçalho, com ícone, nome acessível e o mesmo modal atual.
- A ação independente deve abrir e fechar `VersionHistoryModal` sem alterar seu conteúdo.
- A alternância de tema e a marca da aplicação devem permanecer funcionais.

## Alterações de interface

- Remover o agrupamento visual do perfil no lado direito do cabeçalho.
- Adicionar uma ação compacta de histórico junto aos controles auxiliares do cabeçalho.
- Em telas estreitas, permitir representação somente por ícone, mantendo `aria-label` ou texto acessível.
- Manter dimensões, estados de hover, foco, bordas e cores compatíveis com o botão de tema.
- Reequilibrar o espaço do cabeçalho sem deixar lacunas ou desalinhamentos.

## Alterações necessárias

- Simplificar `src/layout/app-header.tsx` e seus imports.
- Preservar apenas o estado necessário para abrir e fechar `VersionHistoryModal`.
- Manter `version-history-modal.tsx` inalterado, salvo ajuste estritamente necessário de integração.
- Remover código morto relacionado ao dropdown de perfil.

## Impacto

- Impacto direto no cabeçalho de todas as rotas internas em `/calculadora/*`.
- O acesso ao histórico muda de um item dentro de dropdown para uma ação direta.
- Não há impacto esperado na proposta pública, nas rotas, nos dados, nos cálculos ou na persistência do tema.

## Dependências

- Deve ser implementada em coordenação visual com a SPEC-010 e a SPEC-012, pois as três modificam o `AppHeader`.
- A funcionalidade de histórico depende de `VersionHistoryModal` e não pode ser eliminada como consequência da remoção do perfil.

## Critérios de aceite

- O avatar e os textos **Comercial**, **Conexa** e **Time Comercial** não aparecem no cabeçalho.
- Não existe dropdown de perfil nem seta de expansão.
- Não permanecem estado, listener, ref ou imports exclusivos do dropdown removido.
- O histórico de versões continua acessível diretamente pelo cabeçalho.
- O modal de histórico abre e fecha normalmente.
- O botão de tema continua funcionando.
- A marca e os demais elementos do cabeçalho permanecem alinhados em desktop, tablet e mobile.
- Navegação, responsividade e acessibilidade não apresentam regressões.
- Typecheck e build terminam sem erros.

## Observações técnicas

- A ação de histórico deve usar elemento `button`, foco visível e nome acessível.
- Não manter um dropdown vazio apenas para hospedar o histórico.
- Caso a SPEC-012 seja implementada simultaneamente, reservar no cabeçalho espaço suficiente para o stepper sem comprimir as ações auxiliares.

## Restrições

- Não remover ou reescrever o conteúdo do histórico de versões.
- Não introduzir autenticação, perfil real ou novo menu de usuário.
- Não alterar o comportamento do tema.
- Não modificar páginas ou stores sem relação com o cabeçalho.

## Resultado esperado

O cabeçalho deixa de simular um perfil de usuário e fica mais direto, mantendo a marca, o tema e o histórico de versões como funcionalidades independentes e acessíveis.
