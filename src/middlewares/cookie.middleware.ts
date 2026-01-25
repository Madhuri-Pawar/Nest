import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import cookieParser = require('cookie-parser');

@Injectable()
export class CookieMiddleware implements NestMiddleware {
  private parser = cookieParser();
  use(req: Request, res: Response, next: NextFunction) {
    this.parser(req, res, next);
  }
}


// used for 
// @Post('refresh')
// refresh(@Req() req) {
//   const token = req.cookies.refreshToken;
// }