import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: { product: { findMany: ReturnType<typeof vi.fn>; findUnique: ReturnType<typeof vi.fn> } };

  beforeEach(async () => {
    prisma = {
      product: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(ProductsService);
  });

  describe('findAll', () => {
    it('returns an empty list when there are no products', async () => {
      prisma.product.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(prisma.product.findMany).toHaveBeenCalledWith({ where: undefined });
    });

    it('filters by category slug when provided', async () => {
      prisma.product.findMany.mockResolvedValue([{ id: '1', name: 'Product 1' }]);

      const result = await service.findAll('tecnologia');

      expect(result).toEqual([{ id: '1', name: 'Product 1' }]);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { category: { slug: 'tecnologia' } },
      });
    });
  });

  describe('findOne', () => {
    it('returns the product when it exists', async () => {
      const product = { id: '1', name: 'Product 1' };
      prisma.product.findUnique.mockResolvedValue(product);

      const result = await service.findOne('1');

      expect(result).toBe(product);
    });

    it('throws NotFoundException when the id does not exist', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(NotFoundException);
    });
  });
});
