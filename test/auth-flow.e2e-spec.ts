import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { randomUUID } from 'node:crypto';
import { AppModule } from './../src/app.module.js';

describe('Auth flow (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('registra, loga, cria um produto autenticado e o vê no catálogo público', async () => {
    const email = `admin-${randomUUID()}@example.com`;
    const password = 'supersecret';

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password })
      .expect(201);
    expect(registerResponse.body.accessToken).toEqual(expect.any(String));

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(201);
    const { accessToken } = loginResponse.body;
    expect(accessToken).toEqual(expect.any(String));

    const categoriesResponse = await request(app.getHttpServer()).get('/categories').expect(200);
    const [category] = categoriesResponse.body;

    const productName = `E2E product ${randomUUID()}`;
    const createResponse = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: productName,
        descriptionShort: 'created by the auth flow e2e test',
        photo: 'https://example.com/photo.png',
        price: 42,
        categoryId: category.id,
      })
      .expect(201);
    const createdId = createResponse.body.id;

    const publicListResponse = await request(app.getHttpServer()).get('/products').expect(200);
    expect(
      publicListResponse.body.products.some(
        (product: { id: string; productName: string }) =>
          product.id === createdId && product.productName === productName,
      ),
    ).toBe(true);
  });

  it('rejeita criar produto sem token', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'no auth' })
      .expect(401);
  });
});
