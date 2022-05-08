import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from 'src/constants';
import { FileUpload } from 'src/file-upload/file.entity';
import { Order, OrderTypeOfPaper, TypeOfPaper } from 'src/orders/order.entity';
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
      OrderTypeOfPaper,
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
    await sequelize.sync();
    return sequelize;
  },
};
