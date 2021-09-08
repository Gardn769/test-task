import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() shopDto: CreateShopDto) {
    return await this.shopService.createshop(req.user.userId, shopDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Getting all shop' })
  @ApiResponse({ status: 200, type: Shops })
  @UseGuards(JwtAuthGuard)
  @Get('/all/:numberPage')
  async getAll(@Param('numberPage', ParseIntPipe) numberPage: number) {
    return await this.shopService.getAllShop(numberPage);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get All your stores ' })
  @ApiResponse({ status: 200, type: Shops })
  @UseGuards(JwtAuthGuard)
  @Get('/shopsowner')
  async getAllOwnerShops(@Req() req): Promise<Shops[]> {
    return await this.shopService.getAllOwnerShop(req.user.userId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete desired shop' })
  @ApiResponse({ status: 200, type: Shops, description: 'write id del shop' })
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:iddelShop')
  async deleteShop(
    @Param('iddelShop', ParseIntPipe) iddelShop: number,
    @Req() req
  ) {
    await this.shopService.checkOwner(iddelShop, req.user.userId);
    this.shopService.deleteshop(iddelShop);

    return `delete shop id=${iddelShop}`;
  }
}
