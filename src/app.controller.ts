import { Controller, Get, Post, UseGuards ,Request} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './authorization/local-auth.guard';
import { AuthorizationService } from './authorization/authorization.service';
import { JwtAuthGuard } from './authorization/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private authService: AuthorizationService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @UseGuards(AuthGuard('local'))
 @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  
@UseGuards(LocalAuthGuard)
@Post('/auth/logout')
async logout(@Request() req) {
  return req.logout();
}

}

