# SPEC-003 — Remoção do Chatbot Inteligente

## Contexto

O Chatbot Inteligente não é mais oferecido, mas ainda aparece como recurso incluído nos planos Essencial, Profissional e Elite em `src/lib/commercial-catalog.ts`. Essas listas são consumidas pelos cards de planos, pelo resumo financeiro e pela visualização da proposta, fazendo a referência se propagar por várias telas. No estado atual não foi identificada lógica de cálculo, tipo ou store dedicado ao chatbot.

## Objetivo

Remover completamente qualquer oferta ou referência ao Chatbot Inteligente, sem afetar preços, seleção dos planos ou os demais recursos.

## Alterações

- Remover `Chatbot inteligente` das listas `features` dos três planos do catálogo comercial.
- Confirmar e remover ocorrências adicionais em cards, textos, resumos, proposta e documentação de produto, caso tenham sido introduzidas até a implementação.
- Remover lógica dedicada somente se uma nova inspeção identificar código exclusivamente associado ao chatbot.
- Manter IDs, nomes, preços, destaques, descontos e demais features dos planos inalterados.
- Não substituir o item removido por outro benefício sem definição comercial específica.

## Requisitos Técnicos

- Tratar `commercialCatalog` como a fonte de dados atual, evitando correções duplicadas em cada consumidor.
- Verificar o projeto com busca textual, typecheck e build após a remoção.
- Não criar flags, migrações ou compatibilidade para uma funcionalidade que deixou de existir.

## Critérios de Aceite

- “Chatbot Inteligente”, inclusive variações de caixa, não aparece em nenhuma tela.
- A busca no código-fonte não encontra referências funcionais ao item.
- Os cards dos três planos continuam íntegros e responsivos.
- O resumo financeiro e a proposta refletem automaticamente as listas atualizadas.
- Seleção, valores e descontos dos planos continuam funcionando.
- Typecheck e build são concluídos sem erro.

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

Nenhuma parte da aplicação comunica o Chatbot Inteligente como recurso disponível, enquanto todos os demais dados e comportamentos dos planos permanecem iguais.
