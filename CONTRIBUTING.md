# Guia de Contribuição

Obrigado por considerar contribuir com o People Analytics Web!

## Como Contribuir

### 1. Configuração do Ambiente

1. Faça um fork do repositório
2. Clone seu fork: `git clone <seu-fork-url>`
3. Instale as dependências: `npm install`
4. Configure o arquivo `.env` baseado no `.env.example`
5. Certifique-se de que o backend está rodando

### 2. Padrões de Código

- Use TypeScript para todo o código
- Siga os padrões de ESLint e Prettier configurados
- Escreva componentes funcionais com hooks
- Use nomes descritivos para variáveis e funções
- Mantenha componentes pequenos e focados

### 3. Estrutura de Pastas

```
src/
├── api/              # Cliente API
├── components/       # Componentes React
│   ├── common/      # Componentes reutilizáveis
│   └── [module]/    # Componentes específicos do módulo
├── contexts/        # Contextos React
├── hooks/           # Custom hooks
├── pages/           # Páginas/Rotas
├── services/        # Serviços de API
├── types/           # Tipos TypeScript
└── utils/           # Utilitários
```

### 4. Criando um Novo Módulo

1. Crie o serviço em `src/services/[module]Service.ts`
2. Crie o hook em `src/hooks/use[Module].ts`
3. Crie os componentes em `src/components/[module]/`
4. Crie a página em `src/pages/[Module].tsx`
5. Adicione a rota em `src/App.tsx`
6. Adicione ao Sidebar em `src/components/layout/Sidebar.tsx`

### 5. Testes

- Escreva testes para novos componentes e serviços
- Execute `npm test` antes de fazer commit
- Mantenha a cobertura de testes acima de 70%

### 6. Commits

Use mensagens de commit descritivas:
- `feat: adiciona novo módulo de projetos`
- `fix: corrige bug no formulário de funcionários`
- `refactor: melhora estrutura do componente X`
- `docs: atualiza documentação do módulo Y`

### 7. Pull Requests

1. Crie uma branch descritiva: `git checkout -b feature/nova-funcionalidade`
2. Faça suas alterações
3. Execute os testes: `npm test`
4. Execute o linter: `npm run lint`
5. Faça commit das alterações
6. Abra um Pull Request com descrição clara

## Dúvidas?

Entre em contato com a equipe de desenvolvimento.

