# Narvus API — Habit Tracking System

A backend API for managing and tracking habits, built with **Node.js, TypeScript, Fastify, and Drizzle ORM**. The project was designed with a focus on scalability, testability, and maintainability, following an architecture with a clear separation of concerns.

-----

## ✨ Core Features

  - **🔐 Secure Authentication**: JWT and refresh token authentication system via `POST /auth/login`.
  - **👤 User Management**: User registration (`POST /users`) and retrieval.
  - **✔️ Habit CRUD**: Full functionality to create, read, update, and delete habits for each user.
  - **🗓️ Entry Creation**: Allows users to log daily progress for their habits.
  - **🧪 Co-located Tests**: Unit test suite with Vitest, located alongside services for better clarity.
  - **📚 Automated Documentation**: Generates a `swagger.json` file and a UI for API documentation.

-----

## 🚀 Tech Stack

  - **Framework**: [Fastify](https://www.fastify.io/)
  - **Language**: [TypeScript](https://www.typescriptlang.org/)
  - **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
  - **Database**: [PostgreSQL](https://www.postgresql.org/)
  - **Validation**: [Zod](https://zod.dev/)
  - **Testing**: [Vitest](https://vitest.dev/)
  - **Documentation**: [Swagger](https://swagger.io/)

-----

## 📂 Project Structure

```
src/
├─ @types/        # Global type definitions
├─ db/            # Drizzle config, schema, and migrations
├─ errors/        # Custom error classes (e.g., UserNotFoundError)
├─ http/          # Fastify server setup and environment variables
│  ├─ env.ts
│  └─ server.ts
├─ middleware/    # Application middlewares (e.g., authentication)
├─ routes/        # Files defining each API endpoint
└─ services/      # Business logic and use cases (with co-located tests)
```

-----

## 🏁 Getting Started

Follow the steps below to set up and run the project.

### Prerequisites

  - [Node.js](https://nodejs.org/) (v18 or higher)
  - [pnpm](https://pnpm.io/)
  - [Git](https://git-scm.com/)
  - [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### 🐳 Running with Docker (Recommended)

This is the simplest way to get the application and database running.

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/GuilhermeBuenoReis/narvus-backend.git
    cd narvus-backend
    ```

2.  **Set up environment variables:**
    Copy the example file. The default values in `.env.example` are already configured for Docker Compose.

    ```sh
    cp .env.example .env
    ```

3.  **Build and start the containers:**

    ```sh
    docker-compose up --build
    ```

The server will be available at `http://localhost:3333`.
The API documentation can be accessed at `http://localhost:3333/docs`.

### 💻 Local Development Setup

Follow these steps if you prefer to run the application without Docker.

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/GuilhermeBuenoReis/narvus-backend.git
    cd narvus-backend
    ```

2.  **Install dependencies:**

    ```sh
    pnpm install
    ```

3.  **Set up environment variables:**
    Copy the example file and fill it with your credentials.

    ```sh
    cp .env.example .env
    ```

    Adjust the following variables in the `.env` file:

    ```env
    DATABASE_URL=postgres://user:password@localhost:5432/narvus
    JWT_SECRET=your_jwt_secret_here
    JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
    ```

    Do the same for the `.env.test` file for running tests.

4.  **Run database migrations:**
    Make sure you have a PostgreSQL instance running.

    ```sh
    pnpm db:migrate
    ```

5.  **Start the development server:**
    The server will start with hot-reload enabled.

    ```sh
    pnpm dev
    ```

-----

## 📜 Available Scripts

  - `pnpm dev`: Starts the server in development mode using `tsx`.
  - `pnpm build`: Compiles the TypeScript code for production with `tsup`.
  - `pnpm start`: Starts the server in production mode (requires a previous build).
  - `pnpm seed`: Seeds the database with initial data (via `tsx`).
  - `pnpm test`: Runs the Vitest test suite using the `.env.test` environment.
  - `pnpm test:watch`: Runs tests in watch mode.
  - `pnpm db:migrate`: Generates and applies Drizzle migrations.

-----

## 🔑 API Endpoints

| Method   | Endpoint                   | Description                                             |
| :------- | :------------------------- | :------------------------------------------------------ |
| `POST`   | `/auth/login`              | Authenticates a user and returns an accessToken and refreshToken. |
| `POST`   | `/auth/refresh`            | Renews an accessToken using a valid refreshToken.       |
| `POST`   | `/auth/logout`             | Revokes the refreshToken and clears cookies.            |
| `POST`   | `/users`                   | Creates a new user.                                     |
| `GET`    | `/users/email/:email`      | Gets a user by their email.                             |
| `POST`   | `/habits`                  | Creates a new habit for the authenticated user.         |
| `GET`    | `/habits`                  | Lists all habits for the authenticated user.            |
| `GET`    | `/habits/:habitId`         | Gets a specific habit by its ID.                        |
| `PUT`    | `/habits/:habitId`         | Updates an existing habit.                              |
| `DELETE` | `/habits/:habitId`         | Deletes a habit.                                        |
| `POST`   | `/habits/:habitId/entries` | Creates a new entry (log) for a habit.                  |

-----

## 🗺️ Roadmap & Future Improvements

  - [ ] **Full CRUD for Entries**: Implement update, delete, and advanced queries.
  - [ ] **SQL-first Statistics**: Develop queries to calculate streaks, percentages, and other metrics.
  - [ ] **Calendar API (Heatmap)**: Use PostgreSQL's `generate_series` for visualizations.
  - [ ] **Progress Dashboard**: Endpoints to consolidate user progress data.
  - [ ] **Observability**: Add structured logs and metrics (Prometheus).

-----

## 💡 Best Practices & Design Decisions

  - **SQL-first for Stats**: The logic for calculating statistics (like streaks) should reside in the database (SQL/CTEs) for maximum performance.
  - **Co-located Tests**: Test files (`.spec.ts`) are in the same folder as their corresponding services, making navigation easier and ensuring business logic is always tested.
  - **Custom Errors**: Using the `src/errors` folder allows for standardized and clearer error handling throughout the application.
  - **Zod Validation**: Route inputs are validated with Zod, ensuring data integrity before it reaches the application logic.

-----

## 🧪 Testing

  - **To run all tests once:**
    ```sh
    pnpm test
    ```
  - **To run tests in watch mode:**
    ```sh
    pnpm test:watch
    ```

-----

## 🤝 Contributing

1.  Open an **Issue** describing the improvement or bug.
2.  **Fork** the repository.
3.  Create a new **branch** (`feat/your-feature` or `fix/your-bug`).
4.  Open a **Pull Request** targeting the `main` branch with a clear description of the changes. Add tests when applicable.

-----

## 📄 License

This project is licensed under the MIT License.