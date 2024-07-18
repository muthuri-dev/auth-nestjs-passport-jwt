import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth, Logout } from './entities/auth.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  //register
  @Mutation(() => Auth)
  registerUser(@Args('registerDto') registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  //login
  @Mutation(() => Auth)
  async loginUser(@Args('loginDto') loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  //log out
  @Mutation(() => Logout)
  async logout(@Args('user_id') user_id: string): Promise<Logout> {
    return await this.authService.logout(user_id);
  }
}
