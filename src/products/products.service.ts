/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shops } from 'src/shop/shop.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateTransactionsDto } from './dto/create-transaction.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateTransactionsDto } from './dto/update-transaction.dto';
import { Products } from './products.entity';
import { Transactions } from './transactions.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Products)
        private  products:Repository<Products>,       
        @InjectRepository(Transactions)
        private  transaction:Repository<Transactions>, 
        @InjectRepository(Shops)
        private  shop:Repository<Shops>
    ){}

    async createproduct(id: number,productDto:CreateProductDto){
        
        let x = this.products.create({
        ...productDto,
            owner: id,
        })
        this.products.save(x)
        let [shops] = await this.shop.find({where: {name:x.shop_name}});
        shops.revenue-=x.purchase_price*x.count;
        await this.shop.update(shops.id, shops);

    return 
    }

    async getAllProducts(){
        return await this.products.find();
    }

    async getAllShopProducts(shop_name: string){        
        return await this.products.find({where: {shop_name:shop_name}});
    }

    async getAllOwnerProducts(owner:number){
        return await this.products.find({where: {owner:owner}});
    }

    async updateProducts(id: number, productDto: UpdateProductDto): Promise<void> {
        const product:UpdateProductDto = this.products.create({...productDto});    
        await this.products.update(id, product);        
    }

    async deleteProduct(id: number): Promise<void> {
        this.products.delete(id);
    }

    async checkOwner(idProduct: number, idowner: number): Promise<any> {
        return this.products.findOne(idProduct, {select: ['owner']})
        .then((shop: Products) => {
        if (shop.owner !== idowner) 
            throw 'not owner';
        });
    }

    async checkShop(shop_name: string): Promise<any> {       

        return this.shop.findOne({where: {name:shop_name}, select: ['name']})
        .then((shop: Shops) => {
        if (shop.name !== shop_name) 
            throw 'Shop not created';
        });
    }


    async createTransaction(id: number,transactionDto:CreateTransactionsDto): Promise<any> {
        
        let product= await this.products.findOne(transactionDto.id_product);        
        
        let x = this.transaction.create({
            ...product,
        ...transactionDto,
            id_purchaser: id,
        });             
        
    return  this.transaction.save(x);
    }

    async getAllBuyRequestUser(id_purchaser:number){
        return await this.transaction.find({where: {id_purchaser:id_purchaser}});
    }

    async getAllBuyRequestOwner(owner:number){
        return await this.transaction.find({where: {owner:owner,permission:null}});
    }

    async updateBuyRequestUser(id: number,updatetransactionDto:UpdateTransactionsDto){

        const trans:UpdateTransactionsDto = this.transaction.create({...updatetransactionDto});    
        await this.transaction.update(id, trans)

        if (trans.permission) {
            let transact = await this.transaction.findOne(id);

            let product = await this.products.findOne(transact.id_product);
            product.count -= transact.count;
            this.updateProducts (transact.id_product, product)

            let shops = await this.shop.findOne({where: {name:transact.shop_name}});
        
            shops.revenue+=transact.cost*transact.count;
            await this.shop.update(shops.id, shops);
        
        }
    }


    async checkOwnertrans(idTrans: number, idowner: number): Promise<any> {
        return this.transaction.findOne(idTrans, {select: ['owner']})
        .then((trans: Transactions) => {
        if (trans.owner !== idowner) 
            throw 'not owner';
        });
    }

    async getAllBuyUser(id_purchaser:number){
        return await this.transaction.find({where: {id_purchaser:id_purchaser,permission:true}});
    }

}
