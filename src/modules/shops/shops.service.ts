import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './entities/shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private shopsRepository: Repository<Shop>,
  ) {}

  async create(createShopDto: CreateShopDto, ownerId: string): Promise<Shop> {
    const shop = this.shopsRepository.create({
      ...createShopDto,
      ownerId,
    });
    return this.shopsRepository.save(shop);
  }

  async findAll(): Promise<Shop[]> {
    return this.shopsRepository.find({
      where: { isApproved: true },
      relations: ['owner', 'products'],
    });
  }

  async findOne(id: string): Promise<Shop> {
    const shop = await this.shopsRepository.findOne({
      where: { id },
      relations: ['owner', 'products'],
    });
    if (!shop) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }
    return shop;
  }

  async search(query: string): Promise<Shop[]> {
    return this.shopsRepository
      .createQueryBuilder('shop')
      .where('shop.isApproved = :isApproved', { isApproved: true })
      .andWhere(
        '(shop.name ILIKE :query OR shop.description ILIKE :query OR shop.address ILIKE :query)',
        { query: `%${query}%` },
      )
      .leftJoinAndSelect('shop.products', 'products')
      .getMany();
  }

  async findNearby(latitude: number, longitude: number, radius: number = 10): Promise<Shop[]> {
    // Simple distance calculation (Haversine formula approximation)
    return this.shopsRepository
      .createQueryBuilder('shop')
      .where('shop.isApproved = :isApproved', { isApproved: true })
      .andWhere('shop.latitude IS NOT NULL')
      .andWhere('shop.longitude IS NOT NULL')
      .getMany()
      .then((shops) => {
        return shops
          .map((shop) => {
            const distance = this.calculateDistance(
              latitude,
              longitude,
              parseFloat(shop.latitude.toString()),
              parseFloat(shop.longitude.toString()),
            );
            return { shop, distance };
          })
          .filter((item) => item.distance <= radius)
          .sort((a, b) => a.distance - b.distance)
          .map((item) => item.shop);
      });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async approve(id: string): Promise<Shop> {
    const shop = await this.findOne(id);
    shop.isApproved = true;
    return this.shopsRepository.save(shop);
  }

  async update(id: string, updateShopDto: Partial<CreateShopDto>, userId?: string): Promise<Shop> {
    const shop = await this.findOne(id);
    // Owner check removed - all updates allowed
    Object.assign(shop, updateShopDto);
    return this.shopsRepository.save(shop);
  }
}

