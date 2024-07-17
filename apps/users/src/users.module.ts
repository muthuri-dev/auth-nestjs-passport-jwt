import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { join } from 'path';
import { UsersResolver } from './users.resolver';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@app/prisma';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      introspection: true,
      sortSchema: true,
      autoSchemaFile: {
        federation: 2,
        path: join(process.cwd(), 'apps/users/src/schema.gql'),
      },
      driver: ApolloFederationDriver,
    }),
  ],
  providers: [UsersService, UsersResolver, ConfigService, PrismaService],
})
export class UsersModule {}
