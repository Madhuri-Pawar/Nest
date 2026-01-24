import { Injectable } from '@nestjs/common';
import { CustomUsersService } from 'src/custom-users/custom-users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthorizationService {
    constructor(private usersService: CustomUsersService, private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
