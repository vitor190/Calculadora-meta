

# Prompt para o Codex

## Contexto

Estou desenvolvendo uma aplicação chamada **Conexa**, uma plataforma de atendimento via WhatsApp utilizando a **API Oficial da Meta**.

Preciso criar uma nova tela chamada **Calculadora de Custos WhatsApp (Meta)**, destinada exclusivamente ao **time comercial** da empresa.

O objetivo da ferramenta é permitir que o vendedor faça uma simulação completa do custo da solução antes de enviar uma proposta ao cliente.

Esta aplicação será **somente frontend**, utilizando **React**.

Não implemente backend nem persistência de dados.

Toda a lógica deve ficar em memória utilizando React.

---

# Objetivo

Criar uma calculadora simples, intuitiva, moderna e responsiva.

O vendedor deve conseguir simular:

* custo pago à Meta
* mensalidade do Conexa
* módulos adicionais
* implantação
* descontos
* preço final da proposta

Tudo deve ser recalculado automaticamente conforme os valores forem alterados.

---

# Layout

A tela deve possuir apenas uma página.

Organização:

```
------------------------------------------------------------
                    Calculadora Conexa
------------------------------------------------------------

[ Formulário ]                 [ Resumo Financeiro ]

------------------------------------------------------------
```

No desktop:

* formulário na esquerda
* resumo financeiro na direita

No mobile:

* formulário acima
* resumo abaixo

Utilizar Cards.

Interface limpa.

Muito espaço em branco.

Bordas arredondadas.

Visual moderno.

---

# Seção 1 - Custos Meta

Criar um card chamado

**Custos da Meta**

Campos:

### País

Select

Exemplo

```
Brasil
Argentina
Estados Unidos
Portugal
```

(Não precisa implementar regras de país.)

---

### Categorias de Template

Não utilizar valores fixos.

O vendedor deve conseguir informar o custo de cada categoria.

Criar uma tabela assim:

| Categoria    | Valor por Template | Quantidade |
| ------------ | ------------------ | ---------- |
| Marketing    | input              | input      |
| Utilidade    | input              | input      |
| Autenticação | input              | input      |

Para cada linha calcular automaticamente

```
Subtotal

=

Quantidade

×

Valor
```

Mostrar o subtotal ao lado.

Ao final mostrar

```
Total Meta
```

Somando todas as categorias.

---

# Seção 2 - Produtos Conexa

Criar outro card.

Campos

```
Plano Conexa
```

Valor

```
R$

__________
```

---

Adicionar um switch

```
☐ Possui Ecommerce
```

Quando ativado

mostrar

```
Valor Ecommerce

R$

__________
```

---

Adicionar botão

```
+ Adicionar Produto
```

O vendedor poderá adicionar quantos produtos desejar.

Cada produto possui

```
Nome

Valor
```

Exemplo

```
CRM

99,90
```

Todos entram automaticamente na soma.

---

# Seção 3 - Implantação

Campo

```
Valor implantação

R$

_____________
```

---

# Seção 4 - Desconto

Permitir escolher

```
Sem desconto

Desconto em %

Desconto em R$
```

Se escolher %

mostrar

```
10%
```

Se escolher valor

```
R$500
```

Aplicar automaticamente.

---

# Resumo Financeiro

Criar um card fixo na lateral.

Mostrar

```
Custo Meta

R$

xxxx
```

---

Produtos

```
Plano Conexa

R$

xxxx
```

---

Ecommerce

```
R$

xxxx
```

---

Produtos adicionais

```
R$

xxxx
```

---

Implantação

```
R$

xxxx
```

---

Subtotal

```
R$

xxxx
```

---

Desconto

```
R$

xxxx
```

---

Total Final

(em destaque)

```
R$

xxxx
```

---

Abaixo mostrar também

```
Quantidade total de templates

xxxx
```

e

```
Custo médio por template

R$

xxxx
```

---

# Como funciona

Adicionar um card informativo na parte inferior contendo:

```
Como funciona a cobrança da Meta

• A Meta cobra por template enviado.

• Cada categoria possui um custo diferente.

• O cliente abre uma janela de atendimento de 24 horas ao enviar uma mensagem.

• Durante essa janela é possível responder normalmente sem necessidade de iniciar uma nova conversa.

• A janela de 24 horas é renovada apenas quando o cliente envia uma nova mensagem.
```

Não precisa possuir lógica.

É apenas informativo.

---

# Regras

Todos os cálculos devem ocorrer automaticamente.

Sempre que qualquer campo mudar:

* recalcular subtotais
* recalcular total Meta
* recalcular subtotal geral
* aplicar desconto
* atualizar total final

Sem botão de calcular.

Tudo em tempo real.

---

# Componentização

Criar componentes reutilizáveis.

Exemplo

```
Card

CurrencyInput

NumberInput

SummaryCard

ProductRow

TemplateRow

SectionTitle

InfoCard
```

---

# Tecnologias

Utilizar:

* React
* TypeScript
* Vite
* TailwindCSS
* Lucide React para ícones

Não utilizar bibliotecas pesadas de UI.

---

# UX

Priorizar uma interface semelhante a dashboards SaaS modernos.

Requisitos:

* Design clean
* Boa hierarquia visual
* Campos bem espaçados
* Cards com sombra leve
* Ícones discretos
* Responsivo
* Inputs grandes
* Tipografia moderna
* Valores monetários destacados
* Total Final com destaque visual
* Atualização instantânea dos cálculos
* Código limpo e organizado

O resultado esperado é uma ferramenta que o time comercial consiga utilizar rapidamente durante uma negociação, alterando valores em tempo real e visualizando imediatamente o impacto no custo e no preço final da proposta.
