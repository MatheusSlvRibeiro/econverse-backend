import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from './product-response.dto.js';

export class ProductsResponseDto {
  @ApiProperty()
  @Expose()
  success!: boolean;

  @ApiProperty({ type: () => ProductResponseDto, isArray: true })
  @Expose()
  @Type(() => ProductResponseDto)
  products!: ProductResponseDto[];
}
