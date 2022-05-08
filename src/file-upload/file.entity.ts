import { Table, Column, AllowNull, Model, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Order } from 'src/orders/order.entity';
import { User } from 'src/users/user.entity';

@Table
export class FileUpload extends Model<FileUpload> {
  // @Column({ primaryKey: true })
  // file_id: string;

  @AllowNull(false)
  @Column
  encoding: string;

  @AllowNull(false)
  @Column
  mimetype: string;

  @AllowNull(false)
  @Column
  destination: string;

  @AllowNull(false)
  @Column({ primaryKey: true })
  filename: string;

  @AllowNull(false)
  @Column
  path: string;

  @AllowNull(false)
  @Column
  size: number;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @ForeignKey(() => Order)
  @AllowNull(true)
  @Column
  orderId?: string;

  @BelongsTo(() => User)
  owner: User;

  @BelongsTo(() => Order)
  order: Order;
}


export class FileDto {
  encoding: string;

  mimetype: string;

  destination: string;

  filename: string;

  path: string;

  size: number;

  classification?: any;
}