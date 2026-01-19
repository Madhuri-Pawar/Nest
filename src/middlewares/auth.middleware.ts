// import { Injectable, NestMiddleware } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { NextFunction } from "express";

// @Injectable()
// export class JwtMiddleware implements NestMiddleware {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly configService: ConfigService,
//   ) {}

//   async use(req: Request & { user?: any }, res: Response, next: NextFunction) {
//     const auth = req.headers['authorization'];

//     if (!auth || !auth.startsWith('Bearer ')) {
//       return next(); // let Guard decide if auth is required
//     }

//     const token = auth.split(' ')[1];

//     try {
//       const payload = await this.jwtService.verifyAsync(token, {
//         secret: this.configService.get('JWT_SECRET'),
//       });

//       req.user = payload; // attach user to request
//     } catch (err) {
//       // invalid token → no user attached
//     }

//     next();
//   }
// }


// // export class AppModule implements NestModule {
// //   configure(consumer: MiddlewareConsumer) {
// //     consumer.apply(JwtMiddleware).forRoutes('*');
// //   }
// // }
