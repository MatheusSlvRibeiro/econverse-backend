import { Expose, Transform } from 'class-transformer';

export class ProductResponseDto {
  @Expose()
  id!: string;

  @Expose()
  @Transform(({ obj }: { obj: { name: string } }) => obj.name)
  productName!: string;

  @Expose()
  descriptionShort!: string;

  @Expose()
  photo!: string;

  @Expose()
  price!: number;

  @Expose()
  @Transform(({ value }: { value: number | null }) => value ?? undefined)
  oldPrice?: number;

  @Expose()
  @Transform(({ value }: { value: number | null }) => value ?? undefined)
  installmentValue?: number;
}
