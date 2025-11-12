import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ShopsService } from '../shops/shops.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private shopsService: ShopsService,
  ) {}

  async create(createProductDto: CreateProductDto, shopId: string, userId?: string): Promise<Product> {
    // Owner check removed
    const product = this.productsRepository.create({
      ...createProductDto,
      shopId,
    });
    return this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['shop'],
      where: { isAvailable: true },
    });
  }

  async findByShop(shopId: string): Promise<Product[]> {
    return this.productsRepository.find({
      where: { shopId, isAvailable: true },
      relations: ['shop'],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['shop'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: Partial<CreateProductDto>, userId?: string): Promise<Product> {
    const product = await this.findOne(id);
    // Owner check removed
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: string, userId?: string): Promise<void> {
    const product = await this.findOne(id);
    // Owner check removed
    await this.productsRepository.remove(product);
  }
}

