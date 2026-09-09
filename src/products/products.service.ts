import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(categorySlug?: string) {
    return this.prisma.product.findMany({
      where: categorySlug ? { category: { slug: categorySlug } } : undefined,
    });
  }
}
