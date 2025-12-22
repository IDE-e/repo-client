# 1) deps
FROM node:20-alpine AS deps
WORKDIR /app

# pnpm 활성화
RUN corepack enable

# 의존성 설치에 필요한 파일만 먼저 복사 (캐시 최적화)
COPY package.json pnpm-lock.yaml ./

# (선택) workspace면 pnpm-workspace.yaml도 필요
# COPY pnpm-workspace.yaml ./

RUN pnpm i --frozen-lockfile

# 2) build
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# 3) run
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable

# Next.js 실행에 필요한 것만 복사
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000
CMD ["pnpm","start"]
