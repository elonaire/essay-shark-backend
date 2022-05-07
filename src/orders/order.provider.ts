import { ORDER_REPOSITORY, ORDER_TYPE_OF_PAPER, TYPE_OF_PAPER_REPOSITORY } from 'src/constants';
import { Order, OrderTypeOfPaper, TypeOfPaper } from './order.entity';

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
    provide: ORDER_TYPE_OF_PAPER,
    useValue: OrderTypeOfPaper
}
];
