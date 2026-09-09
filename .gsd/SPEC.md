# SPEC.md — Econverse Backend

---

## Visão

Uma API REST que serve o catálogo de produtos da vitrine Econverse ([teste-front-end](https://github.com/MatheusSlvRibeiro/teste-front-end)) com autenticação JWT e CRUD administrativo, para que o frontend consuma dados reais em vez de um JSON estático de terceiros — e para servir como evidência pública de portfólio de backend ownership (modelagem de dados, auth, autorização, APIs documentadas).

---

## Problema

Hoje o `teste-front-end` consome um JSON estático hospedado por terceiros (`app.econverse.com.br`), sem nenhuma camada de persistência, autenticação ou API própria. Matheus pratica isso profissionalmente em Django (KCL Tecnologia), mas esse código é privado — não há evidência pública desse tipo de trabalho no GitHub. Sem este backend, o portfólio mostra só front estático, o que limita o sinal técnico para recrutadores avaliando vagas de backend/full stack.

---

## Solução

1. **API pública de catálogo** — listar produtos (com filtro por categoria) e obter detalhe de um produto por id, substituindo o JSON estático consumido hoje pelo frontend.
2. **Autenticação JWT** — registro e login de usuário administrador (`POST /auth/register`, `POST /auth/login`).
3. **CRUD de produtos e categorias** protegido por autenticação (rotas `admin`) — criar, editar, remover.
4. **Documentação OpenAPI/Swagger** navegável sem autenticação, cobrindo todos os endpoints.
5. **Seed inicial** reproduzindo os produtos atuais do JSON estático, para continuidade visual com o frontend já publicado.

---

## Usuários

- **Visitante (público):** consome `GET /products`, `GET /products/:id`, `GET /categories` — sem autenticação. É quem visita a vitrine publicada.
- **Administrador:** faz login e cria/edita/remove produtos e categorias via rotas autenticadas. Só existe esse papel autenticado (sem hierarquia de permissões).

---

## Fora de escopo

- Pagamento real, checkout ou carrinho de compras
- Wishlist/favoritos de usuário final
- Múltiplos papéis/hierarquia de permissão (só admin vs. anônimo)
- Multi-tenant
- Cadastro de usuário final (compradores) — só existe login de administrador

---

## Critérios de sucesso

- O `teste-front-end` consome os produtos deste backend (`VITE_PRODUCTS_API_URL` apontando para cá) sem quebrar a vitrine nem o modal de detalhes já existentes.
- Um administrador autenticado consegue criar um produto via API e ele aparece na vitrine do frontend na próxima carga.
- `/docs` (Swagger) lista todos os endpoints e é navegável sem autenticação.
- `npm run lint && npm run build && npm run test` passam limpos antes de cada commit.
- Senhas nunca trafegam nem são persistidas em texto plano.

---

## Visão técnica

- **Framework:** NestJS 12 (Node 24)
- **Linguagem:** TypeScript ~6.0 (strict, sem `any`)
- **Banco / ORM:** PostgreSQL + Prisma
- **Testes:** Vitest (unit) + Supertest (e2e)
- **Gerenciador de pacotes:** npm
- **Deploy:** > [TBD: ainda não decidido — Railway, Render ou Coolify self-hosted]

---

## Restrições importantes

- O schema de produto hoje consumido pelo frontend (`teste-front-end/src/schemas/product.ts`) **não tem campo de identificador** (`id`/`uuid`) — os produtos são só `productName`, `descriptionShort`, `photo`, `price`, `oldPrice?`, `installmentValue?`. Para o backend expor `GET /products/:id` e o frontend navegar por produto real, o schema do frontend precisa ganhar um campo `id` — isso é uma mudança coordenada entre os dois repos, não só deste.
- A resposta de `GET /products` precisa manter o formato `{ success: boolean, products: Product[] }` já validado por `ProductsResponseSchema` no frontend, ou as duas pontas mudam juntas.
- Senhas: hash com bcrypt (ou argon2), nunca texto plano; `JWT_SECRET` só via variável de ambiente, nunca hardcoded.
- Este projeto é **standalone** (single-repo) — não é sub-repo de um workspace umbrella com o `teste-front-end`, mesmo integrando com ele.
