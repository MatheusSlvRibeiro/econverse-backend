import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ProductsService } from './products.service.js';
import { ProductResponseDto } from './dto/product-response.dto.js';
import { ProductsResponseDto } from './dto/products-response.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

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

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Id do produto' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Id do produto' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
