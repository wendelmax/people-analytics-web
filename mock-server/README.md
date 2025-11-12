# Mock Server - People Analytics Web

Este projeto possui um servidor mock completo para desenvolvimento e testes.

## Opções de Mock Server

### Opção 1: Mock Server Express (Atual - Recomendado)

Servidor Express.js simples e eficiente já configurado no projeto.

**Vantagens:**
- ✅ Já configurado e funcionando
- ✅ Banco de dados JSON persistente
- ✅ Fácil de modificar e estender
- ✅ Não requer instalação global

**Como usar:**
```bash
# Terminal 1: Iniciar mock server
npm run mock:server

# Terminal 2: Iniciar frontend
npm run dev
```

### Opção 2: MockServer Global (Java)

MockServer é uma ferramenta Java poderosa para mockar APIs HTTP/HTTPS.

**Instalação:**
```bash
npm install -g mockserver
```

**Vantagens:**
- ✅ Mais recursos avançados
- ✅ Suporte a expectations e verifications
- ✅ Interface web para gerenciar mocks
- ✅ Suporte a HTTPS

**Desvantagens:**
- ❌ Requer Java instalado
- ❌ Mais complexo de configurar
- ❌ Overhead maior

**Como usar MockServer:**

1. Instalar MockServer globalmente:
```bash
npm install -g mockserver
```

2. Iniciar MockServer:
```bash
mockserver -serverPort 1080 -logLevel INFO
```

3. Configurar expectations via API ou arquivo JSON

4. Atualizar `.env`:
```env
VITE_MOCK_API_URL=http://localhost:1080
VITE_USE_MOCK=true
```

## Configuração Atual (Express)

### Estrutura

```
mock-server/
├── index.ts          # Servidor Express principal
├── mock-db.json      # Banco de dados JSON (gerado automaticamente)
├── tsconfig.json     # Configuração TypeScript
└── README.md         # Esta documentação
```

### Endpoints Disponíveis

#### Autenticação
- `POST /auth/login` - Login de usuário

#### Funcionários
- `GET /employee` - Listar funcionários
- `GET /employee/:id` - Buscar funcionário
- `POST /employee` - Criar funcionário
- `PATCH /employee/:id` - Atualizar funcionário
- `DELETE /employee/:id` - Deletar funcionário

#### Departamentos
- `GET /departments` - Listar departamentos
- `GET /departments/:id` - Buscar departamento
- `POST /departments` - Criar departamento
- `PATCH /departments/:id` - Atualizar departamento
- `DELETE /departments/:id` - Deletar departamento

#### Posições
- `GET /positions` - Listar posições
- `GET /positions/:id` - Buscar posição
- `POST /positions` - Criar posição
- `PATCH /positions/:id` - Atualizar posição
- `DELETE /positions/:id` - Deletar posição

#### Habilidades
- `GET /skills` - Listar habilidades
- `GET /skills/:id` - Buscar habilidade
- `POST /skills` - Criar habilidade
- `PATCH /skills/:id` - Atualizar habilidade
- `DELETE /skills/:id` - Deletar habilidade
- `POST /skill-proficiency` - Criar proficiência
- `GET /skill-proficiency/employee/:employeeId` - Proficiências do funcionário

#### Projetos
- `GET /projects` - Listar projetos
- `GET /projects/:id` - Buscar projeto
- `POST /projects` - Criar projeto
- `PATCH /projects/:id` - Atualizar projeto
- `DELETE /projects/:id` - Deletar projeto

#### Alocações
- `GET /allocations/projects` - Listar alocações
- `GET /allocations/projects/:id` - Buscar alocação
- `POST /allocations/projects` - Criar alocação
- `PATCH /allocations/projects/:id` - Atualizar alocação
- `DELETE /allocations/projects/:id` - Deletar alocação

#### Licenças
- `GET /leaves/types` - Listar tipos de licença
- `GET /leaves/types/:id` - Buscar tipo de licença
- `POST /leaves/types` - Criar tipo de licença
- `PATCH /leaves/types/:id` - Atualizar tipo de licença
- `DELETE /leaves/types/:id` - Deletar tipo de licença
- `GET /leaves/requests` - Listar solicitações
- `GET /leaves/requests/:id` - Buscar solicitação
- `POST /leaves/requests` - Criar solicitação
- `PATCH /leaves/requests/:id` - Atualizar solicitação
- `POST /leaves/requests/:id/approve` - Aprovar solicitação
- `POST /leaves/requests/:id/reject` - Rejeitar solicitação
- `POST /leaves/requests/:id/cancel` - Cancelar solicitação

#### Presença
- `GET /attendance` - Listar registros
- `GET /attendance/:id` - Buscar registro
- `POST /attendance/check-in` - Registrar entrada
- `POST /attendance/check-out` - Registrar saída

#### Treinamentos
- `GET /trainings` - Listar treinamentos
- `GET /trainings/:id` - Buscar treinamento
- `POST /trainings` - Criar treinamento
- `PATCH /trainings/:id` - Atualizar treinamento
- `DELETE /trainings/:id` - Deletar treinamento

#### Objetivos
- `GET /goals` - Listar objetivos
- `GET /goals/:id` - Buscar objetivo
- `POST /goals` - Criar objetivo
- `PATCH /goals/:id` - Atualizar objetivo
- `DELETE /goals/:id` - Deletar objetivo

#### Performance
- `GET /performance` - Listar avaliações
- `GET /performance/:id` - Buscar avaliação
- `POST /performance` - Criar avaliação
- `PATCH /performance/:id` - Atualizar avaliação
- `DELETE /performance/:id` - Deletar avaliação

#### Feedback
- `GET /feedback` - Listar feedbacks
- `GET /feedback/:id` - Buscar feedback
- `POST /feedback` - Criar feedback
- `PATCH /feedback/:id` - Atualizar feedback
- `DELETE /feedback/:id` - Deletar feedback

#### Mentoria
- `GET /mentoring` - Listar relacionamentos
- `GET /mentoring/:id` - Buscar relacionamento
- `POST /mentoring` - Criar relacionamento
- `PATCH /mentoring/:id` - Atualizar relacionamento
- `DELETE /mentoring/:id` - Deletar relacionamento

#### Analytics
- `GET /analytics/overview` - Visão geral
- `GET /analytics/performance-trend` - Tendência de performance

#### Notificações
- `GET /notifications/user/:userId/unread` - Notificações não lidas

#### Dashboard do Funcionário
- `GET /employee/me/dashboard` - Dashboard completo
- `GET /employee/me/profile` - Perfil do funcionário
- `PATCH /employee/me/profile` - Atualizar perfil
- `GET /employee/me/attendance` - Minha presença
- `GET /employee/me/attendance/summary` - Resumo de presença
- `GET /employee/me/leaves` - Minhas licenças
- `GET /employee/me/leave-balances` - Saldos de licenças
- `GET /employee/me/goals` - Meus objetivos
- `GET /employee/me/trainings` - Meus treinamentos
- `GET /employee/me/performance-reviews` - Minhas avaliações

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Usar mock server
VITE_USE_MOCK=true

# URL do mock server Express (padrão: http://localhost:3001)
VITE_MOCK_API_URL=http://localhost:3001

# URL da API real (quando não usar mock)
VITE_API_URL=http://localhost:3000

# Timeout das requisições (ms)
VITE_API_TIMEOUT=30000
```

### Scripts NPM

```bash
# Iniciar apenas o mock server
npm run mock:server

# Iniciar mock server + frontend
npm run dev:mock

# Iniciar apenas frontend
npm run dev
```

### Banco de Dados

O banco de dados é salvo em `mock-server/mock-db.json` e é persistente entre execuções.

**Resetar banco de dados:**
```bash
# Pare o servidor e delete o arquivo
rm mock-server/mock-db.json

# Reinicie o servidor - dados iniciais serão recriados
npm run mock:server
```

### Adicionando Novos Endpoints

1. Adicione a entidade no tipo `Database`:
```typescript
interface Database {
  // ... outras entidades
  novaEntidade: any[];
}
```

2. Inicialize no `seedDatabase()` se necessário:
```typescript
db.novaEntidade = [
  { id: '1', name: 'Exemplo' }
];
```

3. Crie as rotas:
```typescript
app.get('/nova-entidade', (req, res) => {
  res.json(db.novaEntidade);
});

app.post('/nova-entidade', (req, res) => {
  const novo = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.novaEntidade.push(novo);
  saveDatabase();
  res.status(201).json(novo);
});
```

4. Não esqueça de chamar `saveDatabase()` após modificações!

## Migrando para MockServer Global

Se você preferir usar o MockServer global (Java), siga estes passos:

1. Instale Java JDK 11+ e MockServer:
```bash
npm install -g mockserver
```

2. Crie um arquivo de configuração `mockserver-config.json`:
```json
{
  "serverPort": 1080,
  "logLevel": "INFO"
}
```

3. Inicie o MockServer:
```bash
mockserver -serverPort 1080
```

4. Configure expectations via API REST ou arquivo JSON

5. Atualize `.env`:
```env
VITE_MOCK_API_URL=http://localhost:1080
VITE_USE_MOCK=true
```

## Recomendação

Para este projeto, recomendamos continuar usando o **Mock Server Express** atual porque:
- ✅ Já está configurado e funcionando
- ✅ Mais simples de manter
- ✅ Não requer dependências externas
- ✅ Banco de dados JSON fácil de editar
- ✅ Suficiente para desenvolvimento e testes

Use o MockServer global apenas se precisar de recursos avançados como:
- Verificação de chamadas de API
- Expectations complexas
- Suporte a HTTPS
- Integração com ferramentas de teste avançadas
