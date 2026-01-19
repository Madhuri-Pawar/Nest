import { DynamicModule, Module } from '@nestjs/common';
import { APIFeatureGuard } from './api-feature.guard';
import { APP_GUARD } from '@nestjs/core';
import { CONFIG_KEY } from './config-lkey.const';

@Module({})
export class APIFeatureFlagModule {
  static forFeature(path: string): DynamicModule {
    return {
      module: APIFeatureFlagModule,
      providers: [
        {
          provide: CONFIG_KEY,
          useValue: path,
        },
        {
          provide: APP_GUARD,
          useClass: APIFeatureGuard,
        },
      ],
    };
  }
}
