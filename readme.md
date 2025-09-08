# Narvus API — Habit Tracking System

API backend moderna para gerenciamento de hábitos, construída com **Fastify + TypeScript + Drizzle ORM + PostgreSQL**.  
Focada em performance, escalabilidade e boas práticas de arquitetura.

---

## 🚀 Tecnologias principais

- [Fastify](https://fastify.dev/) — framework web rápido e leve
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática
- [Drizzle ORM](https://orm.drizzle.team/) — queries SQL tipadas
- [PostgreSQL](https://www.postgresql.org/) — banco relacional
- [Zod](https://zod.dev/) — validação de schemas
- [Vitest](https://vitest.dev/) — testes unitários e e2e
- [Swagger](https://swagger.io/) — documentação interativa de API

---

## 📂 Estrutura do projeto

src/
├─ http/ # camada HTTP (rotas, middlewares, errors)
├─ services/ # regras de negócio (habits, entries, users, auth)
├─ routes/ # definição de rotas da API
├─ db/ # conexão, migrações e seeds
├─ test/ # testes unitários e e2e
└─ @types/ # tipagens globais

yaml
Copiar código

---

## ✅ Funcionalidades atuais

- **Autenticação e usuários**
  - Registro e login com JWT + cookies seguros
  - Busca de usuário por email ou ID
- **Hábitos**
  - CRUD completo (criar, listar, editar, deletar hábitos)
  - Listagem de hábitos por usuário
- **Entradas de hábito (habit entries)**
  - Criar entrada vinculada a um hábito
  - Listagem de entradas por hábito
- **Infra**
  - Swagger docs (`/docs`)
  - Geração automática de `swagger.json`
  - Suporte a múltiplos ambientes (`.env`, `.env.test`)

---

## 📦 Scripts principais

```bash
# rodar em dev com reload automático
pnpm dev

# build de produção
pnpm build

# rodar servidor em produção
pnpm start

# rodar testes
pnpm test
pnpm test:watch

# rodar migrações no ambiente de teste
pnpm db:migrate:test
🔮 Roadmap (próximos passos)
CRUD completo para entradas (update/delete/query avançada)

Estatísticas (streaks, % de conclusão, dashboard)

Calendário com generate_series (heatmap estilo GitHub)

Progress & dashboards por usuário

Exports (CSV/XLSX) + notificações (email/push)

Observabilidade (logs estruturados, métricas, tracing)

Controle de roles/admin

📖 Documentação
Swagger UI: disponível em /docs após iniciar o servidor.

Swagger JSON: exportado automaticamente em swagger.json.

🛠️ Como rodar localmente
bash
Copiar código
# 1. instalar dependências
pnpm install

# 2. configurar variáveis de ambiente
cp .env.example .env

# 3. rodar migrations
pnpm db:migrate:test

# 4. iniciar servidor
pnpm dev
Servidor disponível em: http://localhost:3333
Swagger docs em: http://localhost:3333/docs 

---