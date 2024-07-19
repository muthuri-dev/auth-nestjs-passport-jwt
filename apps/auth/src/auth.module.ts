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
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '@app/guards';
import { AccessTokenStrategy, RefreshTokenStrategy } from '@app/strategies';

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
      context: ({ req }) => ({ req }),
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    ConfigService,
    PrismaService,
    JwtService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ],
})
export class AuthModule {}
