import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from './product-response.dto.js';

export class ProductsResponseDto {
  @Expose()
  success!: boolean;

  @Expose()
  @Type(() => ProductResponseDto)
  products!: ProductResponseDto[];
}
