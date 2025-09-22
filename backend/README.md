# Financial Management API

Backend para aplicação de gestão financeira pessoal desenvolvido em Node.js com Express e PostgreSQL.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **pg** - Driver PostgreSQL para Node.js
- **CORS** - Middleware para Cross-Origin Resource Sharing
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL (versão 12 ou superior)
- npm ou yarn

## ⚙️ Configuração

### 1. Configuração do Banco de Dados

Certifique-se de que o PostgreSQL está rodando e crie o banco de dados:

```sql
CREATE DATABASE financial_app;
```

### 2. Variáveis de Ambiente

O arquivo `.env` já está configurado com as credenciais padrão:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=financial_app
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3001
NODE_ENV=development
```

### 3. Instalação das Dependências

```bash
cd backend
npm install
```

### 4. Inicialização

```bash
npm start
# ou para desenvolvimento com auto-reload
npm run dev
```

## 📊 Estrutura do Banco de Dados

### Tabelas

#### `categories`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100)) - Nome da categoria
- `type` (VARCHAR(20)) - Tipo: 'income' ou 'expense'
- `color` (VARCHAR(7)) - Cor em hexadecimal
- `icon` (VARCHAR(50)) - Nome do ícone
- `created_at` (TIMESTAMP)

#### `transactions`
- `id` (SERIAL PRIMARY KEY)
- `type` (VARCHAR(20)) - Tipo: 'income' ou 'expense'
- `amount` (DECIMAL(10,2)) - Valor da transação
- `category` (VARCHAR(100)) - Categoria da transação
- `description` (TEXT) - Descrição
- `date` (DATE) - Data da transação
- `created_at` (TIMESTAMP)

#### `budgets`
- `id` (SERIAL PRIMARY KEY)
- `category` (VARCHAR(100)) - Categoria do orçamento
- `limit_amount` (DECIMAL(10,2)) - Limite do orçamento
- `spent` (DECIMAL(10,2)) - Valor gasto
- `month` (VARCHAR(7)) - Mês no formato YYYY-MM
- `created_at` (TIMESTAMP)

#### `goals`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(200)) - Nome da meta
- `target_amount` (DECIMAL(10,2)) - Valor objetivo
- `current_amount` (DECIMAL(10,2)) - Valor atual
- `target_date` (DATE) - Data objetivo
- `category` (VARCHAR(100)) - Categoria da meta
- `created_at` (TIMESTAMP)

## 🛠️ Endpoints da API

### Transações (`/api/transactions`)

- `GET /` - Listar todas as transações
- `POST /` - Criar nova transação
- `DELETE /:id` - Excluir transação
- `GET /summary` - Resumo das transações

### Orçamentos (`/api/budgets`)

- `GET /` - Listar todos os orçamentos
- `POST /` - Criar novo orçamento
- `PUT /:id` - Atualizar valor gasto do orçamento
- `DELETE /:id` - Excluir orçamento
- `POST /recalculate` - Recalcular valores gastos

### Metas (`/api/goals`)

- `GET /` - Listar todas as metas
- `POST /` - Criar nova meta
- `PUT /:id` - Atualizar valor atual da meta
- `DELETE /:id` - Excluir meta
- `GET /summary` - Resumo das metas

### Categorias (`/api/categories`)

- `GET /` - Listar todas as categorias
- `POST /` - Criar nova categoria
- `DELETE /:id` - Excluir categoria

### Utilitários

- `GET /api/health` - Verificação de saúde da API
- `GET /` - Informações da API e endpoints

## 🔧 Funcionalidades

### Inicialização Automática
- Criação automática das tabelas no primeiro uso
- Inserção das categorias padrão
- Verificação de conexão com o banco

### Validações
- Validação de tipos de dados
- Verificação de campos obrigatórios
- Validação de valores positivos
- Verificação de datas futuras para metas

### Segurança
- Tratamento de erros SQL
- Validação de entrada
- Logs de requisições
- Middleware de tratamento de erros

## 📝 Exemplos de Uso

### Criar Transação
```bash
curl -X POST http://localhost:3001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "expense",
    "amount": 50.00,
    "category": "Alimentação",
    "description": "Almoço no restaurante",
    "date": "2024-01-15"
  }'
```

### Criar Orçamento
```bash
curl -X POST http://localhost:3001/api/budgets \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Alimentação",
    "limit": 500.00,
    "month": "2024-01"
  }'
```

## 🐛 Troubleshooting

### Erro de Conexão com PostgreSQL
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Certifique-se de que o banco `financial_app` existe

### Porta já em uso
- Altere a porta no arquivo `.env`
- Ou pare o processo que está usando a porta 3001

## 📈 Próximas Melhorias

- [ ] Autenticação JWT
- [ ] Paginação nas listagens
- [ ] Filtros avançados
- [ ] Backup automático
- [ ] Logs estruturados
- [ ] Testes automatizados
- [ ] Docker containerization