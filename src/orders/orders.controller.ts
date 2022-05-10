import { Body, Controller, Get, Post, Query, UseGuards, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Roles, AuthRole } from 'src/auth/roles.decorator';
import { OrderDto, OrderStatusDto, TypeOfPaperDto } from './order.entity';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('Authorization')
    @Post('create-order')
    createOrder(@Body() orderDetails: OrderDto, @Headers() headers?: any) {
        return this.ordersService.createNewOrder(orderDetails, headers);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('Authorization')
    @Roles(AuthRole.Admin)
    @Post('create-type-of-paper')
    createTypeOfPaper(@Body() typeOfPaperInfo: TypeOfPaperDto) {
        return this.ordersService.createTypeOfPaper(typeOfPaperInfo);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('Authorization')
    @ApiQuery({ name: 'typeOfPaperId', required: false})
    @Get('fetch-orders')
    fetchOrders(@Query('typeOfPaperId') typeOfPaperId?: string) {
        return this.ordersService.fetchOrders({typeOfPaperId});
    }

    @Get('fetch-paper-types')
    fetchPaperTypes() {
        return this.ordersService.fetchPaperTypes();
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('Authorization')
    @Post('create-order-status')
    createOrderStatus(@Body() orderStatusInfo: OrderStatusDto) {
        return this.ordersService.createOrderStatus(orderStatusInfo);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('Authorization')
    @Get('fetch-order-statuses')
    fetchOrderStatuses() {
        return this.ordersService.fetchOrderStatuses();
    }
}
