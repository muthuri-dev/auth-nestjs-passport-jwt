import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string): Promise<User> {
    return await this.prismaService.user.findUnique({ where: { id } });
  }
}
