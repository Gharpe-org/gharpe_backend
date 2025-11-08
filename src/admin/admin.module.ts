import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/entities/user.entity';
import { Shop } from '../shops/entities/shop.entity';
import { Order } from '../orders/entities/order.entity';
import { ShopsModule } from '../shops/shops.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Shop, Order]),
    ShopsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

