# Pet Manager SPA

Sistema frontend para gerenciamento de **Pets** e **Tutores**, com autenticação JWT, relacionamento entre entidades, upload de fotos e listagem paginada com busca.

> Projeto desenvolvido como **desafio técnico**, com foco em **organização, arquitetura, legibilidade e escalabilidade**.

# Contato e Suporte

**Desenvolvedor**: Henrique Alves Monti  
**GitHub**: [HenriqueMonti](https://github.com/HenriqueMonti)  
**Email**: henrique.amonti@gmail.com
**Celular:** (65) 99201-4005
**N° Inscrição:** 16374

---

## Visão Geral

### Funcionalidades Implementadas

* Autenticação JWT com refresh automático
* CRUD completo de Pets
* CRUD completo de Tutores
* Relacionamento Pet ↔ Tutor (vincular / desvincular)
* Listagem paginada (10 itens por página)
* Busca por nome
* Upload de fotos (Pet e Tutor)
* Rotas protegidas
* Lazy loading de módulos

---

## Arquitetura

O projeto segue uma **arquitetura em camadas**, priorizando separação de responsabilidades e facilidade de manutenção.

```
UI (Components)
   ↓
Pages / Containers
   ↓
Facades (State Management)
   ↓
Services (HTTP)
   ↓
API REST
```

### Principais decisões

* **Facade Pattern** para centralizar regras de negócio e estado
* **RxJS (BehaviorSubject)** para gerenciamento reativo de estado
* **Axios com interceptors** para autenticação e refresh de token
* **Container / Presentational Components** para melhor organização

---

## Estrutura de Pastas (resumo)

```
src/
├── core/        # auth, http, facades globais
├── features/    # pets, tutores, login
├── routes/      # configuração de rotas
├── shared/      # componentes e tipos reutilizáveis
└── styles/      # estilos globais
```

---

## Stack Utilizada

* **React + TypeScript**
* **Vite** (build e dev server)
* **Tailwind CSS** (estilização)
* **React Router** (roteamento)
* **Axios** (HTTP)
* **RxJS** (estado reativo)

---

## Como Executar

### Pré-requisitos

* Node.js ≥ 18
* npm ≥ 10

### Passos

```bash
# Clone o repositório
git clone https://github.com/HenriqueMonti/henriquealvesmonti079406.git
cd pet-manager

# Instale as dependências
npm install

# Configure variáveis de ambiente
cat > .env.local << EOF
VITE_API_URL=https://pet-manager-api.geia.vip
EOF

# Rode o projeto
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

### Credenciais de Teste

```
Username: admin
Password: admin
```

---

## Testes

> **Status**: não implementados por limitação de tempo.

A arquitetura foi planejada para facilitar testes unitários, especialmente nas camadas de **Facade** e **Service**.

---

## 📦 Deploy

O projeto pode ser buildado e servido como SPA estática.

```bash
npm run build
npm run preview
```

Também é compatível com plataformas como **Vercel**, **Netlify** ou **S3 + CloudFront**.

---

## ⚖️ Implementação vs Escopo

### Implementado

* Todos os requisitos funcionais principais
* Autenticação e refresh de token
* Relacionamentos Pet ↔ Tutor
* Upload de imagens

### Não implementado

* Testes automatizados (unitários / E2E)

Esses pontos foram priorizados para manter foco na arquitetura e nas funcionalidades centrais do desafio.

---

## 📝 Observações Finais

* Commits realizados de forma incremental e semântica
* Decisões técnicas priorizaram clareza e manutenibilidade
* Projeto estruturado para fácil evolução futura

---

**Status**: ✅ Concluído
**Última atualização**: 04 de fevereiro de 2026
