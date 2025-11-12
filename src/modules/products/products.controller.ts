import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() body: CreateProductDto & { shopId: string }) {
    // Use default userId for now
    return this.productsService.create(body, body.shopId, '00000000-0000-0000-0000-000000000000');
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('shop/:shopId')
  findByShop(@Param('shopId') shopId: string) {
    return this.productsService.findByShop(shopId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: Partial<CreateProductDto>) {
    return this.productsService.update(id, updateProductDto, '00000000-0000-0000-0000-000000000000');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id, '00000000-0000-0000-0000-000000000000');
  }
}

