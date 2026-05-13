# Especificação de telas e funcionalidades — frontend-01

Documento gerado a partir do código em `frontend-01/src`. Descreve rotas (Hash Router), objetivo de cada tela, integrações HTTP e cada campo ou coluna relevante.

---

## 1. Visão geral

### 1.1 Roteamento e layouts

- A aplicação usa **`HashRouter`** (`src/index.js`). As URLs no navegador têm o formato base `#/…` (por exemplo `#/admin/pessoas`).
- **Layout admin:** `#/admin/*` — sidebar, navbar, área principal (`layouts/admin`).
- **Layout auth:** `#/auth/*` — telas de autenticação sem shell completo do admin (`layouts/auth`).
- **Layout RTL:** `#/rtl/*` — variante espelhada do template (`layouts/rtl`).

### 1.2 API base

- Na maioria das telas de negócio, a URL da API é `process.env.REACT_APP_API_BASE_URL` com fallback **`http://localhost:8080/api`**.
- **Exceções:** vários componentes usam URL **fixa** `http://localhost:8080/api/...` (ver seção 7 — Lacunas e observações).

### 1.3 Padrões de interface

- **Paginação:** nas listagens de Pessoas, Categorias, Contas, Receitas, Despesas e Movimentações, são exibidos **5 itens por página**, com botões numéricos para troca de página.
- **Feedback:**
  - **Toast** (`useToast`): listagens de Pessoas, Contas, Receitas, Despesas, Movimentações, Importar OFX, etc.
  - **Modal** (Chakra): cadastros de Categoria e Conta (e similares) para sucesso/erro após salvar ou carregar.
  - **Alert** (`alert`): uploads em `importacaoNotas/components/UploadNotas.js` e `UploadOfx.js`.

### 1.4 Índice de rotas (`src/routes.js`)

| Rota (path relativo ao layout) | Layout | Tipo |
|--------------------------------|--------|------|
| `/default` | `/admin` | Template Horizon |
| `/pessoas` | `/admin` | Domínio |
| `/categorias`, `/categorias/nova`, `/categorias/editar/:id` | `/admin` | Domínio |
| `/contas`, `/contas/nova`, `/contas/editar/:id` | `/admin` | Domínio |
| `/receitas`, `/receitas/nova`, `/receitas/editar/:id` | `/admin` | Domínio |
| `/despesas`, `/despesas/nova`, `/despesas/editar/:id` | `/admin` | Domínio |
| `/movimentacoes`, `/movimentacoes/nova`, `/movimentacoes/editar/:id`, `/movimentacoes/importar-ofx`, `/movimentacoes/arquivo-ofx/:id` | `/admin` | Domínio |
| `/importacao-notas` | `/admin` | Domínio / upload |
| `/nft-marketplace` | `/admin` | Template Horizon |
| `/data-tables` | `/admin` | Misto (dados API + template) |
| `/profile` | `/admin` | Template Horizon |
| `/sign-in` | `/auth` | Autenticação (UI) |
| `/rtl-default` | `/rtl` | Template Horizon RTL |

---

## 2. Telas de domínio

### 2.1 Pessoas

**URL:** `#/admin/pessoas`  
**Arquivo:** `src/views/admin/pessoas/index.jsx`

**Objetivo:** listar pessoas físicas ou jurídicas, cadastrar nova pessoa em modal e gerenciar vínculos de dependência (responsável / dependente).

**APIs:** `GET /pessoas`, `POST /pessoas/`, `GET /pessoas/dependencias`, `POST /pessoas/dependencias`

#### Lista (tabela)

| Coluna | Conteúdo exibido |
|--------|------------------|
| Nome | `nome` |
| Tipo | “Física” ou “Jurídica” conforme `tipo` |
| Documento | `cpf` se física; `cnpj` se jurídica |
| Data de nascimento | `dataNascimento` ou “-” |
| Ver | Abre modal de dependências da linha |
| Adicionar | Abre modal para novo vínculo com a pessoa da linha como contexto |

**Ações globais:** botão “Cadastrar pessoa” abre o modal de cadastro.

#### Modal — Cadastro de pessoa

| Campo (UI) | Controle | Obrigatório | Propriedade JSON | Descrição |
|------------|----------|-------------|------------------|-----------|
| Nome | `Input` text | Sim (`isRequired`) | `nome` | Nome completo ou razão social |
| Data de nascimento | `Input` date | Não | `dataNascimento` | Data no controle nativo |
| Tipo | `Select` | Não | `tipo` | `FISICA` (pessoa física) ou `JURIDICA` (pessoa jurídica) |

**Se tipo = FISICA:**

| Campo | Controle | Obrigatório | Propriedade | Descrição |
|-------|----------|-------------|-------------|-----------|
| CPF | `Input` | Não | `cpf` | Texto livre, placeholder sugere máscara |
| RG | `Input` | Não | `rg` | Identidade |
| Sexo | `Input` | Não | `sexo` | Texto livre (ex.: Feminino, Masculino, Outro) |
| IRPF | `Select` | Não | `irpf` | Situação: `EM_PROCESSAMENTO`, `EM_FILA_DE_RESTITUICAO`, `PROCESSADA`, `COM_PENDENCIAS`, `EM_ANALISE`, `RETIFICADA`, `CANCELADA`, `TRATAMENTO_MANUAL`, `NAO_DECLARADO` |

**Se tipo = JURIDICA:**

| Campo | Controle | Obrigatório | Propriedade | Descrição |
|-------|----------|-------------|-------------|-----------|
| CNPJ | `Input` | Não | `cnpj` | Texto livre |
| Inscrição estadual | `Input` | Não | `ie` | IE |
| IRPJ | `Input` | Não | `irpj` | Situação / referência IRPJ (texto livre no placeholder) |

**Rodapé:** Cancelar; Salvar pessoa (`POST /pessoas/` com corpo JSON do formulário).

#### Modal — Ver dependências

Lista vínculos em que a pessoa selecionada é responsável ou dependente; exibe o nome da contraparte e **Nível** (`nivel`) em `Badge`.

#### Modal — Adicionar dependência

| Campo | Controle | Obrigatório | Propriedade | Descrição |
|-------|----------|-------------|-------------|-----------|
| Responsável | `Select` | Sim | `responsavelId` | Inclui opção da pessoa selecionada e demais cadastradas |
| Dependente | `Select` | Sim | `dependenteId` | Pessoas exceto o responsável escolhido |
| Nível | `Input` number, min 1 | Não | `nivel` | Grau do vínculo (padrão inicial 1 no estado) |

**Envio:** `POST /pessoas/dependencias` com `responsavelId`, `dependenteId`, `nivel` numéricos.

---

### 2.2 Categorias

#### Lista

**URL:** `#/admin/categorias`  
**Arquivo:** `src/views/admin/categorias/index.jsx`  
**API:** `GET /categorias`, `DELETE /categorias/:id`

| Coluna | Conteúdo |
|--------|----------|
| ID | `id` |
| Nome | `nome` |
| Descrição | `descricao` |
| Status | Badge “Ativa” / “Inativa” conforme `ativa` |
| Ações | Editar (navega para edição), Excluir (confirmação `window.confirm`) |

**Ação:** “Cadastrar categoria” → `#/admin/categorias/nova`.

#### Cadastro / edição

**URL:** `#/admin/categorias/nova`, `#/admin/categorias/editar/:id`  
**Arquivo:** `src/views/admin/categorias/CadastroCategoria.jsx`  
**API:** `GET /categorias/:id` (edição), `POST /categorias/`, `PUT /categorias/:id`

| Campo | Controle | Obrigatório | Propriedade | Descrição |
|-------|----------|-------------|-------------|-----------|
| Nome da categoria | `Input` | Sim | `nome` | Identificação principal |
| Descrição | `Textarea` | Não | `descricao` | Detalhes opcionais |
| Categoria ativa | `Checkbox` | Não | `ativa` | Se falsa, categoria inativa na listagem |

**Ações:** Cancelar (volta à lista); Salvar / Atualizar categoria.

---

### 2.3 Contas bancárias

#### Lista

**URL:** `#/admin/contas`  
**Arquivo:** `src/views/admin/contas/index.jsx`  
**API:** `GET /contas`

| Coluna | Conteúdo |
|--------|----------|
| Nome | `nome` |
| Banco | `banco` |
| Agência | `agencia` |
| Número | `numeroConta` |
| Tipo | Rótulo amigável para `tipoConta` (CORRENTE → Corrente, etc.) |
| Saldo Atual | `saldoAtual` ou, se ausente, `saldoInicial`; cor verde/vermelho conforme sinal |
| Status | Ativa / Inativa (`ativa`) |
| Ações | Editar |

#### Cadastro / edição

**URL:** `#/admin/contas/nova`, `#/admin/contas/editar/:id`  
**Arquivo:** `src/views/admin/contas/CadastroConta.jsx`  
**API:** `GET /contas/:id`, `POST /contas/`, `PUT /contas/:id`

| Campo | Controle | Obrigatório | Propriedade | Descrição |
|-------|----------|-------------|-------------|-----------|
| Nome da conta | `Input` | Sim | `nome` | Ex.: apelido da conta |
| Banco | `Input` | Sim | `banco` | Nome da instituição |
| Agência | `Input` | Não | `agencia` | Código agência |
| Número da conta | `Input` | Não | `numeroConta` | Número + dígito |
| Tipo de conta | `Select` | Não | `tipoConta` | Valores: `CORRENTE`, `POUPANCA`, `SALARIO`, `INVESTIMENTO` |
| Saldo inicial | `Input` number, step 0.01 | Não | `saldoInicial` | Valor inicial |
| Conta ativa | `Checkbox` | Não | `ativa` | Conta utilizável ou não |

---

### 2.4 Receitas

#### Lista

**URL:** `#/admin/receitas`  
**Arquivo:** `src/views/admin/receitas/index.jsx`  
**API:** `GET /receitas/todos`

| Coluna | Conteúdo |
|--------|----------|
| Descrição | `descricao` |
| Valor | `valorBruto` formatado em BRL, cor verde |
| Data Cadastro | `dataEntrada` ou `dataCadastro` |
| Ações | Editar |

#### Cadastro / edição

**URL:** `#/admin/receitas/nova`, `#/admin/receitas/editar/:id`  
**Arquivo:** `src/views/admin/receitas/CadastroReceita.jsx`  
**API:** `GET /receitas/:id`, `POST /receitas/`, `PUT /receitas/:id`

| Campo | Controle | Obrigatório | Propriedade (envio) | Descrição |
|-------|----------|-------------|---------------------|-----------|
| Descrição | `Input` | Sim | `descricao` | Texto do lançamento |
| Valor | `Input` number, step 0.01 | Sim | `valorBruto` | Convertido para `float` no POST/PUT |
| Data de cadastro | `Input` date | Não | `dataEntrada` | No envio vira ISO; label no formulário é “Data de cadastro”; leitura em edição usa `dataEntrada` ou `dataCadastro` |
| Fit ID (opcional) | `Input` | Não | `fitId` | Identificador de transação (ex.: conciliação OFX) |

---

### 2.5 Despesas

#### Lista

**URL:** `#/admin/despesas`  
**Arquivo:** `src/views/admin/despesas/index.jsx`  
**API:** `GET /despesas/todos`

| Coluna | Conteúdo |
|--------|----------|
| Categoria | `categoria` (texto) |
| Descrição | `descricao` |
| Valor | `valorBruto`, cor vermelha |
| Data Cadastro | `dataCadastro` |
| Ações | Editar |

#### Cadastro / edição

**URL:** `#/admin/despesas/nova`, `#/admin/despesas/editar/:id`  
**Arquivo:** `src/views/admin/despesas/CadastroDespesa.jsx`  
**API:** `GET /despesas/:id`, `POST /despesas/`, `PUT /despesas/:id`

| Campo | Controle | Obrigatório | Propriedade | Descrição |
|-------|----------|-------------|-------------|-----------|
| Categoria | `Input` text | Sim | `categoria` | **Texto livre** (não há select ligado ao cadastro de categorias) |
| Descrição | `Input` | Sim | `descricao` | Detalhe do gasto |
| Valor | `Input` number | Sim | `valorBruto` | Enviado como número |
| Data de cadastro | `Input` date | Não | `dataCadastro` | Enviado como ISO |
| Fit ID (opcional) | `Input` | Não | `fitId` | Rastreio OFX / externo |

---

### 2.6 Movimentações

#### Lista

**URL:** `#/admin/movimentacoes`  
**Arquivo:** `src/views/admin/movimentacoes/index.jsx`  
**API:** `GET /movimentacoes`

| Coluna | Conteúdo |
|--------|----------|
| Conta | `nomeConta` |
| Receita | `descricaoReceita` |
| Despesa | `descricaoDespesa` |
| Descrição | `descricao` |
| Tipo | Badge Entrada (`ENTRADA`) / Saída (`SAIDA`) |
| Valor | Monetário; cor verde/vermelha por tipo |
| Data | `dataMovimentacao` |
| Ações | Editar |

**Botões:** “Importar OFX” → `#/admin/movimentacoes/importar-ofx`; “Cadastrar movimentação” → nova movimentação.

#### Cadastro / edição

**URL:** `#/admin/movimentacoes/nova`, `#/admin/movimentacoes/editar/:id`  
**Arquivo:** `src/views/admin/movimentacoes/CadastroMovimentacao.jsx`  
**API:** `GET /movimentacoes/:id`, `POST /movimentacoes/`, `PUT /movimentacoes/:id`  
**Dados auxiliares:** `GET /contas`, `GET /receitas/todos`, `GET /despesas/todos`

| Campo | Controle | Obrigatório | Propriedade | Descrição |
|-------|----------|-------------|-------------|-----------|
| Conta | `Select` | Sim | `idConta` | ID da conta; opções mostram `nome - banco` |
| Receita (opcional) | `Select` | Não | `idReceita` | Opção vazia “Nenhuma”; demais de `/receitas/todos` |
| Despesa (opcional) | `Select` | Não | `idDespesa` | Opção “Nenhuma”; demais de `/despesas/todos` |
| Tipo de movimentação | `Select` | Sim | `tipoMovimentacao` | `ENTRADA` ou `SAIDA` |
| Data da movimentação | `Input` date | Sim | `dataMovimentacao` | Data do lançamento |
| Valor | `Input` number | Sim | `valor` | Enviado como string no corpo atual |
| Descrição | `Input` | Não | `descricao` | Complemento textual |

---

### 2.7 Importar OFX (fluxo completo)

**URL:** `#/admin/movimentacoes/importar-ofx`  
**Arquivo:** `src/views/admin/movimentacoes/ImportarOfx.jsx`

**APIs:** `GET /contas`, `GET /ofx/listar`, `POST /ofx/upload` (`multipart/form-data`)

#### Seção “Importar Novo Arquivo”

| Campo | Controle | Obrigatório | Parte do request | Descrição |
|-------|----------|-------------|------------------|-----------|
| Conta de Destino | `Select` | Sim | `idConta` | ID da conta para associação do extrato |
| Arquivo OFX | `Dropzone` | Sim | `fileUpload` | Um arquivo selecionado ou arrastado |
| — | — | — | `usuario` | Enviado fixo como string **`"123123123"`** no FormData |

**Botão:** “Importar Arquivo” (desabilitado sem arquivo e sem conta).

#### Seção “Arquivos Importados” (tabela)

| Coluna | Conteúdo |
|--------|----------|
| Nome do Arquivo | `nomeArquivo` |
| Conta | `nomeConta` |
| Data de Importação | `dataImportacao` formatada pt-BR |
| Receitas | Badge com `quantidadeReceitas` |
| Despesas | Badge com `quantidadeDespesas` |
| Ações | Ícone “ver” → `#/admin/movimentacoes/arquivo-ofx/:id` |

---

### 2.8 Detalhes do arquivo OFX

**URL:** `#/admin/movimentacoes/arquivo-ofx/:id`  
**Arquivo:** `src/views/admin/movimentacoes/DetalhesArquivoOfx.jsx`  
**API:** `GET /ofx/:id/detalhes` — resposta esperada: `arquivo`, `receitas`, `despesas`, `movimentacoes`.

#### Resumo do arquivo

| Campo exibido | Fonte |
|---------------|--------|
| Nome do Arquivo | `arquivo.nomeArquivo` |
| Conta | `arquivo.nomeConta` |
| Data de Importação | `arquivo.dataImportacao` |
| Resumo | Badges com `quantidadeReceitas` e `quantidadeDespesas` |

#### Tabela Receitas importadas

| Coluna | Fonte |
|--------|--------|
| Data | `dataEntrada` ou `dataCadastro` |
| Descrição | `descricao` |
| Categoria | `categoria` |
| Valor | `valorBruto` (BRL) |

#### Tabela Despesas importadas

| Coluna | Fonte |
|--------|--------|
| Data | `dataCadastro` |
| Descrição | `descricao` |
| Categoria | `categoria` |
| Valor | `valorBruto` |

#### Tabela Movimentações lançadas

| Coluna | Fonte |
|--------|--------|
| Data | `dataMovimentacao` |
| Descrição | `descricao` |
| Tipo | `tipoMovimentacao` (badges Entrada/Saída) |
| Valor | `valor` |
| Conta | `nomeConta` |
| Receita | `descricaoReceita` |
| Despesa | `descricaoDespesa` |

---

### 2.9 Importação de notas (página em grade)

**URL:** `#/admin/importacao-notas`  
**Arquivo:** `src/views/admin/importacaoNotas/index.jsx`

Dois cartões lado a lado (responsivo empilhado):

#### Cartão Nota Fiscal — `components/UploadNotas.js`

| Elemento | Descrição |
|----------|-----------|
| Dropzone | Seleção de um arquivo |
| Botão Upload | Envia `FormData`: campo arquivo **`htmlFile`**, **`nomeArquivo`** = nome do arquivo |
| Endpoint | **`POST http://localhost:8080/api/notas`** (URL fixa no código) |

#### Cartão Extrato OFX — `components/UploadOfx.js`

| Elemento | Descrição |
|----------|-----------|
| Dropzone | Seleção de um arquivo |
| Botão Upload | Envia `FormData`: **`fileUpload`**, **`usuario`** = valor numérico fixo no código (`123123123`) |
| Endpoint | **`POST http://localhost:8080/api/ofx`** (URL fixa) |

**Observação:** Este fluxo OFX é **independente** da tela “Importar OFX” em Movimentações (`/ofx/upload` + conta), com contrato de API diferente.

---

## 3. Autenticação

**URL:** `#/auth/sign-in`  
**Arquivo:** `src/views/auth/signIn/index.jsx`

| Elemento | Tipo | Obrigatório | Descrição |
|----------|------|-------------|-----------|
| Sign in with Google | `Button` | — | **Sem `onClick`:** apenas UI |
| Email | `Input` email | Marcado como obrigatório no UI | Placeholder exemplo; **não há submissão ligada à API** |
| Password | `Input` password/text | Marcado como obrigatório | Alternância mostrar/ocultar ícone |
| Keep me logged in | `Checkbox` | Não | Estado local apenas |
| Forgot password? | `NavLink` → `/auth/forgot-password` | — | Rota **não** declarada em `routes.js` |
| Sign In | `Button` | — | **Sem handler de login** |
| Create an Account | `NavLink` → `/auth/sign-up` | — | Rota **não** declarada em `routes.js` |

---

## 4. Telas template Horizon UI

### 4.1 Home / Dashboard padrão

**URL:** `#/admin/default`  
**Arquivo:** `src/views/admin/default/index.jsx`

Painel com componentes de demonstração: estatísticas (`MiniStatistics`), gráficos (`WeeklyRevenue`, `TotalSpent`, `PieCard`, `DailyTraffic`), tabelas alimentadas por **JSON estático** (`tableDataCheck.json`, `tableDataComplex.json`), lista de tarefas, calendário mini, seletor “Monthly” sem persistência. **Sem integração de negócio Organomeno.**

### 4.2 NFT Marketplace

**URL:** `#/admin/nft-marketplace`  
**Arquivo:** `src/views/admin/marketplace/index.jsx`

Layout de marketplace de exemplo (banner, histórico, tabela de criadores). **Template.**

### 4.3 Profile

**URL:** `#/admin/profile`  
**Arquivo:** `src/views/admin/profile/index.jsx`

Perfil fictício (banner, avatar, nome, métricas), armazenamento, upload genérico, notificações, projetos. **Template.**

### 4.4 RTL Admin

**URL:** `#/rtl/rtl-default`  
**Arquivo:** `src/views/admin/rtl/index.jsx` (e componentes RTL)

Versão espelhada do dashboard template. **Template.**

---

## 5. Data Tables (misto: API + template)

**URL:** `#/admin/data-tables`  
**Arquivo:** `src/views/admin/dataTables/index.jsx`

**Chamadas HTTP (URLs fixas no código):**

- `GET http://localhost:8080/api/despesas`
- `GET http://localhost:8080/api/receitas`
- `GET http://localhost:8080/api/notas`

**Conteúdo:**

1. **Tabela de despesas** e **tabela de receitas** via `ColumnsTable` — colunas React Table:

| Coluna (Header) | Acessor | Descrição |
|-----------------|---------|-----------|
| ID | `id` | Identificador |
| DESCRICAO | `descricao` | Texto |
| CATEGORIA | `categoria` | Pode vazio em receitas conforme dados |
| DATA TRANSACAO | `dataCadastro` | Data da transação |
| VALOR BRUTO | `valorBruto` | Valor numérico |

2. **FormVincularNota** (`components/FormVincularNota.js`):

| Campo | Controle | Obrigatório | Descrição |
|-------|----------|-------------|-----------|
| Despesa | `Select` | Implícito para sucesso | Opções: `id - descricao` |
| Nota fiscal | `Select` | Implícito | Opções: `descricao` da nota |
| Vincular | `Button` submit | — | `PUT http://localhost:8080/api/despesas/vincular-nota` com corpo = objeto despesa enriquecido com `notaFiscal` |

**Feedback:** principalmente `console.log` / `console.error` (sem toast na UI).

---

## 6. Referência rápida de endpoints por tela

| Tela | Métodos e caminhos (relativos à API base salvo indicação) |
|------|------------------------------------------------------------|
| Pessoas | `GET/POST /pessoas`, `GET/POST /pessoas/dependencias` |
| Categorias | `GET /categorias`, `GET/POST/PUT/DELETE /categorias/:id` |
| Contas | `GET/POST/PUT /contas`, `GET/PUT /contas/:id` |
| Receitas lista | `GET /receitas/todos` |
| Receitas form | `GET/POST/PUT /receitas`, `GET/PUT /receitas/:id` |
| Despesas lista | `GET /despesas/todos` |
| Despesas form | `GET/POST/PUT /despesas`, `GET/PUT /despesas/:id` |
| Movimentações | `GET/POST/PUT /movimentacoes`, `GET/PUT /movimentacoes/:id` |
| Importar OFX | `GET /contas`, `GET /ofx/listar`, `POST /ofx/upload` |
| Detalhes OFX | `GET /ofx/:id/detalhes` |
| Importação notas (UploadNotas) | `POST http://localhost:8080/api/notas` |
| Importação notas (UploadOfx) | `POST http://localhost:8080/api/ofx` |
| Data Tables | `GET .../despesas`, `.../receitas`, `.../notas`, `PUT .../despesas/vincular-nota` |

---

## 7. Lacunas, riscos e observações de produto

1. **Login:** a tela Sign In **não** chama backend; botão Google e “Sign In” não autenticam.
2. **Rotas ausentes:** links para `/auth/forgot-password` e `/auth/sign-up` **não** possuem entradas correspondentes em `routes.js`; em `layouts/auth/index.js` o `Redirect` de `/auth` aponta para um `to` com valor **`/auth/sign-in/default`** quebrado por quebra de linha no string literal — comportamento de fallback pode não levar à tela esperada.
3. **Usuário OFX fixo:** `ImportarOfx` envia `usuario: "123123123"`; `UploadOfx` (importação notas) envia número fixo — adequar a sessão/usuário real quando existir autenticação.
4. **URLs hardcoded:** `UploadNotas.js`, `UploadOfx.js` e `dataTables` ignoram `REACT_APP_API_BASE_URL`.
5. **Despesa — categoria:** campo é texto livre; não há validação contra o cadastro de categorias nem select.
6. **Template vs produto:** rotas Default, NFT, Profile e RTL não representam regras de negócio financeiras do Organomeno.

---

## 8. Critérios de cobertura deste documento

- Todas as rotas definidas em `src/routes.js` foram referenciadas (seção 1.4 e demais seções).
- Formulários de domínio possuem tabela campo a campo com propriedades de API quando aplicável.
- Listagens possuem colunas descritas.
- Lacunas conhecidas listadas na seção 7.

*Última atualização conforme código do repositório na elaboração deste arquivo.*
