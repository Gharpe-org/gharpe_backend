import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Query('userId') userId: string) {
    if (!userId) {
      return { error: 'userId query parameter is required' };
    }
    return this.cartService.getCart(userId);
  }

  @Post('add')
  addToCart(@Body() addToCartDto: AddToCartDto & { userId?: string }, @Query('userId') userId?: string) {
    const finalUserId = userId || addToCartDto.userId;
    if (!finalUserId) {
      return { error: 'userId is required (provide in query ?userId=xxx or in request body)' };
    }
    return this.cartService.addToCart(addToCartDto, finalUserId);
  }

  @Patch(':itemId')
  updateQuantity(
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number,
    @Query('userId') userId: string,
  ) {
    if (!userId) {
      return { error: 'userId query parameter is required' };
    }
    return this.cartService.updateQuantity(itemId, quantity, userId);
  }

  @Delete(':itemId')
  removeItem(@Param('itemId') itemId: string, @Query('userId') userId: string) {
    if (!userId) {
      return { error: 'userId query parameter is required' };
    }
    return this.cartService.removeItem(itemId, userId);
  }

  @Delete()
  clearCart(@Query('userId') userId: string) {
    if (!userId) {
      return { error: 'userId query parameter is required' };
    }
    return this.cartService.clearCart(userId);
  }
}

