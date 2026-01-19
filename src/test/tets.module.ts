import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { CatService } from 'src/providers/cat.service';
import { CatsController } from './cats.controller';
import { RolesGuard } from 'src/authorization/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [],
  controllers: [TestController,CatsController],
  providers: [CatService,
     {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
  ],
})
export class TestModule {}
