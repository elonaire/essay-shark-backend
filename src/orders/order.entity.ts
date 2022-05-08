import { ApiProperty } from "@nestjs/swagger";
import { Table, Model, Column, AllowNull, ForeignKey } from "sequelize-typescript";

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

    @ForeignKey(() => TypeOfPaper)
    @Column
    typeOfPaperId: string;
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
}

export class TypeOfPaperDto {
    typeOfPaperId: string;
    
    @ApiProperty()
    name: string;
}