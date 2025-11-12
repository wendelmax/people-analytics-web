# People Analytics Web

Frontend da aplicação People Analytics desenvolvido com React, TypeScript e Vite.

## Tecnologias

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool rápida e moderna
- **React Router** - Roteamento para aplicações React
- **Axios** - Cliente HTTP para requisições à API
- **React Hook Form** - Gerenciamento de formulários
- **Yup** - Validação de schemas
- **Tailwind CSS** - Framework CSS utilitário
- **date-fns** - Biblioteca para manipulação de datas

## Pré-requisitos

- Node.js v18 ou superior
- npm ou yarn
- Backend da API rodando em `http://localhost:3000`

## Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd people-analytics-web
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# No Windows (PowerShell)
Copy-Item .env.example .env

# No Linux/Mac
cp .env.example .env
```

Edite o arquivo `.env` e configure conforme necessário. Veja o arquivo `ENV_SETUP.md` para mais detalhes sobre as variáveis de ambiente.

## Executando o Projeto

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build de Produção

```bash
npm run build
```

### Preview do Build

```bash
npm run preview
```

## Estrutura do Projeto

```
src/
├── api/                    # Cliente API e configuração
│   └── client.ts          # Cliente HTTP configurado
├── components/            # Componentes React
│   ├── common/            # Componentes reutilizáveis
│   ├── employees/         # Componentes de funcionários
│   └── layout/           # Componentes de layout
├── contexts/             # Contextos React
│   └── AuthContext.tsx    # Contexto de autenticação
├── hooks/                 # Custom hooks
│   ├── useEmployees.ts
│   ├── useDepartments.ts
│   ├── usePositions.ts
│   └── useSkills.ts
├── pages/                 # Páginas/Rotas
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Employees.tsx
│   ├── Departments.tsx
│   ├── Positions.tsx
│   └── Skills.tsx
├── services/              # Serviços de negócio
│   ├── employeeService.ts
│   ├── departmentService.ts
│   ├── positionService.ts
│   └── skillService.ts
├── types/                 # Tipos TypeScript
│   └── index.ts
├── utils/                 # Utilitários
│   ├── formatters.ts
│   ├── validators.ts
│   └── constants.ts
├── App.tsx
└── main.tsx
```

## Funcionalidades Implementadas

### Autenticação
- Login de usuários
- Proteção de rotas privadas
- Gerenciamento de token JWT

### Módulos Principais
- **Funcionários (Employees)**: CRUD completo
- **Departamentos (Departments)**: CRUD completo
- **Posições (Positions)**: CRUD completo
- **Habilidades (Skills)**: CRUD completo

### Componentes Comuns
- Button, Input, Select, Modal
- Table, Card, LoadingSpinner
- ErrorMessage, EmptyState

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria o build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter
- `npm run format` - Formata o código com Prettier

## Configuração

### Variáveis de Ambiente

- `VITE_API_URL` - URL base da API (padrão: http://localhost:3000)
- `VITE_API_TIMEOUT` - Timeout das requisições em ms (padrão: 30000)
- `VITE_ENVIRONMENT` - Ambiente de execução (development/production)

### Autenticação

A aplicação utiliza autenticação JWT. O token é armazenado no `localStorage` com a chave `authToken`.

Para fazer login, é necessário que o backend tenha um endpoint `/auth/login` que aceite `email` e `password` e retorne um token.

## Próximos Passos

- Implementar módulos adicionais (Projects, Training, Goals, Performance Reviews, Feedback)
- Adicionar gráficos e analytics
- Implementar sistema de notificações
- Adicionar testes unitários e de integração
- Melhorar responsividade mobile
- Implementar modo escuro

## Deploy

Este projeto possui um workflow automatizado do GitHub Actions para fazer deploy no Vercel.

### Configuração Rápida

1. Configure os secrets no GitHub:
   - `VERCEL_TOKEN` - Token do Vercel
   - `VERCEL_ORG_ID` - ID da organização no Vercel
   - `VERCEL_PROJECT_ID` - ID do projeto no Vercel

2. O deploy acontece automaticamente ao fazer push para `main` ou `master`

Para mais detalhes, consulte o arquivo [DEPLOY.md](./DEPLOY.md)

## Documentação

Consulte a pasta `frontend-docs/` para documentação completa da API e guias de desenvolvimento.

## Licença

Este projeto é privado e de uso interno.

