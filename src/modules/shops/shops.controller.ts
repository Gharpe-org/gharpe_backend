import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  create(
    @Body() createShopDto: CreateShopDto & { ownerId?: string },
    @Query('ownerId') ownerId?: string,
  ) {
    // ownerId is required - must be a valid user ID
    // Can be provided in query parameter or request body
    const finalOwnerId = ownerId || createShopDto.ownerId;
    if (!finalOwnerId) {
      throw new Error('ownerId is required (provide in query ?ownerId=xxx or in request body)');
    }
    // Remove ownerId from DTO before passing to service
    const { ownerId: _, ...shopData } = createShopDto;
    return this.shopsService.create(shopData, finalOwnerId);
  }

  @Get()
  findAll() {
    return this.shopsService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.shopsService.search(query);
  }

  @Get('nearby')
  findNearby(
    @Query('lat') latitude: string,
    @Query('lng') longitude: string,
    @Query('radius') radius?: string,
  ) {
    return this.shopsService.findNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      radius ? parseFloat(radius) : 10,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShopDto: Partial<CreateShopDto>) {
    // Remove owner check for now
    return this.shopsService.update(id, updateShopDto, '');
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.shopsService.approve(id);
  }
}

