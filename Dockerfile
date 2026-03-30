FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@8

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:18-alpine AS production

WORKDIR /app

RUN npm install -g pnpm@8

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

RUN mkdir -p logs uploads

EXPOSE 3000

CMD ["node", "dist/app.js"]

FROM node:18-alpine AS development

WORKDIR /app

RUN npm install -g pnpm@8

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN mkdir -p logs uploads

EXPOSE 3000

CMD ["pnpm", "run", "dev"]
