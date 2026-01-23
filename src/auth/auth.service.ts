
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService,private config: ConfigService) { }


    async signIn(
        username: string,
        pass: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.usersService.findOne(username);

        if (!user || user.password !== pass) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.userId, username: user.username };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: jwtConstants.accessSecret,
            expiresIn: this.config.get('JWT_ACCESS_EXPIRES')
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: jwtConstants.refreshSecret,
            expiresIn: this.config.get('JWT_ACCESS_EXPIRES')
        });

        const hashedRefresh = await bcrypt.hash(refreshToken, 10);

        await this.usersService.updateRefreshToken(user.userId, hashedRefresh);

        return { accessToken, refreshToken };
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: jwtConstants.refreshSecret,
            });

            const user = await this.usersService.findById(payload.sub);

            if (!user || user.refreshToken !== refreshToken) {
                throw new UnauthorizedException();
            }

            const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
            if (!isMatch) throw new UnauthorizedException();

            const newPayload = { sub: user.userId, username: user.username };

            const newAccessToken = await this.jwtService.signAsync(newPayload, {
                secret: jwtConstants.accessSecret,
                expiresIn: this.config.get('JWT_ACCESS_EXPIRES'),
            });

            const newRefreshToken = await this.jwtService.signAsync(newPayload, {
                secret: jwtConstants.refreshSecret,
                expiresIn: this.config.get('JWT_ACCESS_EXPIRES'),
            });


            const hashedRefresh = await bcrypt.hash(newRefreshToken, 10);
            await this.usersService.updateRefreshToken(user.userId, hashedRefresh);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        } catch {
            throw new UnauthorizedException();
        }
    }

}
