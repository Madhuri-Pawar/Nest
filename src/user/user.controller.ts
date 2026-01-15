import { Controller, Get } from '@nestjs/common';
import { UsersService } from './user.services';

@Controller()
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getHello(): any {
    return this.usersService.findAll();
  }
}

