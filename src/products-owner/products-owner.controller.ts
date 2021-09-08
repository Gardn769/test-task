import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';
import { UpdateTransactionsDto } from 'src/products/dto/update-transaction.dto';
import { Products } from 'src/products/products.entity';
import { Transactions } from 'src/products/transactions.entity';
import { Shops } from 'src/shop/shop.entity';
import { ProductsOwnerService } from './products-owner.service';

@ApiTags('products-owner')
@Controller('products-owner')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
export class ProductsOwnerController {
  constructor(private productsOwnerService: ProductsOwnerService) {}

  @ApiOperation({
    summary: 'Create Product',
    description: 'Create Product in the store ',
  })
  @ApiResponse({ status: 201, type: CreateProductDto })
  @Post() //TODO:
  async create(@Req() req, @Body() productDto: CreateProductDto) {
    await this.productsOwnerService.checkShop(productDto.shop_name);
    await this.productsOwnerService.checkShopOwner(
      productDto.shop_name,
      req.user.userId
    );
    await this.productsOwnerService.createproduct(req.user.userId, productDto);

    return;
  }

  @ApiOperation({ summary: 'Get you shop revenue' })
  @ApiResponse({ status: 200, type: Shops })
  @Get('/shopsowner/revenue/:ShopName')
  async getShopsRevenue(
    @Req() req,
    @Param('ShopName') ShopName: string,
    @Query('from') from: Date,
    @Query('after') after: Date
  ): Promise<any> {
    await this.productsOwnerService.checkShopOwner(ShopName, req.user.userId);
    return await this.productsOwnerService.getShopRevenue(
      ShopName,
      from,
      after
    );
  }

  @ApiOperation({ summary: 'Change products in the store' })
  @ApiOkResponse({ description: 'ok' })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Req() req,
    @Body() updateProduct: UpdateProductDto
  ): Promise<any> {
    await this.productsOwnerService.checkProductOwner(id, req.user.userId);
    await this.productsOwnerService.updateProducts(id, updateProduct);

    // return
  }

  @ApiOperation({ summary: 'Get Shop Item Purchased' })
  @ApiResponse({ status: 200, type: Shops })
  @Get('/shopsowner/purchased/:ShopName')
  async getShopItemsPurchased(
    @Req() req,
    @Param('ShopName') ShopName: string,
    @Query('from') from: Date,
    @Query('after') after: Date
  ): Promise<any> {
    await this.productsOwnerService.checkShopOwner(ShopName, req.user.userId);
    return await this.productsOwnerService.getShopItemPurchased(
      ShopName,
      from,
      after
    );
  }

  @ApiOperation({ summary: 'Delete desired product in the store' })
  @ApiResponse({
    status: 200,
    type: Products,
    description: 'write id del product',
  })
  @Delete('/:delProductid')
  async deleteProduct(
    @Param('delProductid') delProductid: number,
    @Req() req
  ): Promise<void> {
    await this.productsOwnerService.checkProductOwner(
      delProductid,
      req.user.userId
    );
    this.productsOwnerService.deleteProduct(delProductid);

    // return
  }

  @ApiOperation({ summary: 'All Buy Request Owner' })
  @ApiResponse({ status: 200, type: Transactions })
  @Get('buyOwner')
  BuyRequestOwner(@Req() req): Promise<any> {
    return this.productsOwnerService.getAllBuyRequestOwner(req.user.userId);
  }

  @ApiOperation({ summary: 'reply to purchase request' })
  @ApiResponse({ status: 200, type: Transactions })
  @Patch('buyOwner/:id')
  async updateBuyRequestUser(
    @Param('id') id: number,
    @Req() req,
    @Body() updateTransactionsDto: UpdateTransactionsDto
  ): Promise<any> {
    await this.productsOwnerService.checkOwnertrans(id, req.user.userId);
    await this.productsOwnerService.updateBuyRequestUser(
      id,
      updateTransactionsDto
    );
  }
}
