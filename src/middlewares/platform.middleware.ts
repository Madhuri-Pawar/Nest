import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Histogram } from 'prom-client';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

enum Label {
  STATUS = 'status',
  METHOD = 'method',
  BASE_PATH = 'basePath',
  FULL_PATH = 'fullPath',
  // add more label names as needed
}

@Injectable()
export class PlatformHttpMiddleware implements NestMiddleware {
  private histogram: Histogram<string>;
  private logger: Logger = new Logger(PlatformHttpMiddleware.name);

  constructor() {
    this.histogram = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP responses',
      labelNames: [Label.STATUS, Label.METHOD, Label.BASE_PATH, Label.FULL_PATH],
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = uuidv4();
    const startTime = Date.now();
    this.logger.log(
      `API Request (${requestId}): ${req.method} ${req.originalUrl} with body: ${JSON.stringify(
        req.body
      )}`
    );

    res.on('finish', () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      const status = res.statusCode.toString();
      const method = req.method;
      const basePath =  req.path.split('/').slice(0, 3).join('/');
      const fullPath = req.originalUrl;
      this.histogram.labels(status, method, basePath, fullPath).observe(duration);
      this.logger.log(
        `API Response (${requestId}): ${req.method} ${req.originalUrl} with status: ${res.statusCode}. Duration ${duration}ms.`
      );
    });
    next();
  }
}
