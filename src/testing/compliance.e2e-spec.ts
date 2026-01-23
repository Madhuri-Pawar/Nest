// import * as request from 'supertest';
// import { Test } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';

// describe('Compliance API (e2e)', () => {
//   let app: INestApplication;

//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleRef.createNestApplication();
//     await app.init();
//   });

//   it('/compliance/users (POST)', () => {
//     return request(app.getHttpServer())
//       .post('/compliance/users')
//       .send({
//         userId: 'uuid',
//         currentAmount: 50000,
//         is50kCheck: true,
//       })
//       .expect(201);
//   });

//   afterAll(async () => {
//     await app.close();
//   });
// });
