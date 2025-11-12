import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery, DeliveryStatus } from './entities/delivery.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
  ) {}

  async create(orderId: string): Promise<Delivery> {
    const delivery = this.deliveryRepository.create({
      orderId,
      status: DeliveryStatus.PENDING,
    });
    return this.deliveryRepository.save(delivery);
  }

  async findByOrderId(orderId: string): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { orderId },
      relations: ['order', 'order.shop', 'order.user'],
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery for order ${orderId} not found`);
    }

    return delivery;
  }

  async updateStatus(deliveryId: string, status: DeliveryStatus): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${deliveryId} not found`);
    }

    delivery.status = status;
    return this.deliveryRepository.save(delivery);
  }

  async updateLocation(
    deliveryId: string,
    latitude: number,
    longitude: number,
  ): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${deliveryId} not found`);
    }

    delivery.currentLatitude = latitude;
    delivery.currentLongitude = longitude;
    return this.deliveryRepository.save(delivery);
  }

  async assignDeliveryPerson(
    deliveryId: string,
    personId: string,
    personName: string,
    personPhone: string,
  ): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${deliveryId} not found`);
    }

    delivery.deliveryPersonId = personId;
    delivery.deliveryPersonName = personName;
    delivery.deliveryPersonPhone = personPhone;
    delivery.status = DeliveryStatus.OUT_FOR_DELIVERY;
    return this.deliveryRepository.save(delivery);
  }

  async updateEstimatedTime(deliveryId: string, estimatedTime: number): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${deliveryId} not found`);
    }

    delivery.estimatedTime = estimatedTime;
    return this.deliveryRepository.save(delivery);
  }
}

