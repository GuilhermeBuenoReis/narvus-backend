# Backend Habit System — Checklist Completo (DEV RAIZ)

> Formato: `[x]` = já implementado no repo (conforme tua base atual)  
> `[ ]` = não implementado / pendente — **possível/útil** para o backend

---

## Índice rápido
1. Core: Auth, Users, Health, Config
2. Habits (CRUD + meta)
3. Habit Entries (CRUD + queries)
4. Stats & Analytics (streaks, longest, %)
5. Calendar / generate_series / days
6. Scheduling & Frequencies
7. Habit Stacks / Dependencies
8. Progress / Dashboard
9. Exports / Imports / Uploads
10. Notifications / Emails / Push / Webhooks
11. Admin / Roles / Permissions
12. Observability / Logging / Metrics / Tracing
13. DB / Migrations / Seeds / Factories
14. Tests / QA / Contract Tests
15. Security / Rate Limit / CORS / Secrets
16. Infra / CI/CD / Backups
17. Utils / Middlewares / Validators
18. Docs / OpenAPI / Postman
19. Maintenance endpoints / Debug
20. Feature flags / AB testing
21. Performance / Caching / Indexing
22. Extra integrations (Calendar sync, Social, SSO)
23. Todos gerais & recomendações de prioridade

---

## 1) Core - Auth, Users, Health, Config

- [x] `services/authenticate-user.ts` — autentica por email/senha + retorna JWT
- [x] `services/refresh-token.ts` — renovar token / refresh
- [x] `services/invalidate-token.ts` — logout / blacklist token
- [x] `services/create-user.ts` — criar usuário (signup)
- [x] `services/find-user-by-id.ts`
- [x] `services/find-user-by-email.ts`
- [x] `services/find-user-by-email-and-password.ts` — valida senha
- [ ] `services/update-user.ts`
- [ ] `services/delete-user.ts`
- [ ] `services/list-users.ts` — admin listing
- [ ] `routes/auth/register.route.ts` — endpoint register
- [x] `routes/auth/login.route.ts` — login
- [ ] `routes/auth/logout.route.ts`
- [ ] `routes/auth/refresh-token.route.ts`
- [ ] `routes/users.update.route.ts` — PUT /users/:id
- [x] `routes/users.get.route.ts` — GET /users/:id
- [ ] `routes/users.delete.route.ts`
- [ ] `utils/password.hash.ts` — hashing (bcrypt/argon2)
- [ ] `utils/password.verify.ts`
- [ ] `middlewares/authenticate.ts` — protege rotas
- [ ] `middlewares/authorize.ts` — roles/permissions
- [ ] `routes/health/liveness.route.ts`
- [ ] `routes/health/readiness.route.ts`
- [ ] `config/env.ts` — carregamento e validação das variáveis de ambiente (zod/dotenv)
- [ ] `services/session.store.ts` — opcionalmente para token blacklisting
- [ ] `schemas/zod/user.schema.ts` — validação de payloads

---

## 2) Habits (CRUD + meta)

- [x] `services/create-habit.ts`
- [x] `services/find-habit-by-id.ts`
- [x] `services/get-all-habits-by-user.ts`
- [x] `services/update-habit.ts`
- [x] `services/delete-habit.ts`
- [ ] `services/bulk-create-habits.ts` — para import
- [ ] `services/toggle-habit-active.ts` — ativar/desativar
- [ ] `services/archive-habit.ts` — arquivar (soft delete)
- [ ] `routes/habits.create.route.ts` — POST /users/:userId/habits
- [x] `routes/habits.list.route.ts` — GET /users/:userId/habits
- [x] `routes/habits.get.route.ts` — GET /habits/:habitId
- [x] `routes/habits.update.route.ts` — PATCH/PUT /habits/:habitId
- [x] `routes/habits.delete.route.ts` — DELETE /habits/:habitId
- [ ] `dto/habit.create.dto.ts`
- [ ] `dto/habit.update.dto.ts`
- [ ] `validators/habit.validator.ts` — zod schema para habit
- [ ] `policies/habit.policy.ts` — ownership checks
- [ ] `controllers/habit.controller.ts` — thin layer para rotas
- [ ] `handlers/habit.events.ts` — event hooks (ex.: habit.created -> schedule jobs)

**Campos importantes em `habits` (exemplo recomendado):**
- id, userId, title, description, createdAt, updatedAt, active, timezone
- frequency: { type: 'daily'|'weekly'|'custom', days?: [0..6], interval?: number }
- startDate, endDate, target (optional), metadata (json)

---

## 3) Habit Entries (CRUD + queries)

- [x] `services/create-habit-entrie.ts` — cria entrada
- [ ] `services/delete-habit-entrie.ts`
- [ ] `services/update-habit-entrie.ts`
- [ ] `services/get-entries-by-habit-id.ts`
- [ ] `services/get-entries-by-user-id.ts`
- [ ] `services/get-entries-by-date-range.ts`
- [ ] `services/deduplicate-entries.ts` — deduplicação se necessário
- [ ] `routes/entries.create.route.ts` — POST /users/:userId/habits/:habitId/entries
- [x] `routes/entries.list.route.ts` — GET /users/:userId/habits/:habitId/entries
- [ ] `routes/entries.delete.route.ts`
- [ ] `routes/entries.update.route.ts`
- [ ] `dto/entry.create.dto.ts`
- [ ] `dto/entry.update.dto.ts`
- [ ] `validators/entry.validator.ts`
- [ ] `factories/habit-entry.factory.ts` — seed/test
- [ ] `services/normalize-entry-timestamps.ts` — timezone handling
- [ ] `indexes/db/indexes-on-entries.sql` — indexes on (habit_id, user_id, date)

**Campos importantes em `habit_entries`:**
- id, habitId, userId, date (date or timestamp), createdAt, note, meta

---

## 4) Stats & Analytics (streaks, longest, percentage)

> **DB-first approach**: tudo via SQL/CTE para desempenho. Serviço JS apenas orquestra.

- [ ] `services/get-entries-streak.ts`  
  - retorna: `{currentStreak, longestStreak, streakStart, streakEnd}`
  - implement via CTE: ordenar dates, gap detection -> group consecutive
- [ ] `services/get-entries-longest-streak.ts` — alias especializado
- [ ] `services/get-entries-percentage.ts` — completedDays / totalPossibleDays
- [ ] `services/get-entries-stats.ts` — counts per period (daily/weekly/monthly)
- [ ] `services/get-habit-stats.ts` — consolida para um hábito
- [ ] `services/get-user-stats.ts` — consolida across habits
- [ ] `routes/habits.stats.route.ts` — GET /users/:userId/habits/:habitId/stats
- [ ] `routes/entries.stats.route.ts` — GET /users/:userId/habits/entries/stats
- [ ] `tests/get-entries-streak.spec.ts`
- [ ] `tests/get-entries-percentage.spec.ts`
- [ ] `utils/sql/streaks.sql` — versão SQL pura reaproveitável
- [ ] `utils/sql/calendar_generate_series.sql` — helper

**Queries cruciais (resumo):**
- CTE to deduplicate and normalize dates
- CTE to create date groups via `row_number() - row_number_by_date_partition` trick
- `generate_series` to create total days for percentage

---

## 5) Calendar / generate_series / days

- [ ] `services/get-habit-calendar.ts` — returns per-day status (true/false/null)
- [ ] `routes/habit.calendar.route.ts` — GET /users/:userId/habits/:habitId/calendar?from=...&to=...
- [ ] `utils/sql/calendar_with_generate_series.sql`
- [ ] `tests/habit.calendar.spec.ts`
- [ ] `services/calendar.fill-missing-days.ts` — ensures empty days shown as false

---

## 6) Scheduling & Frequencies

- [ ] `services/get-habits-for-date.ts` — quais hábitos "caem" no dia (freq calc)
- [ ] `services/get-habits-for-week.ts`
- [ ] `services/get-habits-next-x-days.ts`
- [ ] `utils/frequency.parser.ts` — parser para diferentes formatos de frequência
- [ ] `middlewares/due-habits.middleware.ts`
- [ ] `routes/habits.today.route.ts` — GET /users/:userId/habits/today
- [ ] `tests/habits.for.today.spec.ts`
- [ ] `cron/schedule-daily-jobs.ts` — para enviar notificações/reminders

**Frequências a suportar:**
- daily
- every N days
- weekly on specific weekdays
- custom cron-like rule (opcional)
- repeating with exceptions (dates skip/include)

---

## 7) Habit Stacks / Dependencies (recursivo)

- [ ] `services/get-habit-stack.ts` — retorna árvore de dependências
- [ ] `services/create-habit-dependency.ts` — adicionar dependency A -> B
- [ ] `services/delete-habit-dependency.ts`
- [ ] `utils/sql/cte_recursive_stack.sql` — CTE recursivo para expandir graph
- [ ] `routes/habit-stacks.route.ts`
- [ ] `tests/habit-stacks.spec.ts`

---

## 8) Progress / Dashboard (user-wide)

- [ ] `services/get-user-progress.ts` — resumo: total habits, active habits, overall % done, global streak
- [ ] `services/get-user-dashboard.ts` — data shaped for frontend charts
- [ ] `routes/user.progress.route.ts` — GET /users/:userId/progress
- [ ] `routes/user.dashboard.route.ts` — GET /users/:userId/dashboard
- [ ] `tests/get-user-progress.spec.ts`

**Metrics to expose:**
- activeHabitsCount
- completedToday
- currentStreakAcrossHabits
- longestStreakAcrossHabits
- monthlyCompletionRate
- chart series for last N days

---

## 9) Exports / Imports / Uploads

- [ ] `services/export-user-habits-to-csv.ts`
- [ ] `services/export-habit-calendar-xlsx.ts`
- [ ] `routes/export.habits.route.ts` — GET with content-disposition
- [ ] `services/import-habits-from-csv.ts`
- [ ] `routes/upload.habits.route.ts` — multipart upload
- [ ] `utils/csv/parser.ts` — robust parsing with validation
- [ ] `tests/export-import.spec.ts`
- [ ] `factories/export.factories.ts`

---

## 10) Notifications / Emails / Push / Webhooks

- [ ] `services/notification.enqueue.ts` — enqueue notifications in DB
- [ ] `services/notifications.worker.ts` — worker to send notifications
- [ ] `integrations/email/send-email.ts` — sendgrid / nodemailer
- [ ] `integrations/push/send-push.ts` — FCM / APNs
- [ ] `integrations/sms/send-sms.ts` — Twilio
- [ ] `webhooks/habit-created.handler.ts` — emit webhook
- [ ] `routes/webhooks.verify.route.ts`
- [ ] `tests/notifications.spec.ts`
- [ ] `cron/daily-reminder.job.ts` — job to schedule reminders
- [ ] `models/notifications.table.sql` — storage for scheduled notifications

---

## 11) Admin / Roles / Permissions

- [ ] `models/roles.enum.ts` — e.g., admin, super-admin, user
- [ ] `services/user.assign-role.ts`
- [ ] `middlewares/require-role.ts`
- [ ] `routes/admin/users.list.route.ts`
- [ ] `routes/admin/habits.for.user.route.ts`
- [ ] `routes/admin/stats.route.ts`
- [ ] `tests/admin.auth.spec.ts`
- [ ] `policies/data-access.policy.ts` — row-level ownership checks

---

## 12) Observability / Logging / Metrics / Tracing

- [ ] `infra/logging/logger.ts` — pino/winston config + structured logs
- [ ] `infra/metrics/prometheus.client.ts` — expose /metrics
- [ ] `routes/metrics.route.ts` — /metrics for Prometheus
- [ ] `tracing/opentelemetry.ts`
- [ ] `error-handling/global-error-handler.ts`
- [ ] `sentry/integrations.ts`
- [ ] `tests/logging.spec.ts`

---

## 13) DB / Migrations / Seeds / Factories

- [ ] `db/schema.sql` — full schema talk-through
- [ ] `migrations/[timestamp]_create_tables.sql`
- [ ] `migrations/[timestamp]_add_indexes.sql`
- [ ] `seeds/users.seed.ts`
- [ ] `seeds/habits.seed.ts`
- [x] `factories/user.ts`
- [x] `factories/habit.ts`
- [x] `factories/habit-entrie.ts`
- [ ] `scripts/db/seed-all.ts`
- [ ] `scripts/db/reset-local.sh`
- [ ] `db/backup/automated-backup.sh`
- [ ] `docs/db-indexing.md` — recommendations on indexes

**Indexes sugeridos:**
- `habit_entries(habit_id, date)`
- `habit_entries(user_id, date)`
- `habits(user_id, active)`
- GIN indexes for jsonb metadata if used

---

## 14) Tests / QA / Contract Tests

- [x] `tests/authenticate-user.spec.ts`
- [x] `tests/create-user.spec.ts`
- [x] `tests/find-user-by-email.spec.ts`
- [x] `tests/find-user-by-id.spec.ts`
- [x] `tests/find-user-by-email-and-password.spec.ts`
- [x] `tests/create-habit.spec.ts`
- [x] `tests/delete-habit.spec.ts`
- [x] `tests/find-habit-by-id.spec.ts`
- [x] `tests/get-all-habits-by-user.spec.ts`
- [x] `tests/update-habit.spec.ts`
- [x] `tests/create-habit-entrie.spec.ts`
- [ ] `tests/delete-habit-entrie.spec.ts`
- [ ] `tests/update-habit-entrie.spec.ts`
- [ ] `tests/get-entries-by-habit-id.spec.ts`
- [ ] `tests/get-entries-streak.spec.ts`
- [ ] `tests/get-entries-percentage.spec.ts`
- [ ] `tests/habit.calendar.spec.ts`
- [ ] `contract-tests/openapi-contract.spec.ts`
- [ ] `e2e/api-e2e.spec.ts` — end-to-end suite
- [ ] `tests/performance/large-data.spec.ts`

---

## 15) Security / Rate Limit / CORS / Secrets

- [ ] `middlewares/rate-limit.ts` — per IP / per user
- [ ] `middlewares/cors.ts` — CORS config
- [ ] `security/xss-sanitizer.ts`
- [ ] `security/input-sanitizer.ts`
- [ ] `security/helmet-config.ts`
- [ ] `secrets-management/usage.md` — how to store secrets
- [ ] `secrets/aws-secretsmanager.ts` or `vault` integration
- [ ] `tests/security/authz.spec.ts`

---

## 16) Infra / CI-CD / Backups

- [ ] `ci/pipeline.yml` — build/test/deploy
- [ ] `ci/pre-push.sh` — lint/test hook
- [ ] `infra/docker/Dockerfile` — production image
- [ ] `infra/docker/docker-compose.yml` — local dev
- [ ] `infra/k8s/deployment.yaml` — optional
- [ ] `infra/terraform/README.md` — infra as code notes
- [ ] `scripts/db/backup.sh` — DB backups
- [ ] `monitoring/alerts.md` — alerting policy
- [ ] `deploy/staging-deploy.sh`
- [ ] `deploy/prod-deploy.sh`

---

## 17) Utils / Middlewares / Validators

- [ ] `utils/date-utils.ts` — timezone-safe helpers
- [ ] `utils/pagination.ts` — generic offset/limit or cursor
- [ ] `middlewares/validate-body.ts` — reuse zod
- [ ] `middlewares/request-logger.ts`
- [ ] `utils/uuid.ts`
- [ ] `utils/response-wrappers.ts` — consistent API envelope

---

## 18) Docs / OpenAPI / Postman

- [ ] `docs/openapi.yaml` — full API spec
- [ ] `routes/openapi.route.ts` — serve UI (Swagger)
- [ ] `docs/README.md` — how to run locally
- [ ] `docs/architecture.md` — ER, services, flows
- [ ] `postman/collection.json` — sample requests
- [ ] `docs/perf.md` — perf tips & bottlenecks

---

## 19) Maintenance endpoints / Debug

- [ ] `routes/debug/db-health.route.ts` — quick DB query
- [ ] `routes/debug/clear-cache.route.ts`
- [ ] `routes/debug/queue-stats.route.ts`
- [ ] `routes/debug/environment.route.ts` — only for admin
- [ ] `scripts/maintenance/prune-old-entries.ts`

---

## 20) Feature flags / AB testing

- [ ] `feature-flags/manager.ts` — simple toggle system
- [ ] `routes/feature.flags.route.ts`
- [ ] `tests/feature.flags.spec.ts`

---

## 21) Performance / Caching / Indexing

- [ ] `cache/redis.client.ts` — caching layer
- [ ] `services/cache/habits-cache.ts`
- [ ] `services/cache/entries-cache.ts`
- [ ] `cache/invalidation-strategies.md`
- [ ] `db/query-optimizations.md`
- [ ] `tests/cache.behavior.spec.ts`

---

## 22) Extra integrations (Calendar sync, SSO, Social)

- [ ] `integrations/google.calendar.sync.ts`
- [ ] `integrations/apple.calendar.sync.ts`
- [ ] `integrations/oauth/google.ts` — SSO
- [ ] `integrations/oauth/apple.ts`
- [ ] `routes/oauth.callback.route.ts`
- [ ] `tests/oauth.spec.ts`

---

## 23) Todos gerais & recomendações de prioridade (ordem sugerida)

> Prioridade prática para entregar valor rápido sem frescura, em ordem:

1. **Concluir Entries CRUD**  
   - delete/update/get entries by habit/user/date.  
   - Porque sem isso as estatísticas ficam capadas.  
2. **Implementar Stats básicos via SQL/CTE**  
   - `get-entries-streak`, `get-entries-percentage`, `get-habit-stats`.  
   - Usa CTEs e optimize com índices.  
3. **Calendar API (generate_series)**  
   - Entrega UX pro front (heatmap, calendário).  
4. **Progress / Dashboard endpoints**  
   - Junta dados já calculados e entrega pro front.  
5. **Exports / simple notifications (email reminders)**  
   - Alto valor percebido.  
6. **Observability / metrics**  
   - Export `/metrics` + structured logs.  
7. **Admin / Roles / Security hardening**  
8. **Caching / infra / backups / CI** — conforme estabilidade e tráfego

---

## Notas finais (curtas, práticas)
- **SQL-first para stats**: faz CTEs robustas; JS só orquestra.  
- **Timezone-aware**: armazena `date` como `date` quando possível; pra timestamps usa UTC e converte no read.  
- **Deduplicação**: coloca unique index `(habit_id, date)` e tratativa no service.  
- **Tests**: prioridade nos flows críticos (auth, create habit, create entry, streak calc).  
- **Factories**: mantém factories completas para gerar casos extremos (streak longo, buracos, fuso horário).  
- **Docs**: sempre documentar o shape de retorno dos endpoints de stats — são os mais importantes pro front.

---

## Anexo: marcados como implementados na base atual (para referência)
- Auth & Users:
  - authenticate-user (service) `[x]`
  - create-user `[x]`
  - find-user-by-id `[x]`
  - find-user-by-email `[x]`
  - find-user-by-email-and-password `[x]`
  - routes: POST /auth/login `[x]`, GET /users/:id `[x]`
- Habits:
  - create-habit `[x]`
  - delete-habit `[x]`
  - find-habit-by-id `[x]`
  - get-all-habits-by-user `[x]`
  - update-habit `[x]`
  - routes: POST /users/:userId/habits, GET /users/:userId/habits, GET /users/:userId/habits/:habitId, DELETE /users/:userId/habits/:habitId, PUT /users/:userId/habits/:habitId `[x]`
- Entries:
  - create-habit-entrie `[x]`
  - route POST /users/:userId/habits/:habitId/entries `[x]`
- Tests:
  - multiple specs for auth, users, habits, create entry exist `[x]` (ver lista acima)

---
