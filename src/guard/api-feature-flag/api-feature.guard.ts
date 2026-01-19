import { CanActivate, ExecutionContext, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { FEATURE_KEY } from './feature-key.const';
import { CONFIG_KEY } from './config-lkey.const';

@Injectable()
export class APIFeatureGuard implements CanActivate {
  private readonly logger = new Logger(APIFeatureGuard.name);
  private features: string[] = [];

  constructor(
    private readonly reflector: Reflector,
    @Inject(CONFIG_KEY) private configPath: string,
    private readonly configService: ConfigService,
  ) {
    const features = this.configService.get(configPath) || [];
    this.validateConfig(features);
    this.features = features;
    this.logger.log(`Enabled features: ${this.features.join(', ')}`);
  }

  private validateConfig(features: unknown): void {
    if (!Array.isArray(features)) {
      throw new Error('Features should be array!');
    }

    for (const feature of features) {
      if (typeof feature !== 'string') {
        throw new Error('Feature should be string!');
      }
    }
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const feature = this.reflector.get(FEATURE_KEY, context.getHandler());

    if (!feature) {
      return true;
    }

    if (!this.features.includes(feature)) {
      this.logger.warn(`Endpoint has feature - ${feature}, configuration does have it`);
      throw new NotFoundException();
    }

    return true;
  }
}
