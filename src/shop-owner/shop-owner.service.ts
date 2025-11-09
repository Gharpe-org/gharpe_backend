import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from '../shops/entities/shop.entity';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { ShopsService } from '../shops/shops.service';

@Injectable()
export class ShopOwnerService {
  constructor(
    @InjectRepository(Shop)
    private shopsRepository: Repository<Shop>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private shopsService: ShopsService,
  ) {}

  async getDashboardStats(ownerId: string) {
    const shops = await this.shopsRepository.find({
      where: { ownerId },
    });

    if (shops.length === 0) {
      return {
        totalShops: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
      };
    }

    const shopIds = shops.map((shop) => shop.id);

    const [totalOrders, revenueResult, pendingOrders] = await Promise.all([
      this.ordersRepository
        .createQueryBuilder('order')
        .where('order.shopId IN (:...shopIds)', { shopIds })
        .getCount(),
      this.ordersRepository
        .createQueryBuilder('order')
        .select('SUM(order.total)', 'total')
        .where('order.shopId IN (:...shopIds)', { shopIds })
        .andWhere('order.status = :status', { status: 'delivered' })
        .getRawOne(),
      this.ordersRepository
        .createQueryBuilder('order')
        .where('order.shopId IN (:...shopIds)', { shopIds })
        .andWhere('order.status = :status', { status: 'pending' })
        .getCount(),
    ]);

    const totalRevenue = parseFloat(revenueResult?.total || '0');

    return {
      totalShops: shops.length,
      totalOrders,
      totalRevenue,
      pendingOrders,
    };
  }

  async getShopOrders(ownerId: string) {
    const shops = await this.shopsRepository.find({
      where: { ownerId },
    });

    if (shops.length === 0) {
      return [];
    }

    const shopIds = shops.map((shop) => shop.id);

    return this.ordersRepository
      .createQueryBuilder('order')
      .where('order.shopId IN (:...shopIds)', { shopIds })
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .orderBy('order.createdAt', 'DESC')
      .getMany();
  }

  async getShopProducts(ownerId: string, shopId: string) {
    // Owner check removed
    return this.productsRepository.find({
      where: { shopId },
      order: { createdAt: 'DESC' },
    });
  }
}

