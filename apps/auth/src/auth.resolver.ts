import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth, Logout, NewToken } from './entities/auth.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CurrentUser, CurrentUserId, Public } from '@app/decorators';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from '@app/guards';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  //register
  @Public()
  @Mutation(() => Auth)
  registerUser(@Args('registerDto') registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  //login
  @Public()
  @Mutation(() => Auth)
  async loginUser(@Args('loginDto') loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  //log out
  @Mutation(() => Logout)
  async logout(@Args('user_id') user_id: string): Promise<Logout> {
    return await this.authService.logout(user_id);
  }

  //testing protected routes
  @Public()
  @Query(() => String)
  test() {
    return 'now protected from the public';
  }

  //for new tokens
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => NewToken)
  async getNewTokens(
    @CurrentUserId() user_id: string,
    @CurrentUser('refresh_token') refresh_token: string,
  ) {
    return await this.authService.getNewTokens(user_id, refresh_token);
  }
}
