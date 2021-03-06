import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  BID_REPOSITORY,
  ORDER_REPOSITORY,
  ORDER_STATUS_REPOSITORY,
  TYPE_OF_PAPER_REPOSITORY,
} from 'src/constants';
import {
  Bid,
  BidDto,
  Order,
  OrderDto,
  OrderStatus,
  OrderStatusDto,
  TypeOfPaper,
  TypeOfPaperDto,
} from './order.entity';
import { v4 as uuidGenerator } from 'uuid';
import { JwtService } from '@nestjs/jwt';

export interface JwtEncodedUser {
  sub: string;
  roles: string;
}

export interface FetchOrder { 
  typeOfPaperId?: string;
  orderId?: string;
}

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY) private ordersRepository: typeof Order,
    @Inject(TYPE_OF_PAPER_REPOSITORY)
    private typeOfPaperRepo: typeof TypeOfPaper,
    private jwtService: JwtService,
    @Inject(ORDER_STATUS_REPOSITORY) private orderStatusRepo: typeof OrderStatus,
    @Inject(BID_REPOSITORY) private bidsRepository: typeof Bid,
  ) {}

  /**
   * Create order
   * @param orderDetails Order details
   * @param headers
   * @returns Order
   */
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
      },
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

  /**
   * create type of paper
   * @param typeOfPaperInfo Type of paper info
   * @returns
   */
  async createTypeOfPaper(
    typeOfPaperInfo: TypeOfPaperDto
  ): Promise<TypeOfPaper> {
    typeOfPaperInfo.typeOfPaperId = uuidGenerator();

    const createdTypeOfPaper = this.typeOfPaperRepo.create(typeOfPaperInfo);

    if (!createdTypeOfPaper) {
      throw new HttpException('Not created', 400);
    }

    return createdTypeOfPaper;
  }

  /**
   * Update type of paper
   * @param typeOfPaperId 
   * @param typeOfPaperInfo 
   * @returns 
   */
  async updateTypeOfPaper(
    typeOfPaperId: string,
    typeOfPaperInfo: TypeOfPaperDto
  ): Promise<TypeOfPaper> {
    const foundTypeOfPaper = await this.typeOfPaperRepo.findOne({
      where: {
        typeOfPaperId,
      },
    });

    if (!foundTypeOfPaper) {
      throw new HttpException('Invalid type of paper', 400);
    }

    const updatedTypeOfPaper = await this.typeOfPaperRepo.update(typeOfPaperInfo, 
      {
        where: {
          typeOfPaperId
        }
      }
    );

    if (!updatedTypeOfPaper) {
      throw new HttpException('Not updated', 400);
    }

    return await this.typeOfPaperRepo.findOne({
      where: {
        typeOfPaperId,
      },
    });
  }

  /**
   * delete type of paper
   * @param typeOfPaperId 
   * @returns 
   */
  async deleteTypeOfPaper(typeOfPaperId: string): Promise<TypeOfPaper> {
    const foundTypeOfPaper = await this.typeOfPaperRepo.findOne({
      where: {
        typeOfPaperId,
      },
    });

    if (!foundTypeOfPaper) {
      throw new HttpException('Invalid type of paper', 400);
    }

    const deletedTypeOfPaper = await this.typeOfPaperRepo.destroy({
      where: {
        typeOfPaperId,
      },
    });

    if (!deletedTypeOfPaper) {
      throw new HttpException('Not deleted', 400);
    }

    return foundTypeOfPaper;
  }

  /**
   * Fetch all orders, by id or by type of paper
   * @param param0
   * @returns Promise<Order[] | Order>
   */
  async fetchOrders({ typeOfPaperId, orderId }: FetchOrder): Promise<Order[] | Order> {
    if (typeOfPaperId) {
      const typeOfPaper: TypeOfPaper = await this.typeOfPaperRepo.findOne({
        where: {
          typeOfPaperId,
        },
        include: ['orders'],
      });
      return await typeOfPaper['orders'];
    }

    if (orderId) {
      const order: Order = await this.ordersRepository.findOne({
        where: {
          orderId,
        },
        include: ['status', 'user', 'typeOfPaper', { model: Bid, as: 'bids' },],
      });

      if (!order) {
        throw new HttpException('Invalid order id', 400);
      }

      return order;
    }

    return await this.ordersRepository.findAll({
      include: [
        { model: TypeOfPaper, as: 'typeOfPaper' },
        { model: OrderStatus, as: 'status' },
      ],
    });
  }

  /**
   * Fetch all type of papers
   * @returns Promise<TypeOfPaper[]>
   */
  async fetchPaperTypes(): Promise<TypeOfPaper[]> {
    return await this.typeOfPaperRepo.findAll();
  }

  /**
   * Create order status
   * @param orderStatusInfo Order status info
   * @returns
   */
  async createOrderStatus(
    orderStatusInfo: OrderStatusDto
  ): Promise<OrderStatus> {
    orderStatusInfo.orderStatusId = uuidGenerator();
    const createdStatus = await this.orderStatusRepo.create(orderStatusInfo);
    if (!createdStatus) {
      throw new HttpException('Not created', 400);
    }

    return createdStatus;
  }

  /**
   * Fetch all order statuses
   * @returns Promise<OrderStatus[]>
   */
  async fetchOrderStatuses(): Promise<OrderStatus[]> {
    return await this.orderStatusRepo.findAll();
  }

  /**
   * Update order details
   * @param orderInfo Order info
   * @returns
   */
  async updateOrder(orderInfo: OrderDto): Promise<Order> {
    const foundOrder = await this.ordersRepository.findOne({
      where: {
        orderId: orderInfo.orderId,
      },
      include: ['status', 'user', 'typeOfPaper'],
    });

    if (!foundOrder) {
      throw new HttpException('Invalid order id', 400);
    }

    if (orderInfo.typeOfPaperId) {
      const foundTypeOfPaper = await this.typeOfPaperRepo.findOne({
        where: {
          typeOfPaperId: orderInfo.typeOfPaperId,
        },
      });

      if (!foundTypeOfPaper) {
        throw new HttpException('Invalid type of paper', 400);
      }
      orderInfo.typeOfPaperId = foundTypeOfPaper.typeOfPaperId;
    }

    if (orderInfo.orderStatusId) {
      const foundOrderStatus = await this.orderStatusRepo.findOne({
        where: {
          orderStatusId: orderInfo.orderStatusId,
        },
      });

      if (!foundOrderStatus) {
        throw new HttpException('Invalid order status. Contact Admin', 400);
      }

      orderInfo.orderStatusId = foundOrderStatus.orderStatusId;
    }

    const updatedOrder = await this.ordersRepository.update(orderInfo, {
      where: {
        orderId: orderInfo.orderId,
      },
    });

    if (!updatedOrder[0]) {
      throw new HttpException('Not updated', 400);
    }

    return await this.ordersRepository.findOne({
      where: {
        orderId: orderInfo.orderId,
      },
      include: ['status', 'user', 'typeOfPaper'],
    });
  }

  /**
   * place Bid
   * @param bidInfo 
   * @returns 
   */
  async placeBid(bidInfo: BidDto): Promise<Bid> {
    const foundOrder = await this.ordersRepository.findOne({
      where: {
        orderId: bidInfo.orderId,
      },
      include: ['status', 'user', 'typeOfPaper'],
    });

    if (!foundOrder) {
      throw new HttpException('Invalid order id', 400);
    }

    const foundBid = await this.bidsRepository.findOne({
      where: {
        orderId: bidInfo.orderId,
      },
    });

    if (foundBid) {
      throw new HttpException('Bid already placed', 400);
    }

    bidInfo.bidId = uuidGenerator();
    const createdBid = await this.bidsRepository.create(bidInfo);

    if (!createdBid) {
      throw new HttpException('Not created', 400);
    }

    return createdBid;
  }

  async updateBid(bidInfo: BidDto, bidId: string): Promise<Bid> {
    const foundBid = await this.bidsRepository.findOne({
      where: {
        bidId,
      },
    });

    if (!foundBid) {
      throw new HttpException('Invalid bid id', 400);
    }

    const orderFound = await this.fetchOrders({ orderId: bidInfo.orderId });

    if (!orderFound) {
      throw new HttpException('Invalid order id', 400);
    }

    const updatedBid = await this.bidsRepository.update(bidInfo, {
      where: {
        bidId: bidInfo.bidId,
      },
    });

    if (!updatedBid[0]) {
      throw new HttpException('Not updated', 400);
    }

    const foundOrderStatus = await this.orderStatusRepo.findOne({
      where: {
        name: 'ASSIGNED',
      },
    });

    if (!foundOrderStatus) {
      throw new HttpException('Invalid order status. Contact Admin', 400);
    }

    await this.ordersRepository.update({
      orderStatusId: foundOrderStatus.orderStatusId,
    }, {
      where: {
        orderId: bidInfo.orderId,
      }
    });

    return await this.bidsRepository.findOne({
      where: {
        bidId: bidInfo.bidId,
      },
    });
  }

  async fetchBids({orderId}): Promise<Bid[]> {
    const foundOrder = await this.ordersRepository.findOne({
      where: {
        orderId,
      },
      include: ['status', 'user', 'typeOfPaper'],
    });

    if (!foundOrder) {
      throw new HttpException('Invalid order id', 400);
    }

    return await this.bidsRepository.findAll({
      where: {
        orderId,
      },
    });
  }
}
