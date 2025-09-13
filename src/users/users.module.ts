import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UserRepository } from './repositories/user.repository';
import { DatabaseModule } from '../database/database.module';
import { USER_REPOSITORY_TOKEN } from '../common/tokens/repository.tokens';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
