import { ApiProperty } from "@nestjs/swagger";
import { Table, Model, Column, AllowNull, HasOne, HasMany, ForeignKey, BelongsToMany } from "sequelize-typescript";
import { File } from "src/file-upload/file.entity";

@Table
export class Order extends Model<Order> {
    @AllowNull(false)
    @Column({primaryKey: true})
    orderId: string;

    @AllowNull(false)
    @Column
    deadline: Date

    @AllowNull(false)
    @Column
    pages: number;

    @AllowNull(false)
    @Column
    description: string;

    @ForeignKey(() => TypeOfPaper)
    @Column
    typeOfPaperId: string;

    @HasMany(() => File)
    files: File[];
}

@Table
export class TypeOfPaper extends Model<TypeOfPaper> {
    @AllowNull(false)
    @Column({primaryKey: true})
    typeOfPaperId: string;

    @AllowNull(false)
    @Column
    name: string;

    @BelongsToMany(() => Order, () => OrderTypeOfPaper)
    orders: Order;
}

@Table
export class OrderTypeOfPaper extends Model<OrderTypeOfPaper> {
    @ForeignKey(() => Order)
    @Column
    orderId: string;

    @ForeignKey(() => TypeOfPaper)
    @Column
    typeOfPaperId: string;
}

export class OrderDto {
    orderId: string;

    @ApiProperty()
    deadline: Date;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    description: string;

    @ApiProperty()
    typeOfPaperId: string;
}

export class TypeOfPaperDto {
    typeOfPaperId: string;
    
    @ApiProperty()
    name: string;
}