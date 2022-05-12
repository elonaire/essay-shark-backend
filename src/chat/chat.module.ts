import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { chatProviders } from './chat.provider';

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.SECRET}`,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule
  ],
  providers: [ChatService, ChatGateway, ...chatProviders],
  controllers: [ChatController]
})
export class ChatModule {}
