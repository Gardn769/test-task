import { ProductsService } from './products.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { ProductsController } from './products.controller';
import { Shops } from 'src/shop/shop.entity';
import { Transactions } from './transactions.entity';

@Module({
    imports: [  TypeOrmModule.forFeature([Products,Shops,Transactions]),],
    controllers: [ProductsController],
    exports: [ProductsService],
    providers: [
        ProductsService, ],
})
export class ProductsModule {}
