import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ProductsService } from './products.service.js';
import { ProductResponseDto } from './dto/product-response.dto.js';
import { ProductsResponseDto } from './dto/products-response.dto.js';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiQuery({ name: 'category', required: false, description: 'Slug da categoria para filtrar' })
  @ApiOkResponse({ type: ProductsResponseDto })
  async findAll(@Query('category') category?: string): Promise<ProductsResponseDto> {
    const products = await this.productsService.findAll(category);
    return plainToInstance(
      ProductsResponseDto,
      { success: true, products },
      { excludeExtraneousValues: true },
    );
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Id do produto' })
  @ApiOkResponse({ type: ProductResponseDto })
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.productsService.findOne(id);
    return plainToInstance(ProductResponseDto, product, { excludeExtraneousValues: true });
  }
}
