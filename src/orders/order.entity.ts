import { ApiProperty } from "@nestjs/swagger";
import { Table, Model, Column, AllowNull, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/user.entity";

@Table
export class Order extends Model<Order> {
    @AllowNull(false)
    @Column({primaryKey: true})
    orderId: string;

    @AllowNull(false)
    @Column
    title: string

    @AllowNull(false)
    @Column
    deadline: Date

    @AllowNull(false)
    @Column
    pages: number;

    @AllowNull(false)
    @Column
    description: string;

    @AllowNull(false)
    @ForeignKey(() => TypeOfPaper)
    @Column
    typeOfPaperId: string;

    @AllowNull(false)
    @ForeignKey(() => OrderStatus)
    @Column
    orderStatusId: string;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column
    userId: string;
}

@Table
export class TypeOfPaper extends Model<TypeOfPaper> {
    @AllowNull(false)
    @Column({primaryKey: true})
    typeOfPaperId: string;

    @AllowNull(false)
    @Column
    name: string;
}

@Table
export class OrderStatus extends Model<OrderStatus> {
    @AllowNull(false)
    @Column({primaryKey: true})
    orderStatusId: string;

    @AllowNull(false)
    @Column
    name: string;
}

export class OrderDto {
    orderId: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    deadline: Date;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    description: string;

    @ApiProperty()
    typeOfPaperId: string;

    @ApiProperty()
    orderStatusId: string;

    userId: string;
}

export class TypeOfPaperDto {
    typeOfPaperId: string;
    
    @ApiProperty()
    name: string;
}

export class OrderStatusDto {
    orderStatusId: string;  

    @ApiProperty()
    name: string;
}