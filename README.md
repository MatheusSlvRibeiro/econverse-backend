# Econverse Backend

API REST em NestJS que serve o catálogo de produtos consumido pela vitrine [teste-front-end](https://github.com/MatheusSlvRibeiro/teste-front-end), com autenticação JWT e CRUD administrativo de produtos/categorias.

Ver [.gsd/SPEC.md](.gsd/SPEC.md) para a especificação completa (problema, escopo, critérios de sucesso) e [.gsd/ROADMAP.md](.gsd/ROADMAP.md) para o plano de entrega.

---

## Como rodar o projeto

### Pré-requisitos

- Node.js 24+ e npm
- PostgreSQL (local ou remoto)

### Instalação

```bash
git clone https://github.com/MatheusSlvRibeiro/econverse-backend.git
cd econverse-backend
npm install
```

### Variáveis de ambiente

```bash
cp .env.example .env
```

| Variável | Descrição | Default |
|---|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL usada pelo Prisma | nenhum — obrigatória |
| `JWT_SECRET` | Chave usada para assinar/validar tokens JWT | nenhum — obrigatória |
| `PORT` | Porta HTTP do servidor Nest | `3000` |

### Banco de dados

```bash
npx prisma migrate dev   # cria o schema no Postgres apontado por DATABASE_URL
```

> Ainda não implementado nesta fase do projeto — ver M01/S01 em [.gsd/ROADMAP.md](.gsd/ROADMAP.md).

### Desenvolvimento

```bash
npm run start:dev
```

### Build de produção

```bash
npm run build
npm run start:prod
```

### Testes

```bash
npm run test        # unit (Vitest)
npm run test:e2e    # e2e (Supertest)
```

### Lint

```bash
npm run lint
```

### Validação completa (lint + build + test)

```bash
npm run lint && npm run build && npm run test
```

Esse é o gate que precisa passar limpo antes de qualquer commit — ver `AGENTS.md`.

---

## Sobre o desenvolvimento

Este projeto segue o mesmo workflow assistido por IA (Claude Code) do [teste-front-end](https://github.com/MatheusSlvRibeiro/teste-front-end), orquestrado por um harness próprio versionado no repositório:

- **`AGENTS.md`** — regras universais do projeto.
- **`.gsd/`** — documentação viva: `SPEC.md` (especificação funcional), `STACK.md` (stack e convenções), `ROADMAP.md` (milestones/sprints/tasks).
- **`.harness/`** — rastreamento de features (`feature_list.json`) com critérios de aceite observáveis, e baseline de métricas de qualidade (`baseline.json`) que só pode melhorar.
