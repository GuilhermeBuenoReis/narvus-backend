# Narvus API

Backend para um sistema de acompanhamento de hábitos, responsável por autenticação, usuários, hábitos e registros de progresso.

A API é construída com TypeScript, Fastify, PostgreSQL e Drizzle ORM. O projeto prioriza separação de responsabilidades, validação explícita e testes próximos das regras de aplicação.

## Escopo atual

- autenticação com access token e refresh token
- criação, consulta e remoção de usuários
- criação, consulta, atualização e remoção de hábitos
- criação, consulta e remoção de registros de progresso
- validação de entrada com Zod
- persistência relacional em PostgreSQL
- documentação da API
- testes automatizados com Vitest
- PostgreSQL local por Docker Compose

## Estrutura

```text
src/
├── @types/
├── config/
├── db/
├── errors/
├── http/
├── lib/
├── middleware/
├── routes/
├── services/
└── test/
```

As rotas traduzem HTTP para a aplicação, os serviços concentram casos de uso e o acesso a dados permanece separado da camada de transporte.

## Stack

| Área | Tecnologia |
| --- | --- |
| Linguagem | TypeScript |
| API | Fastify |
| Banco de dados | PostgreSQL |
| ORM | Drizzle ORM |
| Validação | Zod |
| Autenticação | JWT |
| Testes | Vitest |
| Documentação | Swagger / Scalar |
| Qualidade | Biome |
| Infraestrutura local | Docker Compose |

## Configuração

A aplicação valida as variáveis de ambiente na inicialização.

```env
NODE_ENV=development
DATABASE_URL=postgresql://docker:docker@localhost:5432/controll-habits
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
CLIENT_ORIGIN=http://localhost:3000
```

Não versione credenciais reais.

## Banco local

O `docker-compose.yml` inicia a instância PostgreSQL usada no desenvolvimento:

```bash
docker compose up -d
```

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

## Scripts disponíveis

```bash
pnpm dev
pnpm build
pnpm start
pnpm seed
pnpm test
pnpm test:watch
pnpm test:ci
pnpm db:migrate:test
```

## Decisões de engenharia

**Validação na borda.** Dados externos são validados antes de chegar aos serviços, reduzindo estados inválidos dentro da aplicação.

**Erros explícitos.** Erros da aplicação têm representação própria para que a camada HTTP consiga traduzi-los de forma consistente.

**Regras de aplicação fora das rotas.** A camada HTTP coordena entrada e saída; comportamento de negócio permanece nos serviços.

**Persistência relacional como parte do modelo.** PostgreSQL e Drizzle são usados de forma explícita em vez de esconder o banco atrás de abstrações que não agregariam valor ao estágio atual do produto.

**Testes próximos do comportamento.** A organização favorece testes dos serviços e fluxos relevantes em vez de tratar cobertura como objetivo isolado.

## Roadmap

O planejamento técnico e as próximas evoluções estão documentados em [`roadmap.md`](./roadmap.md).

## Licenciamento

O `package.json` declara licença ISC. Não há um arquivo de licença separado publicado atualmente no repositório.
