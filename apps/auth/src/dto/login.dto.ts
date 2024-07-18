import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoginDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}
