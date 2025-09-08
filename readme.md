# Narvus API — Sistema de Rastreamento de Hábitos

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

API backend para gerenciamento e rastreamento de hábitos, construída com **Node.js, TypeScript, Fastify e Drizzle ORM**. O projeto foi desenhado com foco em escalabilidade, testabilidade e facilidade de manutenção, seguindo uma arquitetura de separação de responsabilidades.

---

## ✨ Funcionalidades Atuais

-   **🔐 Autenticação Segura**: Sistema de autenticação via `POST /auth/login` com JWT.
-   **👤 Gerenciamento de Usuários**: Registro (`POST /users`) e busca de usuários.
-   **✔️ CRUD de Hábitos**: Funcionalidades completas para criar, ler, atualizar e deletar hábitos por usuário.
-   **🗓️ Criação de Entradas**: Permite registrar o progresso diário de um hábito.
-   **🧪 Testes Co-localizados**: Suíte de testes unitários com Vitest, localizados junto aos serviços para maior clareza.
-   **📚 Documentação Automatizada**: Geração de `swagger.json` e UI para documentação da API.

---

## 🚀 Tecnologias Principais

-   **Framework**: [Fastify](https://www.fastify.io/)
-   **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
-   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
-   **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/)
-   **Validação**: [Zod](https://zod.dev/)
-   **Testes**: [Vitest](https://vitest.dev/)
-   **Documentação**: [Swagger](https://swagger.io/)

---

## 📂 Estrutura do Projeto

A estrutura de pastas foi organizada para separar claramente as responsabilidades da aplicação.

```
src/
├─ @types/         # Definições de tipos globais
├─ db/             # Configuração do Drizzle, schema e migrações
├─ errors/         # Classes de erro customizadas (ex: UserNotFoundError)
├─ http/           # Configuração do servidor Fastify e variáveis de ambiente
│  ├─ env.ts
│  └─ server.ts
├─ middleware/     # Middlewares da aplicação (ex: autenticação)
├─ routes/         # Arquivos que definem cada endpoint da API
└─ services/       # Lógica de negócio e casos de uso (com testes co-localizados)
```

---

## 🏁 Começando

Siga os passos abaixo para configurar e rodar o projeto localmente.

### Pré-requisitos

-   [Node.js](https://nodejs.org/) (v18 ou superior)
-   [pnpm](https://pnpm.io/)
-   [Git](https://git-scm.com/)
-   Uma instância do [PostgreSQL](https://www.postgresql.org/download/) rodando (Docker é recomendado).

### Instalação

1.  **Clone o repositório:**
    ```sh
    git clone <[url-do-repositorio](https://github.com/GuilhermeBuenoReis/narvus-backend.git)>
    cd <narvus-backend>
    ```

2.  **Instale as dependências:**
    ```sh
    pnpm install
    ```

3.  **Configure as variáveis de ambiente:**
    Copie o arquivo de exemplo e preencha com suas credenciais.
    ```sh
    cp .env.example .env
    ```
    Ajuste `DATABASE_URL` e `JWT_SECRET` no arquivo `.env`. Faça o mesmo para `.env.test`.

4.  **Rode as migrações do banco de dados:**
    ```sh
    pnpm db:migrate:test
    ```

5.  **Inicie o servidor em modo de desenvolvimento:**
    O servidor iniciará com hot-reload.
    ```sh
    pnpm dev
    ```

O servidor estará disponível em `http://localhost:3333`.
A documentação da API pode ser acessada em `http://localhost:3333/docs`.

---

## 📜 Scripts Disponíveis

-   `pnpm dev`: Inicia o servidor em modo de desenvolvimento com `tsx`.
-   `pnpm build`: Compila o código TypeScript para produção com `tsup`.
-   `pnpm start`: Inicia o servidor em modo de produção (requer build prévio).
-   `pnpm seed`: Popula o banco de dados com dados iniciais (via `tsx`).
-   `pnpm test`: Roda a suíte de testes do Vitest com o ambiente `.env.test`.
-   `pnpm test:watch`: Roda os testes em modo de observação.
-   `pnpm db:migrate:test`: Gera e aplica migrações do Drizzle no banco de teste.

---

## 🔑 Endpoints Principais da API

Abaixo está um resumo dos endpoints. Para detalhes completos sobre schemas e respostas, acesse a `/docs`.

| Método | Endpoint                               | Descrição                                                   |
| :----- | :------------------------------------- | :---------------------------------------------------------- |
| `POST` | `/auth/login`                          | Autentica um usuário e retorna um JWT.                      |
| `POST` | `/users`                               | Cria um novo usuário.                                       |
| `GET`  | `/users/email/:email`                  | Obtém um usuário pelo e-mail.                               |
| `POST` | `/habits`                              | Cria um novo hábito para o usuário autenticado.             |
| `GET`  | `/habits`                              | Lista todos os hábitos do usuário autenticado.              |
| `GET`  | `/habits/:habitId`                     | Obtém um hábito específico pelo seu ID.                     |
| `PUT`  | `/habits/:habitId`                     | Atualiza um hábito existente.                               |
| `DELETE`| `/habits/:habitId`                    | Deleta um hábito.                                           |
| `POST` | `/habits/:habitId/entries`             | Cria uma nova entrada (registro) para um hábito.            |

---

## 🗺️ Roadmap e Melhorias Futuras

-   [ ] **CRUD completo para Entradas**: Implementar update, delete e queries avançadas.
-   [ ] **Estatísticas SQL-first**: Desenvolver queries para calcular streaks, porcentagens e outras métricas.
-   [ ] **API de Calendário (Heatmap)**: Utilizar `generate_series` do PostgreSQL para visualizações.
-   [ ] **Dashboard de Progresso**: Endpoints para consolidar dados de progresso do usuário.
-   [ ] **Observabilidade**: Adicionar logs estruturados e métricas (Prometheus).

---

## 💡 Boas Práticas e Decisões de Design

-   **SQL-first para Stats**: A lógica de cálculo de estatísticas (como streaks) deve residir no banco de dados (SQL/CTEs) para máxima performance.
-   **Testes Co-localizados**: Os testes (`.spec.ts`) estão na mesma pasta que os serviços, facilitando a navegação e garantindo que a lógica de negócio seja sempre testada.
-   **Erros Customizados**: O uso da pasta `src/errors` permite um tratamento de erro padronizado e mais claro em toda a aplicação.
-   **Validação com Zod**: As entradas das rotas são validadas com Zod, garantindo a integridade dos dados que chegam à aplicação.

---

## 🧪 Testes

O projeto utiliza **Vitest** para testes unitários.

-   **Para rodar todos os testes uma vez:**
    ```sh
    pnpm test
    ```
-   **Para rodar os testes em modo de observação:**
    ```sh
    pnpm test:watch
    ```

---

## 🤝 Contribuição

Contribuições são bem-vindas!

1.  Abra uma **Issue** descrevendo a melhoria ou o bug.
2.  Faça um **Fork** do repositório.
3.  Crie uma nova **branch** (`feat/sua-feature` ou `fix/seu-bug`).
4.  Abra um **Pull Request** apontando para a branch `main` com uma descrição clara das mudanças. Adicione testes quando aplicável.

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.
