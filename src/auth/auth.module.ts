import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        UsersModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const secret = config.get<string>('JWT_ACCESS_SECRET');

                if (!secret) {
                    throw new Error('JWT_ACCESS_SECRET is not defined');
                }

                return {
                    secret,
                    signOptions: {
                        expiresIn: 1,
                    },
                };
            },
        }),

    ],

    providers: [
        AuthService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],

    controllers: [AuthController],
})
export class AuthModule { }
