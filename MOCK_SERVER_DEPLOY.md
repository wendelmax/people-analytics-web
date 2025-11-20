# Guia Rápido: Deploy do Mock Server para Apresentação

Este guia explica como fazer deploy do mock-server no Vercel para usar durante apresentações.

## Passo 1: Deploy do Mock Server no Vercel

### Opção A: Via Dashboard do Vercel (Recomendado)

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **Add New Project**
3. Importe o mesmo repositório do GitHub
4. **IMPORTANTE**: Nas configurações do projeto:
   - **Root Directory**: Selecione `mock-server`
   - **Framework Preset**: Deixe como "Other" ou "Node.js"
   - **Build Command**: Deixe vazio (o Vercel detectará automaticamente)
   - **Output Directory**: Deixe vazio
   - **Install Command**: `npm install`
5. Clique em **Deploy**

### Opção B: Via CLI do Vercel

```bash
cd mock-server
vercel
```

Siga as instruções e quando perguntar sobre o diretório, confirme que está em `mock-server`.

## Passo 2: Obter a URL do Mock Server

Após o deploy, você receberá uma URL como:
- `https://people-analytics-mock-server.vercel.app`
- Ou uma URL customizada se você configurou domínio

**Anote esta URL!** Você precisará dela no próximo passo.

## Passo 3: Configurar o Frontend no Vercel

No projeto do **frontend** no Vercel:

1. Acesse **Settings > Environment Variables**
2. Adicione as seguintes variáveis:

   **Para Production:**
   - `VITE_USE_MOCK` = `true`
   - `VITE_MOCK_API_URL` = `https://sua-url-do-mock-server.vercel.app`
   - `VITE_API_URL` = (pode deixar vazio ou usar como fallback)
   - `VITE_API_TIMEOUT` = `30000`

   **Para Preview e Development:**
   - Configure as mesmas variáveis se quiser usar mock em previews também

3. Clique em **Save**

## Passo 4: Fazer Novo Deploy do Frontend

Após configurar as variáveis:

1. Vá para o projeto do frontend no Vercel
2. Clique em **Deployments**
3. Clique nos três pontos do último deploy
4. Selecione **Redeploy**
5. Ou simplesmente faça um novo commit e push para `main`

## Verificação

Após o deploy, verifique se está funcionando:

1. Acesse a URL do frontend
2. Abra o DevTools (F12) > Network
3. Faça uma requisição (ex: login)
4. Verifique se as requisições estão indo para a URL do mock-server

## Troubleshooting

### Mock server retorna 404
- Verifique se o `vercel.json` está na pasta `mock-server`
- Certifique-se de que o Root Directory está configurado como `mock-server` no Vercel

### Frontend não conecta ao mock
- Verifique se `VITE_USE_MOCK=true` está configurado
- Verifique se a URL do `VITE_MOCK_API_URL` está correta (sem barra no final)
- Faça um novo deploy após alterar as variáveis de ambiente

### CORS Error
- O mock-server já tem CORS configurado, mas se houver problemas, verifique se a URL está correta

## Após a Apresentação

Quando não precisar mais do mock em produção:

1. No projeto do frontend no Vercel
2. Vá em **Settings > Environment Variables**
3. Altere `VITE_USE_MOCK` para `false`
4. Configure `VITE_API_URL` com a URL da API real
5. Faça um novo deploy

