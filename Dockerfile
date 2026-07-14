# --- BASE STAGE ---
FROM node:20-alpine AS base
RUN npm install -g pnpm

# --- DEPENDENCIES STAGE ---
FROM base AS deps
# Registrar libc6-compat para Alpine linux si es necesario
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# --- BUILDER STAGE ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desactivar telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

# --- RUNNER STAGE ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos públicos y estáticos construidos
COPY --from=builder /app/public ./public

# Configurar permisos correctos para la caché de Next.js
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiar standalone build (Next.js standalone extrae todo lo necesario)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Arrancar el servidor Next.js standalone
CMD ["node", "server.js"]
