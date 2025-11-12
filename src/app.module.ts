// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { getDatabaseConfig } from './config/typeorm.config';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { ShopsModule } from './shops/shops.module';
// import { ProductsModule } from './products/products.module';
// import { CartModule } from './cart/cart.module';
// import { OrdersModule } from './orders/orders.module';
// import { DeliveryModule } from './delivery/delivery.module';
// import { AdminModule } from './admin/admin.module';
// import { ShopOwnerModule } from './shop-owner/shop-owner.module';
// import { TransformInterceptor } from './common/interceptors/transform.interceptor';
// import { APP_INTERCEPTOR } from '@nestjs/core';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: '.env',
//     }),
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: getDatabaseConfig,
//       inject: [ConfigService],
//     }),
//     AuthModule,
//     UsersModule,
//     ShopsModule,
//     ProductsModule,
//     CartModule,
//     OrdersModule,
//     DeliveryModule,
//     AdminModule,
//     ShopOwnerModule,
//   ],
//   controllers: [AppController],
//   providers: [
//     AppService,
//     {
//       provide: APP_INTERCEPTOR,
//       useClass: TransformInterceptor,
//     },
//   ],
// })
// export class AppModule {}

// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { UsersModule } from './modules/users/users.module';
import {ShopsModule} from './modules/shops/shops.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { AdminModule } from './modules/admin/admin.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    UsersModule,
    ShopsModule,
    DeliveryModule,
    OrdersModule,
    AdminModule,
  ],
})
export class AppModule {}
