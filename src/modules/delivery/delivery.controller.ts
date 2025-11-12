import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryStatus } from './entities/delivery.entity';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get(':orderId/track')
  track(@Param('orderId') orderId: string) {
    return this.deliveryService.findByOrderId(orderId);
  }

  @Patch(':orderId/update-location')
  updateLocation(
    @Param('orderId') orderId: string,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number,
  ) {
    // In a real app, you'd get deliveryId from orderId
    return this.deliveryService.findByOrderId(orderId).then((delivery) =>
      this.deliveryService.updateLocation(delivery.id, latitude, longitude),
    );
  }

  @Patch(':orderId/status')
  updateStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: DeliveryStatus,
  ) {
    return this.deliveryService.findByOrderId(orderId).then((delivery) =>
      this.deliveryService.updateStatus(delivery.id, status),
    );
  }
}

