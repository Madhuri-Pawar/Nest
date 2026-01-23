// import { Test, TestingModule } from '@nestjs/testing';
// import { ComplianceService } from './compliance.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { UsersComplianceLimit } from './entities/users-compliance.entity';
// import { Repository } from 'typeorm';
// import { CreateUsersComplianceDTO } from './dto/create-users-compliance.dto';

// // async createUsersCompliance(dto: CreateUsersComplianceDTO) {
// //   return this.repo.save(dto);
// // }

// describe('ComplianceService', () => {
//   let service: ComplianceService;
//   let repo: Repository<UsersComplianceLimit>;

//   const mockRepo = {
//     save: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         ComplianceService,
//         {
//           provide: getRepositoryToken(UsersComplianceLimit),
//           useValue: mockRepo,
//         },
//       ],
//     }).compile();

//     service = module.get<ComplianceService>(ComplianceService);
//     repo = module.get(getRepositoryToken(UsersComplianceLimit));
//   });

//   it('should save compliance record', async () => {
//     const dto: CreateUsersComplianceDTO = {
//       userId: 'uuid',
//       currentAmount: 10000,
//       is50kCheck: false,
//     };

//     const savedEntity = { id: 'uuid-123', ...dto };

//     mockRepo.save.mockResolvedValue(savedEntity);

//     const result = await service.createUsersCompliance(dto);

//     expect(repo.save).toHaveBeenCalledWith(dto);
//     expect(result).toEqual(savedEntity);
//   });
// });
