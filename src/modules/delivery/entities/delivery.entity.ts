import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

export enum DeliveryStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
}

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  orderId: string;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  currentLatitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  currentLongitude: number;

  @Column({ nullable: true })
  estimatedTime: number; // in minutes

  @Column({ nullable: true })
  deliveryPersonId: string;

  @Column({ nullable: true })
  deliveryPersonName: string;

  @Column({ nullable: true })
  deliveryPersonPhone: string;

  @OneToOne(() => Order, (order) => order.delivery)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

