import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ProductResponseDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }: { obj: { name: string } }) => obj.name)
  productName!: string;

  @ApiProperty()
  @Expose()
  descriptionShort!: string;

  @ApiProperty()
  @Expose()
  photo!: string;

  @ApiProperty()
  @Expose()
  price!: number;

  @ApiProperty({ required: false })
  @Expose()
  @Transform(({ value }: { value: number | null }) => value ?? undefined)
  oldPrice?: number;

  @ApiProperty({ required: false })
  @Expose()
  @Transform(({ value }: { value: number | null }) => value ?? undefined)
  installmentValue?: number;
}
