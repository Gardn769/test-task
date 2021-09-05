import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { ProductsOwnerService } from './products-owner.service';

@ApiTags('products-owner')
@Controller('products-owner')
export class ProductsOwnerController {
  constructor(private productsOwnerService: ProductsOwnerService) {}

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create Product' })
  @ApiResponse({ status: 201, type: CreateProductDto })
  @UseGuards(JwtAuthGuard)
  @Post() //TODO:
  async create(@Req() req, @Body() productDto: CreateProductDto) {
    await this.productsOwnerService
      .checkShop(productDto.shop_name)
      // await this.productsService.checkOwner( req.user.userId)
      .then(() => {
        this.productsOwnerService.createproduct(req.user.userId, productDto);
      })
      .catch(e => {
        throw new HttpException(
          {
            message: 'not owner',
          },
          HttpStatus.BAD_REQUEST
        );
      });

    // await this.productsService.createproduct(req.user.userId, productDto);
    return;
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Change products in the store' })
  @ApiOkResponse({ description: 'ok' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Req() req,
    @Body() updateProduct: UpdateProductDto
  ): Promise<any> {
    await this.productsOwnerService
      .checkOwner(id, req.user.userId)
      .then(() => {
        this.productsOwnerService.updateProducts(id, updateProduct);
      })
      .catch(e => {
        throw new HttpException(
          {
            message: 'not owner',
          },
          HttpStatus.BAD_REQUEST
        );
      });
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete desired product in the store' })
  @ApiResponse({
    status: 200,
    type: Products,
    description: 'write id del product',
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/:delProductid')
  async deleteProduct(
    @Param('delProductid') delProductid: number,
    @Req() req
  ): Promise<void> {
    await this.productsOwnerService
      .checkOwner(delProductid, req.user.userId)
      .then(() => {
        this.productsOwnerService.deleteProduct(delProductid);
      })
      .catch(e => {
        throw new HttpException(
          {
            message: 'not owner',
          },
          HttpStatus.BAD_REQUEST
        );
      });

    // return
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'All Buy Request Owner' })
  @ApiResponse({ status: 200, type: Transactions })
  @UseGuards(JwtAuthGuard)
  @Get('buyOwner')
  BuyRequestOwner(@Req() req): Promise<any> {
    return this.productsOwnerService.getAllBuyRequestOwner(req.user.userId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'reply to purchase request' })
  @ApiResponse({ status: 200, type: Transactions })
  @UseGuards(JwtAuthGuard)
  @Put('buyOwner/:id')
  async updateBuyRequestUser(
    @Param('id') id: number,
    @Req() req,
    @Body() updateTransactionsDto: UpdateTransactionsDto
  ): Promise<any> {
    await this.productsOwnerService
      .checkOwnertrans(id, req.user.userId)
      .then(() => {
        this.productsOwnerService.updateBuyRequestUser(
          id,
          updateTransactionsDto
        );
      })
      .catch(e => {
        throw new HttpException(
          {
            message: 'not owner',
          },
          HttpStatus.BAD_REQUEST
        );
      });
  }
}
