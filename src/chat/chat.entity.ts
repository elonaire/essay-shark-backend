import { AllowNull, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/user.entity";

@Table
export class Chat extends Model<Chat> {
    @Column({primaryKey: true})
    chatId: string;
}

@Table
export class Message extends Model<Message> {
    @Column({primaryKey: true})
    messageId: string;

    @Column
    chatId: string;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column
    user_id: string;

    @Column
    message: string;
}

@Table
export class UserChat extends Model<UserChat> {
    @ForeignKey(() => User)
    user_id: string;

    @ForeignKey(() => Chat)
    @Column
    chatId: string;
}