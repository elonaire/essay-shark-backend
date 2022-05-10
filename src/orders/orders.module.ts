import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { orderProviders } from './order.provider';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    secret: `${process.env.SECRET}`,
    signOptions: { expiresIn: '1h' },
  })],
  providers: [OrdersService, ...orderProviders],
  controllers: [OrdersController]
})
export class OrdersModule {}
