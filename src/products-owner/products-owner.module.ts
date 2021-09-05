import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/products/products.entity';
import { Transactions } from 'src/products/transactions.entity';
import { Shops } from 'src/shop/shop.entity';
import { ProductsOwnerController } from './products-owner.controller';
import { ProductsOwnerService } from './products-owner.service';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Shops, Transactions])],
  controllers: [ProductsOwnerController],
  exports: [ProductsOwnerService],
  providers: [ProductsOwnerService],
})
export class ProductsOwnerModule {}
