# CashFlow - Aplicativo de Gestão Financeira

CashFlow é um aplicativo web para controle de finanças pessoais. Ele permite gerenciar transações, orçamentos e metas financeiras, oferecendo dashboards com informações resumidas sobre receitas, despesas e saldo.

---

## 🖥 Tecnologias utilizadas

**Frontend**
- React + TypeScript
- Tailwind CSS
- Lucide Icons

**Backend**
- Node.js + Express
- PostgreSQL
- Dotenv para variáveis de ambiente
- CORS

**Utilitários**
- Fetch API para comunicação frontend-backend

---

## 🔹 Funcionalidades

1. **Dashboard**
   - Visualização do saldo total, receita, despesas e saldo mensal.
   - Principais gastos por categoria.
   - Dicas de saúde financeira.

2. **Transações**
   - Adicionar receitas e despesas.
   - Filtrar por tipo, categoria ou buscar por descrição.
   - Excluir transações.

3. **Orçamentos (Budgets)**
   - Adicionar e deletar orçamentos.
   - Listagem dos budgets existentes.

4. **Metas (Goals)**
   - Adicionar e deletar metas financeiras.
   - Listagem das metas existentes.


## 📝 Estrutura do Projeto
````
cashflow/
├─ backend/
│  ├─ routes/
│  │  ├─ budgets.js
│  │  ├─ goals.js
│  │  └─ transactions.js
│  ├─ db.js
│  └─ server.js
└─ frontend/
   ├─ src/
   │  ├─ components/
   │  │  ├─ Header.tsx
   │  │  ├─ Dashboard.tsx
   │  │  ├─ Transactions.tsx
   │  │  ├─ Budgets.tsx
   │  │  └─ Goals.tsx
   │  ├─ context/
   │  │  ├─ FinancialContext.tsx
   │  │  └─ ThemeContext.tsx
   │  ├─ utils/
   │  │  └─ financial.ts
   │  └─ index.css
   └─ package.json
````
## 📈 Próximas melhorias
  - Autenticação de usuário.
  - Exportação de relatórios financeiros.
  - Gráficos mais detalhados.
  - Notificações de orçamento ou metas atingidas.

## 👩‍💻 Autores
  - Maria Cecília Schneider de Oliveira
  - Guilherme Depiné Neto
  - Kauan A. Cipriani
  - Vitor Hugo Konzen

