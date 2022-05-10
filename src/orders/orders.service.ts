import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ORDER_REPOSITORY, ORDER_STATUS_REPOSITORY, TYPE_OF_PAPER_REPOSITORY } from 'src/constants';
import { Order, OrderDto, OrderStatus, OrderStatusDto, TypeOfPaper, TypeOfPaperDto } from './order.entity';
import { v4 as uuidGenerator } from 'uuid';
import { JwtService } from '@nestjs/jwt';

export interface JwtEncodedUser {
  sub: string;
  roles: string;
}

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY) private ordersRepository: typeof Order,
    @Inject(TYPE_OF_PAPER_REPOSITORY)
    private typeOfPaperRepo: typeof TypeOfPaper,
    private jwtService: JwtService,
    @Inject(ORDER_STATUS_REPOSITORY) private orderStatusRepo: typeof OrderStatus
  ) {}

  async createNewOrder(orderDetails: OrderDto, headers: any): Promise<Order> {
    const user: JwtEncodedUser = await this.jwtService.verifyAsync(
      headers.authorization.replace('Bearer ', ''),
      { secret: `${process.env.SECRET}` }
    );

    const foundTypeOfPaper = await this.typeOfPaperRepo.findOne({
      where: {
        typeOfPaperId: orderDetails.typeOfPaperId,
      },
    });

    if (!foundTypeOfPaper) {
      throw new HttpException('Invalid type of paper', 400);
    }

    const foundOrderStatus = await this.orderStatusRepo.findOne({
        where: {
            name: 'PENDING',
        }
    });

    if (!foundOrderStatus) {
        throw new HttpException('Invalid order status. Contact Admin', 400);
    }

    orderDetails.orderStatusId = foundOrderStatus.orderStatusId;
    orderDetails.orderId = uuidGenerator();
    orderDetails.userId = user.sub;

    const createdOrder: Order = await this.ordersRepository.create(
      orderDetails
    );

    if (!createdOrder) {
      throw new HttpException('Not created', 400);
    }

    return createdOrder;
  }

  async createTypeOfPaper(typeOfPaperInfo: TypeOfPaperDto) {
    typeOfPaperInfo.typeOfPaperId = uuidGenerator();

    const createdTypeOfPaper = this.typeOfPaperRepo.create(typeOfPaperInfo);

    if (!createdTypeOfPaper) {
      throw new HttpException('Not created', 400);
    }

    return createdTypeOfPaper;
  }

  async fetchOrders({ typeOfPaperId }): Promise<Order[]> {
    if (typeOfPaperId) {
      const typeOfPaper: TypeOfPaper = await this.typeOfPaperRepo.findOne({
        where: {
          typeOfPaperId,
        },
        include: ['orders'],
      });
      return await typeOfPaper['orders'];
    }
    return await this.ordersRepository.findAll({
      include: [{model: TypeOfPaper, as: 'typeOfPaper'}, {model: OrderStatus, as: 'status'}],
    });
  }

  async fetchPaperTypes(): Promise<TypeOfPaper[]> {
    return await this.typeOfPaperRepo.findAll();
  }

  async createOrderStatus(orderStatusInfo: OrderStatusDto): Promise<OrderStatus> {
    orderStatusInfo.orderStatusId = uuidGenerator();
    const createdStatus = await this.orderStatusRepo.create(orderStatusInfo);
    if (!createdStatus) {
        throw new HttpException('Not created', 400);
    }

    return createdStatus;
  }

  async fetchOrderStatuses(): Promise<OrderStatus[]> {
    return await this.orderStatusRepo.findAll();
  }
}
