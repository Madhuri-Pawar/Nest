import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DatabaseModule } from './database.module';
import { UsersModule } from './user/user.module';
import { TestModule } from './test/tets.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
// import { AuthModule } from './auth/auth.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { CustomUsersModule } from './custom-users/custom-users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    // UsersModule,
    TestModule,
    // AuthModule,
    AuthorizationModule,
    CustomUsersModule
  ],
  controllers:[AppController],
  providers:[AppService]
})
export class AppModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes();
      // .forRoutes({ path: 'cats', method: RequestMethod.GET });
      // forRoutes({path: 'abcd/{*splat}',method: RequestMethod.ALL});
  }
  
}

