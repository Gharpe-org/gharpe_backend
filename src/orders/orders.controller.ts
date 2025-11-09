import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto & { userId: string }, @Query('userId') userId?: string) {
    // userId is required - must be provided in query or body
    const finalUserId = userId || createOrderDto.userId;
    if (!finalUserId) {
      throw new Error('userId is required (provide in query ?userId=xxx or in request body)');
    }
    return this.ordersService.create(createOrderDto, finalUserId);
  }

  @Get()
  findAll(@Query('shopId') shopId?: string, @Query('userId') userId?: string) {
    return this.ordersService.findAll(userId, shopId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status);
  }
}

