import { BID_REPOSITORY, ORDER_REPOSITORY, ORDER_STATUS_REPOSITORY, TYPE_OF_PAPER_REPOSITORY } from 'src/constants';
import { TypeOfPaper, Order, OrderStatus, Bid } from './order.entity';

export const orderProviders = [
  {
    provide: ORDER_REPOSITORY,
    useValue: Order,
  },
  {
      provide: TYPE_OF_PAPER_REPOSITORY,
      useValue: TypeOfPaper
  },
  {
    provide: ORDER_STATUS_REPOSITORY,
    useValue: OrderStatus,
  },
  {
    provide: BID_REPOSITORY,
    useValue: Bid,
  }
];
