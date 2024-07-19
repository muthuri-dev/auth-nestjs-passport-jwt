import { Module } from '@nestjs/common';
import { Public } from './public/public.decorator';
import { CurrentUser } from './current-user/current-user.service';
import { CurrentUserId } from './current-user-id/current-user-id.service';

@Module({
  providers: [],
  exports: [Public, CurrentUser, CurrentUserId],
})
export class DecoratorsModule {}
