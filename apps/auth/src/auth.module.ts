import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { AuthResolver } from './auth.resolver';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { PrismaService } from '@app/prisma';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      introspection: true,
      sortSchema: true,
      autoSchemaFile: {
        federation: 2,
        path: join(process.cwd(), 'apps/auth/src/schema.gql'),
      },
      driver: ApolloFederationDriver,
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    ConfigService,
    PrismaService,
    JwtService,
  ],
})
export class AuthModule {}
