import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  private readonly users:any[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      refreshToken: null,
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      refreshToken: null,
    },
  ];

  async findOne(username: string) {
    return this.users.find(user => user.username === username);
  }

  async findById(userId: number) {
    return this.users.find(user => user.userId === userId);
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    console.log("refreshToken",`${refreshToken}`)
    const user = this.users.find(u => u.userId === userId);
    if (user) {
      user.refreshToken = refreshToken; 
    }
  }
}
