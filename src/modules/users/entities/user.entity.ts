import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Shop } from '../../shops/entities/shop.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { Order } from '../../orders/entities/order.entity';

export enum UserRole {
  CUSTOMER = 'customer',
  SHOP_OWNER = 'shop_owner',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column('jsonb', { nullable: true })
  addresses: Array<{
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
  }>;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  facebookId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Shop, (shop) => shop.owner)
  shops: Shop[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}

