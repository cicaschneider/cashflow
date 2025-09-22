# CashFlow - Aplicativo de Gestão Financeira

CashFlow é um aplicativo web completo para controle de finanças pessoais. Ele permite gerenciar transações, orçamentos e metas financeiras, oferecendo dashboards com informações resumidas sobre receitas, despesas e saldo.

---

## 🖥 Tecnologias utilizadas

**Frontend**
- React + TypeScript
- Tailwind CSS
- Lucide Icons
- Vite

**Backend**
- Node.js + Express
- PostgreSQL
- Dotenv para variáveis de ambiente
- CORS

**Utilitários**
- Context API para gerenciamento de estado
- Fetch API para comunicação frontend-backend

---

## 🔹 Funcionalidades

1. **Dashboard**
   - Visualização do saldo total, receita, despesas e saldo mensal.
   - Principais gastos por categoria.
   - Dicas de saúde financeira.
   - Modo claro/escuro.

2. **Transações**
   - Adicionar receitas e despesas.
   - Filtrar por tipo, categoria ou buscar por descrição.
   - Excluir transações.
   - Listagem responsiva.

3. **Orçamentos (Budgets)**
   - Adicionar e deletar orçamentos mensais.
   - Acompanhamento automático de gastos.
   - Indicadores visuais de status.
   - Alertas de orçamento excedido.

4. **Metas (Goals)**
   - Adicionar e deletar metas financeiras.
   - Acompanhar progresso com barras visuais.
   - Cálculo de economia necessária.
   - Status de metas (concluída, em progresso, vencida).

## 📝 Estrutura do Projeto
```
cashflow/
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ Header.tsx
│  │  │  ├─ Dashboard.tsx
│  │  │  ├─ Transactions.tsx
│  │  │  ├─ Budgets.tsx
│  │  │  └─ Goals.tsx
│  │  ├─ context/
│  │  │  ├─ FinancialContext.tsx
│  │  │  └─ ThemeContext.tsx
│  │  ├─ utils/
│  │  │  └─ financial.ts
│  │  └─ types/
│  │     └─ financial.ts
│  └─ package.json
└─ backend/
   ├─ routes/
   │  ├─ budgets.js
   │  ├─ goals.js
   │  ├─ transactions.js
   │  └─ categories.js
   ├─ db.js
   ├─ server.js
   └─ package.json
```

## 🚀 Como executar

### Pré-requisitos
- Node.js (versão 16+)
- PostgreSQL
- npm ou yarn

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Banco de Dados
1. Crie o banco `financial_app` no PostgreSQL
2. Configure as credenciais no arquivo `backend/.env`
3. As tabelas são criadas automaticamente na primeira execução

## 📊 Endpoints da API

- **GET/POST/DELETE** `/api/transactions` - Gerenciar transações
- **GET/POST/DELETE** `/api/budgets` - Gerenciar orçamentos
- **GET/POST/DELETE** `/api/goals` - Gerenciar metas
- **GET/POST/DELETE** `/api/categories` - Gerenciar categorias
- **GET** `/api/health` - Status da API

## 📈 Próximas melhorias
- Autenticação de usuário
- Exportação de relatórios financeiros
- Gráficos mais detalhados
- Notificações de orçamento ou metas atingidas
- PWA (Progressive Web App)
- Testes automatizados

## 👩‍💻 Autores
- Maria Cecília Schneider de Oliveira
- Guilherme Depiné Neto
- Kauan A. Cipriani
- Vitor Hugo Konzen