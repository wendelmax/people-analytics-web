# Quick Start - Mock Server

## Início Rápido

### 1. Iniciar Mock Server Express (Recomendado)

```bash
# Terminal 1: Iniciar mock server
npm run mock:server

# Terminal 2: Iniciar frontend
npm run dev
```

O mock server estará disponível em: `http://localhost:3001`

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
VITE_USE_MOCK=true
VITE_MOCK_API_URL=http://localhost:3001
```

### 3. Verificar Funcionamento

1. Acesse `http://localhost:5173` (ou porta do Vite)
2. Faça login com qualquer email/senha
3. Navegue pela aplicação - todos os dados são mockados!

## Usando MockServer Global (Opcional)

Se preferir usar o MockServer global:

```bash
# 1. Instalar MockServer globalmente
npm install -g mockserver

# 2. Iniciar MockServer
mockserver -serverPort 1080

# 3. Atualizar .env
VITE_MOCK_API_URL=http://localhost:1080
```

Veja `MOCKSERVER_SETUP.md` para detalhes completos.

## Endpoints Principais

- `GET /employee` - Listar funcionários
- `GET /departments` - Listar departamentos
- `GET /projects` - Listar projetos
- `POST /auth/login` - Login
- `GET /health` - Status do servidor

Veja `mock-server/README.md` para lista completa.

## Banco de Dados

Dados são salvos em `mock-server/mock-db.json` e persistem entre execuções.

**Resetar dados:**
```bash
rm mock-server/mock-db.json
npm run mock:server
```

## Troubleshooting

**Problema:** Mock server não inicia
- Verifique se a porta 3001 está livre
- Execute `npm install` para garantir dependências

**Problema:** Frontend não conecta ao mock
- Verifique se `VITE_USE_MOCK=true` no `.env`
- Verifique se mock server está rodando na porta 3001

**Problema:** Dados não persistem
- Verifique permissões de escrita em `mock-server/`
- Verifique se `mock-db.json` existe

