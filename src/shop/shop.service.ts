import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShopDto } from './dto/create-shop.dto';
import { Shops } from './shop.entity';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shops)
    private shops: Repository<Shops>
  ) {}

  async createshop(id: number, ShopsDto: CreateShopDto): Promise<any> {
    const x = this.shops.create({
      ...ShopsDto,
      owner: id,
    });
    return this.shops.save(x);
  }

  async getAllShop(page: number, count = 2): Promise<Shops[]> {
    return await this.shops.find({
      skip: page * count,
      take: count,
      select: ['name', 'description', 'owner'],
    });
  }

  async getAllOwnerShop(owner: number): Promise<Shops[]> {
    return await this.shops.find({ where: { owner: owner } });
  }

  async deleteshop(id: number): Promise<any> {
    return await this.shops.delete(id);
  }

  async checkOwner(idShop: number, idOwner: number): Promise<any> {
    return this.shops
      .findOne(idShop, { select: ['owner'] })
      .then((shop: Shops) => {
        if (shop.owner !== idOwner)
          throw new HttpException('not owner', HttpStatus.NOT_FOUND);
      });
  }
}
