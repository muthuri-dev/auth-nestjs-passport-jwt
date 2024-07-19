import { Module } from '@nestjs/common';
import { AccessTokenGuard } from './access-token/access-token.guard';
import { AccessTokenStrategy } from '@app/strategies';
import { RefreshTokenGuard } from './refresh-token/refresh-token.guard';

@Module({
  imports: [AccessTokenStrategy],
  providers: [AccessTokenGuard, RefreshTokenGuard],
  exports: [AccessTokenGuard, RefreshTokenGuard],
})
export class GuardsModule {}
