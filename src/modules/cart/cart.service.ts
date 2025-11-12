import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartRepository: Repository<CartItem>,
    private productsService: ProductsService,
  ) {}

  async getCart(userId: string): Promise<CartItem[]> {
    return this.cartRepository.find({
      where: { userId },
      relations: ['product', 'product.shop'],
    });
  }

  async addToCart(addToCartDto: AddToCartDto, userId: string): Promise<CartItem> {
    const product = await this.productsService.findOne(addToCartDto.productId);
    
    if (!product.isAvailable || product.stock < addToCartDto.quantity) {
      throw new NotFoundException('Product not available or insufficient stock');
    }

    // Check if item already exists in cart
    const existingItem = await this.cartRepository.findOne({
      where: { userId, productId: addToCartDto.productId },
    });

    if (existingItem) {
      existingItem.quantity += addToCartDto.quantity;
      return this.cartRepository.save(existingItem);
    }

    const cartItem = this.cartRepository.create({
      userId,
      productId: addToCartDto.productId,
      quantity: addToCartDto.quantity,
    });

    return this.cartRepository.save(cartItem);
  }

  async updateQuantity(itemId: string, quantity: number, userId: string): Promise<CartItem> {
    const item = await this.cartRepository.findOne({
      where: { id: itemId, userId },
      relations: ['product'],
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity <= 0) {
      await this.cartRepository.remove(item);
      return item;
    }

    if (item.product.stock < quantity) {
      throw new NotFoundException('Insufficient stock');
    }

    item.quantity = quantity;
    return this.cartRepository.save(item);
  }

  async removeItem(itemId: string, userId: string): Promise<void> {
    const item = await this.cartRepository.findOne({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartRepository.remove(item);
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartRepository.delete({ userId });
  }
}

