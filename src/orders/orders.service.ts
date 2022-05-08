import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ORDER_REPOSITORY, TYPE_OF_PAPER_REPOSITORY } from 'src/constants';
import { Order, OrderDto, TypeOfPaper, TypeOfPaperDto } from './order.entity';
import { v4 as uuidGenerator } from 'uuid';

@Injectable()
export class OrdersService {
    constructor(
        @Inject(ORDER_REPOSITORY) private ordersRepository: typeof Order,
        @Inject(TYPE_OF_PAPER_REPOSITORY) private typeOfPaperRepo: typeof TypeOfPaper
    ) {}

    async createNewOrder(orderDetails: OrderDto): Promise<Order> {
        const foundTypeOfPaper = await this.typeOfPaperRepo.findOne({
            where: {
                typeOfPaperId: orderDetails.typeOfPaperId
            }
        })

        if (!foundTypeOfPaper) {
            throw new HttpException('Invalid type of paper', 400)
        }

        orderDetails.orderId = uuidGenerator();

        const createdOrder: Order = await this.ordersRepository.create(orderDetails);

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

    async fetchOrders({typeOfPaperId}): Promise<Order[]> {
        if (typeOfPaperId) {
            const typeOfPaper: TypeOfPaper = await this.typeOfPaperRepo.findOne({
                where: {
                    typeOfPaperId,
                },
                include: ['orders']
            });
            return await typeOfPaper['orders'];
        }
        return await this.ordersRepository.findAll();
    }

    async fetchPaperTypes(): Promise<TypeOfPaper[]> {
        return await this.typeOfPaperRepo.findAll();
    }
}
