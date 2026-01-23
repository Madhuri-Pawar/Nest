
import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from './auth.decorator';
import { UsersService } from './users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Public()
    @Post('refresh')
    refresh(@Body('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Req() req) {
        await this.usersService.updateRefreshToken(req.user.sub, null);
        return { message: 'Logged out successfully' };
    }
}
