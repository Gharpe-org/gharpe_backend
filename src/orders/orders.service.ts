import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { DeliveryService } from '../delivery/delivery.service';
import { Product } from '../products/entities/product.entity';
import { Delivery, DeliveryStatus } from '../delivery/entities/delivery.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private cartService: CartService,
    private productsService: ProductsService,
    private deliveryService: DeliveryService,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    const cartItems = await this.cartService.getCart(userId);
    
    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Filter items for the specific shop
    const shopCartItems = cartItems.filter(
      (item) => item.product.shopId === createOrderDto.shopId,
    );

    if (shopCartItems.length === 0) {
      throw new BadRequestException('No items from this shop in cart');
    }

    // Calculate total and validate stock
    let total = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const cartItem of shopCartItems) {
      const product = await this.productsService.findOne(cartItem.productId);
      
      if (!product.isAvailable || product.stock < cartItem.quantity) {
        throw new BadRequestException(
          `Product ${product.name} is not available or insufficient stock`,
        );
      }

      const itemTotal = parseFloat(product.price.toString()) * cartItem.quantity;
      total += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: cartItem.quantity,
        price: parseFloat(product.price.toString()),
      });
    }

    // Create order in transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = this.ordersRepository.create({
        userId,
        shopId: createOrderDto.shopId,
        total,
        deliveryAddress: createOrderDto.deliveryAddress,
        notes: createOrderDto.notes,
        status: OrderStatus.PENDING,
      });

      const savedOrder = await queryRunner.manager.save(order);

      // Create order items
      for (const item of orderItems) {
        const orderItem = this.orderItemsRepository.create({
          ...item,
          orderId: savedOrder.id,
        });
        await queryRunner.manager.save(orderItem);

        // Update product stock
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
        });
        if (product) {
          product.stock -= item.quantity;
          await queryRunner.manager.save(product);
        }
      }

      // Create delivery tracking within the transaction
      const delivery = queryRunner.manager.create(Delivery, {
        orderId: savedOrder.id,
        status: DeliveryStatus.PENDING,
      });
      await queryRunner.manager.save(delivery);

      // Clear cart items for this shop
      for (const cartItem of shopCartItems) {
        await this.cartService.removeItem(cartItem.id, userId);
      }

      await queryRunner.commitTransaction();

      return this.findOne(savedOrder.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId?: string, shopId?: string): Promise<Order[]> {
    const where: any = {};
    if (userId) where.userId = userId;
    if (shopId) where.shopId = shopId;

    return this.ordersRepository.find({
      where,
      relations: ['user', 'shop', 'items', 'items.product', 'delivery'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'shop', 'items', 'items.product', 'delivery'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus, userId?: string): Promise<Order> {
    const order = await this.findOne(id);
    // Owner check removed
    order.status = status;
    await this.ordersRepository.save(order);

    // Update delivery status
    if (order.delivery) {
      await this.deliveryService.updateStatus(order.delivery.id, status as any);
    }

    return this.findOne(id);
  }
}

