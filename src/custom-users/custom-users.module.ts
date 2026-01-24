import { Module } from '@nestjs/common';
import { CustomUsersService } from './custom-users.service';

@Module({
  providers: [CustomUsersService],
  exports:[CustomUsersService]
})
export class CustomUsersModule {}
