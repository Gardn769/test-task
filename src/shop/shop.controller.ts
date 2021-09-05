import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TypeormExceptionFilter } from 'src/typeorm-exception.filter';
import { CreateShopDto } from './dto/create-shop.dto';
import { Shops } from './shop.entity';
import { ShopService } from './shop.service';

@ApiTags('shop')
@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Shop creation' })
  @ApiResponse({ status: 201, type: Shops })
  @UseFilters(TypeormExceptionFilter)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() shopDto: CreateShopDto) {
    return await this.shopService.createshop(req.user.userId, shopDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Getting all shop' })
  @ApiResponse({ status: 200, type: Shops })
  @UseGuards(JwtAuthGuard)
  @Get('/:numberPage')
  getAll(@Param('numberPage') numberPage: number) {
    return this.shopService.getAllShop(numberPage);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get all owner shops' })
  @ApiResponse({ status: 200, type: Shops })
  @UseGuards(JwtAuthGuard)
  @Get('/shopsowner')
  getAllShopProduct(@Req() req): Promise<Shops[]> {
    return this.shopService.getAllOwnerShop(req.user.userId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete desired shop' })
  @ApiResponse({ status: 200, type: Shops, description: 'write id del shop' })
  @UseGuards(JwtAuthGuard)
  @Delete('/:iddelShop')
  async deleteShop(@Param('iddelShop') iddelShop: number, @Req() req) {
    await this.shopService
      .checkOwner(iddelShop, req.user.userId)
      .then(() => {
        this.shopService.deleteshop(iddelShop);
      })
      .catch(e => {
        throw new HttpException(
          {
            message: 'not owner',
          },
          HttpStatus.BAD_REQUEST
        );
      });
    return `delete shop id=${iddelShop}`;
  }
}
