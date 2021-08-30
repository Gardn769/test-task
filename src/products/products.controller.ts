import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseFilters, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TypeormExceptionFilter } from 'src/typeorm-exception.filter';
import { Transaction } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateTransactionsDto } from './dto/create-transaction.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateTransactionsDto } from './dto/update-transaction.dto';
import { Products } from './products.entity';
import { ProductsService } from './products.service';
import { Transactions } from './transactions.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {

    constructor( private productsService:ProductsService){}    

    @ApiCookieAuth()
    @ApiOperation({summary: 'Create Product'})
    @ApiResponse({status:200, type:CreateProductDto})
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Req() req, @Body() productDto:CreateProductDto){

        await this.productsService.checkShop(productDto.shop_name)
        // await this.productsService.checkOwner( req.user.userId)
        .then(()=> {  this.productsService.createproduct(req.user.userId, productDto);})
        .catch((e)=>{
            throw new HttpException({
                message: 'not owner'
            }, HttpStatus.BAD_REQUEST);
        });
        
        // await this.productsService.createproduct(req.user.userId, productDto);
        return
    }


    @ApiCookieAuth()
    @ApiOperation({summary: 'Getting all products'})
    @ApiResponse({status:200, type:Products})
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(){
        return this.productsService.getAllProducts();
    }

    @ApiCookieAuth()
    @ApiOperation({summary: 'Get all products in the store'})
    @ApiResponse({status:200, type:Products, description:'write Name shop'})
    @UseGuards(JwtAuthGuard)
    @Get('shop/:shopName')
    getAllShopProduct(@Param('shopName') shopName: string){

        return this.productsService.getAllShopProducts(shopName);
    }


    @ApiCookieAuth()
    @ApiOperation({summary: 'Get all owner products in the store'})
    @ApiResponse({status:200, type:Products, description:'write id Shop_owner'})
    @UseGuards(JwtAuthGuard)
    @Get('owner/:ownerProduct')
    getAllOwnerProducts(@Param('ownerProduct') ownerProduct: number){

        return this.productsService.getAllOwnerProducts(ownerProduct);
    }


    @ApiCookieAuth()
    @ApiOperation({summary: 'Change products in the store'})
    @ApiOkResponse({description: 'ok'})
    @UseGuards(JwtAuthGuard)
    @Put(':id') 
    async update(@Param('id') id: number, @Req() req, @Body() updateProduct: UpdateProductDto) {
        
        await this.productsService.checkOwner(id, req.user.userId)
        .then(()=> { this.productsService.updateProducts(id, updateProduct);})
        .catch((e)=>{
            throw new HttpException({
                message: 'not owner'
            }, HttpStatus.BAD_REQUEST);
        });
    
    }


    
    @ApiCookieAuth()
    @ApiOperation({summary: 'Delete desired product in the store'})
    @ApiResponse({status:200, type:Products, description:'write id del product'})
    @UseGuards(JwtAuthGuard)
    @Delete('/:delProductid')
    async deleteProduct(@Param('delProductid') delProductid: number, @Req() req){
        await this.productsService.checkOwner(delProductid, req.user.userId)
        .then(()=> { this.productsService.deleteProduct(delProductid);})
        .catch((e)=>{
            throw new HttpException({
                message: 'not owner'
            }, HttpStatus.BAD_REQUEST);
        });

        // return 
    }



    @ApiCookieAuth()
    @ApiOperation({summary: 'Product purchase request'})
    @ApiResponse({status:200, type:Transactions})
    @UseGuards(JwtAuthGuard)
    @UseFilters(TypeormExceptionFilter)
    @Post('/buy')
    Buy(@Req() req, @Body() transactionDto:CreateTransactionsDto){        
        return this.productsService.createTransaction(req.user.userId, transactionDto);
    }


    @ApiCookieAuth()
    @ApiOperation({summary: ' All Buy RequestUser'})
    @ApiResponse({status:200, type:Transactions})
    @UseGuards(JwtAuthGuard)
    @Get('/allBuyRequestUser')
    BuyRequestUser(@Req() req){       
        return this.productsService.getAllBuyRequestUser(req.user.userId);
    }

    @ApiCookieAuth()
    @ApiOperation({summary: ' All Buy User'})
    @ApiResponse({status:200, type:Transactions})
    @UseGuards(JwtAuthGuard)
    @Get('/allBuyUser')
    BuyUser(@Req() req){      
        return this.productsService.getAllBuyUser(req.user.userId);
    }

    @ApiCookieAuth()
    @ApiOperation({summary: 'All Buy Request Owner'})
    @ApiResponse({status:200, type:Transactions})
    @UseGuards(JwtAuthGuard)
    @Get('buyOwner')
    BuyRequestOwner(@Req() req){
        // console.log(req.user.userId);
        return this.productsService.getAllBuyRequestOwner(req.user.userId);
    }



    @ApiCookieAuth()
    @ApiOperation({summary: 'reply to purchase request'})
    @ApiResponse({status:200, type:Transactions})
    @UseGuards(JwtAuthGuard)
    @Put('buyOwner/:id') 
    async updateBuyRequestUser(@Param('id') id: number, @Req() req, @Body() updateTransactionsDto: UpdateTransactionsDto) {

        await this.productsService.checkOwnertrans(id, req.user.userId)
        .then(()=> { this.productsService.updateBuyRequestUser(id, updateTransactionsDto);})
        .catch((e)=>{
            throw new HttpException({
                message: 'not owner'
            }, HttpStatus.BAD_REQUEST);
        });    
    }




}
