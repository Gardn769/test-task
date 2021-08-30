import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/products/products.entity';
import { ShopController } from './shop.controller';
import { Shops } from './shop.entity';
import { ShopService } from './shop.service';

@Module({
  controllers: [ShopController],
  providers: [ShopService],
  imports:[
    TypeOrmModule.forFeature([Shops,Products])
],
  exports:[ShopService]
})
export class ShopModule {}
