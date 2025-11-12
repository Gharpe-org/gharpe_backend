import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Shop } from '../shops/entities/shop.entity';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Shop)
    private shopsRepository: Repository<Shop>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async getDashboardStats() {
    const [totalShops, totalUsers, totalOrders] = await Promise.all([
      this.shopsRepository.count(),
      this.usersRepository.count(),
      this.ordersRepository.count(),
    ]);

    const revenueResult = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.status = :status', { status: 'delivered' })
      .getRawOne();

    const revenue = parseFloat(revenueResult?.total || '0');

    const pendingShops = await this.shopsRepository.count({
      where: { isApproved: false },
    });

    return {
      totalShops,
      totalUsers,
      totalOrders,
      revenue,
      pendingShops,
    };
  }

  async getAllShops() {
    return this.shopsRepository.find({
      relations: ['owner'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllOrders() {
    return this.ordersRepository.find({
      relations: ['user', 'shop', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllUsers() {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}

