import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: { category: { findMany: ReturnType<typeof vi.fn> } };

  beforeEach(async () => {
    prisma = {
      category: {
        findMany: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(CategoriesService);
  });

  describe('findAll', () => {
    it('returns an empty list when there are no categories', async () => {
      prisma.category.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('returns the categories from the database', async () => {
      const categories = [{ id: '1', name: 'Tecnologia', slug: 'tecnologia' }];
      prisma.category.findMany.mockResolvedValue(categories);

      const result = await service.findAll();

      expect(result).toBe(categories);
    });
  });
});
