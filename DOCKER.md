# Pet Manager SPA - Docker Setup

## 🐳 Containerização

### Build da imagem Docker

```bash
# Build com tag
docker build -t pet-manager:latest .

# Build com tag específica
docker build -t pet-manager:1.0.0 .
```

### Executar container

```bash
# Modo interativo
docker run -p 3000:3000 pet-manager:latest

# Modo background (detached)
docker run -d -p 3000:3000 --name pet-manager pet-manager:latest

# Com variáveis de ambiente
docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  --name pet-manager \
  pet-manager:latest

# Com volume para logs
docker run -d -p 3000:3000 \
  -v $(pwd)/logs:/app/logs \
  --name pet-manager \
  pet-manager:latest
```

### Usando Docker Compose

```bash
# Iniciar serviço
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviço
docker-compose down

# Rebuild e iniciar
docker-compose up -d --build
```

## 📊 Verificar container

```bash
# Listar containers
docker ps

# Ver logs
docker logs pet-manager

# Acessar shell do container
docker exec -it pet-manager sh

# Health check
docker inspect pet-manager | grep -A 5 "Health"

# Acessar aplicação
curl http://localhost:3000
```

## 🚀 Push para Registry (Docker Hub/ECR)

### Docker Hub

```bash
# Login
docker login

# Tag
docker tag pet-manager:latest seuuser/pet-manager:latest

# Push
docker push seuuser/pet-manager:latest

# Pull (outro servidor)
docker pull seuuser/pet-manager:latest
```

### AWS ECR

```bash
# Login (substitua ACCOUNT_ID, REGION)
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Tag
docker tag pet-manager:latest \
  ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/pet-manager:latest

# Push
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/pet-manager:latest
```

## 📦 Tamanho da imagem

```bash
# Verificar tamanho
docker images pet-manager

# Análise detalhada
docker history pet-manager:latest
```

A imagem final (Stage 2) é mínima (~150-200MB) porque:
- ✅ Base: node:20-alpine (~150MB)
- ✅ Apenas arquivos compilados do `/dist`
- ✅ Sem node_modules, source code ou build tools

## 🔒 Segurança

### Scan de vulnerabilidades

```bash
# Com Trivy
trivy image pet-manager:latest

# Com Snyk
snyk container test pet-manager:latest
```

### Best practices aplicadas

- ✅ Multi-stage build (reduz tamanho)
- ✅ Alpine Linux (mínimo)
- ✅ Non-root user (segurança)
- ✅ Health checks (monitoramento)
- ✅ .dockerignore (cache eficiente)
- ✅ Read-only filesystem (considerar em produção)

### Executar com segurança extra

```bash
docker run -d \
  -p 3000:3000 \
  --read-only \
  --cap-drop=ALL \
  --security-opt=no-new-privileges \
  --user 1000 \
  pet-manager:latest
```

## 🐳 Kubernetes (K8s)

### Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pet-manager
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pet-manager
  template:
    metadata:
      labels:
        app: pet-manager
    spec:
      containers:
      - name: pet-manager
        image: pet-manager:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
---
apiVersion: v1
kind: Service
metadata:
  name: pet-manager
spec:
  selector:
    app: pet-manager
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

Deploy no K8s:
```bash
kubectl apply -f deployment.yaml
kubectl port-forward svc/pet-manager 3000:80
```

## 📋 Resumo

| Aspecto | Detalhes |
|--------|----------|
| **Base** | node:20-alpine |
| **Build** | npm ci + npm run build |
| **Runtime** | serve (servidor HTTP) |
| **Porta** | 3000 |
| **Health Check** | Ativo a cada 30s |
| **Tamanho Final** | ~200MB |
| **User** | root (pode alterar) |
| **Restart** | unless-stopped (compose) |
