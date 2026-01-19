
import { Module } from '@nestjs/common';
import { APIFeatureFlagModule } from './api-feature-flag.module';

@Module({
  imports: [
    APIFeatureFlagModule.forFeature('bps.features'), // static method called 

  ],
  providers: [],
  controllers: [],
})
export class PaymentModule {}
