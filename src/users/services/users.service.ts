import { Injectable, Inject } from '@nestjs/common';
import { User } from '@prisma/client';

import { CreateUserDto } from '../dto/create-user.dto';
import { IUsersService } from '../interfaces/users-service.interface';
import type { IUserRepository } from '../interfaces/user-repository.interface';
import { USER_REPOSITORY_TOKEN } from '../../common/tokens/repository.tokens';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    return this.userRepository.create(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
