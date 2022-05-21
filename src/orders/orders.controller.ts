import { Body, Controller, Get, Post, Query, UseGuards, Headers, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Roles, AuthRole } from 'src/auth/roles.decorator';
import { BidDto, OrderDto, OrderStatusDto, TypeOfPaperDto } from './order.entity';
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
    @ApiQuery({ name: 'orderId', required: false})
    @Get('fetch-orders')
    fetchOrders(@Query('typeOfPaperId') typeOfPaperId?: string, @Query('orderId') orderId?: string) {
        return this.ordersService.fetchOrders({typeOfPaperId, orderId});
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

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('Authorization')
    @Patch('update-order')
    updateOrder(@Body() orderDetails: OrderDto) {
        return this.ordersService.updateOrder(orderDetails);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('Authorization')
    @Patch('update-type-of-paper/:typeOfPaperId')
    updateTypeOfPaper(@Body() typeOfPaperInfo: TypeOfPaperDto, @Param('typeOfPaperId') typeOfPaperId: string) {
        return this.ordersService.updateTypeOfPaper(typeOfPaperId, typeOfPaperInfo);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('Authorization')
    @Delete('delete-type-of-paper/:typeOfPaperId')
    deleteTypeOfPaper(@Param('typeOfPaperId') typeOfPaperId: string) {
        return this.ordersService.deleteTypeOfPaper(typeOfPaperId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('Authorization')
    @Post('place-bid')
    placeBid(@Body() bidInfo: BidDto) {
        return this.ordersService.placeBid(bidInfo);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('Authorization')
    @ApiQuery({ name: 'orderId', required: true})
    @Get('fetch-bids')
    fetchBids(@Query('orderId') orderId: string) {
        return this.ordersService.fetchBids({orderId});
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('Authorization')
    @Patch('update-bid/:bidId')
    updateBid(@Body() bidInfo: BidDto, @Param('bidId') bidId: string) {
        return this.ordersService.updateBid(bidInfo, bidId);
    }
}
