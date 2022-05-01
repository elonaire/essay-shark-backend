import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { LoginDetails } from './app.entity';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    ) {}

  // End point to authenticate a user
  @Post('login')
  login(@Body() logins: LoginDetails): any {
    return this.authService.validateUser(logins);
  }

  @UseGuards(JwtAuthGuard)
  @Get('confirm')
  confirmAuth(): any {
    return {
      message: 'OK'
    }
  }

  @Get('google-auth')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google-auth/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.appService.confirmGoogleOAuth(req)
  }

  @Get('facebook-auth')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req) {}

  @Get('facebook-auth/redirect')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Req() req) {
    return this.appService.confirmFacebookOAuth(req)
  }

  @Get('linkedin-auth')
  @UseGuards(AuthGuard('linkedin'))
  async linkedInAuth(@Req() req) {}

  @Get('linkedin-auth/redirect')
  @UseGuards(AuthGuard('linkedin'))
  linkedInAuthRedirect(@Req() req) {
    return this.appService.confirmLinkedInOAuth(req)
  }
}
