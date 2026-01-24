import { Test, TestingModule } from '@nestjs/testing';
import { CustomUsersService } from './custom-users.service';

describe('CustomUsersService', () => {
  let service: CustomUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomUsersService],
    }).compile();

    service = module.get<CustomUsersService>(CustomUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
