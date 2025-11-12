import { Controller, Get, Param, Query } from '@nestjs/common';
import { ShopOwnerService } from './shop-owner.service';

@Controller('shop-owner')
export class ShopOwnerController {
  constructor(private readonly shopOwnerService: ShopOwnerService) {}

  @Get('dashboard')
  getDashboard(@Query('ownerId') ownerId: string) {
    if (!ownerId) {
      return { error: 'ownerId query parameter is required' };
    }
    return this.shopOwnerService.getDashboardStats(ownerId);
  }

  @Get('orders')
  getOrders(@Query('ownerId') ownerId: string) {
    if (!ownerId) {
      return { error: 'ownerId query parameter is required' };
    }
    return this.shopOwnerService.getShopOrders(ownerId);
  }

  @Get('products/:shopId')
  getProducts(@Param('shopId') shopId: string, @Query('ownerId') ownerId: string) {
    if (!ownerId) {
      return { error: 'ownerId query parameter is required' };
    }
    return this.shopOwnerService.getShopProducts(ownerId, shopId);
  }
}

