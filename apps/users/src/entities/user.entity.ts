import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  user_name: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  refresh_token?: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
