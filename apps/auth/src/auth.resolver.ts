import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { RegisterDto } from './dto/register.dto';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  registerUser(@Args('registerDto') registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
