FROM node:22 AS build

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install

COPY . .

RUN pnpm build

FROM node:22

WORKDIR /app

COPY --from=build /app ./
RUN pnpm install --prod

EXPOSE 3000

CMD ["pnpm", "start"]