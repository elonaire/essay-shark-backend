import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { usersProviders } from 'src/users/user.providers';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [JwtModule.register({
    secret: `${process.env.SECRET}`,
    signOptions: { expiresIn: '1h' },
  })],
  providers: [AuthService, UsersService, ...usersProviders, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
