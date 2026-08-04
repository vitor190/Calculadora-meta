# Calculadora Conexa

Frontend da calculadora comercial de custos do WhatsApp, construído com React, TypeScript, Vite, Tailwind CSS e Zustand.

O estado é mantido em memória no navegador. O projeto não possui backend, autenticação, API ou persistência de propostas.

## Estrutura

```text
src/
├── components/  Componentes reutilizáveis de interface
├── layout/      Estrutura global, cabeçalho e sidebar
├── lib/         Catálogos, moedas, preços e estilos compartilhados
├── pages/       Páginas organizadas por funcionalidade
├── routes/      Definição das rotas da aplicação
├── services/    Regras de cálculo e serialização de propostas
├── store/       Estado e ações da interface
├── types/       Modelos do domínio da calculadora
└── utils/       Utilitários genéricos, quando necessários
```

As regras financeiras não devem ser implementadas diretamente nas páginas. Cálculos pertencem a `services`, modelos a `types` e mutações de estado a `store`.

## Executar

```bash
yarn
yarn dev
```

## Validar

```bash
yarn typecheck
yarn build
```
