import { Module } from '@nestjs/common';
import { AccessTokenStrategy } from './access-token/access-token.strategy';
import { RefreshTokenStrategy } from './refresh-token/refresh-token.service';

@Module({
  providers: [AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AccessTokenStrategy, RefreshTokenStrategy],
})
export class StrategiesModule {}
