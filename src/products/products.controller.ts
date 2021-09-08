import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTransactionsDto } from './dto/create-transaction.dto';
import { Products } from './products.entity';
import { ProductsService } from './products.service';
import { Transactions } from './transactions.entity';

@ApiTags('products')
@ApiCookieAuth()
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @ApiOperation({ summary: 'Getting all products' })
  @ApiResponse({ status: 200, type: Products })
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.productsService.getAllProducts();
  }
  //////////////////////////////////////////////////////////////////////

  @ApiOperation({ summary: 'Get all products in the store' })
  @ApiResponse({ status: 200, type: Products, description: 'write Name shop' })
  @UseGuards(JwtAuthGuard)
  @Get('shop/:shopName/:numberPage')
  getAllShopProduct(
    @Param('shopName') shopName: string,
    @Param('numberPage') numberPage: number
  ): Promise<Products[]> {
    return this.productsService.getAllShopProducts(shopName, numberPage);
  }

  @ApiOperation({ summary: 'Get all owner products in the store' })
  @ApiResponse({
    status: 200,
    type: Products,
    description: 'write id Shop_owner',
  })
  @UseGuards(JwtAuthGuard)
  @Get('owner/:ownerProduct')
  getAllOwnerProducts(
    @Param('ownerProduct') ownerProduct: number
  ): Promise<Products[]> {
    return this.productsService.getAllOwnerProducts(ownerProduct);
  }

  @ApiOperation({ summary: 'Product purchase request' })
  @ApiResponse({ status: 201, type: Transactions })
  @UseGuards(JwtAuthGuard)
  @Post('/buy')
  Buy(@Req() req, @Body() transactionDto: CreateTransactionsDto): Promise<any> {
    return this.productsService.createTransaction(
      req.user.userId,
      transactionDto
    );
  }

  @ApiOperation({ summary: ' All Buy RequestUser' })
  @ApiResponse({ status: 200, type: Transactions })
  @UseGuards(JwtAuthGuard)
  @Get('/allBuyRequestUser')
  BuyRequestUser(@Req() req): Promise<Transactions[]> {
    return this.productsService.getAllBuyRequestUser(req.user.userId);
  }

  @ApiOperation({ summary: ' All Buy User' })
  @ApiResponse({ status: 200, type: Transactions })
  @UseGuards(JwtAuthGuard)
  @Get('/allBuyUser')
  BuyUser(@Req() req): Promise<any> {
    return this.productsService.getAllBuyUser(req.user.userId);
  }
}
