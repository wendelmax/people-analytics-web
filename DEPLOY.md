# Guia de Deploy no Vercel

Este projeto está configurado para fazer deploy automático no Vercel através da integração com GitHub.

## Configuração Inicial

### 1. Criar Projeto no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **Add New Project**
3. Importe o repositório do GitHub
4. O Vercel detectará automaticamente as configurações do projeto através do arquivo `vercel.json`

### 2. Configuração Automática

O projeto já possui um arquivo `vercel.json` configurado que define:
- **Build Command**: `npm run build`
- **Output Directory**: `dist` (diretório de saída do Vite)
- **Framework**: Vite
- **Rewrites**: Configurado para SPA (Single Page Application) com React Router
- **Headers**: Cache otimizado para assets estáticos

## Como Funciona

O Vercel faz deploy automaticamente quando você faz push para a branch `main` ou `master`:

1. **Detecta mudanças** - O Vercel monitora o repositório conectado
2. **Instala dependências** - Executa `npm install`
3. **Executa build** - Roda `npm run build` (definido no `vercel.json`)
4. **Deploy** - Faz o deploy do diretório `dist` gerado pelo Vite
5. **Configura rotas** - Aplica os rewrites para funcionar como SPA

## Triggers

O deploy é executado automaticamente quando:

- Há um push para a branch `main` ou `master`
- Há um merge de pull request para a branch principal

## Deploy Manual

Se precisar fazer deploy manual, você pode usar a CLI do Vercel:

```bash
npm i -g vercel
vercel login
vercel --prod
```

Ou simplesmente fazer push para a branch `main`:
```bash
git push origin main
```

## Variáveis de Ambiente no Vercel

### Frontend

Configure as variáveis de ambiente no projeto do frontend:

1. Acesse o projeto no Vercel
2. Vá em **Settings > Environment Variables**
3. Adicione as variáveis necessárias (baseado no `env.example`):
   - `VITE_API_URL` - URL da API de produção
   - `VITE_MOCK_API_URL` - URL do mock-server (se usar)
   - `VITE_USE_MOCK` - Se deve usar mock (`true` ou `false`)
   - `VITE_API_TIMEOUT` - Timeout das requisições (padrão: `30000`)

**Para usar mock-server em produção (ex: apresentações):**
- Veja o guia completo em [MOCK_SERVER_DEPLOY.md](./MOCK_SERVER_DEPLOY.md)

### Mock Server (se deploy separado)

Se você configurou o deploy do mock-server como projeto separado:

1. Acesse o projeto do mock-server no Vercel
2. Vá em **Settings > Environment Variables**
3. Configure as variáveis necessárias para o mock-server

## Troubleshooting

### Erro: "VERCEL_TOKEN not found"
- Verifique se o secret foi adicionado corretamente no GitHub
- Certifique-se de que o nome do secret está exatamente como `VERCEL_TOKEN`

### Erro: "Invalid VERCEL_ORG_ID"
- Verifique se o Organization ID está correto
- Certifique-se de que você tem permissão na organização

### Erro: "Project not found"
- Verifique se o Project ID está correto
- Certifique-se de que o projeto existe no Vercel

### Build falha
- Verifique os logs do deploy no dashboard do Vercel
- Teste o build localmente com `npm run build`
- Verifique se todas as dependências estão no `package.json`
- Certifique-se de que o arquivo `vercel.json` está na raiz do projeto

### Rotas não funcionam (404)
- Verifique se o `vercel.json` tem a configuração de rewrites para SPA
- Certifique-se de que todas as rotas do React Router estão configuradas corretamente

### Assets não carregam
- Verifique se os caminhos dos assets estão corretos
- Certifique-se de que o `outputDirectory` no `vercel.json` está como `dist`

