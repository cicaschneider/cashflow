# Financial Frontend

Frontend da aplicação de gestão financeira pessoal desenvolvido em React com TypeScript.

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones
- **Vite** - Build tool e dev server

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

## ⚙️ Instalação e Execução

### 1. Instalação das Dependências

```bash
cd frontend
npm install
```

### 2. Execução em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### 3. Build para Produção

```bash
npm run build
```

## 🏗️ Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Dashboard.tsx    # Dashboard principal
│   │   ├── Transactions.tsx # Gestão de transações
│   │   ├── Budgets.tsx      # Gestão de orçamentos
│   │   ├── Goals.tsx        # Gestão de metas
│   │   └── Header.tsx       # Cabeçalho da aplicação
│   ├── context/             # Contextos React
│   │   ├── FinancialContext.tsx # Estado global financeiro
│   │   └── ThemeContext.tsx     # Tema claro/escuro
│   ├── types/               # Definições TypeScript
│   │   └── financial.ts     # Tipos financeiros
│   ├── utils/               # Utilitários
│   │   └── financial.ts     # Funções auxiliares
│   ├── data/                # Dados estáticos
│   │   └── defaultCategories.ts # Categorias padrão
│   └── App.tsx              # Componente principal
├── public/                  # Arquivos públicos
└── package.json            # Dependências e scripts
```

## 🎨 Funcionalidades

### Dashboard
- Visão geral das finanças
- Cards com saldo, receitas e despesas
- Transações recentes
- Gráfico de gastos por categoria
- Dicas de saúde financeira

### Transações
- Adicionar receitas e despesas
- Filtros por tipo, categoria e busca
- Listagem com paginação
- Exclusão de transações

### Orçamentos
- Criar orçamentos mensais por categoria
- Acompanhamento de gastos vs limite
- Indicadores visuais de status
- Alertas de orçamento excedido

### Metas
- Definir metas financeiras
- Acompanhar progresso
- Cálculo automático de economia necessária
- Status de metas (atingida, em progresso, vencida)

### Tema
- Modo claro e escuro
- Toggle no header
- Persistência da preferência
- Detecção automática do sistema

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do frontend se necessário:

```env
VITE_API_URL=http://localhost:3001
```

### Integração com Backend

A aplicação está configurada para se conectar com o backend em `http://localhost:3001`. Certifique-se de que o backend esteja rodando antes de usar a aplicação.

## 📱 Responsividade

A aplicação é totalmente responsiva e otimizada para:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎯 Próximas Melhorias

- [ ] Gráficos interativos
- [ ] Exportação de relatórios
- [ ] Notificações push
- [ ] Modo offline
- [ ] Testes automatizados
- [ ] PWA (Progressive Web App)