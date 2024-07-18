import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'apps/users/src/entities/user.entity';

@ObjectType()
export class Auth {
  @Field(() => User)
  user: User;

  @Field()
  access_token: string;

  @Field()
  refresh_token: string;
}

@ObjectType()
export class Logout {
  @Field()
  loggedout: string;
}
