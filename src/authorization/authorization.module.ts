import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { CustomUsersModule } from 'src/custom-users/custom-users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports:[CustomUsersModule,PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthorizationService,LocalStrategy,JwtStrategy],
  exports:[AuthorizationService]
})
export class AuthorizationModule {}
