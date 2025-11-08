import { IsObject, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  shopId: string;

  @IsObject()
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };

  @IsOptional()
  @IsString()
  notes?: string;
}

