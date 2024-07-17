import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterDto {
  @Field()
  user_name: string;

  @Field()
  password: string;
}
