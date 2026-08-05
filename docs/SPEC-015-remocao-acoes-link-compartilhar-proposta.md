# SPEC-015 — Remoção das ações de link e compartilhamento da proposta

## Contexto

A barra de ações da `ProposalPreviewPage` oferece alternância de tema, **Copiar link**, **Compartilhar** e **Imprimir ou salvar PDF**. A ação de compartilhamento usa `navigator.share` e recorre à cópia do link quando a API nativa não está disponível ou falha. A página também mantém uma mensagem temporária para informar sucesso ou erro da cópia.

As ações de copiar e compartilhar não devem mais fazer parte da proposta pública. Tema e impressão continuam necessários.

## Objetivo

Remover exclusivamente as ações **Copiar link** e **Compartilhar** da página de proposta, preservando o documento, a alternância de tema e a impressão/PDF.

## Regras de negócio

- Remover o botão **Copiar link**.
- Remover o botão **Compartilhar**.
- Remover a integração com `navigator.clipboard`.
- Remover a integração com `navigator.share` e seu fallback para cópia.
- Remover mensagens temporárias, timers, estado, handlers e tratamento de erros usados somente por essas duas ações.
- Manter o botão de alternância de tema.
- Manter o botão **Imprimir ou salvar PDF** e seu uso de `window.print()`.
- Manter a URL pública e o mecanismo de leitura do snapshot inalterados.

## Alterações de interface

- Reorganizar a barra de ações para conter somente tema e impressão/PDF.
- Alinhar as ações restantes sem preservar espaço vazio para os botões removidos.
- Manter a quebra responsiva, foco visível, labels acessíveis e áreas de toque atuais.
- A barra continua oculta na impressão.
- Não alterar cabeçalho institucional, resumo, seções financeiras ou rodapé da proposta.

## Alterações necessárias

- Simplificar `src/pages/proposal/ProposalPreviewPage.tsx`.
- Remover imports de ícones usados exclusivamente por copiar e compartilhar.
- Remover `actionMessage`, `copyLink`, `share` e qualquer JSX associado.
- Preservar a classe `proposal-actions` para as ações restantes e para a regra de impressão, salvo renomeação justificada.
- Confirmar que não permaneçam referências a clipboard ou compartilhamento na página.

## Impacto

- Impacto direto apenas na barra de ações da proposta pública.
- Usuários deixam de copiar ou compartilhar a URL por botões internos, mas a URL e o conteúdo continuam acessíveis pelo navegador.
- Nenhum impacto esperado na geração do snapshot, na rota `/proposta`, nos dados, nos cálculos ou nas páginas internas.

## Dependências

- É independente da SPEC-013; ambas alteram a proposta, mas em regiões e comportamentos distintos.
- Deve preservar a troca de ícones por tema definida na SPEC-010 quando as duas forem implementadas.

## Critérios de aceite

- **Copiar link** não aparece na proposta.
- **Compartilhar** não aparece na proposta.
- Não existem chamadas a `navigator.clipboard` ou `navigator.share` na `ProposalPreviewPage`.
- Não permanecem mensagem, timer, handler, fallback ou imports mortos relacionados às ações removidas.
- Alternar tema continua funcionando.
- **Imprimir ou salvar PDF** continua abrindo a impressão do navegador.
- A barra de ações permanece alinhada e responsiva.
- O documento da proposta e o estado **Proposta não encontrada** permanecem inalterados funcionalmente.
- A rota e o snapshot da proposta continuam válidos.
- Typecheck e build terminam sem erros.

## Observações técnicas

- A remoção deve alcançar também o fallback indireto da função `share`, que hoje chama `copyLink`.
- Não é necessário impedir que o usuário copie a URL diretamente pela barra do navegador.
- Validar a barra em temas claro e escuro e confirmar que ela continua ausente no PDF.

## Restrições

- Não remover tema ou impressão.
- Não alterar o conteúdo da proposta.
- Não modificar serialização, validação ou leitura do snapshot.
- Não adicionar ação substituta.
- Não alterar outras páginas ou componentes sem relação com a barra de ações.

## Resultado esperado

A proposta apresenta uma barra de ações mais simples, limitada à alternância de tema e à impressão/PDF. Todo o código exclusivo de copiar link e compartilhar é removido sem afetar o documento ou seu acesso público.
