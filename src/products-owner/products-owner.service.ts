import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';
import { UpdateTransactionsDto } from 'src/products/dto/update-transaction.dto';
import { Products } from 'src/products/products.entity';
import { Transactions } from 'src/products/transactions.entity';
import { Shops } from 'src/shop/shop.entity';
import { Between, Repository } from 'typeorm';

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
    const product = await this.products.create({
      ...productDto,
      owner: id,
    });

    const check = await this.products.findOne({
      where: {
        name: product.name,
        description: product.description,
        shop_name: product.shop_name,
        cost: product.cost,
        purchase_price: product.purchase_price,
        owner: product.owner,
      },
    });

    if (check) {
      check.count += product.count;
      delete check.createAt;
      await this.products.update(check.id, check);
    } else {
      await this.products.save(product);
    }

    const trans = await this.products.findOne({
      where: {
        name: product.name,
        description: product.description,
        shop_name: product.shop_name,
        cost: product.cost,
        purchase_price: product.purchase_price,
        owner: product.owner,
      },
    });

    const saveID = trans.id;
    delete trans.id;
    await this.transaction.save({
      ...trans,
      count: product.count,
      owner: null,
      id_product: saveID,
      transaction_amount: -product.count * product.cost,
      id_purchaser: null,
      permission: true,
    });

    return product;
  }

  async getShopRevenue(
    shopName: string,
    from: Date,
    after: Date
  ): Promise<any> {
    const shop = await this.shop.findOneOrFail({
      where: {
        name: shopName,
        createAt: Between(from, after),
      },
    });

    const trans = await this.transaction.find({
      where: {
        shop_name: shopName,
        permission: true,
        updateAt: Between(from, after),
      },
    });
    for (const i of trans) {
      shop.revenue += i.transaction_amount;
    }

    return shop;
  }

  async updateProducts(
    id: number,
    productDto: UpdateProductDto
  ): Promise<void> {
    const product: UpdateProductDto = this.products.create({ ...productDto });
    await this.products.update(id, product);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.products.delete(id);
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
    const transact = await this.transaction.findOne(id);
    const product = await this.products.findOne(transact.id_product);

    if (product.count - transact.count < 0) {
      throw new HttpException('not enough products', HttpStatus.NOT_FOUND);
    }
    await this.transaction.update(id, trans);

    if (trans.permission) {
      product.count -= transact.count;
      this.updateProducts(transact.id_product, product);

      const shops = await this.shop.findOne({
        where: { name: transact.shop_name },
      });

      shops.revenue += transact.cost * transact.count;
      await this.shop.update(shops.id, shops);
    }
  }

  async checkProductOwner(idProduct: number, idowner: number): Promise<any> {
    console.log('checkProductOwner');
    return await this.products
      .findOneOrFail(idProduct, { select: ['owner'] })
      .then((product: Products) => {
        if (product.owner !== idowner)
          throw new HttpException('not owner', HttpStatus.NOT_FOUND);
      });
  }

  async checkShop(shop_name: string): Promise<any> {
    console.log('checkShop');

    return await this.shop
      .findOne({ where: { name: shop_name }, select: ['name'] })
      .catch(() => {
        throw new HttpException('Shop not created', HttpStatus.NOT_FOUND);
      });
  }

  async checkShopOwner(shop_name: string, idowner: number): Promise<any> {
    console.log('checkShopOwner');

    return await this.shop
      .findOneOrFail({ where: { name: shop_name } })
      .then((shops: Shops) => {
        if (shops.owner !== idowner) {
          throw new HttpException('not owner', HttpStatus.NOT_FOUND);
        }
      });
  }

  async checkOwnertrans(idTrans: number, idowner: number): Promise<any> {
    console.log('checkOwnertrans');
    return await this.transaction
      .findOne(idTrans, { select: ['owner'] })
      .then((trans: Transactions) => {
        if (trans.owner !== idowner)
          throw new HttpException('not owner', HttpStatus.NOT_FOUND);
      });
  }
}
