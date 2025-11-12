# Guia de Deploy no Vercel

Este projeto possui um workflow automatizado do GitHub Actions para fazer deploy no Vercel.

## Configuração Inicial

### 1. Criar Projeto no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Crie um novo projeto ou importe este repositório
3. Anote os seguintes valores:
   - **Organization ID** (vercel-org-id)
   - **Project ID** (vercel-project-id)

### 2. Obter Token do Vercel

1. Acesse [Vercel Settings > Tokens](https://vercel.com/account/tokens)
2. Crie um novo token com escopo completo
3. Copie o token gerado

### 3. Configurar Secrets no GitHub

1. Acesse o repositório no GitHub
2. Vá em **Settings > Secrets and variables > Actions**
3. Adicione os seguintes secrets:

   - `VERCEL_TOKEN`: Token do Vercel obtido no passo anterior
   - `VERCEL_ORG_ID`: ID da organização no Vercel
   - `VERCEL_PROJECT_ID`: ID do projeto no Vercel

### 4. Como Encontrar os IDs

**Organization ID:**
- Acesse [Vercel Dashboard](https://vercel.com/dashboard)
- Clique no nome da organização
- O ID aparece na URL ou nas configurações da organização

**Project ID:**
- Acesse o projeto no Vercel
- Vá em **Settings > General**
- O Project ID aparece na seção "Project ID"

## Como Funciona

O workflow está configurado em `.github/workflows/deploy-vercel.yml` e executa:

1. **Checkout do código** - Baixa o código do repositório
2. **Setup Node.js** - Configura o ambiente Node.js 20
3. **Instala dependências** - Executa `npm ci`
4. **Executa linter** - Valida o código (não bloqueia o deploy)
5. **Executa testes** - Roda os testes (não bloqueia o deploy)
6. **Build do projeto** - Executa `npm run build`
7. **Deploy no Vercel** - Faz o deploy usando a action oficial do Vercel

## Triggers

O workflow é executado automaticamente quando:

- Há um push para a branch `main` ou `master`
- Há um pull request para a branch `main` ou `master`

## Deploy Manual

Se precisar fazer deploy manual, você pode:

1. Usar a CLI do Vercel:
```bash
npm i -g vercel
vercel login
vercel --prod
```

2. Ou fazer push para a branch `main`:
```bash
git push origin main
```

## Variáveis de Ambiente no Vercel

Configure as variáveis de ambiente no Vercel:

1. Acesse o projeto no Vercel
2. Vá em **Settings > Environment Variables**
3. Adicione as variáveis necessárias (baseado no `env.example`)

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
- Verifique os logs do workflow no GitHub Actions
- Teste o build localmente com `npm run build`
- Verifique se todas as dependências estão no `package.json`

