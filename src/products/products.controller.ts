import { Controller, Get, Param, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductsService } from './products.service.js';
import { ProductResponseDto } from './dto/product-response.dto.js';
import { ProductsResponseDto } from './dto/products-response.dto.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('category') category?: string): Promise<ProductsResponseDto> {
    const products = await this.productsService.findAll(category);
    return plainToInstance(
      ProductsResponseDto,
      { success: true, products },
      { excludeExtraneousValues: true },
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.productsService.findOne(id);
    return plainToInstance(ProductResponseDto, product, { excludeExtraneousValues: true });
  }
}
