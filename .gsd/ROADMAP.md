# ROADMAP.md — Econverse Backend

> Mantenha as tarefas pequenas o suficiente para caber em uma sessão do agente.
> Atualize os marcadores de status conforme o trabalho avança.

---

## Como ler este arquivo

- **Milestone:** uma versão entregável do produto
- **Sprint:** uma capacidade vertical demonstrável dentro de um milestone
- **Tarefa:** uma unidade focada de trabalho, cabe em uma sessão do agente

Marcadores de status: `[ ]` pendente · `[~]` em progresso · `[x]` concluído

---

## Roadmap do projeto

> Sem prazo de entrega definido.

## M01 — Catálogo público

> Meta: expor o catálogo de produtos/categorias via API REST com persistência real em PostgreSQL, pronto para o frontend consumir no lugar do JSON estático.
> Entregável quando: `GET /products` e `GET /products/:id` retornam dados do banco (via seed), `/docs` (Swagger) lista os endpoints, e `npm run lint && npm run build && npm run test` passa limpo.

### S01 — Persistência `[ ]`

- [ ] T01: instalar e configurar Prisma (`@prisma/client`, `prisma`), criar `prisma/schema.prisma` com models `Product` e `Category`
- [ ] T02: rodar migration inicial e criar módulo `PrismaModule`/`PrismaService` reutilizável para injeção nos demais módulos
- [ ] T03: script de seed (`prisma/seed.ts`) reproduzindo os produtos atuais do JSON estático consumido pelo frontend

### S02 — API de catálogo `[ ]`

- [ ] T01: módulo `ProductsModule` — `GET /products` (com filtro opcional por categoria), `GET /products/:id`
- [ ] T02: módulo `CategoriesModule` — `GET /categories`
- [ ] T03: DTOs de resposta com `class-validator`/`class-transformer`, formato `{ success: boolean, products: Product[] }` compatível com `ProductsResponseSchema` do frontend
- [ ] T04: tratar erros (404 em produto inexistente, 500 com corpo consistente) — sem stack trace vazando pra resposta

### S03 — Documentação e qualidade `[ ]`

- [ ] T01: configurar `@nestjs/swagger`, decorar DTOs/controllers, expor `/docs`
- [ ] T02: testes unitários dos services de `ProductsModule`/`CategoriesModule` e teste e2e dos endpoints públicos
- [ ] T03: preencher `.env.example` e README com setup do zero (`npm install`, `prisma migrate`, `npm run start:dev`)

---

## M02 — Autenticação e CRUD admin

> Meta: permitir que um administrador autenticado gerencie o catálogo via API, sem expor essas rotas a visitantes anônimos.
> Entregável quando: um admin consegue registrar/logar, criar/editar/remover um produto autenticado, e uma tentativa sem token recebe 401.

### S01 — Autenticação JWT `[ ]`

- [ ] T01: model `User` no Prisma (email, hash de senha, timestamps)
- [ ] T02: `AuthModule` — `POST /auth/register`, `POST /auth/login`, hash de senha com bcrypt, emissão de JWT (`@nestjs/jwt`)
- [ ] T03: `JwtAuthGuard` (Passport) reutilizável para proteger rotas admin

### S02 — CRUD admin `[ ]`

- [ ] T01: `POST/PATCH/DELETE /products` e `/categories` protegidos por `JwtAuthGuard`
- [ ] T02: validação de entrada (DTOs de criação/edição) rejeitando payloads inválidos com 400
- [ ] T03: testes unitários dos guards/services de auth e e2e do fluxo completo (registrar → logar → criar produto → ver na listagem pública)

---

## M03 — Integração e entrega

> Meta: o `teste-front-end` consumindo este backend em produção, com o backend deployado e documentado.
> Entregável quando: a vitrine publicada do frontend mostra produtos vindos deste backend, e o repositório está pronto para ser usado como peça de portfólio (README completo, deploy no ar).

### S01 — Deploy `[ ]`

- [ ] T01: decidir e configurar o alvo de deploy (`> [TBD: Railway, Render ou Coolify]`, ver `.gsd/STACK.md`)
- [ ] T02: publicar o backend com banco Postgres gerenciado/self-hosted e rodar a seed em produção

### S02 — Integração com o frontend `[ ]`

- [ ] T01: adicionar campo `id`/`uuid` ao `ProductSchema` do `teste-front-end` (mudança coordenada — ver restrição em `.gsd/SPEC.md`)
- [ ] T02: apontar `VITE_PRODUCTS_API_URL` do `teste-front-end` para este backend em produção e validar a vitrine/modal end-to-end
- [ ] T03: revisar README de ambos os repos linkando um ao outro (backend ↔ frontend) como peça única de portfólio
