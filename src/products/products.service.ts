import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionsDto } from './dto/create-transaction.dto';
import { Products } from './products.entity';
import { Transactions } from './transactions.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private products: Repository<Products>,
    @InjectRepository(Transactions)
    private transaction: Repository<Transactions>
  ) {}

  async getAllProducts() {
    return await this.products.find();
  }

  async getAllShopProducts(shop_name: string, page: number, count = 5) {
    return await this.products.find({
      where: { shop_name: shop_name },
      skip: page * count,
      take: count,
    });
  }

  async getAllOwnerProducts(owner: number) {
    return await this.products.find({ where: { owner: owner } });
  }

  async createTransaction(
    id: number,
    transactionDto: CreateTransactionsDto
  ): Promise<any> {
    const product = await this.products.findOneOrFail(
      transactionDto.id_product
    );

    delete product.id;
    const transact = await this.transaction.create({
      ...product,
      ...transactionDto,
      transaction_amount: transactionDto.count * product.cost,
      id_purchaser: id,
    });
    return await this.transaction.save(transact);
  }

  async getAllBuyRequestUser(id_purchaser: number) {
    return await this.transaction.find({
      where: { id_purchaser: id_purchaser },
    });
  }

  async getAllBuyUser(id_purchaser: number) {
    return await this.transaction.find({
      where: { id_purchaser: id_purchaser, permission: true },
    });
  }
}
