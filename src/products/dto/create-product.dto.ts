import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, Min } from 'class-validator';
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

