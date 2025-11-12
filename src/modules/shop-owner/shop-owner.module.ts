import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopOwnerService } from './shop-owner.service';
import { ShopOwnerController } from './shop-owner.controller';
import { Shop } from '../shops/entities/shop.entity';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { ShopsModule } from '../shops/shops.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop, Order, Product]),
    ShopsModule,
  ],
  controllers: [ShopOwnerController],
  providers: [ShopOwnerService],
})
export class ShopOwnerModule {}

