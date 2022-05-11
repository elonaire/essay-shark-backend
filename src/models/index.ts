import { Sequelize } from 'sequelize-typescript';
import { Chat, Message, UserChat } from 'src/chat/chat.entity';
import { SEQUELIZE } from 'src/constants';
import { FileUpload } from 'src/file-upload/file.entity';
import { Order, OrderStatus, TypeOfPaper } from 'src/orders/order.entity';
import { Role, User, UserRole } from 'src/users/user.entity';

export const globalDBProvider = {
  provide: SEQUELIZE,
  useFactory: async (): Promise<Sequelize> => {
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PWD,
      database: process.env.DATABASE,
    });
    sequelize.addModels([
      User,
      Role,
      UserRole,
      FileUpload,
      Order,
      TypeOfPaper,
      OrderStatus,
      Chat,
      Message,
      UserChat,
    ]);

    Order.hasMany(FileUpload, {
      as: 'files',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    
    Order.belongsTo(TypeOfPaper, {
      as: 'typeOfPaper',
      foreignKey: 'typeOfPaperId',
    });
    
    TypeOfPaper.hasMany(Order, {
      as: 'orders',
      foreignKey: 'typeOfPaperId',
    });

    Order.belongsTo(OrderStatus, {
      as: 'status',
      foreignKey: 'orderStatusId',
    })

    OrderStatus.hasMany(Order, {
      as: 'orders',
      foreignKey: 'orderStatusId',
    });

    User.hasMany(Order, {
      as: 'orders',
      foreignKey: 'userId',
    });

    Order.belongsTo(User, {
      as: 'user',
      foreignKey: 'userId',
    });

    Chat.hasMany(Message, {
      as: 'messages',
    });

    Message.belongsTo(Chat, {
      as: 'chat',
      foreignKey: 'chatId',
    });

    User.belongsToMany(Chat, {
      as: 'chats',
      through: UserChat,
    });

    Chat.belongsToMany(User, {
      as: 'users',
      through: UserChat,
    });

    Message.belongsTo(User, {
      as: 'sender',
      foreignKey: 'user_id',
    });

    User.hasMany(Message, {
      as: 'messages',
      foreignKey: 'user_id',
    })
    await sequelize.sync();
    return sequelize;
  },
};
