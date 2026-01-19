

// Let's create an exception filter that is responsible for catching exceptions which are an instance of the HttpException class, 
// and implementing custom response logic for them



import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}

// bind filters on controller method
// @Post()
// @UseFilters(new HttpExceptionFilter())
// async create(@Body() createCatDto: CreateCatDto) {
//   throw new ForbiddenException();
// }


