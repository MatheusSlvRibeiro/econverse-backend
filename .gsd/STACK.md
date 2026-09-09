# STACK.md

Identificação do projeto: qual stack este código usa, como validar, que ambiente ele precisa.

Este arquivo é **preenchido pela entrevista de bootstrap** e **nunca é sobrescrito por scripts de sincronia**.
As convenções de código (folder layout, módulos, testes, DTOs) **não** vão aqui — vêm da skill `stack-<archetype>` correspondente (ver `skills/harness-index`).

---

## Stack

- Runtime / framework: Node 24 · NestJS 12
- Linguagem: TypeScript ~6.0 (strict, sem `any`)
- Banco / ORM: PostgreSQL + Prisma
- Estilização: N/A — API, sem UI
- Testes: Vitest (unit) + Supertest (e2e), scaffold padrão do `@nestjs/cli`
- Gerenciador de pacotes: npm
- Deploy: > [TBD: ainda não decidido — Railway, Render ou Coolify self-hosted]

**Archetype skill correspondente:** nenhuma ainda — não existe `stack-nestjs-*` no harness. Convenções emergem via OpenSpace (`evolving-skills`) conforme o projeto avança; considerar propor uma skill `stack-nestjs-prisma` no `harness-engineering` depois que os padrões (estrutura de módulos, DTOs, guards) estiverem estáveis aqui.

---

## Validação (rodar antes de cada commit)

```bash
npm run lint && npm run build && npm run test
```

O que ele roda, em sequência:

1. `lint` — oxlint (scaffold padrão do Nest 12; mais rápido que ESLint, sem config própria ainda)
2. `build` — `nest build` (compilação TypeScript)
3. `test` — Vitest (unit); `npm run test:e2e` roda a suite Supertest separadamente (não faz parte do gate padrão ainda — sem banco de teste configurado)

**Uma tarefa só está completa quando este comando passa com zero erros.**
Nunca considere uma tarefa pronta com base apenas no seu próprio julgamento.

---

## Setup do zero

```bash
git clone https://github.com/MatheusSlvRibeiro/econverse-backend.git
cd econverse-backend
npm install
cp .env.example .env     # preencha DATABASE_URL e JWT_SECRET
npx prisma migrate dev   # cria o schema no Postgres local
npm run start:dev
```

---

## Variáveis de ambiente

| Variável | Descrição | Default |
| -------- | --------- | ------- |
| `DATABASE_URL` | Connection string do PostgreSQL usada pelo Prisma | nenhum — obrigatória |
| `JWT_SECRET` | Chave usada para assinar/validar tokens JWT | nenhum — obrigatória, nunca hardcoded |
| `PORT` | Porta HTTP do servidor Nest | `3000` |

`.env.example` deve documentar as três com esses defaults/observações.

---

## Notas específicas do projeto

- Integração com o frontend: `teste-front-end` (repo irmão, standalone — não é workspace umbrella) vai apontar `VITE_PRODUCTS_API_URL` para este backend depois que `GET /products` estiver estável. Ver restrição de shape do produto em `.gsd/SPEC.md`.
- Sem lib de autenticação de terceiros (ex.: Auth0/Clerk) — JWT emitido/validado pelo próprio Nest (`@nestjs/jwt` + `passport-jwt`), para manter o projeto autocontido como peça de portfólio.
- Prisma Client gerado em build/postinstall — `prisma/schema.prisma` é a fonte de verdade do modelo de dados, não os DTOs do Nest.
