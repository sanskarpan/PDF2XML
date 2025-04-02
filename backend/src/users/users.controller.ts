import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaClient } from '@prisma/client';
import { ClerkGuard } from '../shared/guards/clerk.guard';
import { GetUser } from '../shared/decorators/user.decorator';

const prisma = new PrismaClient();
type User = Awaited<ReturnType<typeof prisma.user.findUnique>>;

@Controller('users')
@UseGuards(ClerkGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@GetUser() user: { id: string }): Promise<User> {
    return this.usersService.findOne(user.id);
  }
}
