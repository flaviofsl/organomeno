# Organomeno — Sistema de Gestão Financeira Familiar

O **Organomeno** é uma aplicação web de gestão financeira voltada para famílias. O propósito central é oferecer visibilidade completa sobre o fluxo de dinheiro de um núcleo familiar: quem provê, quem depende, quais contas existem, como as receitas e despesas se distribuem entre os membros e categorias, e como o saldo evolui ao longo do tempo.

A ideia parte de uma realidade comum: famílias gerenciam finanças de forma compartilhada, com provedores principais, dependentes financeiros e membros que contribuem parcialmente. O sistema mapeia essa estrutura de forma visual (organograma familiar) e a conecta diretamente aos lançamentos financeiros, oferecendo uma visão integrada que vai além de um simples controle de gastos pessoais.

---

## Telas do Sistema

### Autenticação

| Login | Cadastro de Usuário | Recuperação de Senha |
|-------|--------------------|--------------------|
| ![Login](Documentação/telas/01_login.png) | ![Cadastro](Documentação/telas/02_cadastro_usuario.png) | ![Recuperar Senha](Documentação/telas/03_esqueci_senha.png) |

---

### Dashboard

Visão geral das finanças da família: saldo consolidado, resumo de receitas e despesas do período, gráficos de evolução e alertas relevantes.

![Dashboard](Documentação/telas/04_dashboard.png)

---

### Movimentações Financeiras

| Extrato | Registrar Lançamento |
|---------|---------------------|
| ![Extrato](Documentação/telas/05_extrato.png) | ![Registrar](Documentação/telas/06_registrar_lancamento.png) |

| Lista de Receitas | Lista de Despesas |
|------------------|------------------|
| ![Receitas](Documentação/telas/07_lista_receitas.png) | ![Despesas](Documentação/telas/08_lista_despesas.png) |

| Manutenção de Transação | Detalhe da Transação |
|------------------------|---------------------|
| ![Manutenção](Documentação/telas/09_manutencao_transacao.png) | ![Detalhe](Documentação/telas/10_detalhe_transacao.png) |

| Livro Caixa | Prévia de Impressão |
|-------------|---------------------|
| ![Livro Caixa](Documentação/telas/11_livro_caixa.png) | ![Impressão](Documentação/telas/12_previa_impressao.png) |

---

### Transferências

| Lista de Transferências | Formulário de Transferência |
|------------------------|-----------------------------|
| ![Transferências](Documentação/telas/13_lista_transferencias.png) | ![Form Transferência](Documentação/telas/14_form_transferencia.png) |

---

### Contas Bancárias

| Lista de Contas | Formulário de Conta |
|----------------|---------------------|
| ![Contas](Documentação/telas/15_lista_contas.png) | ![Form Conta](Documentação/telas/16_form_conta.png) |

---

### Categorias

| Lista de Categorias | Formulário de Categoria |
|--------------------|------------------------|
| ![Categorias](Documentação/telas/18_lista_categorias.png) | ![Form Categoria](Documentação/telas/19_form_categoria.png) |

---

### Importação de Dados

| Importar OFX | Importar Fatura |
|--------------|----------------|
| ![OFX](Documentação/telas/21_importar_ofx.png) | ![Fatura](Documentação/telas/22_importar_fatura.png) |

---

### Gestão Familiar

| Hub Família | Estrutura Familiar |
|-------------|-------------------|
| ![Família](Documentação/telas/23_hub_familia.png) | ![Estrutura](Documentação/telas/24_estrutura_familiar.png) |

| Dependentes | Provedores | Entidades |
|-------------|------------|-----------|
| ![Dependentes](Documentação/telas/26_dependentes.png) | ![Provedores](Documentação/telas/27_provedores.png) | ![Entidades](Documentação/telas/28_entidades.png) |

---

### Configurações

| Configurações Gerais | Notificações |
|---------------------|--------------|
| ![Config Gerais](Documentação/telas/29_configuracoes_gerais.png) | ![Notificações](Documentação/telas/30_configuracoes_notificacoes.png) |

---

## Funcionalidades Principais

- **Dashboard financeiro** com visão consolidada de saldos, receitas, despesas e evolução mensal
- **Extrato e livro caixa** com histórico completo de movimentações e prévia para impressão
- **Gestão de contas bancárias** — corrente, poupança, salário e investimento
- **Controle de receitas e despesas** com categorização detalhada
- **Transferências entre contas** com rastreabilidade completa
- **Importação de extratos OFX** para conciliação automática com movimentos bancários
- **Importação de faturas** de cartão de crédito
- **Estrutura familiar** — organograma com provedores, dependentes e vínculos financeiros
- **Gestão de membros** — adicionar/editar membros, dependentes e provedores
- **Cadastro de entidades** (pessoas físicas e jurídicas) vinculadas a lançamentos
- **Configurações** de notificações e preferências gerais

---

## Arquitetura

O projeto é dividido em dois módulos independentes que se comunicam via API REST:

```
organomeno/
├── frontend/          # SPA React (porta 3000)
└── backend-java/      # API REST Quarkus (porta 8080)
```

### Frontend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 19 | Framework UI |
| TypeScript | 5.8 | Tipagem estática |
| Vite | 6 | Build e dev server |
| Tailwind CSS | 4 | Estilização |
| Recharts | 3 | Gráficos financeiros |
| Motion | 12 | Animações de tela |
| Lucide React | — | Ícones |
| date-fns | 4 | Manipulação de datas |
| Google Generative AI | — | Integração com IA (Gemini) |

Roteamento 100% client-side implementado em `frontend/src/lib/routing.ts`, sem dependência de biblioteca de router externa.

### Backend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Java | 17 | Linguagem |
| Quarkus | 3.9.3 | Framework REST |
| Hibernate ORM Panache | — | Persistência |
| MySQL | — | Banco de dados |
| Lombok | 1.18.30 | Redução de boilerplate |
| MapStruct | 1.5.5 | Mapeamento DTO ↔ Entity |
| ofx4j | 1.37 | Parser de arquivos OFX |
| Apache POI | 5.2 | Leitura de planilhas Excel |
| Jsoup | 1.16.1 | Parse de HTML (notas fiscais) |

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- Java 17+
- MySQL 8+
- Maven 3.9+

### Frontend

```bash
cd frontend
npm install
npm run dev
# Acesse: http://localhost:3000
```

### Backend

```bash
cd backend-java

# Modo desenvolvimento (hot reload)
./mvnw compile quarkus:dev
# API disponível em: http://localhost:8080
# Dev UI: http://localhost:8080/q/dev
```

Configure as variáveis de ambiente do banco de dados antes de iniciar o backend (datasource no `application.properties` do Quarkus).

### Build para produção

```bash
# Frontend
cd frontend && npm run build

# Backend (JAR)
cd backend-java && ./mvnw package
java -jar target/quarkus-app/quarkus-run.jar

# Backend (executável nativo com GraalVM)
cd backend-java && ./mvnw package -Dnative
./target/organomeno-1.0.0-SNAPSHOT-runner
```

---

## Estrutura de Telas (Rotas)

| Rota | Tela |
|------|------|
| `/login` | Login |
| `/register-user` | Cadastro de usuário |
| `/forgot-password` | Recuperação de senha |
| `/dashboard` | Dashboard financeiro |
| `/ledger` | Extrato |
| `/register` | Registrar lançamento |
| `/income-list` | Lista de receitas |
| `/expense-list` | Lista de despesas |
| `/maintain-transaction` | Manutenção de transação |
| `/transaction-detail` | Detalhe da transação |
| `/ledger-book` | Livro caixa |
| `/ledger-print-preview` | Prévia de impressão |
| `/transfer-list` | Transferências |
| `/transfer-form` | Formulário de transferência |
| `/account-list` | Lista de contas |
| `/account-form` | Formulário de conta |
| `/category-list` | Lista de categorias |
| `/category-form` | Formulário de categoria |
| `/import-ofx` | Importar extrato OFX |
| `/import-invoice` | Importar fatura |
| `/family` | Hub familiar |
| `/family-structure` | Estrutura familiar |
| `/add-family-member` | Adicionar membro |
| `/dependents` | Dependentes |
| `/providers` | Provedores |
| `/entities` | Entidades (pessoas/empresas) |
| `/general-settings` | Configurações gerais |
| `/notification-settings` | Configurações de notificações |

---

## Estrutura Familiar — Conceito

O diferencial do Organomeno em relação a apps de finanças pessoais convencionais é a modelagem da **estrutura financeira familiar**. A aplicação representa os relacionamentos de dependência financeira em forma de organograma:

```
João ─────────┬───────── Maria
   (provedor) │          (provedora)
              │
     ┌────────┴────────┐
     │                 │
  Ana + Pedro        Carlos
  (contribuem)     (dependente)
        │
     Beatriz
    (dependente)
```

Cada membro pode ser classificado como **provedor principal**, **co-provedor** ou **dependente financeiro**, e essa estrutura influencia diretamente os relatórios e a visão consolidada das finanças.

---

## Licença

Consulte o arquivo [LICENSE](LICENSE) para os termos de uso.
