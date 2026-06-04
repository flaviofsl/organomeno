# MER — Organomeno: Análise e Evolução para Multi-Usuário

---

## 1. Diagnóstico do Modelo Atual

### 1.1 Problemas identificados

| # | Entidade | Problema |
|---|----------|----------|
| 1 | **Todas** | Nenhuma entidade possui `id_usuario` ou `id_grupo_familiar` — o sistema é single-tenant por design |
| 2 | **Conta** | Não tem dono: qualquer query retorna todas as contas de todos os usuários |
| 3 | **Categoria** | Global e compartilhada — sem isolamento por usuário ou família |
| 4 | **Despesas / Receitas** | Possuem `idOperador` (FK manual sem `@ManyToOne`) — rudimento de autoria sem implementação real |
| 5 | **Receitas** | Colunas com prefixo `DESPESA_` (ex: `DESPESA_NOME`, `DESPESA_VALOR_BRUTO`) — tabela foi copiada de `DESPESAS` sem renomear |
| 6 | **Pessoa** | Mistura dois conceitos: membros da família e fornecedores/terceiros |
| 7 | **Autenticacao** | `LoginDTO` está vazio — não existe entidade `Usuario` no modelo |
| 8 | **FKs manuais** | `idCategoria`, `idConta`, `idPessoa` são colunas simples sem `@ManyToOne`, quebrando integridade referencial no JPA |
| 9 | **GrupoFamiliar** | Não existe — o conceito central do sistema não tem representação no banco |
| 10 | **Recorrencia** | FKs para `Despesas` e `Receitas` são manuais, sem integridade referencial |

### 1.2 O que precisa ser adicionado para multi-usuário

Para tornar o sistema verdadeiramente multi-usuário, a estratégia é o modelo **"Grupo Familiar como Tenant"**:

- Cada família é um **GrupoFamiliar** (tenant)
- Cada **Usuario** pertence a um `GrupoFamiliar` com um papel (ADMIN, MEMBRO, VISUALIZADOR)
- Todas as entidades de negócio recebem FK para `GrupoFamiliar`, garantindo isolamento total dos dados
- **Pessoa** é separada em dois conceitos: membros da família (ligados ao `GrupoFamiliar`) e entidades externas (fornecedores/empresas)

---

## 2. MER Atual (estado do código)

```mermaid
erDiagram
    PESSOAS {
        bigint ID_PESSOA PK
        varchar NOME
        date DATA_NASCIMENTO
        varchar TIPO_PESSOA
        varchar CPF
        varchar RG
        varchar SEXO
        varchar IRPF
        varchar CNPJ
        varchar IE
        varchar IRPJ
    }

    DEPENDENCIAS {
        bigint ID_DEPENDENCIA PK
        bigint RESPONSAVEL_ID FK
        bigint DEPENDENTE_ID FK
        int NIVEL_DEPENDENCIA
    }

    CONTATOS {
        bigint ID_CONTATO PK
        bigint ID_PESSOA
        varchar VALOR
        varchar TIPO
        boolean ATIVA
    }

    ENDERECOS {
        int ID_ENDERECO PK
        int ID_PESSOA
        varchar nome_endereco
        varchar ENDERECO
        varchar COMPLEMENTO_ENDERECO
        varchar NUMERO_ENDERECO
        varchar BAIRRO
        varchar CIDADE
        varchar UF
        varchar CEP
    }

    CATEGORIAS {
        int ID_CATEGORIA PK
        varchar NOME
        varchar DESCRICAO
        boolean ATIVA
    }

    CONTAS {
        bigint ID_CONTA PK
        varchar NOME
        varchar BANCO
        varchar AGENCIA
        varchar NUMERO_CONTA
        varchar TIPO_CONTA
        decimal SALDO_INICIAL
        decimal SALDO_ATUAL
        boolean ATIVA
    }

    RECEITAS {
        int ID_RECEITA PK
        int ID_CATEGORIA
        varchar DESPESA_NOME
        varchar DESPESA_DESCRICAO
        double DESPESA_VALOR_BRUTO
        int NOTA_FISCAL_VINCULADA FK
        date DATA_CADASTRO
        varchar TRANSACAO_FITID
        int ID_CONTA
        int ID_OPERADOR
        date DATA_TRANSACAO
    }

    DESPESAS {
        int ID_DESPESAS PK
        int ID_CATEGORIA
        varchar DESPESA_NOME
        varchar DESPESA_DESCRICAO
        double DESPESA_VALOR_BRUTO
        int NOTA_FISCAL_VINCULADA FK
        date DATA_CADASTRO
        varchar TRANSACAO_FITID
        int ID_CONTA
        int ID_OPERADOR
        date DATA_TRANSACAO
    }

    LIVRO_MOVIMENTACAO {
        bigint ID_MOVIMENTACAO PK
        bigint ID_CONTA FK
        int ID_RECEITA FK
        int ID_DESPESAS FK
        date DATA_MOVIMENTACAO
        decimal VALOR
        varchar NOME
        varchar DESCRICAO
        varchar TIPO_MOVIMENTACAO
        timestamp DATA_CADASTRO
    }

    TRANSFERENCIAS {
        int ID_TRANSFERENCIA PK
        bigint ID_CONTA_ORIGEM FK
        bigint ID_CONTA_DESTINO FK
        decimal VALOR
        datetime DATA_TRANSFERENCIA
        varchar DESCRICAO
        boolean ATIVA
    }

    NOTA_FISCAL {
        int NOTA_ID PK
        varchar NOTA_DESCRICAO
        date NOTA_DATA_CADASTRO
        double NOTA_VALOR_BRUTO
    }

    ITENS_NOTA_FISCAL {
        int ITEM_ID PK
        int NOTA_VINCULADA FK
        varchar ITEM_UND_MEDIDA
        double ITEM_QUANTIDADE
        double ITEM_VALOR_BRUTO
        varchar ITEM_DESCRICAO
    }

    ARQUIVOS_OFX {
        bigint ID_ARQUIVO_OFX PK
        varchar NOME_ARQUIVO
        datetime DATA_IMPORTACAO
        bigint ID_CONTA FK
        int QUANTIDADE_RECEITAS
        int QUANTIDADE_DESPESAS
    }

    ARQUIVO_OFX_TRANSACOES {
        bigint ID_ARQUIVO_OFX_TRANSACAO PK
        bigint ID_ARQUIVO_OFX FK
        varchar FIT_ID
        varchar TIPO_TRANSACAO
    }

    RECORRENCIAS {
        int ID_RECORRENCIA PK
        varchar TIPO
        varchar NOME
        date DATA_CADASTRO
        varchar TIPO_RECORRENCIA
        int ID_DESPESA
        int ID_RECEITA
    }

    PESSOAS ||--o{ DEPENDENCIAS : "responsavel_id"
    PESSOAS ||--o{ DEPENDENCIAS : "dependente_id"
    NOTA_FISCAL ||--o{ ITENS_NOTA_FISCAL : "contem"
    NOTA_FISCAL ||--o{ RECEITAS : "vinculada"
    NOTA_FISCAL ||--o{ DESPESAS : "vinculada"
    CONTAS ||--o{ LIVRO_MOVIMENTACAO : "movimenta"
    RECEITAS ||--o{ LIVRO_MOVIMENTACAO : "registra"
    DESPESAS ||--o{ LIVRO_MOVIMENTACAO : "registra"
    CONTAS ||--o{ TRANSFERENCIAS : "origem"
    CONTAS ||--o{ TRANSFERENCIAS : "destino"
    CONTAS ||--o{ ARQUIVOS_OFX : "importa"
    ARQUIVOS_OFX ||--o{ ARQUIVO_OFX_TRANSACOES : "contem"
```

---

## 3. MER Proposto — Multi-Usuário

### 3.1 Estratégia adotada: Grupo Familiar como Tenant

Cada `GrupoFamiliar` é um tenant isolado. Todos os dados financeiros pertencem a um grupo. Usuários entram no grupo com papéis distintos. A chave `id_grupo_familiar` é adicionada como FK em todas as entidades de negócio.

```mermaid
erDiagram

    %% ─── AUTENTICAÇÃO E CONTROLE DE ACESSO ───────────────────────────────────

    GRUPO_FAMILIAR {
        bigint ID_GRUPO_FAMILIAR PK
        varchar NOME
        varchar DESCRICAO
        varchar PLANO
        timestamp DATA_CRIACAO
        boolean ATIVO
    }

    USUARIO {
        bigint ID_USUARIO PK
        bigint ID_GRUPO_FAMILIAR FK
        varchar NOME
        varchar EMAIL UK
        varchar SENHA_HASH
        varchar PAPEL
        varchar STATUS
        timestamp DATA_CRIACAO
        timestamp ULTIMO_ACESSO
        boolean ATIVO
    }

    TOKEN_RECUPERACAO_SENHA {
        bigint ID_TOKEN PK
        bigint ID_USUARIO FK
        varchar TOKEN UK
        timestamp DATA_EXPIRACAO
        boolean USADO
    }

    %% ─── ESTRUTURA FAMILIAR ──────────────────────────────────────────────────

    MEMBRO_FAMILIA {
        bigint ID_MEMBRO PK
        bigint ID_GRUPO_FAMILIAR FK
        bigint ID_USUARIO FK
        varchar NOME
        varchar PAPEL_FINANCEIRO
        decimal RENDA_MENSAL
        decimal ORCAMENTO_MENSAL
        date DATA_NASCIMENTO
        varchar TIPO_PESSOA
        varchar CPF
        varchar CNPJ
        boolean ATIVO
    }

    DEPENDENCIA_FINANCEIRA {
        bigint ID_DEPENDENCIA PK
        bigint ID_GRUPO_FAMILIAR FK
        bigint RESPONSAVEL_ID FK
        bigint DEPENDENTE_ID FK
        int NIVEL_DEPENDENCIA
    }

    ENTIDADE_EXTERNA {
        bigint ID_ENTIDADE PK
        bigint ID_GRUPO_FAMILIAR FK
        varchar NOME
        varchar TIPO_PESSOA
        varchar CPF
        varchar CNPJ
        varchar IE
        varchar RG
        varchar IRPF
        varchar IRPJ
        boolean ATIVO
    }

    CONTATO {
        bigint ID_CONTATO PK
        bigint ID_ENTIDADE FK
        varchar TIPO
        varchar VALOR
        boolean ATIVO
    }

    ENDERECO {
        bigint ID_ENDERECO PK
        bigint ID_ENTIDADE FK
        varchar NOME_ENDERECO
        varchar LOGRADOURO
        varchar NUMERO
        varchar COMPLEMENTO
        varchar BAIRRO
        varchar CIDADE
        varchar UF
        varchar CEP
    }

    %% ─── FINANCEIRO CORE ─────────────────────────────────────────────────────

    CATEGORIA {
        bigint ID_CATEGORIA PK
        bigint ID_GRUPO_FAMILIAR FK
        varchar NOME
        varchar DESCRICAO
        varchar TIPO
        varchar ICONE
        varchar COR
        boolean ATIVA
    }

    CONTA {
        bigint ID_CONTA PK
        bigint ID_GRUPO_FAMILIAR FK
        bigint ID_MEMBRO_RESPONSAVEL FK
        varchar NOME
        varchar BANCO
        varchar AGENCIA
        varchar NUMERO_CONTA
        varchar TIPO_CONTA
        decimal SALDO_INICIAL
        decimal SALDO_ATUAL
        boolean ATIVA
    }

    LANCAMENTO {
        bigint ID_LANCAMENTO PK
        bigint ID_GRUPO_FAMILIAR FK
        bigint ID_USUARIO_CRIADOR FK
        bigint ID_CONTA FK
        bigint ID_CATEGORIA FK
        bigint ID_MEMBRO FK
        bigint ID_ENTIDADE_EXTERNA FK
        bigint ID_NOTA_FISCAL FK
        varchar TIPO
        varchar DESCRICAO
        decimal VALOR_BRUTO
        decimal VALOR_LIQUIDO
        date DATA_TRANSACAO
        timestamp DATA_CADASTRO
        varchar FIT_ID
        varchar STATUS
        boolean RECORRENTE
    }

    RECORRENCIA {
        bigint ID_RECORRENCIA PK
        bigint ID_GRUPO_FAMILIAR FK
        bigint ID_LANCAMENTO_ORIGEM FK
        varchar NOME
        varchar TIPO_RECORRENCIA
        int TOTAL_PARCELAS
        int PARCELA_ATUAL
        date PROXIMA_DATA
        boolean ATIVO
    }

    LIVRO_MOVIMENTACAO {
        bigint ID_MOVIMENTACAO PK
        bigint ID_GRUPO_FAMILIAR FK
        bigint ID_CONTA FK
        bigint ID_LANCAMENTO FK
        bigint ID_USUARIO_CRIADOR FK
        date DATA_MOVIMENTACAO
        decimal VALOR
        varchar DESCRICAO
        varchar TIPO_MOVIMENTACAO
        timestamp DATA_CADASTRO
    }

    TRANSFERENCIA {
        bigint ID_TRANSFERENCIA PK
        bigint ID_GRUPO_FAMILIAR FK
        bigint ID_CONTA_ORIGEM FK
        bigint ID_CONTA_DESTINO FK
        bigint ID_USUARIO_CRIADOR FK
        decimal VALOR
        datetime DATA_TRANSFERENCIA
        varchar DESCRICAO
        boolean ATIVA
    }

    %% ─── NOTA FISCAL ─────────────────────────────────────────────────────────

    NOTA_FISCAL {
        bigint ID_NOTA_FISCAL PK
        bigint ID_GRUPO_FAMILIAR FK
        bigint ID_USUARIO_IMPORTADOR FK
        varchar DESCRICAO
        decimal VALOR_BRUTO
        date DATA_EMISSAO
        timestamp DATA_CADASTRO
    }

    ITEM_NOTA_FISCAL {
        bigint ID_ITEM PK
        bigint ID_NOTA_FISCAL FK
        varchar DESCRICAO
        double QUANTIDADE
        varchar UNIDADE_MEDIDA
        decimal VALOR_UNITARIO
        decimal VALOR_BRUTO
    }

    %% ─── IMPORTAÇÃO OFX ──────────────────────────────────────────────────────

    ARQUIVO_OFX {
        bigint ID_ARQUIVO_OFX PK
        bigint ID_GRUPO_FAMILIAR FK
        bigint ID_CONTA FK
        bigint ID_USUARIO_IMPORTADOR FK
        varchar NOME_ARQUIVO
        datetime DATA_IMPORTACAO
        int QUANTIDADE_RECEITAS
        int QUANTIDADE_DESPESAS
    }

    ARQUIVO_OFX_TRANSACAO {
        bigint ID_OFX_TRANSACAO PK
        bigint ID_ARQUIVO_OFX FK
        bigint ID_LANCAMENTO FK
        varchar FIT_ID
        varchar TIPO_TRANSACAO
    }

    %% ─── RELACIONAMENTOS ─────────────────────────────────────────────────────

    GRUPO_FAMILIAR ||--o{ USUARIO : "tem membros"
    GRUPO_FAMILIAR ||--o{ MEMBRO_FAMILIA : "composto por"
    GRUPO_FAMILIAR ||--o{ CATEGORIA : "define"
    GRUPO_FAMILIAR ||--o{ CONTA : "possui"
    GRUPO_FAMILIAR ||--o{ LANCAMENTO : "registra"
    GRUPO_FAMILIAR ||--o{ LIVRO_MOVIMENTACAO : "organiza"
    GRUPO_FAMILIAR ||--o{ TRANSFERENCIA : "realiza"
    GRUPO_FAMILIAR ||--o{ NOTA_FISCAL : "importa"
    GRUPO_FAMILIAR ||--o{ ARQUIVO_OFX : "importa"
    GRUPO_FAMILIAR ||--o{ ENTIDADE_EXTERNA : "cadastra"
    GRUPO_FAMILIAR ||--o{ DEPENDENCIA_FINANCEIRA : "estrutura"

    USUARIO ||--o{ TOKEN_RECUPERACAO_SENHA : "solicita"
    USUARIO |o--o{ MEMBRO_FAMILIA : "vincula"

    MEMBRO_FAMILIA ||--o{ DEPENDENCIA_FINANCEIRA : "responsavel"
    MEMBRO_FAMILIA ||--o{ DEPENDENCIA_FINANCEIRA : "dependente"
    MEMBRO_FAMILIA ||--o{ CONTA : "responsavel por"
    MEMBRO_FAMILIA ||--o{ LANCAMENTO : "gerou"

    ENTIDADE_EXTERNA ||--o{ CONTATO : "tem"
    ENTIDADE_EXTERNA ||--o{ ENDERECO : "tem"
    ENTIDADE_EXTERNA ||--o{ LANCAMENTO : "referenciada em"

    CATEGORIA ||--o{ LANCAMENTO : "classifica"

    CONTA ||--o{ LIVRO_MOVIMENTACAO : "movimenta"
    CONTA ||--o{ TRANSFERENCIA : "origem"
    CONTA ||--o{ TRANSFERENCIA : "destino"
    CONTA ||--o{ ARQUIVO_OFX : "importado para"
    CONTA ||--o{ LANCAMENTO : "associada"

    LANCAMENTO ||--o{ LIVRO_MOVIMENTACAO : "registrado em"
    LANCAMENTO |o--o| RECORRENCIA : "origina"
    LANCAMENTO |o--o| NOTA_FISCAL : "vinculada"
    LANCAMENTO ||--o{ ARQUIVO_OFX_TRANSACAO : "conciliado com"

    NOTA_FISCAL ||--o{ ITEM_NOTA_FISCAL : "contem"

    ARQUIVO_OFX ||--o{ ARQUIVO_OFX_TRANSACAO : "contem"
```

---

## 4. Detalhamento das mudanças

### 4.1 Entidades novas

| Entidade | Motivo |
|----------|--------|
| `GRUPO_FAMILIAR` | Tenant principal — isola todos os dados por família. Suporta múltiplas famílias no mesmo banco |
| `USUARIO` | Credencial de acesso com papel (ADMIN / MEMBRO / VISUALIZADOR) vinculado ao grupo |
| `TOKEN_RECUPERACAO_SENHA` | Suporte ao fluxo de recuperação de senha por email |
| `MEMBRO_FAMILIA` | Separação entre "membro da família" (com renda, orçamento, papel financeiro) e credencial de acesso (`USUARIO`) |
| `ENTIDADE_EXTERNA` | Renomeação de `PESSOA` — agora representa apenas fornecedores, empresas e terceiros externos |

### 4.2 Entidades modificadas

| Entidade | Mudanças |
|----------|----------|
| `CATEGORIA` | + `id_grupo_familiar` (FK) — categorias passam a ser por família; + `tipo` (RECEITA/DESPESA); + `icone` e `cor` (suporte à UI) |
| `CONTA` | + `id_grupo_familiar` (FK) + `id_membro_responsavel` (FK) — conta tem dono dentro da família |
| `LIVRO_MOVIMENTACAO` | + `id_grupo_familiar` (FK) + `id_usuario_criador` (FK) — rastreabilidade de quem lançou; simplificado: referencia um único `LANCAMENTO` em vez de `RECEITA` e `DESPESA` separados |
| `TRANSFERENCIA` | + `id_grupo_familiar` (FK) + `id_usuario_criador` (FK) |
| `NOTA_FISCAL` | + `id_grupo_familiar` (FK) + `id_usuario_importador` (FK) |
| `ARQUIVO_OFX` | + `id_grupo_familiar` (FK) + `id_usuario_importador` (FK) |
| `ARQUIVO_OFX_TRANSACAO` | + `id_lancamento` (FK) — transação OFX agora referencia o lançamento gerado, fechando o ciclo de conciliação |
| `RECORRENCIA` | Reestruturada — agora referencia um `LANCAMENTO` pai e controla parcelas individualmente |

### 4.3 Entidades consolidadas/removidas

| Entidade Antiga | Decisão | Motivo |
|----------------|---------|--------|
| `RECEITAS` + `DESPESAS` | **Consolidadas em `LANCAMENTO`** | As duas tabelas tinham estrutura idêntica (inclusive com prefixo `DESPESA_` nas colunas de `RECEITAS`). Um campo `TIPO` (`RECEITA` / `DESPESA`) resolve o problema sem duplicação de schema |
| `PESSOAS` | **Separada em `MEMBRO_FAMILIA` + `ENTIDADE_EXTERNA`** | Misturava dois conceitos distintos |

---

## 5. Campos de isolamento multi-tenant por entidade

Resumo de qual campo garante o isolamento dos dados por família:

| Entidade | Campo de tenant | Observação |
|----------|----------------|------------|
| `USUARIO` | `ID_GRUPO_FAMILIAR` | Direto |
| `MEMBRO_FAMILIA` | `ID_GRUPO_FAMILIAR` | Direto |
| `ENTIDADE_EXTERNA` | `ID_GRUPO_FAMILIAR` | Direto |
| `CATEGORIA` | `ID_GRUPO_FAMILIAR` | Direto |
| `CONTA` | `ID_GRUPO_FAMILIAR` | Direto |
| `LANCAMENTO` | `ID_GRUPO_FAMILIAR` | Direto |
| `LIVRO_MOVIMENTACAO` | `ID_GRUPO_FAMILIAR` | Direto |
| `TRANSFERENCIA` | `ID_GRUPO_FAMILIAR` | Direto |
| `NOTA_FISCAL` | `ID_GRUPO_FAMILIAR` | Direto |
| `ARQUIVO_OFX` | `ID_GRUPO_FAMILIAR` | Direto |
| `DEPENDENCIA_FINANCEIRA` | `ID_GRUPO_FAMILIAR` | Direto |
| `CONTATO` | Via `ID_ENTIDADE` → `ID_GRUPO_FAMILIAR` | Indireto |
| `ENDERECO` | Via `ID_ENTIDADE` → `ID_GRUPO_FAMILIAR` | Indireto |
| `ITEM_NOTA_FISCAL` | Via `ID_NOTA_FISCAL` → `ID_GRUPO_FAMILIAR` | Indireto |
| `ARQUIVO_OFX_TRANSACAO` | Via `ID_ARQUIVO_OFX` → `ID_GRUPO_FAMILIAR` | Indireto |
| `RECORRENCIA` | Via `ID_LANCAMENTO` → `ID_GRUPO_FAMILIAR` | Indireto |
| `TOKEN_RECUPERACAO_SENHA` | Via `ID_USUARIO` → `ID_GRUPO_FAMILIAR` | Indireto |

---

## 6. Papéis de usuário (PAPEL em USUARIO)

| Papel | Permissões |
|-------|-----------|
| `ADMIN` | Gerencia grupo, convida membros, acessa tudo |
| `MEMBRO` | Lança receitas/despesas, visualiza tudo dentro do grupo |
| `VISUALIZADOR` | Somente leitura — ideal para dependentes que acompanham o orçamento |

---

## 7. Plano de migração sugerido

### Fase 1 — Criar base multi-tenant (sem quebrar o que existe)
1. Criar tabela `GRUPO_FAMILIAR` com um registro padrão (`id=1, nome='Família Padrão'`)
2. Criar tabela `USUARIO` com o campo `id_grupo_familiar`
3. Adicionar coluna `id_grupo_familiar` em `CONTAS`, `CATEGORIAS` (com default `1`)
4. Adicionar coluna `id_grupo_familiar` em `LIVRO_MOVIMENTACAO`, `TRANSFERENCIAS`, `ARQUIVOS_OFX`

### Fase 2 — Consolidar RECEITAS e DESPESAS
5. Criar tabela `LANCAMENTO` unificada
6. Migrar dados de `RECEITAS` → `LANCAMENTO` com `tipo = 'RECEITA'`
7. Migrar dados de `DESPESAS` → `LANCAMENTO` com `tipo = 'DESPESA'`
8. Atualizar FKs em `LIVRO_MOVIMENTACAO` para apontar para `LANCAMENTO`
9. Deprecar tabelas `RECEITAS` e `DESPESAS`

### Fase 3 — Separar Pessoa
10. Criar `MEMBRO_FAMILIA` e `ENTIDADE_EXTERNA`
11. Migrar dados de `PESSOAS` para as novas tabelas com critério de negócio
12. Atualizar `DEPENDENCIAS` → `DEPENDENCIA_FINANCEIRA`

### Fase 4 — Rastreabilidade
13. Adicionar `id_usuario_criador` em todas as entidades de negócio
14. Implementar JWT com `claims`: `{ idUsuario, idGrupoFamiliar, papel }`
15. Implementar filtro global de tenant em todos os repositórios Panache

---

*Documento gerado em: junho de 2026*
*Baseado na análise do código-fonte em `backend-java/src/main/java/br/com/organomeno/`*
