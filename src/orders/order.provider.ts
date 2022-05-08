import { ORDER_REPOSITORY, TYPE_OF_PAPER_REPOSITORY } from 'src/constants';
import { TypeOfPaper, Order } from './order.entity';

export const orderProviders = [
  {
    provide: ORDER_REPOSITORY,
    useValue: Order,
  },
  {
      provide: TYPE_OF_PAPER_REPOSITORY,
      useValue: TypeOfPaper
  },
];
