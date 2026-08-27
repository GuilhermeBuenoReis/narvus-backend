# Narvus API

Backend para um sistema de acompanhamento de hábitos, responsável por autenticação, usuários, hábitos, registros de progresso e evolução futura de métricas e estatísticas.

A API é construída com TypeScript, Fastify, PostgreSQL e Drizzle ORM, com foco em separação de responsabilidades, testabilidade e uma base simples de operar.

## Escopo atual

- autenticação com access token e refresh token
- cadastro e consulta de usuários
- criação, leitura, atualização e remoção de hábitos
- registro diário de progresso
- validação de entrada com Zod
- documentação OpenAPI / Swagger
- testes automatizados com Vitest
- ambiente local e de testes com Docker

## Arquitetura

```text
src/
├── @types/
├── db/
├── errors/
├── http/
├── middleware/
├── routes/
└── services/
```

A aplicação mantém as responsabilidades de HTTP, persistência, regras de negócio e erros separadas. Os serviços concentram os casos de uso, enquanto as rotas fazem a tradução entre HTTP e aplicação.

Os testes ficam próximos dos serviços correspondentes para facilitar navegação e manutenção.

## Stack

| Área | Tecnologia |
| --- | --- |
| Linguagem | TypeScript |
| API | Fastify |
| Banco de dados | PostgreSQL |
| ORM | Drizzle ORM |
| Validação | Zod |
| Testes | Vitest |
| Documentação | Swagger / OpenAPI |
| Qualidade | Biome |
| Infraestrutura local | Docker Compose |

## Execução com Docker

```bash
git clone https://github.com/GuilhermeBuenoReis/narvus-backend.git
cd narvus-backend
cp .env.example .env
docker compose up --build
```

A API fica disponível em:

```text
http://localhost:3333
```

A documentação pode ser acessada em:

```text
http://localhost:3333/docs
```

## Desenvolvimento local

```bash
git clone https://github.com/GuilhermeBuenoReis/narvus-backend.git
cd narvus-backend
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm dev
```

Variáveis principais:

```env
DATABASE_URL=postgres://user:password@localhost:5432/narvus
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
```

Use configurações separadas para testes e não versione credenciais reais.

## Endpoints principais

| Método | Endpoint | Responsabilidade |
| --- | --- | --- |
| `POST` | `/auth/login` | Autentica o usuário |
| `POST` | `/auth/refresh` | Renova o access token |
| `POST` | `/auth/logout` | Revoga a sessão |
| `POST` | `/users` | Cria um usuário |
| `GET` | `/users/email/:email` | Consulta usuário por e-mail |
| `POST` | `/habits` | Cria um hábito |
| `GET` | `/habits` | Lista hábitos |
| `GET` | `/habits/:habitId` | Consulta um hábito |
| `PUT` | `/habits/:habitId` | Atualiza um hábito |
| `DELETE` | `/habits/:habitId` | Remove um hábito |
| `POST` | `/habits/:habitId/entries` | Registra progresso |

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm seed
pnpm test
pnpm test:watch
pnpm db:migrate
```

## Direções de evolução

- CRUD completo de registros de progresso
- consultas SQL para streaks e métricas
- API de calendário / heatmap
- endpoints consolidados de progresso
- logs estruturados, métricas e observabilidade

O roadmap detalhado permanece em [`roadmap.md`](./roadmap.md).

## Decisões de engenharia

**Estatísticas orientadas a SQL.** Cálculos de streaks, percentuais e séries temporais podem aproveitar consultas relacionais e CTEs em vez de mover processamento desnecessário para a aplicação.

**Validação na borda.** Dados externos são validados antes de chegar aos serviços, reduzindo estados inválidos dentro da aplicação.

**Erros explícitos.** Erros de domínio e aplicação são representados de forma consistente para que a camada HTTP consiga traduzi-los sem espalhar regras de tratamento.

**Testes próximos do comportamento.** A organização prioriza testar serviços e regras relevantes em vez de usar cobertura como métrica isolada.

## Licença

MIT.
