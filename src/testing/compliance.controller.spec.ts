// import { Test, TestingModule } from '@nestjs/testing';
// import { ComplianceController } from './compliance.controller';
// import { ComplianceService } from './compliance.service';
// import { CreateUsersComplianceDTO } from './dto/create-users-compliance.dto';

// // @Post('compliance/users')
// // async createUserCompliance(
// //   @Body() dto: CreateUsersComplianceDTO,
// // ): Promise<any> {
// //   return this.complianceService.createUsersCompliance(dto);
// // }


// describe('ComplianceController', () => {
//   let controller: ComplianceController;
//   let service: ComplianceService;

//   const mockService = {
//     createUsersCompliance: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [ComplianceController],
//       providers: [
//         {
//           provide: ComplianceService,
//           useValue: mockService,
//         },
//       ],
//     }).compile();

//     controller = module.get<ComplianceController>(ComplianceController);
//     service = module.get<ComplianceService>(ComplianceService);
//   });

//   it('should create user compliance record', async () => {
//     const dto: CreateUsersComplianceDTO = {
//       userId: '8164d5e3-dbc3-407d-981c-8c59b6c42035',
//       currentAmount: 52000.75,
//       is50kCheck: true,
//     };

//     const result = { id: 'uuid-1', ...dto };

//     mockService.createUsersCompliance.mockResolvedValue(result);

//     const response = await controller.createUserCompliance(dto);

//     expect(service.createUsersCompliance).toHaveBeenCalledWith(dto);
//     expect(response).toEqual(result);
//   });
// });
