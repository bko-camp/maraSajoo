FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

# 클라이언트 번들에 주입되므로 빌드 시점에 필요합니다.
ARG NEXT_PUBLIC_TOSS_WIDGET_CLIENT_KEY
ARG NEXT_PUBLIC_TOSS_CUSTOMER_KEY
ARG NEXT_PUBLIC_TOSS_PAYMENT_AMOUNT
ARG NEXT_PUBLIC_TOSS_ORDER_NAME
ARG NEXT_PUBLIC_TOSS_ORDER_ID_PREFIX
ARG NEXT_PUBLIC_TOSS_AGREEMENT_VARIANT_KEY
ENV NEXT_PUBLIC_TOSS_WIDGET_CLIENT_KEY=$NEXT_PUBLIC_TOSS_WIDGET_CLIENT_KEY
ENV NEXT_PUBLIC_TOSS_CUSTOMER_KEY=$NEXT_PUBLIC_TOSS_CUSTOMER_KEY
ENV NEXT_PUBLIC_TOSS_PAYMENT_AMOUNT=$NEXT_PUBLIC_TOSS_PAYMENT_AMOUNT
ENV NEXT_PUBLIC_TOSS_ORDER_NAME=$NEXT_PUBLIC_TOSS_ORDER_NAME
ENV NEXT_PUBLIC_TOSS_ORDER_ID_PREFIX=$NEXT_PUBLIC_TOSS_ORDER_ID_PREFIX
ENV NEXT_PUBLIC_TOSS_AGREEMENT_VARIANT_KEY=$NEXT_PUBLIC_TOSS_AGREEMENT_VARIANT_KEY

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
