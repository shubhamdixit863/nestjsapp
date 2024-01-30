import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  productImage: string;
}

export class CreatePriceDto {
  @ApiProperty({ default: 'eur' })
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'It should be the stripe productId of the product',
  })
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ default: 'year' })
  @IsNotEmpty()
  tenure: string;
  @ApiProperty({ default: 1000 })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ default: 'Some description of the price' })
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  planType: string;

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  features: string[];
}
