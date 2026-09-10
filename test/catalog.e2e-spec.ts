import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

describe('Catalog (e2e)', () => {
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

  it('GET /products returns the success/products envelope', async () => {
    const response = await request(app.getHttpServer()).get('/products').expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        products: expect.any(Array),
      }),
    );
  });

  it('GET /products/:id returns the product when it exists', async () => {
    const list = await request(app.getHttpServer()).get('/products').expect(200);
    const [firstProduct] = list.body.products;

    const response = await request(app.getHttpServer())
      .get(`/products/${firstProduct.id}`)
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining({ id: firstProduct.id }));
  });

  it('GET /products/:id returns 404 for an id that does not exist', async () => {
    const response = await request(app.getHttpServer())
      .get('/products/00000000-0000-0000-0000-000000000000')
      .expect(404);

    expect(response.body).toEqual(
      expect.objectContaining({ success: false, statusCode: 404 }),
    );
  });

  it('GET /categories returns an array of categories', async () => {
    const response = await request(app.getHttpServer()).get('/categories').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
