import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { ShopController } from './shop/shop.controller';
import { ProductsController } from './products/products.controller';
import { AuthModule } from './auth/auth.module';
import { ShopModule } from './shop/shop.module';
import configuration from './configs/configuration';
import { AuthController } from './auth/auth.controller';
import { ProductsOwnerController } from './products-owner/products-owner.controller';
import { ProductsOwnerModule } from './products-owner/products-owner.module';

@Module({
  controllers: [
    AppController,
    AuthController,
    UsersController,
    ShopController,
    ProductsController,
    ProductsOwnerController,
  ],
  providers: [AppService],
  imports: [
    AuthModule,
    ProductsModule,
    UsersModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    ShopModule,
    ProductsOwnerModule,
  ],
})
export class AppModule {}
