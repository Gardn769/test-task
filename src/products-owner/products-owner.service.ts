import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';
import { UpdateTransactionsDto } from 'src/products/dto/update-transaction.dto';
import { Products } from 'src/products/products.entity';
import { Transactions } from 'src/products/transactions.entity';
import { Shops } from 'src/shop/shop.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsOwnerService {
  constructor(
    @InjectRepository(Products)
    private products: Repository<Products>,
    @InjectRepository(Transactions)
    private transaction: Repository<Transactions>,
    @InjectRepository(Shops)
    private shop: Repository<Shops>
  ) {}

  async createproduct(id: number, productDto: CreateProductDto) {
    const x = this.products.create({
      ...productDto,
      owner: id,
    });
    this.products.save(x);
    const [shops] = await this.shop.find({ where: { name: x.shop_name } });
    shops.revenue -= x.purchase_price * x.count;
    await this.shop.update(shops.id, shops);

    return;
  }

  async updateProducts(
    id: number,
    productDto: UpdateProductDto
  ): Promise<void> {
    const product: UpdateProductDto = this.products.create({ ...productDto });
    await this.products.update(id, product);
  }

  async deleteProduct(id: number): Promise<void> {
    this.products.delete(id);
  }

  async getAllBuyRequestOwner(owner: number) {
    return await this.transaction.find({
      where: { owner: owner, permission: null },
    });
  }

  async updateBuyRequestUser(
    id: number,
    updatetransactionDto: UpdateTransactionsDto
  ): Promise<any> {
    const trans: UpdateTransactionsDto = this.transaction.create({
      ...updatetransactionDto,
    });
    await this.transaction.update(id, trans);

    if (trans.permission) {
      const transact = await this.transaction.findOne(id);

      const product = await this.products.findOne(transact.id_product);
      product.count -= transact.count;
      this.updateProducts(transact.id_product, product);

      const shops = await this.shop.findOne({
        where: { name: transact.shop_name },
      });

      shops.revenue += transact.cost * transact.count;
      await this.shop.update(shops.id, shops);
    }
  }

  async checkOwner(idProduct: number, idowner: number): Promise<any> {
    return this.products
      .findOne(idProduct, { select: ['owner'] })
      .then((shop: Products) => {
        if (shop.owner !== idowner)
          throw new HttpException('not owner', HttpStatus.NOT_FOUND);
      });
  }

  async checkShop(shop_name: string): Promise<any> {
    return this.shop
      .findOne({ where: { name: shop_name }, select: ['name'] })
      .then((shop: Shops) => {
        if (shop.name !== shop_name)
          throw new HttpException('Shop not created', HttpStatus.NOT_FOUND);
      });
  }

  async checkOwnertrans(idTrans: number, idowner: number): Promise<any> {
    return this.transaction
      .findOne(idTrans, { select: ['owner'] })
      .then((trans: Transactions) => {
        if (trans.owner !== idowner)
          throw new HttpException('not owner', HttpStatus.NOT_FOUND);
      });
  }
}
