import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FacebookStrategy } from './auth/oauth/facebook.strategy';
import { GoogleStrategy } from './auth/oauth/google.strategy';
import { LinkedInStrategy } from './auth/oauth/linkedin.strategy';
import { SessionSerializer } from './auth/session.serializer';
import { DatabaseModule } from './database/database.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MailingServiceModule } from './mailing-service/mailing-service.module';
import { UsersModule } from './users/users.module';
import {MailerModule as NodeMailerModule} from '@nestjs-modules/mailer';
import { OrdersModule } from './orders/orders.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UsersModule,
    JwtModule.register({
      secret: `${process.env.SECRET}`,
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule.forRoot(),
    FileUploadModule,
    NodeMailerModule.forRoot({
      transport: {
        host: process.env.SMTP_SERVER,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: process.env.SMTP_DEFAULT_SENDER,
      },
    }),
    MailingServiceModule,
    OrdersModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, FacebookStrategy, LinkedInStrategy, SessionSerializer],
})
export class AppModule {}
