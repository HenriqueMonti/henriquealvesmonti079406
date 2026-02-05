# Stage 1: Build
FROM node:20-alpine as builder

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código-fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Instalar servidor web leve (serve)
RUN npm install -g serve

# Copiar apenas os arquivos necessários do stage anterior
COPY --from=builder /app/dist ./dist

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Expor porta
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production

# Iniciar aplicação
CMD ["serve", "-s", "dist", "-l", "3000"]
