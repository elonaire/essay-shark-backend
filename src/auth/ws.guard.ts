import { Injectable, CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
      private jwtService: JwtService,
      private userService: UsersService
      ) {}

  canActivate(
    context: any
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken = context.args[0].handshake.headers.authorization.replace('Bearer ', '');
    if (bearerToken === 'undefined') {
      return false;
    }
    
    try {
      console.log('passes here');
      
      const decoded = this.jwtService.verify(bearerToken, {
        secret: process.env.SECRET,
      }) as any;
      
      return new Promise((resolve, reject) => {
        return this.userService
          .getSingleUser(['user_id'], 'either', { user_id: decoded.sub })
          .then((user) => {
            if (user) {
              resolve(true);
            } else {
              reject(false);
            }
          });
      });
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
